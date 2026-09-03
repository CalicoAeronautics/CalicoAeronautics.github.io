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
      home: 'Ana Sayfa', news: 'Haberler', competitions: 'Yarışmalar',
      iconicAircraft: 'İkonik Uçaklar', resources: 'Kaynaklar', about: 'Hakkında',
      calculators: 'Hesap Makineleri',
      formulas: 'Formül Kütüphanesi', simulations: 'Simülasyonlar', timeline: 'Havacılık Tarihi',
      map: 'Havacılık Haritası', scientists: 'Havacılık Öncüleri', iphyc: 'IPhyC',
      socials: 'Sosyal Medya', more: 'Daha Fazla',
    },
    footer: {
      learn: 'Öğren', explore: 'Keşfet', compete: 'Yarış', connect: 'Bağlan',
      tagline: 'Sadece uçan şeyleri anlatan bir kalico kedi.',
      builtWith: 'Meraktan inşa edildi, ders kitaplarından değil.',
    },
    home: {
      exploreBtn: 'Formülleri Keşfet',
      readBtn: 'Havacılık Haberleri',
      sectionEyebrow: 'Buradan başla',
    },
  },
  fr: {
    nav: {
      home: 'Accueil', news: 'Actualit\u00e9s', competitions: 'Comp\u00e9titions',
      iconicAircraft: 'Avions Emblématiques', resources: 'Ressources', about: '\u00c0 propos',
      calculators: 'Calculatrices',
      formulas: 'Biblioth\u00e8que de Formules', simulations: 'Simulations', timeline: 'Histoire de l\u2019A\u00e9ronautique',
      map: 'Carte de l\u2019Aviation', scientists: 'Pionniers de l\u2019Aviation', iphyc: 'IPhyC',
      socials: 'R\u00e9seaux Sociaux', more: 'Plus',
    },
    footer: {
      learn: 'Apprendre', explore: 'Explorer', compete: 'Concourir', connect: 'Contact',
      tagline: 'Juste un chat calico qui explique les choses qui volent.',
      builtWith: 'Construit avec curiosit\u00e9, pas avec des manuels.',
    },
    home: {
      exploreBtn: 'Explorer les Formules',
      readBtn: 'Actualités Aéronautiques',
      sectionEyebrow: 'Commencer ici',
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
