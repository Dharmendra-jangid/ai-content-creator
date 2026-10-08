import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

export { Avatar };
