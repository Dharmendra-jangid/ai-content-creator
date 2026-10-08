import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-brand"> *</span> : null}
        </Label>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

type OptionItem<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

type OptionGroupProps<T extends string> = {
  legend: string;
  required?: boolean;
  value: T;
  options: readonly OptionItem<T>[];
  onChange: (value: T) => void;
  columns?: string;
  disabled?: boolean;
};

export function OptionGroup<T extends string>({
  legend,
  required,
  value,
  options,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-3",
  disabled,
}: OptionGroupProps<T>) {
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-medium text-foreground">
        {legend}
        {required ? <span className="text-brand"> *</span> : null}
      </legend>
      <div className={cn("grid gap-2", columns)}>
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-150",
                selected
                  ? "border-brand bg-brand-soft text-brand shadow-sm"
                  : "border-border text-foreground hover:border-brand/40 hover:bg-muted",
                disabled && "cursor-not-allowed opacity-60",
              )}
              aria-pressed={selected}
            >
              <span className="block font-medium">{option.label}</span>
              {option.hint ? (
                <span
                  className={cn(
                    "mt-0.5 block text-xs",
                    selected ? "text-brand/80" : "text-muted-foreground",
                  )}
                >
                  {option.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
