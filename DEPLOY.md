================================================================================

SETUP DEPLOY — Frontend di Vercel, API di VPS (43.157.243.77)

================================================================================

Runbook konkret untuk deployment INI, dengan nilai asli (bukan placeholder):

- VPS API      : 43.157.243.77 (SUDAH menjalankan Laravel + MySQL - lihat
                 catatan khusus di Bagian A supaya tidak mengganggu app itu)
- Domain API   : 43.157.243.77.sslip.io (gratis, otomatis resolve ke IP di
                 atas - dipakai supaya Certbot bisa terbitkan HTTPS, karena
                 Let's Encrypt tidak bisa menerbitkan sertifikat untuk bare IP)
- Frontend     : Next.js (project ini) -> Vercel
- Repo backend : https://github.com/wayanbudiastra/survei-keamanan-data.git
                 (sudah di-push sebelumnya)
- Repo frontend: BELUM ADA - lihat Bagian B langkah 1

Secret production yang sudah digenerate khusus untuk deployment ini (jangan
pakai nilai dev lokal):

    SURVEY_API_KEY = 8cec08675203b6378f92339e745d4245d50eb0dde7c41f7e8e4b701d8374e910
    NEXTAUTH_SECRET = PtIfXE+z46e+sg0IRmoWsXRBwZNuTQm50gFXSaRGjg4=

Simpan dua nilai di atas ke password manager - dipakai di Bagian A langkah 5
dan Bagian B langkah 3.


================================================================================
BAGIAN A — Setup API server di VPS (43.157.243.77)
================================================================================

Catatan penting: VPS ini SUDAH menjalankan project Laravel + MySQL yang live.
Semua langkah di bawah didesain AMAN untuk kondisi itu:
- `deploy.sh` HANYA membuat database/user MySQL BARU (`survey_db`/
  `survey_user`) - kalau nama itu ternyata sudah dipakai, script berhenti
  TANPA mengubah apa pun (tidak akan menimpa DB Laravel).
- Nginx: kita TAMBAH satu server block baru (bukan mengganti config Laravel
  yang sudah ada), lalu `reload` (bukan `restart`) supaya koneksi Laravel
  yang sedang berjalan tidak terputus.
- Port aplikasi API (4000) dipakai terpisah dari port Laravel - pastikan
  belum dipakai (langkah 1 di bawah).

SSH ke VPS dulu: `ssh <user>@43.157.243.77`

--------------------------------------------------------------------------------
1. Cek prasyarat & port yang belum dipakai
--------------------------------------------------------------------------------

    node -v          # perlu v20.x - kalau belum ada, install dulu:
                      #   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                      #   sudo apt-get install -y nodejs
    pm2 -v           # kalau belum ada: sudo npm install -g pm2
    mysql --version  # harus sudah ada (dipakai Laravel juga)
    sudo ss -tlnp | grep ':4000\b'   # HARUS kosong (port belum dipakai apa pun)

--------------------------------------------------------------------------------
2. Clone & jalankan deploy pertama kali
--------------------------------------------------------------------------------

    cd /opt   # atau lokasi lain pilihan Anda, asal bukan folder Laravel
    sudo git clone https://github.com/wayanbudiastra/survei-keamanan-data.git survey-api-server
    sudo chown -R $USER:$USER survey-api-server
    cd survey-api-server
    chmod +x deploy.sh
    ./deploy.sh --seed

Script ini akan:
- Membuat database `survey_db` + user `survey_user` MySQL BARU (password
  random) - kalau nama ini ternyata bentrok dengan yang Laravel pakai, script
  akan BERHENTI dan kasih instruksi pakai nama lain (mis.
  `DB_NAME=survey_api_db DB_USER=survey_api_user ./deploy.sh --seed`).
- Generate `.env` otomatis dengan `DATABASE_URL` + `SURVEY_API_KEY` random.
- Install dependencies, migrate, build, lalu start via PM2 (proses bernama
  `survey-api-server` - terpisah dari proses PM2 Laravel kalau Laravel juga
  pakai PM2).
- Seed admin awal (`admin@rs-demo.id` / `Admin123!` - **wajib ganti password
  setelah go-live**).

--------------------------------------------------------------------------------
3. Pasang domain gratis (sslip.io) - tidak perlu setting DNS apa pun
--------------------------------------------------------------------------------

`43.157.243.77.sslip.io` SUDAH otomatis resolve ke `43.157.243.77` (layanan
wildcard DNS publik) - tidak ada langkah DNS yang perlu dilakukan, langsung
lanjut ke setup Nginx di bawah.

--------------------------------------------------------------------------------
4. Tambah server block Nginx (TIDAK mengganggu vhost Laravel yang ada)
--------------------------------------------------------------------------------

    sudo nano /etc/nginx/sites-available/survey-api

Isi dengan:

    server {
        listen 80;
        server_name 43.157.243.77.sslip.io;

        location / {
            proxy_pass http://127.0.0.1:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

Aktifkan & reload (reload, BUKAN restart - supaya Laravel tidak ke-drop):

    sudo ln -s /etc/nginx/sites-available/survey-api /etc/nginx/sites-enabled/
    sudo nginx -t                    # HARUS "syntax is ok" sebelum lanjut
    sudo systemctl reload nginx

    # HTTPS gratis khusus untuk domain ini saja (tidak menyentuh vhost lain):
    sudo apt-get install -y certbot python3-certbot-nginx   # skip kalau sudah ada
    sudo certbot --nginx -d 43.157.243.77.sslip.io

--------------------------------------------------------------------------------
5. Isi SURVEY_API_KEY production & ALLOWED_ORIGIN, lalu reload
--------------------------------------------------------------------------------

    cd /opt/survey-api-server
    nano .env

Ubah/isi baris berikut (pakai nilai yang sudah digenerate di atas dokumen ini):

    SURVEY_API_KEY="8cec08675203b6378f92339e745d4245d50eb0dde7c41f7e8e4b701d8374e910"
    ALLOWED_ORIGIN="https://<akan-diisi-setelah-Bagian-B-langkah-4>"

(`ALLOWED_ORIGIN` boleh dikosongkan/diisi placeholder dulu - kembali ke sini
setelah tahu URL Vercel di Bagian B langkah 4.)

Terapkan perubahan .env:

    ./deploy.sh

--------------------------------------------------------------------------------
6. Verifikasi API server bisa diakses dari internet
--------------------------------------------------------------------------------

Dari KOMPUTER ANDA (bukan dari dalam VPS):

    curl https://43.157.243.77.sslip.io/health
    # harus balas: {"status":"ok","time":"..."}

    curl -X POST https://43.157.243.77.sslip.io/api/departments \
      -H "x-api-key: 8cec08675203b6378f92339e745d4245d50eb0dde7c41f7e8e4b701d8374e910" \
      -H "Content-Type: application/json" \
      -d '{"name":"Uji Coba Deploy"}'
    # harus 201 (bukan 401) - kalau sudah OK, hapus lagi data uji ini via
    # halaman admin /admin/departments setelah Bagian B selesai.


================================================================================
BAGIAN B — Setup frontend (project ini) ke Vercel
================================================================================

--------------------------------------------------------------------------------
1. Buat repo GitHub untuk project ini (belum ada)
--------------------------------------------------------------------------------

Buat repo BARU (kosong, jangan centang "Add README") di
https://github.com/new, mis. nama `survei-keamanan-data-web`. Kirim URL-nya
ke saya - saya bantu `git init` + push (sama seperti yang sudah dilakukan
untuk `survey-api-server`), atau jalankan sendiri:

    cd <folder project ini>
    git init
    git branch -M main
    git add -A
    git commit -m "Initial commit"
    git remote add origin https://github.com/<user>/<repo-baru>.git
    git push -u origin main

--------------------------------------------------------------------------------
2. Import ke Vercel
--------------------------------------------------------------------------------

https://vercel.com/new -> Import repo GitHub di atas -> Framework Preset
Next.js (otomatis terdeteksi) -> JANGAN klik Deploy dulu, isi Environment
Variables dulu (langkah 3).

--------------------------------------------------------------------------------
3. Environment Variables di Vercel (scope: Production)
--------------------------------------------------------------------------------

| Key | Value |
|---|---|
| `SURVEY_API_URL` | `https://43.157.243.77.sslip.io` |
| `SURVEY_API_KEY` | `8cec08675203b6378f92339e745d4245d50eb0dde7c41f7e8e4b701d8374e910` |
| `NEXTAUTH_SECRET` | `PtIfXE+z46e+sg0IRmoWsXRBwZNuTQm50gFXSaRGjg4=` |
| `NEXTAUTH_URL` | isi sementara `https://placeholder.vercel.app`, update di langkah 4 |

**JANGAN** beri prefix `NEXT_PUBLIC_` pada `SURVEY_API_URL`/`SURVEY_API_KEY` -
keduanya server-side only.

Klik Deploy, tunggu build selesai.

--------------------------------------------------------------------------------
4. Setelah dapat URL Vercel - sambungkan balik ke VPS
--------------------------------------------------------------------------------

Misal URL yang didapat: `https://survei-keamanan-data-web.vercel.app`

1. Di Vercel: update env var `NEXTAUTH_URL` jadi URL itu -> trigger redeploy
   (Vercel > Deployments > ... > Redeploy, atau otomatis saat env var disave).
2. Di VPS (`/opt/survey-api-server/.env`): update `ALLOWED_ORIGIN` jadi URL
   yang sama, lalu:

       cd /opt/survey-api-server && ./deploy.sh


================================================================================
BAGIAN C — Verifikasi akhir (setelah A + B selesai)
================================================================================

[ ] Buka `https://<url-vercel-anda>/` - landing page tampil
[ ] `/admin/login` - login dengan `admin@rs-demo.id` / `Admin123!` (GANTI
    password ini setelah verifikasi selesai)
[ ] Dashboard menampilkan data (bukan blank/error)
[ ] Buka `/survey/<id-survey-aktif>` dari HP - form muncul & bisa submit
[ ] Audit Log (superadmin) mencatat aksi login & submit di atas
[ ] `curl -I https://43.157.243.77.sslip.io/health` menunjukkan header HTTPS
    valid (bukan warning sertifikat)

================================================================================
End
================================================================================
