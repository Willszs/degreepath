import Link from "next/link";
import { notFound } from "next/navigation";
import { resourceItems } from "@/lib/resources";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = resourceItems.find((item) => item.slug === slug);

  if (!resource) return notFound();

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="paper rounded-3xl px-6 py-8 md:px-10">
          <Link href="/" className="text-sm muted hover:text-[var(--accent)]">
            ← 返回首页
          </Link>

          <h1 className="mt-6 text-4xl font-semibold">{resource.title}</h1>
          <p className="mt-2 muted">{resource.subtitle}</p>

          <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/70 p-6">
            <h2 className="text-lg font-semibold">建议你这样使用这个模板：</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {resource.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
