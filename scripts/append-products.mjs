import fs from 'fs/promises';
import path from 'path';

const newProducts = [
  {
    slug: "different-hearts-one-friendship",
    title: "Different Hearts, One Friendship",
    medium: "Original Textured Floral Painting on Canvas",
    size: "18 × 18 inches",
    price: 1600,
    src: "/artworks/different-hearts-one-friendship.webp",
    images: ["/artworks/different-hearts-one-friendship.webp"],
    materials: "Original textured painting on canvas",
    width: "18 inches",
    height: "18 inches",
    depth: "1.5 inches",
    frame: "Elegant 1.5-inch soft silver-grey frame with warm gold detailing",
    style: "Contemporary Textured Floral Art",
    colours: "Deep Burgundy, Crimson Red, Blush Pink, Soft White, Powder Blue, Warm Gold and Sage Green",
    theme: "Friendship, Love, Understanding, Harmony and Individuality",
    artistMessage: "“We may bloom in different colours and see the world in different ways, but true friendship grows through love, kindness, and understanding. We do not need to think alike to remain connected—only to respect our differences and share the hope of a lasting friendship.”",
    description: "Different Hearts, One Friendship is an expressive textured floral painting celebrating the beauty of friendship, individuality, and the love that connects different hearts.\n\nThe burgundy, pink, and white blossoms represent friends with different personalities, thoughts, and dreams, yet blooming together in harmony.\n\nThe deep burgundy symbolizes loyalty and affection, soft pink reflects kindness and understanding, while white represents sincerity and peace. The golden accents highlight the precious value of friendship, beautifully balanced by the calming blue background.\n\nThrough its vibrant colours and rich textures, the painting reminds us that true friendship is not about thinking alike, but about embracing differences with love, respect, and understanding.",
    closingQuote: "“Like flowers blooming in different colours, true friends may see life differently, yet together they create something beautiful. Friendship blossoms when different hearts share one hope—to remain connected through love.”"
  },
  {
    slug: "petals-of-tender-strength",
    title: "Petals of Tender Strength",
    medium: "Original Textured Floral Painting on Canvas",
    size: "12 × 10 inches",
    price: 1200,
    src: "/artworks/petals-of-tender-strength.webp",
    images: ["/artworks/petals-of-tender-strength.webp"],
    materials: "Original textured painting on canvas",
    width: "12 inches",
    height: "10 inches",
    depth: "0.5 inch",
    frame: "Unframed canvas",
    style: "Contemporary Expressive Textured Floral Art",
    colours: "Blush Pink, Deep Crimson, Burgundy, Gold, Soft Sage Green and Muted Grey",
    theme: "Love, Tenderness, Inner Strength and Personal Growth",
    artistMessage: "“True strength does not always need to be bold. Sometimes, it blooms gently through love, courage and resilience. Like a flower, we can remain soft at heart while finding the strength to grow through life's imperfections.”",
    description: "Petals of Tender Strength is a contemporary textured floral painting celebrating the beautiful harmony between softness and strength, love and resilience.\n\nThe expressive blossoms combine deep crimson and burgundy, symbolizing passion, courage and emotional strength, with delicate blush pink petals reflecting tenderness, compassion and love. Rich golden accents at the centre suggest the inner light that continues to shine through life's challenges.\n\nThe smaller flower and unopened bud represent different stages of life and personal growth, reminding us that every journey unfolds at its own pace.\n\nBold, layered textures and freely painted petals bring depth and natural character to the composition. Their imperfect forms reflect the beauty of embracing change while remaining true to ourselves.\n\nThrough its expressive colours and delicate floral forms, Petals of Tender Strength reminds us that love and strength can exist together, and that life's imperfections often reveal its most beautiful qualities.",
    closingQuote: "“Like flowers, we do not need to be perfect to bloom beautifully. True beauty lies in growing with love, embracing change and finding strength within our gentleness.”"
  },
  {
    slug: "blossoms-of-the-heart",
    title: "Blossoms of the Heart",
    medium: "Original Textured Floral Painting on Canvas",
    size: "15 × 24 inches",
    price: 1500,
    src: "/artworks/blossoms-of-the-heart.webp",
    images: ["/artworks/blossoms-of-the-heart.webp"],
    materials: "Original textured painting on canvas",
    width: "15 inches",
    height: "24 inches",
    depth: "1.5 inches",
    frame: "Elegant 1.5-inch champagne gold luxury frame",
    style: "Contemporary Textured Floral Art",
    colours: "Crimson Red, Deep Rose, Magenta, Blush Pink, Golden Yellow, Fresh Green and Warm Cream",
    theme: "Love, Friendship, Happiness and Individuality",
    artistMessage: "“Like flowers blooming in their own time, every heart has its own beautiful journey. Love and kindness help us grow, while our differences make us unique. True beauty lies in embracing life and allowing our hearts to blossom.”",
    description: "Blossoms of the Heart is a vibrant textured floral painting celebrating love, friendship, individuality, and the joy of life's journey.\n\nThe expressive crimson, rose, and soft pink blossoms symbolize love, passion, tenderness, and compassion. Touches of golden yellow represent happiness and hope, while the fresh greens reflect growth, renewal, and new beginnings.\n\nThe rich palette-knife textures and freely flowing petals create movement and character. Each flower blooms differently, reminding us that every life unfolds at its own pace, and beauty exists in every stage of growth.\n\nThrough its joyful colours and expressive composition, Blossoms of the Heart celebrates the beauty of embracing our individuality and growing through life with love and kindness.",
    closingQuote: "“Every heart blooms in its own colours and time. With love, kindness, and hope, even the smallest beginnings can grow into something beautiful.”"
  },
  {
    slug: "a-heart-that-endures",
    title: "A Heart That Endures",
    medium: "Original Textured Abstract Heart Painting on Canvas",
    size: "20 × 20 inches",
    price: 1800,
    src: "/artworks/a-heart-that-endures.webp",
    images: ["/artworks/a-heart-that-endures.webp"],
    materials: "Original textured painting on canvas",
    width: "20 inches",
    height: "20 inches",
    depth: "0.5 inch",
    frame: "Unframed canvas",
    style: "Contemporary Expressive Textured Abstract Art",
    colours: "Soft Lavender, Muted White, Lavender Blue, Warm Gold and Subtle Grey",
    theme: "Enduring Love, Healing, Forgiveness, Inner Strength and Hope",
    artistMessage: "“A heart becomes more beautiful not because it has never been broken, but because it has learned to carry every scar with love and still shine. True strength lies in embracing our imperfections, healing through life's challenges and finding the courage to love again.”",
    description: "A Heart That Endures is a contemporary textured abstract painting celebrating the resilience of love, the beauty of imperfection and the quiet strength of a heart that continues to shine.\n\nThe composition features a large, expressive heart formed through rich layers of soft lavender, muted white and radiant gold. Its uneven textures, delicate cracks and imperfect surfaces reflect the memories, emotions and experiences that shape our lives.\n\nThe soft lavender and white tones evoke tenderness, peace and emotional healing, while the golden accents symbolize hope, inner strength and the precious beauty that can emerge from life's challenges.\n\nThe textured heart stands against a calming lavender-blue background, creating a sense of stillness and reflection. Its imperfect yet complete form reminds us that life's difficulties do not diminish our beauty; they become part of the story that makes us stronger and more compassionate.\n\nThrough its expressive textures and gentle colours, A Heart That Endures reminds us that true love is not defined by perfection, but by understanding, forgiveness, patience and the courage to keep loving through every season of life.",
    closingQuote: "“Every scar carries a story, every imperfection holds a lesson, and every heart that chooses to love again carries a golden strength that never fades.”"
  },
  {
    slug: "wings-of-golden-courage",
    title: "Wings of Golden Courage",
    medium: "Original Textured Abstract Butterfly Painting on Canvas",
    size: "20 × 20 inches",
    price: 1900,
    src: "/artworks/wings-of-golden-courage.webp",
    images: ["/artworks/wings-of-golden-courage.webp"],
    materials: "Original textured painting on canvas",
    width: "20 inches",
    height: "20 inches",
    depth: "0.5 inch",
    frame: "Unframed canvas",
    style: "Contemporary Expressive Textured Abstract Art",
    colours: "Radiant Gold, Soft White, Blush Pink, Warm Peach and Champagne Gold",
    theme: "Feminine Strength, Resilience, Transformation, Freedom and Dreams",
    artistMessage: "“Her wings may carry the marks of every storm, but they still shine in gold. She does not wait for perfect wings to fly. With courage in her heart and dreams beyond her fears, she rises above life's challenges, embracing every imperfection as part of her strength.”",
    description: "Wings of Golden Courage is a contemporary textured abstract painting celebrating the extraordinary inner strength of a woman who continues to dream, rise and shine despite life's challenges.\n\nThe butterfly's expressive wings are formed through rich layers of radiant gold, soft white and delicate blush tones, creating a beautiful balance between feminine elegance and powerful resilience.\n\nThe warm peach-pink background reflects tenderness, love and compassion, while the luminous gold symbolizes confidence, determination and the inner strength that remains even through difficult times. Soft white accents introduce hope, healing and the promise of new beginnings.\n\nThe butterfly's uneven textures, fragmented patterns and imperfect wings represent the experiences, struggles and lessons that shape a woman's journey. Rather than hiding these imperfections, the painting transforms them into a beautiful expression of courage and individuality.\n\nThrough its delicate yet powerful composition, Wings of Golden Courage reminds us that a strong woman does not need perfect wings to fly. Her true beauty lies in her ability to embrace her scars, believe in herself and continue pursuing her dreams with love and determination.",
    closingQuote: "“She may have broken wings, but her spirit remains unbroken. With every scar transformed into golden strength, she finds the courage to rise, shine and fly toward her dreams.”"
  },
  {
    slug: "rhythm-of-the-city",
    title: "Rhythm of the City",
    medium: "Original Contemporary Textured Abstract Painting on Canvas",
    size: "24 × 12 inches",
    price: 1400,
    src: "/artworks/rhythm-of-the-city.webp",
    images: ["/artworks/rhythm-of-the-city.webp"],
    materials: "Original painting on canvas",
    width: "24 inches",
    height: "12 inches",
    depth: "2 inches",
    frame: "Unframed canvas",
    style: "Contemporary Geometric Abstract Art",
    colours: "Deep Red, Blue, Earthy Beige, Cream, White, Brown and Gold",
    theme: "Urban Life, Diversity, Connection, Harmony and the Beauty of Everyday Moments",
    artistMessage: "“Even in the busiest corners of the world, beauty exists within the movement, colours and countless stories of everyday life. Every street, every building and every person adds something unique to the rhythm of a city, reminding us that harmony can be found even in life's beautiful chaos.”",
    description: "Rhythm of the City is a contemporary abstract painting celebrating the vibrant energy of urban life, the beauty of diversity and the unexpected harmony found within a busy town.\n\nThe composition brings together bold geometric forms in deep red, blue, cream and earthy tones, suggesting overlapping buildings, streets and architectural structures. Contrasting colours and expressive brushstrokes reflect the constant movement and changing character of city life.\n\nThe deep reds convey energy and passion, while blue introduces calmness and balance. Warm neutrals and golden accents add depth, reflecting the many experiences, connections and stories that shape a city.\n\nThrough its layered forms and dynamic composition, Rhythm of the City captures the beauty of a world where people, places and moments come together, each following its own path while contributing to a shared rhythm.\n\nThe painting reminds us that beauty is not always found in silence or simplicity. Sometimes, it exists within the movement, diversity and lively imperfections of everyday life.",
    closingQuote: "“A city may never stand still, yet within its endless movement lies a beautiful harmony of dreams, connections and moments that make life meaningful.”"
  },
  {
    slug: "beauty-beyond-colour",
    title: "Beauty Beyond Colour",
    medium: "Original Contemporary Figurative Portrait Painting on Canvas",
    size: "23 × 27 inches",
    price: 2100,
    src: "/artworks/beauty-beyond-colour.webp",
    images: ["/artworks/beauty-beyond-colour.webp"],
    materials: "Original painting on canvas",
    width: "23 inches",
    height: "27 inches",
    depth: "1.5 inches",
    frame: "Elegant 1.5-inch dark bronze frame with antique gold detailing",
    style: "Contemporary Expressive Figurative Art",
    colours: "Earthy Brown, Ivory White, Crimson Red, Antique Gold and Soft Grey",
    theme: "Inner Beauty, Confidence, Individuality and Grace",
    artistMessage: "“Beauty has no colour. It lives in the confidence of being yourself, the grace of how you carry yourself, and the light within. True beauty is defined by our individuality, kindness, and inner strength.”",
    description: "Beauty Beyond Colour celebrates feminine confidence, individuality, and the timeless elegance of self-expression.\n\nThe woman's striking crimson lips, elegant ivory headwrap, and delicate jewellery reflect confidence and grace, while her gently closed eyes express inner peace and self-assurance.\n\nThe earthy browns and golden highlights symbolize strength and inner radiance, while the ivory tones represent elegance and the crimson lips express passion and confidence.\n\nThrough its expressive textures and graceful composition, the painting reminds us that true beauty is not defined by skin colour or appearance, but by the confidence, kindness, and individuality we carry within.",
    closingQuote: "“True beauty is not the colour of our skin, but the confidence in our presence, the kindness in our hearts, and the grace with which we express ourselves.”"
  },
  {
    slug: "strength-in-motion",
    title: "Strength in Motion",
    medium: "Original Expressive Horse Painting on Canvas",
    size: "22 × 26 inches",
    price: 2200,
    src: "/artworks/strength-in-motion.webp",
    images: ["/artworks/strength-in-motion.webp"],
    materials: "Original expressive painting on canvas",
    width: "22 inches",
    height: "26 inches",
    depth: "1 inch",
    frame: "Framed in a rich reddish-brown wooden frame with a classic polished finish (1.25-inch frame width)",
    style: "Contemporary Expressive Figurative Art",
    colours: "Soft White, Cream, Gold, Fiery Orange, Amber, Deep Brown and Charcoal",
    theme: "Strength, Freedom, Determination and Self-Control",
    artistMessage: "“True strength is not measured by how fast we move, but by our ability to choose our own direction. Like a powerful horse, we find freedom in moving forward with courage, controlling our strength and knowing when to stand still.”",
    description: "Strength in Motion is an expressive contemporary painting celebrating the beauty of freedom, inner strength and the wisdom of self-control.\n\nThe majestic horse, painted in soft white, cream, gold and subtle grey, emerges against a dramatic background of fiery orange, golden yellow and deep earthy tones. Its graceful presence reflects confidence and determination, while the vibrant surroundings symbolize life's energy, challenges and opportunities.\n\nBold, sweeping brushstrokes create a powerful sense of movement, speed and vitality, capturing the spirit of a horse that possesses both extraordinary strength and the freedom to control its own pace.\n\nThrough its dynamic composition, Strength in Motion reminds us that true power lies not only in moving forward with courage, but also in having the discipline to choose our direction and the wisdom to know when to stop.",
    closingQuote: "“The greatest freedom is not simply the power to run, but the strength to decide when to move and when to stand still.”"
  },
  {
    slug: "the-crimson-queen",
    title: "The Crimson Queen",
    medium: "Original Contemporary Floral Painting on Canvas",
    size: "27 × 27 inches",
    price: 2400,
    src: "/artworks/the-crimson-queen.webp",
    images: ["/artworks/the-crimson-queen.webp"],
    materials: "Original painting on canvas",
    width: "27 inches",
    height: "27 inches",
    depth: "1 inch",
    frame: "Elegant 1.75-inch luxury reddish-gold frame",
    style: "Contemporary Expressive Floral Art",
    colours: "Crimson Red, Deep Burgundy, Vibrant Orange, Amber, Golden Yellow and Soft Turquoise-Blue",
    theme: "Feminine Confidence, Inner Strength, Passion, Grace, Self-Love and Timeless Beauty",
    artistMessage: "“A true queen does not need a crown to express her royalty. Her confidence is her strength, her kindness is her elegance, and her individuality is her beauty. Like a flower blooming boldly in its own colours, she shines through the love, courage, and grace she carries within.”",
    description: "The Crimson Queen is a striking contemporary floral painting celebrating feminine confidence, individuality, passion, and timeless beauty—a queen who does not need a crown, because her presence itself is her royalty.\n\nBold, graceful, and commanding, the magnificent flower unfolds through sweeping layers of rich crimson, deep burgundy, vibrant orange, and glowing gold, reflecting the beauty of a woman who carries both strength and softness within her.\n\nThe deep reds and burgundy tones symbolize love, passion, courage, and resilience, while the radiant golden highlights express dignity, warmth, confidence, and a quiet sense of royalty. Against the calming turquoise-blue background, the flower stands proudly, allowing its vibrant colours and unique character to shine.\n\nThe elegant, flowing curves of the petals resemble the graceful folds of a royal gown, giving the flower a majestic yet feminine presence. Its rich, dark centre represents inner wisdom, individuality, and the quiet strength that lies beneath true beauty.\n\nThrough its bold colours, graceful movement, and striking simplicity, The Crimson Queen reminds us that true elegance is not defined by perfection or appearance, but by the confidence to embrace who we are and the strength to shine in our own unique way.",
    closingQuote: "“Every woman carries a queen within her. Her crown is her confidence, her beauty is her individuality, and her greatest strength is the love and grace she carries in her heart.”"
  },
  {
    slug: "still-she-shines",
    title: "Still She Shines",
    medium: "Original Textured Abstract Floral Painting on Canvas",
    size: "20 × 20 inches",
    price: 1850,
    src: "/artworks/still-she-shines.webp",
    images: ["/artworks/still-she-shines.webp"],
    materials: "Original textured painting on canvas",
    width: "20 inches",
    height: "20 inches",
    depth: "1.5 inches",
    frame: "Elegant 2-inch antique silver and ornate gold decorative frame",
    style: "Contemporary Textured Abstract Floral Art",
    colours: "Soft White, Ivory, Warm Cream, Champagne Gold, Antique Gold, Silver-Grey and Deep Charcoal",
    theme: "Feminine Grace, Quiet Resilience, Inner Beauty and Strength",
    artistMessage: "“A woman does not need to be strong every moment to be beautiful. Even when life leaves her feeling fragile or wounded, her inner light never truly fades. Like a delicate flower touched by gold, she carries the beauty of her experiences, the courage to rise again, and the quiet strength to keep shining.”",
    description: "Still She Shines is an elegant contemporary textured floral painting celebrating feminine grace, quiet resilience, inner beauty, and the strength that remains within us through life's challenges.\n\nA magnificent white blossom unfolds against a dramatic charcoal-grey background, its delicate petals enriched with soft ivory, warm cream, and radiant gold. The flower represents a woman who may sometimes feel fragile or wounded, yet continues to carry beauty, dignity, and an enduring inner light.\n\nThe soft white petals symbolize purity, vulnerability, and peace, while the golden highlights reflect hope, courage, and self-worth. The contrasting deep charcoal and silver-grey tones represent life's challenges, allowing the flower's gentle beauty to shine even more brightly.\n\nThe expressive textured brushstrokes and imperfect layers reflect life's experiences, reminding us that vulnerability does not diminish our beauty, and true strength often lies within our softest moments.\n\nThrough its graceful contrasts and rich textures, Still She Shines celebrates the beauty of embracing our imperfections and finding the courage to shine again.",
    closingQuote: "“Even when life softens her petals and challenges her strength, she remains beautiful. For true beauty is not in being perfect, but in carrying love, hope, and the courage to shine through it all.”"
  },
  {
    slug: "path-of-natures-embrace",
    title: "Path of Nature's Embrace",
    medium: "Original Tranquil Landscape Painting on Canvas",
    size: "12 × 24 inches",
    price: 1400,
    src: "/artworks/path-of-natures-embrace.webp",
    images: ["/artworks/path-of-natures-embrace.webp"],
    materials: "Original painting on canvas",
    width: "12 inches",
    height: "24 inches",
    depth: "1 inch",
    frame: "Unframed canvas",
    style: "Contemporary Expressive Landscape Art",
    colours: "Vibrant Green, Olive Green, Earthy Brown, Misty Grey, Muted Lavender, Charcoal and Soft Black",
    theme: "Inner Peace, Love for Nature, Hope, Renewal and Life's Journey",
    artistMessage: "“Nature reminds us to slow down, breathe deeply, and appreciate life's simple beauty. Like a quiet path through a peaceful forest, our journey may sometimes be uncertain, yet every step offers a chance to discover hope, embrace love, and find peace within ourselves.”",
    description: "Path of Nature's Embrace is a serene contemporary landscape painting celebrating our connection with nature, the beauty of simplicity, and the inner peace found in life's quiet moments.\n\nA gentle earthy pathway winds through a lush green meadow towards a mist-covered forest, inviting us to escape the noise of everyday life and reconnect with nature's peaceful rhythm.\n\nThe vibrant greens symbolize life, renewal, and hope, while the soft misty greys and muted lavender tones reflect calmness, reflection, and life's uncertainties. The winding brown path represents our personal journey, reminding us that every step offers new opportunities for growth.\n\nThe delicate overhanging branches and textured greenery create a comforting natural embrace, while the contrast between the bright meadow and mysterious forest reminds us that even when the road ahead is unclear, beauty and hope remain around us.\n\nThrough its peaceful colours and inviting composition, Path of Nature's Embrace encourages us to slow down, appreciate the present moment, and find happiness in the simple beauty of nature.",
    closingQuote: "“Life is a winding path through nature. We may not always see what lies ahead, but with love in our hearts and peace in our minds, every journey can become beautiful.”"
  },
  {
    slug: "flow-of-inner-strength",
    title: "Flow of Inner Strength",
    medium: "Original Textured Abstract Painting on Canvas",
    size: "15 × 24 inches",
    price: 1600,
    src: "/artworks/flow-of-inner-strength.webp",
    images: ["/artworks/flow-of-inner-strength.webp"],
    materials: "Original textured painting on canvas",
    width: "15 inches",
    height: "24 inches",
    depth: "1.5 inches",
    frame: "Unframed canvas",
    style: "Contemporary Textured Abstract Expressionism",
    colours: "Deep Navy Blue, Vibrant Turquoise, Sky Blue, Soft White, Radiant Gold and Warm Ochre",
    theme: "Inner Strength, Resilience, Freedom, Hope and Personal Growth",
    artistMessage: "“Life moves—sometimes gently, sometimes powerfully, yet always finding its way forward. Every turn, challenge, and uncertainty shapes our journey, reminding us that true strength lies not in following a perfect path, but in embracing change, finding hope, and continuing to flow with courage and confidence.”",
    description: "Flow of Inner Strength is a striking contemporary textured abstract painting celebrating resilience, freedom, inner strength, and the beauty of moving forward through life's changing journey.\n\nBold, sweeping curves of deep navy blue, vibrant turquoise, and radiant gold flow across the canvas, creating a powerful sense of movement and energy. The expressive strokes resemble flowing water, symbolizing life's continuous journey and our ability to adapt, overcome challenges, and move forward.\n\nThe deep navy blue represents confidence, depth, and inner strength, while the turquoise and sky-blue tones express freedom, renewal, and emotional calm. The generous areas of soft white symbolize clarity, peace, and new beginnings, while the radiant golden accents reflect hope, courage, and the precious moments that illuminate our lives.\n\nThe contrast between bold textured strokes and open, peaceful spaces creates a beautiful balance between strength and serenity, reminding us that life does not need to follow a perfect path to become meaningful and beautiful.\n\nThrough its flowing forms, expressive textures, and striking colours, Flow of Inner Strength celebrates the courage to embrace change, the strength to overcome uncertainty, and the freedom to discover beauty along life's journey.",
    closingQuote: "“Life may take us through unexpected turns, but like water finding its way, we carry the strength to keep moving forward. With courage in our hearts and hope in our journey, every new direction can lead to something beautiful.”"
  },
  {
    slug: "the-courage-to-stand-alone",
    title: "The Courage to Stand Alone",
    medium: "Original Contemporary Floral Painting on Canvas",
    size: "11.5 × 14 inches",
    price: 900,
    src: "/artworks/the-courage-to-stand-alone.webp",
    images: ["/artworks/the-courage-to-stand-alone.webp"],
    materials: "Original painting on canvas",
    width: "11.5 inches",
    height: "14 inches",
    depth: "1 inch",
    frame: "Elegant 1.5-inch antique gold frame",
    style: "Contemporary Minimalist Floral Art",
    colours: "Radiant Orange, Golden Yellow, Warm Amber, Soft Aqua Green and Earthy Brown",
    theme: "Courage, Confidence, Individuality and Personal Growth",
    artistMessage: "“You do not have to follow the crowd to become beautiful. Sometimes, standing alone allows your true colours to shine. True strength lies in embracing who you are, believing in your worth, and having the courage to follow your own path.”",
    description: "The Courage to Stand Alone is an elegant contemporary floral painting celebrating individuality, self-confidence, inner strength, and the beauty of being different.\n\nA radiant orange poppy stands gracefully against a peaceful aqua-green background, accompanied by delicate buds at different stages of growth. The flower represents the courage to stand independently and embrace one's unique beauty.\n\nThe vibrant orange and golden tones symbolize courage, determination, and happiness, while the soft aqua-green background reflects peace, balance, and calmness.\n\nThe delicate buds remind us that everyone grows and blooms at their own pace, and every stage of life carries its own beauty.\n\nThrough its graceful simplicity and expressive colours, The Courage to Stand Alone reminds us that true confidence comes from accepting our individuality and having the strength to shine in our own way.",
    closingQuote: "“We do not need to bloom like everyone else. True beauty lies in the courage to be ourselves and the confidence to shine in our own unique way.”"
  }
];

async function updateProducts() {
  const filePath = path.join('src', 'data', 'products.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  const formattedNewProducts = newProducts.map(p => {
    let str = `  {\n`;
    for (const [key, value] of Object.entries(p)) {
      if (Array.isArray(value)) {
        str += `    ${key}: [${value.map(v => `"${v}"`).join(', ')}],\n`;
      } else if (typeof value === 'number') {
        str += `    ${key}: ${value},\n`;
      } else {
        str += `    ${key}: ${JSON.stringify(value)},\n`;
      }
    }
    str += `  }`;
    return str;
  }).join(',\n');

  content = content.replace(/  \}\n\];/, `  },\n${formattedNewProducts}\n];`);
  
  await fs.writeFile(filePath, content);
  console.log("Updated products.ts");
}

updateProducts();
