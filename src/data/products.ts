export type Product = {
  slug: string;
  title: string;
  medium: string;
  size: string;
  /** Price in USD for display and checkout */
  price: number;
  src: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "the-crimson-queen",
    title: "The Crimson Queen",
    medium: "Oil on Canvas",
    size: "60 × 60 cm",
    price: 1500,
    src: "/the-crimson-queen.webp",
    description: "The Crimson Queen is a celebration of feminine confidence, individuality, passion, and timeless beauty—a queen who does not need a crown, because her presence itself is her royalty.\n\nBold, graceful, and commanding, The Crimson Queen celebrates the timeless elegance of a woman who carries both strength and beauty within her. Like a queen standing confidently in her own presence, the single flower unfolds with magnificent crimson and deep burgundy petals, touched by glowing shades of amber and gold.\n\nThe rich reds and burgundy tones symbolize passion, courage, love, and inner strength, while the golden highlights suggest dignity, warmth, and a quiet sense of royalty. Against the vibrant turquoise-blue background, the flower becomes even more striking—its warm colours appearing almost illuminated, as though it possesses a light of its own.\n\nThe sweeping curves of the petals resemble the flowing folds of an elegant royal gown, giving the bloom a feminine and majestic character. Yet beneath its grandeur lies softness and grace—a reminder that true strength does not need to be loud.",
  },
  {
    slug: "whispers-of-stillness",
    title: "Whispers of Stillness",
    medium: "Acrylic on Canvas",
    size: "60 × 80 cm",
    price: 1280,
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=650&fit=crop",
    description:
      "Layered acrylic washes and deliberate brushwork invite quiet observation. The palette stays restrained so emotion reads through texture and negative space rather than loud colour.",
  },
  {
    slug: "emotional-currents",
    title: "Emotional Currents",
    medium: "Mixed Media",
    size: "50 × 70 cm",
    price: 1450,
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=650&fit=crop",
    description:
      "Paper, pigment, and gestural marks collide in a piece about movement beneath the surface—memory, tension, and release expressed as overlapping currents.",
  },
  {
    slug: "inner-landscape",
    title: "Inner Landscape",
    medium: "Watercolour",
    size: "40 × 55 cm",
    price: 920,
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500&h=650&fit=crop",
    description:
      "Transparent washes and soft edges suggest an interior terrain: hills of feeling, rivers of thought. Light is treated as a participant in the composition.",
  },
  {
    slug: "presence-in-gold",
    title: "Presence in Gold",
    medium: "Textured Abstraction",
    size: "70 × 90 cm",
    price: 2100,
    src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=650&fit=crop",
    description:
      "Heavy texture and metallic accents create a focal ritual—presence as something you can almost touch. Scale encourages the viewer to step closer.",
  },
  {
    slug: "reflections-of-peace",
    title: "Reflections of Peace",
    medium: "Acrylic on Canvas",
    size: "55 × 75 cm",
    price: 1180,
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&h=650&fit=crop",
    description:
      "Mirrored forms and a cooled palette suggest water and stillness. Acrylic allows crisp edges against softer passages for a balanced, contemplative read.",
  },
  {
    slug: "memory-and-light",
    title: "Memory and Light",
    medium: "Mixed Media",
    size: "45 × 60 cm",
    price: 980,
    src: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&h=650&fit=crop",
    description:
      "Collage fragments and painted light intersect—what is remembered versus what is invented. The surface rewards slow viewing from different distances.",
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPriceUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
