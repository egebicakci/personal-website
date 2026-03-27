import { siteContent } from "@/data/site-content";

type InstagramPost = {
  id: string;
  image: string;
  caption: string;
  permalink: string;
  dateLabel: string;
};

type InstagramFeedResponse = {
  mode: "live" | "fallback" | "public_scrape";
  notice: string;
  profile: {
    name: string;
    username: string;
    bio: string;
    url: string;
    image?: string;
    metrics: ReadonlyArray<{
      label: string;
      value: string;
    }>;
  };
  posts: InstagramPost[];
};

type InstagramMetric = {
  label: string;
  value: string;
};

type InstagramGraphMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp?: string;
};

type PublicFeedItem = {
  pk?: string;
  code?: string;
  caption?: {
    text?: string;
  };
  image_versions2?: {
    candidates?: Array<{
      url?: string;
    }>;
  };
  carousel_media?: Array<{
    image_versions2?: {
      candidates?: Array<{
        url?: string;
      }>;
    };
  }>;
  taken_at?: number;
};

type ScrapedProfileStats = {
  followers?: string;
  posts?: string;
};

function buildFallback(notice: string): InstagramFeedResponse {
  return {
    mode: "fallback",
    notice,
    profile: siteContent.instagram.profile,
    posts: [...siteContent.instagram.fallbackPosts],
  };
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(Number.parseInt(dec, 10)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function formatDateLabel(date?: string | number) {
  if (!date) return "Instagram";

  const normalized =
    typeof date === "number" ? new Date(date * 1000) : new Date(date);

  return new Intl.DateTimeFormat("tr-TR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(normalized);
}

function parseProfileStats(description: string): ScrapedProfileStats {
  const statsMatch = description.match(
    /([\d,.KMBkmb]+)\s+Followers,\s+[\d,.KMBkmb]+\s+Following,\s+([\d,.KMBkmb]+)\s+Posts/i,
  );

  if (!statsMatch) {
    return {};
  }

  return {
    followers: statsMatch[1],
    posts: statsMatch[2],
  };
}

function buildInstagramMetrics(
  stats: ScrapedProfileStats,
): ReadonlyArray<InstagramMetric> {
  return [
    {
      label: "Gönderi",
      value: stats.posts ?? siteContent.instagram.profile.metrics[0]?.value ?? "0",
    },
    {
      label: "Takipçi",
      value: stats.followers ?? siteContent.instagram.profile.metrics[1]?.value ?? "0",
    },
  ];
}

async function tryPublicProfileScrape(): Promise<InstagramFeedResponse | null> {
  const username = siteContent.instagram.profile.username;
  const profileUrl = `https://www.instagram.com/${username}/`;

  try {
    const htmlResponse = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 1800 },
    });

    if (!htmlResponse.ok) {
      return null;
    }

    const html = await htmlResponse.text();
    const descriptionMatch = html.match(
      /<meta property="og:description" content="([^"]+)"/i,
    );
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);

    const decodedDescription = descriptionMatch
      ? decodeHtmlEntities(descriptionMatch[1])
      : "";
    const decodedTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : "";
    const profileImage = imageMatch ? decodeHtmlEntities(imageMatch[1]) : undefined;

    const metrics = buildInstagramMetrics(parseProfileStats(decodedDescription));
    let posts: InstagramPost[] = [];

    try {
      const feedUrl = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=6`;
      const feedResponse = await fetch(feedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "X-IG-App-ID": "936619743392459",
          Referer: profileUrl,
        },
        next: { revalidate: 1800 },
      });

      if (feedResponse.ok) {
        const feedJson = (await feedResponse.json()) as { items?: PublicFeedItem[] };
        posts =
          feedJson.items
            ?.map((item) => {
              const image =
                item.image_versions2?.candidates?.[0]?.url ??
                item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ??
                "";
              const code = item.code ?? "";

              return {
                id: item.pk ?? code ?? crypto.randomUUID(),
                image,
                caption: item.caption?.text ?? "",
                permalink: code ? `https://www.instagram.com/p/${code}/` : profileUrl,
                dateLabel: formatDateLabel(item.taken_at),
              };
            })
            .filter((post) => post.image)
            .slice(0, 6) ?? [];
      }
    } catch {
      posts = [];
    }

    return {
      mode: "public_scrape",
      notice: posts.length
        ? "Bu bölüm Graph API yerine herkese açık Instagram sayfası ve web endpoint'lerinden alınan verilerle çalışıyor. Bu yöntem kırılgan olabilir."
        : "Profil bilgileri herkese açık sayfadan alındı, ancak gönderi akışı public scrape ile getirilemediği için yedek gönderiler gösteriliyor.",
      profile: {
        ...siteContent.instagram.profile,
        name:
          decodedTitle.split("(")[0]?.trim() || siteContent.instagram.profile.name,
        username,
        image: profileImage,
        metrics,
      },
      posts: posts.length ? posts : [...siteContent.instagram.fallbackPosts],
    };
  } catch {
    return null;
  }
}

