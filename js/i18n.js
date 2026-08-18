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
      contact: 'İletişim', more: 'Daha Fazla',
    },
    footer: {
      learn: 'Öğren', explore: 'Keşfet', compete: 'Yarış', connect: 'Bağlan',
      tagline: 'Fiziği anlatan bir kalico kedi: Schr\u00f6dinger\u2019in Kalikosu, göründüğünden daha güçlü.',
      builtWith: 'Meraktan inşa edildi, ders kitaplarından değil.',
    },
    home: {
      eyebrow: 'Muhtemelen tensörleri açıklayan Schr\u00f6dinger\u2019in kalikosu',
      tagline: 'Matematik ve fizik zordur, ama kalico kedi hepsini paylaşmak istiyor.',
      exploreBtn: 'Formülleri Keşfet',
      readBtn: 'Havacılık Haberleri',
      sectionEyebrow: 'Buradan başla',
      sectionHeading: 'Bölümlerle değil, merakla düzenlenmiş bir evren',
      sectionSub: 'Aynı fikirlere altı farklı kapıdan giriş - bugün hangisi ilginizi çekiyorsa onu seçin.',
    },
    about: {
      eyebrow: 'Bunun neden var olduğu',
      heading: 'Fizik imkansız ders kitaplarının arkasına gizlenmemeli.',
      sub: 'Merakı engellemek değil, ilham vermek. Calico Aeronautics\u2019in tüm öncülü bu.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil', news: 'Actualit\u00e9s', competitions: 'Comp\u00e9titions',
      iconicAircraft: 'Avions Emblématiques', resources: 'Ressources', about: '\u00c0 propos',
      calculators: 'Calculatrices',
      formulas: 'Biblioth\u00e8que de Formules', simulations: 'Simulations', timeline: 'Histoire de l\u2019A\u00e9ronautique',
      map: 'Carte de l\u2019Aviation', scientists: 'Pionniers de l\u2019Aviation', iphyc: 'IPhyC',
      contact: 'Contact', more: 'Plus',
    },
    footer: {
      learn: 'Apprendre', explore: 'Explorer', compete: 'Concourir', connect: 'Contact',
      tagline: 'Un chat calico qui explique la physique : le Calico de Schr\u00f6dinger, plus solide qu\u2019il n\u2019y para\u00eet.',
      builtWith: 'Construit avec curiosit\u00e9, pas avec des manuels.',
    },
    home: {
      eyebrow: 'Le chat calico de Schr\u00f6dinger, probablement en train d\u2019expliquer les tenseurs',
      tagline: 'Les maths et la physique sont difficiles, mais le chat calico veut tout partager.',
      exploreBtn: 'Explorer les Formules',
      readBtn: 'Actualités Aéronautiques',
      sectionEyebrow: 'Commencer ici',
      sectionHeading: 'Un univers organis\u00e9 par curiosit\u00e9, pas par chapitres',
      sectionSub: 'Six portes d\u2019entr\u00e9e vers les m\u00eames id\u00e9es - choisissez celle qui vous int\u00e9resse aujourd\u2019hui.',
    },
    about: {
      eyebrow: 'Pourquoi ce site existe',
      heading: 'La physique ne devrait pas \u00eatre cach\u00e9e derri\u00e8re des manuels impossibles.',
      sub: 'Elle devrait inspirer la curiosit\u00e9, pas la freiner. C\u2019est toute la raison d\u2019\u00eatre de Calico Aeronautics.',
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
