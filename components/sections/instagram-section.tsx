import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getInstagramFeed } from "@/lib/instagram";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export async function InstagramSection() {
  const feed = await getInstagramFeed();

  return (
    <section id="instagram" className="relative py-24">
      <div className="section-shell space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Instagram"
            title="Instagram’da ne attıysam burada"
            description="Çok bir olayı yok aslında. Güzel çıktığımı düşündüğüm fotoğrafları vs. paylaşıyorum. Yeni bir şey paylaşınca buraya da düşer."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="glass-panel soft-outline grid gap-6 rounded-[32px] p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-3xl font-semibold">
                    {feed.profile.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-accent)]">
                    @{feed.profile.username}
                  </p>
                </div>
                <p className="max-w-md text-sm leading-7 text-white/70">
                  {feed.profile.bio}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {feed.profile.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[24px] border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                      {metric.label}
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Link
                  href={feed.profile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-hover inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-white/10"
                >
                  Instagram'ı aç
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {feed.posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[26px] border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-[#4da3ff]/70 hover:shadow-[0_0_0_1px_rgba(77,163,255,0.24),0_0_28px_rgba(77,163,255,0.22)]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.caption || "Instagram gönderisi"}
                      fill
                      unoptimized={post.image.startsWith("http")}
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex h-[112px] flex-col justify-between p-4">
                    {post.caption ? (
                      <p className="line-clamp-3 text-sm leading-6 text-white/70">
                        {post.caption}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    <p className="text-left text-xs uppercase tracking-[0.3em] text-white/40">
                      {post.dateLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
