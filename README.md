# RabicVisuals — spletna stran

Statična spletna stran (HTML, CSS, vanilla JS) brez gradbenega procesa. Pripravljena za GitHub + Cloudflare Pages.

## Struktura

```
rabicvisuals/
├── index.html          Domov
├── o-meni.html          O meni
├── galerija.html        Galerija (filtri + lightbox)
├── photobooth.html       Photobooth
├── kontakt.html          Kontakt (obrazec)
├── robots.txt
├── sitemap.xml
├── favicon.svg
├── css/style.css        Vsi stili (design tokeni na vrhu datoteke)
├── js/script.js         Meni, animacije, filtri galerije, lightbox, obrazec
└── images/               Zamenljive placeholder fotografije
    ├── hero/
    ├── about/
    ├── gallery/
    │   ├── weddings/
    │   ├── portraits/
    │   └── events/
    └── photobooth/
```

## Zamenjava fotografij

Vse slike v mapi `images/` so **generirani placeholderji** (ne prave fotografije). Preprosto zamenjajte datoteke z enakim imenom s svojimi fotografijami — poti v HTML-ju se ne bodo spremenile. Priporočena razmerja:

- `hero/*.jpg` — širok format (npr. 2400×1500)
- `about/portrait-main.jpg` — pokončni portret (4:5)
- `gallery/**/*.jpg` — poljubna razmerja, galerija je zasnovana kot "masonry" postavitev
- `photobooth/*.jpg` — mešano pokončne in ležeče

Za dodajanje novih fotografij v galerijo kopirajte en `<figure class="masonry-item ...">` blok v `galerija.html` in prilagodite `data-category` (`weddings`, `portraits` ali `events`), `data-full`, `data-caption` ter `src`/`alt`.

## Povezava kontaktnega obrazca

Obrazec na `kontakt.html` je pripravljen, a še ne pošilja podatkov nikamor. Za povezavo:

**Formspree**
```html
<form class="contact-form" action="https://formspree.io/f/VAŠA_KODA" method="POST">
```
in v `js/script.js` odstranite `e.preventDefault();` v razdelku "Contact form".

**Web3Forms**
```html
<form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="VAŠ_KLJUČ">
```

## Urejanje besedila

Vse besedilo je neposredno v HTML datotekah — ni potrebe po CMS-ju ali predlogah. Iščite po slovenskem besedilu neposredno v ustrezni `.html` datoteki.

## Postavitev na Cloudflare Pages

1. Naložite mapo v repozitorij na GitHub.
2. V Cloudflare Pages ustvarite nov projekt in povežite repozitorij.
3. Build command: pustite prazno. Output directory: `/` (koren repozitorija).
4. Deploy — stran ne potrebuje `npm install` ali gradbenega koraka.

## Pred objavo

- Zamenjajte `https://www.rabicvisuals.com` v `<head>` vsake strani, v `sitemap.xml` in `robots.txt` z dejansko domeno.
- Zamenjajte placeholder fotografije s pravimi.
- Povežite kontaktni obrazec (glej zgoraj).
- Preverite `hello@rabicvisuals.com` in Instagram povezavo v `kontakt.html` in nogi strani.
