"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getNameFormSchema,
  getStatusLabels,
  getZodiacLabels,
  relationshipStatuses,
  sanitizeEnglishName,
  zodiacSigns,
  type NameFormValues,
} from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoveStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { CoupleInput } from "@/lib/types";

interface NameFormProps {
  onSubmit: (data: CoupleInput) => void;
  submitLabel?: string;
  defaultTheirName?: string;
  lockTheirName?: boolean;
  requireZodiac?: boolean;
}

export function NameForm({
  onSubmit,
  submitLabel,
  defaultTheirName,
  lockTheirName = false,
  requireZodiac = false,
}: NameFormProps) {
  const store = useLoveStore();
  const { t, lang } = useI18n();

  const statusLabels = useMemo(() => getStatusLabels(lang), [lang]);
  const zodiacLabels = useMemo(() => getZodiacLabels(lang), [lang]);
  const schema = useMemo(
    () => getNameFormSchema(lang, { requireZodiac }),
    [lang, requireZodiac]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NameFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      yourName: sanitizeEnglishName(store.yourName || ""),
      theirName: sanitizeEnglishName(defaultTheirName || store.theirName || ""),
      status: store.status || undefined,
      yourZodiac: store.yourZodiac || "",
      theirZodiac: store.theirZodiac || "",
    },
  });

  const status = watch("status");
  const yourZodiac = watch("yourZodiac");
  const theirZodiac = watch("theirZodiac");

  const yourNameField = register("yourName");
  const theirNameField = register("theirName");

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const payload: CoupleInput = {
          yourName: data.yourName.trim(),
          theirName: data.theirName.trim(),
          status: data.status,
          yourZodiac: data.yourZodiac || undefined,
          theirZodiac: data.theirZodiac || undefined,
        };
        store.setCouple(payload);
        onSubmit(payload);
      })}
      className="glass mx-auto w-full max-w-lg space-y-5 rounded-3xl p-5 sm:p-7"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="yourName" className="text-sm font-bold text-rose-950">
          {t.form.yourNameLabel}
        </Label>
        <Input
          id="yourName"
          autoComplete="given-name"
          inputMode="text"
          lang="en"
          spellCheck={false}
          autoCapitalize="words"
          placeholder={t.form.yourNamePlaceholder}
          className="h-12 rounded-2xl border-rose-200 bg-white/80 text-base"
          aria-invalid={!!errors.yourName}
          name={yourNameField.name}
          ref={yourNameField.ref}
          onBlur={yourNameField.onBlur}
          onChange={(e) => {
            const cleaned = sanitizeEnglishName(e.target.value);
            e.target.value = cleaned;
            void yourNameField.onChange(e);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const cleaned = sanitizeEnglishName(pasted);
            setValue("yourName", cleaned, { shouldValidate: true, shouldDirty: true });
          }}
        />
        {errors.yourName ? (
          <p className="text-sm text-rose-600" role="alert">
            {errors.yourName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="theirName" className="text-sm font-bold text-rose-950">
          {t.form.theirNameLabel}
        </Label>
        <Input
          id="theirName"
          autoComplete="off"
          inputMode="text"
          lang="en"
          spellCheck={false}
          autoCapitalize="words"
          placeholder={t.form.theirNamePlaceholder}
          disabled={lockTheirName}
          className="h-12 rounded-2xl border-rose-200 bg-white/80 text-base disabled:opacity-80"
          aria-invalid={!!errors.theirName}
          name={theirNameField.name}
          ref={theirNameField.ref}
          onBlur={theirNameField.onBlur}
          onChange={(e) => {
            if (lockTheirName) return;
            const cleaned = sanitizeEnglishName(e.target.value);
            e.target.value = cleaned;
            void theirNameField.onChange(e);
          }}
          onPaste={(e) => {
            if (lockTheirName) return;
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const cleaned = sanitizeEnglishName(pasted);
            setValue("theirName", cleaned, { shouldValidate: true, shouldDirty: true });
          }}
        />
        {errors.theirName ? (
          <p className="text-sm text-rose-600" role="alert">
            {errors.theirName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-rose-950">
          {t.form.statusLabel}
        </Label>
        <Select
          value={status}
          onValueChange={(v) =>
            setValue("status", v as NameFormValues["status"], { shouldValidate: true })
          }
          items={statusLabels}
        >
          <SelectTrigger className="h-12 w-full rounded-2xl border-rose-200 bg-white/80">
            <SelectValue placeholder={t.form.statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {relationshipStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-rose-950">
            {requireZodiac ? t.form.yourZodiacRequiredLabel : t.form.yourZodiacLabel}
          </Label>
          <Select
            value={yourZodiac || undefined}
            onValueChange={(v) =>
              setValue("yourZodiac", v as NameFormValues["yourZodiac"], { shouldValidate: true })
            }
            items={zodiacLabels}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-rose-200 bg-white/80">
              <SelectValue
                placeholder={
                  requireZodiac
                    ? t.form.yourZodiacRequiredPlaceholder
                    : t.form.yourZodiacPlaceholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              {zodiacSigns.map((z) => (
                <SelectItem key={z} value={z}>
                  {zodiacLabels[z]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.yourZodiac ? (
            <p className="text-xs font-medium text-rose-600">{errors.yourZodiac.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold text-rose-950">
            {requireZodiac ? t.form.theirZodiacRequiredLabel : t.form.theirZodiacLabel}
          </Label>
          <Select
            value={theirZodiac || undefined}
            onValueChange={(v) =>
              setValue("theirZodiac", v as NameFormValues["theirZodiac"], {
                shouldValidate: true,
              })
            }
            items={zodiacLabels}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-rose-200 bg-white/80">
              <SelectValue
                placeholder={
                  requireZodiac
                    ? t.form.theirZodiacRequiredPlaceholder
                    : t.form.theirZodiacPlaceholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              {zodiacSigns.map((z) => (
                <SelectItem key={z} value={z}>
                  {zodiacLabels[z]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.theirZodiac ? (
            <p className="text-xs font-medium text-rose-600">{errors.theirZodiac.message}</p>
          ) : null}
        </div>
      </div>

      <button type="submit" className="btn-chaos w-full text-lg">
        {submitLabel || t.form.submitButton}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        {t.common.shortDisclaimer}
      </p>
    </form>
  );
}
