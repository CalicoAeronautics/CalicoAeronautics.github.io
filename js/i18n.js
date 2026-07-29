/* ==========================================================================
   i18n: nav/footer strings (used by layout.js via t()) plus page-specific
   strings applied via [data-i18n] + [data-i18n-default] attributes.

   To extend translations to more pages: add a data-i18n="section.key"
   and data-i18n-default="Original English text" to any element, then add
   matching entries under tr/fr below. English needs no entry - the
   data-i18n-default value is used automatically.
   ========================================================================== */

const TRANSLATIONS = {
  tr: {
    nav: {
      home: 'Ana Sayfa', articles: 'Makaleler', olympiad: 'Olimpiyat Merkezi',
      spaceExplorer: 'Uzay Kaşifi', resources: 'Kaynaklar', about: 'Hakkında',
      problem: 'Haftanın Problemi', news: 'Haberler', calculators: 'Hesap Makineleri',
      formulas: 'Formül Kütüphanesi', simulations: 'Simülasyonlar', timeline: 'Zaman Çizelgesi',
      map: 'Keşif Haritası', scientists: 'Büyük Bilim İnsanları', iphyc: 'IPhyC',
      contact: 'İletişim', more: 'Daha Fazla',
    },
    footer: {
      learn: 'Öğren', explore: 'Keşfet', compete: 'Yarış', connect: 'Bağlan',
      tagline: 'Fizik ve matematiği meraklı bir kedinin bakış açısıyla anlatıyoruz - sabırla, eğlenerek, bir seferde bir fikir.',
      builtWith: 'Meraktan inşa edildi, ders kitaplarından değil.',
    },
    home: {
      eyebrow: 'Muhtemelen tensörleri açıklayan Schr\u00f6dinger\u2019in kalikosu',
      tagline: 'Fizik ve matematik imkansız ders kitaplarının arkasına gizlenmemeli. Bir kalico kedi, bir tahta dolusu merak ve hiç kapı bekçiliği yok.',
      exploreBtn: 'Fiziği Keşfet',
      readBtn: 'Makaleleri Oku',
      sectionEyebrow: 'Buradan başla',
      sectionHeading: 'Bölümlerle değil, merakla düzenlenmiş bir evren',
      sectionSub: 'Aynı fikirlere altı farklı kapıdan giriş - bugün hangisi ilginizi çekiyorsa onu seçin.',
    },
    about: {
      eyebrow: 'Bunun neden var olduğu',
      heading: 'Fizik imkansız ders kitaplarının arkasına gizlenmemeli.',
      sub: 'Merakı engellemek değil, ilham vermek. Calico Physics\u2019in tüm öncülü bu.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil', articles: 'Articles', olympiad: 'Espace Olympiades',
      spaceExplorer: 'Explorateur Spatial', resources: 'Ressources', about: '\u00c0 propos',
      problem: 'Probl\u00e8me de la Semaine', news: 'Actualit\u00e9s', calculators: 'Calculatrices',
      formulas: 'Biblioth\u00e8que de Formules', simulations: 'Simulations', timeline: 'Chronologie',
      map: 'Carte des D\u00e9couvertes', scientists: 'Grands Scientifiques', iphyc: 'IPhyC',
      contact: 'Contact', more: 'Plus',
    },
    footer: {
      learn: 'Apprendre', explore: 'Explorer', compete: 'Concourir', connect: 'Contact',
      tagline: 'La physique et les math\u00e9matiques expliqu\u00e9es comme un chat curieux les explorerait - patiemment, avec l\u00e9g\u00e8ret\u00e9, une id\u00e9e \u00e0 la fois.',
      builtWith: 'Construit avec curiosit\u00e9, pas avec des manuels.',
    },
    home: {
      eyebrow: 'Le chat calico de Schr\u00f6dinger, probablement en train d\u2019expliquer les tenseurs',
      tagline: 'La physique et les math\u00e9matiques ne devraient pas \u00eatre cach\u00e9es derri\u00e8re des manuels impossibles. Un chat calico, une bonne dose de curiosit\u00e9, et aucune barri\u00e8re \u00e0 l\u2019entr\u00e9e.',
      exploreBtn: 'Explorer la Physique',
      readBtn: 'Lire les Articles',
      sectionEyebrow: 'Commencer ici',
      sectionHeading: 'Un univers organis\u00e9 par curiosit\u00e9, pas par chapitres',
      sectionSub: 'Six portes d\u2019entr\u00e9e vers les m\u00eames id\u00e9es - choisissez celle qui vous int\u00e9resse aujourd\u2019hui.',
    },
    about: {
      eyebrow: 'Pourquoi ce site existe',
      heading: 'La physique ne devrait pas \u00eatre cach\u00e9e derri\u00e8re des manuels impossibles.',
      sub: 'Elle devrait inspirer la curiosit\u00e9, pas la freiner. C\u2019est toute la raison d\u2019\u00eatre de Calico Physics.',
    },
  },
};

function currentLang() {
  return localStorage.getItem('calico-lang') || 'en';
}

function t(path) {
  const lang = currentLang();
  if (lang === 'en') return null;
  const dict = TRANSLATIONS[lang];
  if (!dict) return null;
  let node = dict;
  for (const part of path.split('.')) {
    if (!node) return null;
    node = node[part];
  }
  return node || null;
}

function applyPageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    el.textContent = val || el.dataset.i18nDefault || el.textContent;
  });
}

document.addEventListener('DOMContentLoaded', applyPageTranslations);
