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
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPriceUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
