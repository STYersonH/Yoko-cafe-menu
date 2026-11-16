import type { Translations } from '../i18n/translations/es';

export const CATEGORY_IDS = ['classics', 'signatures', 'snacks'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type ItemId = keyof Translations['menu']['items'];

/** Vertical offsets from the item's top edge, in px at the 390px frame. */
export interface ItemOffsets {
  title: number;
  description: number;
  price: number;
  note: number;
  imageTop: number;
}

export interface MenuItemData {
  id: ItemId;
  price: number;
  image: string;
  offsets?: Partial<ItemOffsets>;
}

export const DEFAULT_OFFSETS: ItemOffsets = {
  title: 16,
  description: 72,
  price: 132,
  note: 148,
  imageTop: -6,
};

/** Which Figma backdrop (whisk + wave) each category uses. */
export const BACKDROP_BY_CATEGORY = {
  classics: 'classics',
  signatures: 'tall',
  snacks: 'tall',
} as const satisfies Record<CategoryId, 'classics' | 'tall'>;

const assets = '/menu-assets';

export const MENU_ITEMS: Record<CategoryId, MenuItemData[]> = {
  classics: [
    {
      id: 'usucha',
      price: 720,
      image: `${assets}/classics/usucha.png`,
      offsets: { title: 6, description: 62 },
    },
    {
      id: 'shot',
      price: 480,
      image: `${assets}/classics/shot.png`,
      offsets: { title: 24, description: 62, price: 117 },
    },
    {
      id: 'latte',
      price: 650,
      image: `${assets}/classics/latte.png`,
      offsets: { title: 24, description: 62, price: 117, note: 148, imageTop: -2 },
    },
  ],
  signatures: [
    { id: 'strawberryMatcha', price: 820, image: `${assets}/signatures/strawberry-matcha.png` },
    { id: 'yuzuTonic', price: 780, image: `${assets}/signatures/yuzu-matcha-tonic.png` },
    { id: 'blackSesameLatte', price: 850, image: `${assets}/signatures/black-sesame-latte.png` },
    { id: 'sakuraCloud', price: 880, image: `${assets}/signatures/sakura-cloud.png` },
    { id: 'hojichaMaple', price: 800, image: `${assets}/signatures/hojicha-maple.png` },
  ],
  snacks: [
    { id: 'madeleines', price: 420, image: `${assets}/snacks/matcha-madeleines.png` },
    { id: 'daifuku', price: 480, image: `${assets}/snacks/strawberry-daifuku.png` },
    { id: 'financier', price: 450, image: `${assets}/snacks/hojicha-financier.png` },
    { id: 'cheesecake', price: 620, image: `${assets}/snacks/yuzu-cheesecake.png` },
    { id: 'cookie', price: 380, image: `${assets}/snacks/black-sesame-cookie.png` },
    { id: 'dorayaki', price: 520, image: `${assets}/snacks/matcha-dorayaki.png` },
  ],
};

export function pxToRem(px: number) {
  return `${px / 16}rem`;
}
