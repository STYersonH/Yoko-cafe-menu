import type { Translations } from './es';

const en: Translations = {
  common: {
    languageLabel: 'Language',
    localeNames: {
      es: 'ES',
      en: 'EN',
    },
  },
  header: {
    brand: 'Template',
    brandAriaLabel: 'Template, go to home',
    navAriaLabel: 'Pages',
    links: [
      { label: 'Home', slug: '' },
      { label: 'About', slug: 'about' },
    ],
  },
  home: {
    metaTitle: 'Template',
    eyebrow: 'First section',
    titleLine1: 'A clear page',
    titleLine2: 'for the next project.',
    text: 'The header and this section share one component. The words follow the language in the URL.',
    preloader: ['A', 'clear', 'page'],
  },
  homeSteps: {
    eyebrow: 'Second section',
    title: 'Each section gets the same language.',
    items: [
      {
        index: '01',
        title: 'One component',
        text: 'The section lives in pages/_home and knows nothing about routes.',
      },
      {
        index: '02',
        title: 'Its own copy',
        text: 'These lines live in es.ts and en.ts, apart from the section above.',
      },
      {
        index: '03',
        title: 'The same lang',
        text: 'The page passes it to both. Switching language changes them together.',
      },
    ],
  },
  about: {
    metaTitle: 'About',
    eyebrow: 'Another page',
    title: 'This is not the home page.',
    text: 'The header stays. The route does not: English lives at /en/about, and switching language keeps you on /es/about.',
    points: [
      { label: 'English', value: '/en/about' },
      { label: 'Spanish', value: '/es/about' },
    ],
  },
  menu: {
    metaTitle: 'Yokō · Matcha Cafe Tokyo',
    brand: 'Yokō',
    subtitle: 'Matcha Cafe  |  Tokyo',
    title: 'MENU',
    back: '‹  MENU',
    viewer: {
      close: 'Close',
    },
    navAriaLabel: 'Menu categories',
    currency: '¥',
    footer: {
      note: 'Classics · Signatures · Snacks',
      brand: 'Yokō · Tokyo',
    },
    categories: {
      classics: {
        metaTitle: 'Classics · Yokō',
        title: 'CLASSICS',
        intro: 'The everyday matcha ritual.',
      },
      signatures: {
        metaTitle: 'Signatures · Yokō',
        title: 'SIGNATURES',
        intro: 'A little beyond the everyday.',
      },
      snacks: {
        metaTitle: 'Snacks · Yokō',
        title: 'SNACKS',
        intro: 'Small bites. Slow moments.',
      },
    },
    items: {
      usucha: {
        name: 'Pure Matcha (Usucha)',
        description: 'Traditional matcha, whisked with hot water.',
      },
      shot: {
        name: 'Matcha Shot',
        description: 'Bold, pure ceremonial matcha.',
      },
      latte: {
        name: 'Matcha Latte',
        description: 'Organic Japanese matcha with oat milk.',
        note: 'HOT / ICED',
      },
      strawberryMatcha: {
        name: 'Strawberry Matcha',
        description: 'Matcha, oat milk & strawberry purée.',
      },
      yuzuTonic: {
        name: 'Yuzu Matcha Tonic',
        description: 'Bright yuzu, matcha & sparkling tonic.',
      },
      blackSesameLatte: {
        name: 'Black Sesame Latte',
        description: 'Roasted black sesame, matcha & oat milk.',
      },
      sakuraCloud: {
        name: 'Sakura Cloud',
        description: 'Matcha, sakura milk & a soft cream cloud.',
      },
      hojichaMaple: {
        name: 'Hojicha Maple',
        description: 'Roasted Japanese tea, oat milk & maple.',
      },
      madeleines: {
        name: 'Matcha Madeleines',
        description: 'Two tender shells, ceremonial matcha.',
      },
      daifuku: {
        name: 'Strawberry Daifuku',
        description: 'Fresh strawberry, red bean & soft mochi.',
      },
      financier: {
        name: 'Hojicha Financier',
        description: 'Brown butter, almond & roasted hojicha.',
      },
      cheesecake: {
        name: 'Yuzu Cheesecake',
        description: 'Creamy cheesecake with a bright yuzu note.',
      },
      cookie: {
        name: 'Black Sesame Cookie',
        description: 'Toasted black sesame, crisp edge, soft center.',
      },
      dorayaki: {
        name: 'Matcha Dorayaki',
        description: 'Fluffy matcha pancakes with sweet azuki bean.',
      },
    },
  },
};

export default en;
