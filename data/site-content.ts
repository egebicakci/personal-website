export type SocialLink = {
  platform: string;
  label: string;
  handle: string;
  href: string;
};

export type TravelPin = {
  country: string;
  city: string;
  lat: number;
  lng: number;
  displayLat?: number;
  displayLng?: number;
  marker?: string;
  date?: string;
  note?: string;
  emphasis?: "normal" | "high";
  gallery?: Array<{
    image: string;
    alt: string;
    caption?: string;
  }>;
};

export type TravelCountry = {
  country: string;
  note: string;
  trips?: number;
  cities: Array<{
    name: string;
    date?: string;
  }>;
};

export type GalleryItem = {
  id: string;
  country: string;
  city: string;
  image: string;
  alt: string;
  caption: string;
  tags: string[];
};

// Sitedeki içeriklerin çoğunu bu dosyadan düzenleyebilirsiniz.
// Linkleri, metinleri, koordinatları ve görsel yollarını buradan güncelleyin.
export const siteContent = {
  name: "Ege Bıçakcı",
  subtitle:
    "Profesyonel bira içicisi, Fenerbahçeli ve Trakya Üniversitesi’nde okulu bitirmeye çalışan bir vatandaş. Boş zamanı ve parası oldukça gezmeye çalışıyor. Dolu zamanı yok.",
  hero: {
    kicker: "ÇOK ÖNEMLİ BİLGİLER",
  },
  profile: {
    image: "/images/profile/ege-profile-new.jpeg",
    alt: "Ege Bıçakcı'nın portre fotoğrafı",
  },
  socialLinks: [
    { platform: "kick", label: "Kick", handle: "@besiege", href: "https://kick.com/besiege" },
    { platform: "facebook", label: "Facebook", handle: "/share", href: "https://www.facebook.com/share/1CM3i3bxBx/?mibextid=wwXIfr" },
    { platform: "x", label: "Twitter / X", handle: "@Todo_Proudfoot", href: "https://x.com/Todo_Proudfoot" },
    { platform: "discord", label: "Discord", handle: "114755192850743299", href: "https://www.discordapp.com/users/114755192850743299" },
    { platform: "steam", label: "Steam", handle: "XCamellia", href: "https://steamcommunity.com/id/XCamellia/" },
    { platform: "spotify", label: "Spotify", handle: "21t3q52m45brdq7gawsayoqny", href: "https://open.spotify.com/user/21t3q52m45brdq7gawsayoqny?si=9d57d145d2e742d5" },
    { platform: "instagram", label: "Instagram", handle: "@egebckci", href: "https://www.instagram.com/egebckci/" },
  ] satisfies SocialLink[],
  travelPins: [
    {
      country: "Gürcistan",
      city: "Batum",
      lat: 41.6168,
      lng: 41.6367,
      displayLat: 41.2,
      displayLng: 42.2,
      marker: "🇬🇪",
      note: "Karadeniz kıyısında kısa ama akılda kalan bir şehir deneyimi.",
      emphasis: "high",
    },
    {
      country: "Yunanistan",
      city: "Selanik",
      lat: 40.6401,
      lng: 22.9444,
      displayLat: 40.1,
      displayLng: 23.7,
      marker: "🇬🇷",
      note: "Sahil, tarih ve şehir ritminin güzel birleştiği duraklardan biri.",
      gallery: [
        {
          image: "/images/travel/greece/greece-1.jpeg",
          alt: "Selanik'te gece selfie",
        },
        {
          image: "/images/travel/greece/greece-2.jpeg",
          alt: "Selanik meydan görünümü",
        },
        {
          image: "/images/travel/greece/greece-3.jpeg",
          alt: "Selanik sahilinde gemi",
        },
        {
          image: "/images/travel/greece/greece-4.jpeg",
          alt: "Selanik'te bar içinde selfie",
        },
        {
          image: "/images/travel/greece/greece-5.jpeg",
          alt: "Selanik'te Atatürk Evi'nde balmumu figürü",
        },
        {
          image: "/images/travel/greece/greece-6.jpeg",
          alt: "Selanik'te Atatürk Evi iç mekânı",
        },
        {
          image: "/images/travel/greece/greece-7.jpeg",
          alt: "Selanik'te Atatürk fotoğrafları sergisi",
        },
        {
          image: "/images/travel/greece/greece-8.jpeg",
          alt: "Selanik'te Atatürk Evi önünde portre",
        },
        {
          image: "/images/travel/greece/greece-9.jpeg",
          alt: "Selanik sokak görünümü",
        },
        {
          image: "/images/travel/greece/greece-10.jpeg",
          alt: "Selanik sahilinde selfie",
        },
        {
          image: "/images/travel/greece/greece-11.jpeg",
          alt: "Selanik caddesi görünümü",
        },
        {
          image: "/images/travel/greece/greece-12.jpeg",
          alt: "Selanik Beyaz Kule",
        },
      ],
    },
    {
      country: "Avusturya",
      city: "Viyana",
      lat: 48.2082,
      lng: 16.3738,
      displayLat: 48.9,
      displayLng: 15.8,
      marker: "🇦🇹",
      note: "Düzenli şehir dokusu, klasik mimari ve güçlü bir atmosfer.",
      emphasis: "high",
      gallery: [
        {
          image: "/images/travel/austria/austria-1.jpeg",
          alt: "Viyana'da ilginç bir afiş",
        },
        {
          image: "/images/travel/austria/austria-2.jpeg",
          alt: "Viyana'da schnitzel ve bira",
        },
        {
          image: "/images/travel/austria/austria-3.jpeg",
          alt: "Viyana'da gece aydınlatmalı tarihi yapı",
        },
        {
          image: "/images/travel/austria/austria-4.jpeg",
          alt: "Viyana'da gece meydan ve anıt",
        },
        {
          image: "/images/travel/austria/austria-5.jpeg",
          alt: "Viyana'da gece sokak anıtı",
        },
        {
          image: "/images/travel/austria/austria-6.jpeg",
          alt: "Viyana'da tarihi bina cephesi",
        },
        {
          image: "/images/travel/austria/austria-7.jpeg",
          alt: "Viyana Aziz Stefan Katedrali dış görünüm",
        },
        {
          image: "/images/travel/austria/austria-8.jpeg",
          alt: "Viyana Aziz Stefan Katedrali önünde portre",
        },
        {
          image: "/images/travel/austria/austria-9.jpeg",
          alt: "Viyana Aziz Stefan Katedrali iç mekân orgu",
        },
        {
          image: "/images/travel/austria/austria-10.jpeg",
          alt: "Viyana Aziz Stefan Katedrali iç görünüm",
        },
        {
          image: "/images/travel/austria/austria-11.jpeg",
          alt: "Viyana'da akşam bira molası",
        },
        {
          image: "/images/travel/austria/austria-12.jpeg",
          alt: "Viyana'da parkta selfie",
        },
        {
          image: "/images/travel/austria/austria-13.jpeg",
          alt: "Viyana'da tarihi yapı detayı ve heykel",
        },
      ],
    },
    {
      country: "Macaristan",
      city: "Budapeşte",
      lat: 47.4979,
      lng: 19.0402,
      displayLat: 47.3,
      displayLng: 20.1,
      marker: "🇭🇺",
      note: "Mimari dokusu ve şehir manzaralarıyla en etkileyici rotalardan biri.",
      gallery: [
        {
          image: "/images/travel/hungary/hungary-1.jpeg",
          alt: "Budapeşte'de ev içinden bir an",
        },
        {
          image: "/images/travel/hungary/hungary-2.jpeg",
          alt: "Budapeşte'de bira ve tatlı patates kızartması",
        },
        {
          image: "/images/travel/hungary/hungary-3.jpeg",
          alt: "Budapeşte Parlamento Binası ve meydan",
        },
        {
          image: "/images/travel/hungary/hungary-4.jpeg",
          alt: "Budapeşte'de gece mekânı atmosferi",
        },
        {
          image: "/images/travel/hungary/hungary-5.jpeg",
          alt: "Budapeşte Parlamento Binası önünde portre",
        },
        {
          image: "/images/travel/hungary/hungary-6.jpeg",
          alt: "Budapeşte Parlamento Binası geniş açı görünüm",
        },
        {
          image: "/images/travel/hungary/hungary-7.jpeg",
          alt: "Budapeşte'de bar iç mekânı",
        },
      ],
    },
    {
      country: "Çek Cumhuriyeti",
      city: "Brno",
      lat: 49.1951,
      lng: 16.6068,
      displayLat: 49.8,
      displayLng: 17.3,
      marker: "🇨🇿",
      note: "Daha sakin ama kendine has havası olan özel bir durak.",
      gallery: [
        {
          image: "/images/travel/czechia/czechia-1.jpeg",
          alt: "Brno gece sokak tabelaları",
        },
        {
          image: "/images/travel/czechia/czechia-2.jpeg",
          alt: "Brno'da gece aydınlatmalı katedral",
        },
        {
          image: "/images/travel/czechia/czechia-3.jpeg",
          alt: "Brno'da meydandaki tarihi anıt",
        },
        {
          image: "/images/travel/czechia/czechia-4.jpeg",
          alt: "Brno'da bina üzerindeki heykel",
        },
        {
          image: "/images/travel/czechia/czechia-5.jpeg",
          alt: "Brno katedral dış cephe detayı",
        },
        {
          image: "/images/travel/czechia/czechia-6.jpeg",
          alt: "Brno'da kilise iç mekânı",
        },
        {
          image: "/images/travel/czechia/czechia-7.jpeg",
          alt: "Brno'da bina üzerindeki figür heykel",
        },
        {
          image: "/images/travel/czechia/czechia-8.jpeg",
          alt: "Brno katedral dış cephesi ve portre",
        },
        {
          image: "/images/travel/czechia/czechia-9.jpeg",
          alt: "Brno katedral duvarındaki haç detayı",
        },
        {
          image: "/images/travel/czechia/czechia-10.jpeg",
          alt: "Brno meydanında portre",
        },
        {
          image: "/images/travel/czechia/czechia-11.jpeg",
          alt: "Brno'da sokak arasından görünen katedral",
        },
        {
          image: "/images/travel/czechia/czechia-12.jpeg",
          alt: "Brno merkez tramvay hattı görünümü",
        },
        {
          image: "/images/travel/czechia/czechia-13.jpeg",
          alt: "Brno'da pembe bina önünde portre",
        },
        {
          image: "/images/travel/czechia/czechia-14.jpeg",
          alt: "Brno manzarası önünde portre",
        },
        {
          image: "/images/travel/czechia/czechia-15.jpeg",
          alt: "Brno'da Pokemon otomatı",
        },
        {
          image: "/images/travel/czechia/czechia-16.jpeg",
          alt: "Brno şehir caddesi ve gökyüzü",
        },
      ],
    },
    {
      country: "Türkiye",
      city: "Türkiye",
      lat: 39.9334,
      lng: 32.8597,
      marker: "🇹🇷",
      note: "Türkiye için şehir adı belirtilmediği için bu pin geçici olarak genel bir konumla gösteriliyor.",
    },
  ] satisfies TravelPin[],
  visitedPlaces: [
    {
      country: "Gürcistan",
      note: "Karadeniz kıyısında keyifli ve akılda kalan bir rota.",
      trips: 1,
      cities: [{ name: "Batum" }],
    },
    {
      country: "Yunanistan",
      note: "Yakın ama karakterli şehirlerden biri.",
      trips: 1,
      cities: [{ name: "Selanik" }],
    },
    {
      country: "Avusturya",
      note: "Mimari ve şehir düzeniyle öne çıkan bir deneyim.",
      trips: 1,
      cities: [{ name: "Viyana" }],
    },
    {
      country: "Macaristan",
      note: "Şehir manzarası ve atmosferiyle öne çıkan duraklardan biri.",
      trips: 1,
      cities: [{ name: "Budapeşte" }],
    },
    {
      country: "Çek Cumhuriyeti",
      note: "Daha sakin ama kendine has havasıyla farklı bir deneyim.",
      trips: 1,
      cities: [{ name: "Brno" }],
    },
    {
      country: "Türkiye",
      note: "Şehir bilgisi netleştirildiğinde bu satır kolayca güncellenebilir.",
      trips: 1,
      cities: [{ name: "Türkiye" }],
    },
  ] satisfies TravelCountry[],
  galleryFilters: [
    "İtalya",
    "Fransa",
    "Japonya",
    "Amerika Birleşik Devletleri",
    "Roma",
    "Tokyo",
    "Gece",
    "Mimari",
  ],
  galleryItems: [
    {
      id: "rome-night",
      country: "İtalya",
      city: "Roma",
      image: "/images/gallery/rome-night.svg",
      alt: "Roma gecesinden ilham alan yer tutucu seyahat görseli",
      caption: "Sıcak taş tonları, gece ışıkları ve sakin ama sinematik sokak hissi.",
      tags: ["İtalya", "Roma", "Gece", "Mimari"],
    },
    {
      id: "paris-cafe",
      country: "Fransa",
      city: "Paris",
      image: "/images/gallery/paris-cafe.svg",
      alt: "Paris kafe atmosferinden ilham alan yer tutucu seyahat görseli",
      caption: "Yumuşak ışıklar, yansıyan sokaklar ve daha editoryal bir şehir havası.",
      tags: ["Fransa", "Paris", "Sokak"],
    },
    {
      id: "tokyo-neon",
      country: "Japonya",
      city: "Tokyo",
      image: "/images/gallery/tokyo-neon.svg",
      alt: "Tokyo neon sokaklarından ilham alan yer tutucu seyahat görseli",
      caption: "Yoğun tabelalar, neon sisleri ve geç saatlerin keskin enerjisi.",
      tags: ["Japonya", "Tokyo", "Gece", "Neon"],
    },
    {
      id: "dubai-skyline",
      country: "Birleşik Arap Emirlikleri",
      city: "Dubai",
      image: "/images/gallery/dubai-skyline.svg",
      alt: "Dubai silüetinden ilham alan yer tutucu seyahat görseli",
      caption: "Cam kuleler, sıcak hava ve gün batımı sonrası parlayan şehir çizgileri.",
      tags: ["Dubai", "Mimari", "Silüet"],
    },
    {
      id: "newyork-grid",
      country: "Amerika Birleşik Devletleri",
      city: "New York",
      image: "/images/gallery/newyork-grid.svg",
      alt: "New York caddelerinden ilham alan yer tutucu seyahat görseli",
      caption: "Sokak ritmi, katmanlı ışık ve dev bir şehrin ağırlığı.",
      tags: ["Amerika Birleşik Devletleri", "New York", "Mimari"],
    },
    {
      id: "kyoto-silence",
      country: "Japonya",
      city: "Kyoto",
      image: "/images/gallery/kyoto-silence.svg",
      alt: "Sakin bir Kyoto sahnesinden ilham alan yer tutucu seyahat görseli",
      caption: "Tokyo'ya kıyasla daha sessiz, daha yumuşak ve daha dingin bir ritim.",
      tags: ["Japonya", "Kyoto", "Minimal"],
    },
  ] satisfies GalleryItem[],
  instagram: {
    profile: {
      name: "Ege Bıçakcı",
      username: "egebckci",
      bio: "Ege Bıçakcı instagram hesabı. Yeni gönderiler otomatik olarak burada görünür.",
      url: "https://www.instagram.com/egebckci/",
      metrics: [
        { label: "Gönderi", value: "20" },
        { label: "Takipçi", value: "655" },
      ],
    },
    fallbackPosts: [
      {
        id: "ig-1",
        image: "/images/gallery/rome-night.svg",
        caption: "Yedek gönderi içeriği. Gerçek Instagram bağlantısı kurulduğunda bunu değiştirebilirsiniz.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
      {
        id: "ig-2",
        image: "/images/gallery/tokyo-neon.svg",
        caption: "API erişimi olmasa bile bölüm düzenli ve güçlü görünmeye devam eder.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
      {
        id: "ig-3",
        image: "/images/gallery/paris-cafe.svg",
        caption: "README içinde nelerin otomatik yapılabildiği ve nasıl kurulacağı açıkça anlatılır.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
      {
        id: "ig-4",
        image: "/images/gallery/newyork-grid.svg",
        caption: "İşletme ya da içerik üretici hesabı ve token tanımlanana kadar bu görünüm kullanılır.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
      {
        id: "ig-5",
        image: "/images/gallery/dubai-skyline.svg",
        caption: "Sunucu tarafı entegrasyon rotası Vercel için şimdiden hazırdır.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
      {
        id: "ig-6",
        image: "/images/gallery/kyoto-silence.svg",
        caption: "Profil detaylarını da bu merkezi içerik dosyasından güncelleyebilirsiniz.",
        permalink: "https://www.instagram.com/egebckci/",
        dateLabel: "Yedek içerik",
      },
    ],
  },
  footer: {
    tagline: "Ege Bıçakcı. Seyahat, üretim ve modern dijital duruş için tasarlandı.",
  },
} as const;

const totalCities = siteContent.visitedPlaces.reduce(
  (count, country) => count + country.cities.length,
  0,
);

const totalTrips = siteContent.visitedPlaces.reduce(
  (count, country) => count + (country.trips ?? 1),
  0,
);

export const travelStats = {
  totalCountries: siteContent.visitedPlaces.length,
  totalCities,
  totalTrips,
};
