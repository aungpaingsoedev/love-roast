"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Coffee, Copy, QrCode, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Real KBZPay receive QR */
const KBZPAY_QR_IMAGE = "/kbzpay-qr.jpg";

interface TipDeveloperProps {
  className?: string;
  compact?: boolean;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function TipDeveloper({ className, compact = false }: TipDeveloperProps) {
  const { t } = useI18n();
  const tip = t.tip;
  const [selected, setSelected] = useState(tip.amounts[0]?.id ?? "mmk-3000");
  const [status, setStatus] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [useStaticQr, setUseStaticQr] = useState(false);

  const phone = (t.common.kpayPhone || "").trim();
  const name = t.common.kpayName || t.common.developerName;
  const selectedAmount =
    tip.amounts.find((a) => a.id === selected) ?? tip.amounts[0];

  useEffect(() => {
    let cancelled = false;
    fetch(KBZPAY_QR_IMAGE, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setUseStaticQr(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyPhone() {
    if (!phone) {
      setStatus(tip.no_phone);
      return;
    }
    const ok = await copyText(phone);
    setStatus(ok ? tip.copied_phone : tip.no_phone);
    window.setTimeout(() => setStatus(null), 3000);
  }

  if (compact) {
    return (
      <a
        href="/#tip"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100",
          className
        )}
      >
        <Coffee className="size-3.5" aria-hidden />
        {tip.compact_label}
      </a>
    );
  }

  return (
    <>
      <div
        id="tip"
        className={cn(
          "rounded-3xl border border-amber-200/70 bg-[#fffaf5] p-5 sm:p-6",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
            <Coffee className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.18em] text-amber-600 uppercase">
              {tip.badge}
            </p>
            <h3 className="font-display text-xl font-extrabold text-rose-950">
              {tip.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tip.description}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {tip.amounts.map((amount) => (
            <button
              key={amount.id}
              type="button"
              onClick={() => setSelected(amount.id)}
              className={cn(
                "rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98]",
                selected === amount.id
                  ? "border-transparent bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md"
                  : "border-amber-200/80 bg-white text-rose-950 hover:border-orange-300"
              )}
            >
              <p className="text-xs font-semibold opacity-90">{amount.label}</p>
              <p className="mt-1 text-sm font-extrabold sm:text-base">{amount.hint}</p>
            </button>
          ))}
        </div>

        {phone ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                KBZPay
              </p>
              <p className="truncate font-display text-lg font-extrabold tracking-wide text-rose-950">
                {phone}
              </p>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
            <button
              type="button"
              onClick={() => void copyPhone()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
            >
              <Copy className="size-3.5" aria-hidden />
              {tip.copy_phone}
            </button>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            disabled={!phone}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50 sm:flex-none"
          >
            <QrCode className="size-4" aria-hidden />
            {tip.show_qr}
          </button>
          <button
            type="button"
            onClick={() => void copyPhone()}
            disabled={!phone}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-bold text-rose-950 transition hover:bg-amber-50 active:scale-[0.98] disabled:opacity-50 sm:flex-none"
          >
            <Copy className="size-4" aria-hidden />
            {tip.cta}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">{tip.note}</p>

        {status ? (
          <p className="mt-3 text-sm font-semibold text-rose-700" role="status">
            {status}
          </p>
        ) : null}
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm border-amber-200 bg-[#fffaf5] sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-rose-950">
              {tip.scan_title}
            </DialogTitle>
            <DialogDescription>{tip.scan_hint}</DialogDescription>
          </DialogHeader>

          <div className="mx-auto rounded-2xl border border-amber-200 bg-white p-4">
            {useStaticQr ? (
              <Image
                src={KBZPAY_QR_IMAGE}
                alt="KBZPay QR"
                width={220}
                height={220}
                className="mx-auto size-[220px] object-contain"
                onError={() => setUseStaticQr(false)}
                unoptimized
              />
            ) : phone ? (
              <QRCodeSVG
                value={phone}
                size={220}
                level="M"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#1c1917"
                className="mx-auto"
              />
            ) : null}
          </div>

          <div className="text-center">
            <p className="font-display text-lg font-extrabold text-rose-950">
              {selectedAmount?.hint}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {phone} · {name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQrOpen(false)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-200 bg-white py-2.5 text-sm font-bold text-rose-950"
          >
            <X className="size-4" aria-hidden />
            {tip.close_qr}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
