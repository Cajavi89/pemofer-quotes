export function PageTitle({
  title,
  subtitle
}: {
  title: string
  subtitle: string
}) {
  return (
    <section className="mb-3 flex flex-col gap-0.5">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </section>
  )
}
