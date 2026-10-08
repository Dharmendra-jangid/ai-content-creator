export default function GenerateLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[32rem] animate-pulse rounded-2xl bg-muted" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
