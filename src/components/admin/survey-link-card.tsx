"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SurveyLinkCard({ surveyId }: { surveyId: string }) {
  const [link, setLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/survey/${surveyId}`;
    setLink(url);
    QRCode.toDataURL(url, { width: 180, margin: 1 }).then(setQrDataUrl).catch(() => setQrDataUrl(null));
  }, [surveyId]);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      {qrDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrDataUrl} alt="QR code survey" className="size-32 rounded-md border shrink-0" />
      )}
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm text-muted-foreground">
          Bagikan link atau QR code ini ke staff untuk mengisi survey secara anonim.
        </p>
        <div className="flex gap-2">
          <Input readOnly value={link} className="text-xs" />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
