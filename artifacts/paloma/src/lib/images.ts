export const SALON_IMAGES = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfea63a2f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b9?auto=format&fit=crop&w=800&q=80",
];

export const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1590156551560-39f5aa49c7ec?auto=format&fit=crop&w=400&q=80",
];

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=85";

export const STYLIST_IMAGES = [
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
];

export function getSalonImage(index: number): string {
  return SALON_IMAGES[index % SALON_IMAGES.length];
}

export function getProductImage(index: number): string {
  return PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
}

export function getStylistImage(index: number): string {
  return STYLIST_IMAGES[index % STYLIST_IMAGES.length];
}
