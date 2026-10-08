import { cn } from "@/lib/utils";

type AuthMessageProps = {
  tone: "error" | "success";
  children: string;
};

export function AuthMessage({ tone, children }: AuthMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg px-3 py-2 text-sm",
        tone === "error"
          ? "border border-danger/20 bg-danger/10 text-danger"
          : "border border-brand/20 bg-brand-soft text-brand",
      )}
    >
      {children}
    </p>
  );
}
