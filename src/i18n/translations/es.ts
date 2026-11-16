const es = {
  common: {
    languageLabel: 'Idioma',
    localeNames: {
      es: 'ES',
      en: 'EN',
    },
  },
  header: {
    brand: 'Plantilla',
    brandAriaLabel: 'Plantilla, ir al inicio',
    navAriaLabel: 'Páginas',
    links: [
      { label: 'Inicio', slug: '' },
      { label: 'Acerca', slug: 'about' },
    ],
  },
  home: {
    metaTitle: 'Plantilla',
    eyebrow: 'Primera sección',
    titleLine1: 'Una página clara',
    titleLine2: 'para el siguiente proyecto.',
    text: 'El header y esta sección comparten un componente. Las palabras siguen el idioma de la URL.',
    preloader: ['Una', 'página', 'clara'],
  },
  homeSteps: {
    eyebrow: 'Segunda sección',
    title: 'Cada sección recibe el mismo idioma.',
    items: [
      {
        index: '01',
        title: 'Un componente',
        text: 'La sección vive en pages/_home y no sabe de rutas.',
      },
      {
        index: '02',
        title: 'Su propio copy',
        text: 'Estas frases están en es.ts y en.ts, aparte de las de arriba.',
      },
      {
        index: '03',
        title: 'El mismo lang',
        text: 'La página se lo pasa a las dos. Cambiar de idioma las cambia juntas.',
      },
    ],
  },
  about: {
    metaTitle: 'Acerca',
    eyebrow: 'Otra página',
    title: 'Esta no es la página de inicio.',
    text: 'El header es el mismo. La ruta no: el inglés vive en /en/about y, al cambiar de idioma, el español se queda en /es/about.',
    points: [
      { label: 'Inglés', value: '/en/about' },
      { label: 'Español', value: '/es/about' },
    ],
  },
  menu: {
    metaTitle: 'Yokō · Matcha Cafe Tokyo',
    brand: 'Yokō',
    subtitle: 'Matcha Cafe  |  Tokyo',
    title: 'MENÚ',
    back: '‹  MENÚ',
    navAriaLabel: 'Categorías del menú',
    viewer: {
      close: 'Cerrar',
    },
    currency: '¥',
    footer: {
      note: 'Clásicos · Especiales · Bocados',
      brand: 'Yokō · Tokyo',
    },
    categories: {
      classics: {
        metaTitle: 'Clásicos · Yokō',
        title: 'CLÁSICOS',
        intro: 'El ritual diario del matcha.',
      },
      signatures: {
        metaTitle: 'Especiales · Yokō',
        title: 'ESPECIALES',
        intro: 'Un paso más allá de lo cotidiano.',
      },
      snacks: {
        metaTitle: 'Bocados · Yokō',
        title: 'BOCADOS',
        intro: 'Pequeños bocados. Momentos lentos.',
      },
    },
    items: {
      usucha: {
        name: 'Matcha puro (Usucha)',
        description: 'Matcha tradicional, batido con agua caliente.',
      },
      shot: {
        name: 'Shot de matcha',
        description: 'Matcha ceremonial puro e intenso.',
      },
      latte: {
        name: 'Matcha latte',
        description: 'Matcha orgánico japonés con leche de avena.',
        note: 'CALIENTE / FRÍO',
      },
      strawberryMatcha: {
        name: 'Matcha de fresa',
        description: 'Matcha, leche de avena y puré de fresa.',
      },
      yuzuTonic: {
        name: 'Tónica de matcha y yuzu',
        description: 'Yuzu fresco, matcha y tónica con gas.',
      },
      blackSesameLatte: {
        name: 'Latte de sésamo negro',
        description: 'Sésamo negro tostado, matcha y leche de avena.',
      },
      sakuraCloud: {
        name: 'Nube de sakura',
        description: 'Matcha, leche de sakura y una suave nube de crema.',
      },
      hojichaMaple: {
        name: 'Hojicha y arce',
        description: 'Té japonés tostado, leche de avena y arce.',
      },
      madeleines: {
        name: 'Madeleines de matcha',
        description: 'Dos bizcochitos tiernos, matcha ceremonial.',
      },
      daifuku: {
        name: 'Daifuku de fresa',
        description: 'Fresa fresca, judía roja y mochi suave.',
      },
      financier: {
        name: 'Financier de hojicha',
        description: 'Mantequilla avellana, almendra y hojicha tostado.',
      },
      cheesecake: {
        name: 'Cheesecake de yuzu',
        description: 'Cheesecake cremoso con un toque brillante de yuzu.',
      },
      cookie: {
        name: 'Galleta de sésamo negro',
        description: 'Sésamo negro tostado, borde crujiente, centro suave.',
      },
      dorayaki: {
        name: 'Dorayaki de matcha',
        description: 'Esponjosos panqueques de matcha con azuki dulce.',
      },
    },
  },
};

export default es;
export type Translations = typeof es;
