export function PageTitle({
  title,
  subtitle
}: {
  title: string
  subtitle: string
}) {
  return (
    <section className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </section>
  )
}