export async function getInstagramFeed(): Promise<InstagramFeedResponse> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;
  const publicScrapeResult = await tryPublicProfileScrape();

  if (accessToken && instagramUserId) {
    try {
      const profileUrl = new URL(`https://graph.instagram.com/${instagramUserId}`);
      profileUrl.searchParams.set("fields", "username,media_count,account_type");
      profileUrl.searchParams.set("access_token", accessToken);

      const mediaUrl = new URL(`https://graph.instagram.com/${instagramUserId}/media`);
      mediaUrl.searchParams.set(
        "fields",
        "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
      );
      mediaUrl.searchParams.set("limit", "6");
      mediaUrl.searchParams.set("access_token", accessToken);

      const [profileResponse, mediaResponse] = await Promise.all([
        fetch(profileUrl, { next: { revalidate: 1800 } }),
        fetch(mediaUrl, { next: { revalidate: 1800 } }),
      ]);

      if (profileResponse.ok && mediaResponse.ok) {
        const profileJson = (await profileResponse.json()) as {
          username?: string;
          media_count?: number;
          account_type?: string;
        };
        const mediaJson = (await mediaResponse.json()) as {
          data?: InstagramGraphMedia[];
        };

        const posts =
          mediaJson.data
            ?.filter((post) => post.media_url || post.thumbnail_url)
            .map((post) => ({
              id: post.id,
              image:
                post.media_type === "VIDEO"
                  ? post.thumbnail_url ?? ""
                  : post.media_url ?? "",
              caption: post.caption ?? "",
              permalink: post.permalink,
              dateLabel: formatDateLabel(post.timestamp),
            }))
            .filter((post) => post.image)
            .slice(0, 6) ?? [];

        if (posts.length) {
          return {
            mode: "live",
            notice:
              "Bu akış Instagram Graph API üzerinden sunucu tarafında düzenli olarak yenilenir.",
            profile: {
              ...siteContent.instagram.profile,
              username:
                profileJson.username ?? siteContent.instagram.profile.username,
              image: publicScrapeResult?.profile.image,
              metrics: buildInstagramMetrics({
                posts:
                  publicScrapeResult?.profile.metrics.find(
                    (metric) => metric.label === "Gönderi",
                  )?.value ?? profileJson.media_count?.toString(),
                followers: publicScrapeResult?.profile.metrics.find(
                  (metric) => metric.label === "Takipçi",
                )?.value,
              }),
            },
            posts,
          };
        }
      }
    } catch {
      // Fall through to public scrape and fallback.
    }
  }

  if (publicScrapeResult) {
    return publicScrapeResult;
  }

  return buildFallback(
    "Ne Graph API ne de public scrape yöntemi veri döndürebildiği için yedek Instagram içeriği gösteriliyor.",
  );
}
