# Memselon Mockup Landing — Repositioning Update

## ⚠️ Règle d'or pour cette mission

Cette landing existe déjà à https://mockup-landing-rho.vercel.app et a une bonne structure de base. **Ne fais pas un rewrite.** Modifie chirurgicalement les sections qui doivent changer, garde tout ce qui marche déjà visuellement.

**Préserve absolument** :
- Le styling existant (Tailwind, CSS modules, ou autre selon la stack actuelle)
- Le système de breakpoints / responsive
- Les composants UI réutilisables existants
- Le layout global (header / footer)
- Le système de dark mode si présent
- Les animations / interactions déjà en place
- La structure des assets (images, fonts, icons)

**Workflow demandé** :
1. Lis ce document en entier
2. Audit du codebase actuel : liste les composants, fichiers, assets affectés par cette mission
3. Propose un plan de modification incrémental section par section
4. Demande validation avant de commit
5. Pour chaque section, montre-moi le diff avant d'appliquer
6. Commit chaque section dans un commit séparé pour rollback facile
7. Run `npm run build` (ou équivalent) pour valider qu'aucune section ne casse le build après modifications

---

## Contexte stratégique

Repositionnement produit :
- **Avant** : "Framer Mockup — 3D Device Mockups in Seconds" (utilitaire)
- **Après** : "Memselon Mockup — Real-time 3D Mockup Studio for Framer" (premium category)

**Tagline officielle** : `Real 3D. Real-time. In Framer.`

**Différenciateur unique à marteler** : on est le SEUL outil qui embed des mockups 3D temps réel directement dans le site Framer du designer. Tous les concurrents (Rotato, Previewed, Device Frames, MockRocket, Mockuuups Studio) exportent des fichiers PNG/MP4 statiques. Nous on ship un composant 3D live qui scroll, rotate et réagit dans le site final.

**Audience cible** : designers Framer freelances et agences premium, monde entier. Audience **anglophone**, pas de focus France. Currency **USD**.

---

## DÉCISIONS DE BASE

- **Langue** : English-first, pas de FR au launch
- **Tone** : premium / cinematic (genre Linear, Vercel, Aica), pas friendly indie maker
- **Currency** : USD uniquement, $ symbol partout
- **Pricing affiché** : $19 / $39 / $99 / $249
- **Stripe checkout** : checkout en USD, Stripe affiche local currency selon IP visitor
- **Compteur Founder Lifetime** : dynamique en temps réel via API endpoint

---

## SECTION 1 — HEADER / NAVIGATION

### Actuel
"Framer Mockup" + logo white.png + nav `Features`, `Pricing` + CTA `Get the plugin`

### Nouveau
- Brand : `Memselon Mockup` (texte) + logo (white.png si déjà branded Memselon, sinon update)
- Nav : `Features` `Pricing` `FAQ`
- CTA primaire : `Try free` (mène vers Framer Marketplace)
- CTA secondaire (optionnel, mobile burger) : `View pricing` (anchor #pricing)

### Action concrète
Update les strings, vérifier que l'anchor `#faq` existe (à créer si manquant).

---

## SECTION 2 — HERO

### Actuel
```
Title: Your designs deserve depth.
Subtitle: Drop your screenshot on a real 3D iPhone. Rotate. Animate. Export in 4K. All inside Framer.
CTAs: Get the plugin — it's free / Watch demo
Social proof: Used by 200+ Framer designers
```

### Nouveau
```
Eyebrow tagline (small, uppercase, monospace ou tracking-wider, opacity 70%) :
REAL 3D. REAL-TIME. IN FRAMER.

H1 (XL, premium font, leading tight) :
The first real-time 3D mockup studio for Framer.

Subtitle (medium opacity, max-width 600px) :
Stop exporting PNGs from Rotato or Previewed. Memselon Mockup ships real 3D — live, scrollable, interactive — straight into your Framer site.

CTA primaire : Try free
CTA secondaire : See it live (anchor scroll vers section démo)

Trust line below CTAs (small, opacity 60%) :
Built by a certified Framer Partner Expert from Strasbourg ☁️
```

### Visuel hero
**Idéal** : intégrer une démo 3D interactive directement dans le hero (un mockup R3F qui rotate au scroll ou au hover). Tu maîtrises R3F donc faisable.

**Acceptable au launch** : vidéo loop muet (8-10 sec) du wow factor 3D en background ou en blob à droite du title.

**Minimum viable** : image statique premium d'un mockup 3D dans une scène cinématique avec gradient.

### Action
Update hero text. Garder structure CTA existante (2 boutons). Si pas de démo 3D embed pour V1, prévoir vidéo loop dans `/public/hero-loop.mp4` à charger en `<video autoplay muted loop playsinline />`.

### Important — Social proof à enlever
**Retirer "Used by 200+ Framer designers"** s'il n'est pas vrai. Remplacer par la trust line "Built by a certified Framer Partner Expert" ci-dessus, ou par une mention discrète "Now in Founder Lifetime — early access".

---

## SECTION 3 — PROBLEM SECTION

### Actuel
"Still exporting flat screenshots?" — 3 cards (Mockup sites are generic / 3D tools are overkill / External tools break your flow)

### Nouveau
Garder la structure 3 cards mais reformuler pour pointer plus directement les concurrents :

```
Title: Why are you still exporting PNGs?

Card 1
Title: Static mockup tools fall flat
Body: Rotato, Previewed, Device Frames — they all export PNG or MP4 you import as static images. Your site looks frozen.

Card 2
Title: 3D tools are overkill
Body: Blender, Cinema 4D, After Effects — months of learning for one mockup that's still just a video file.

Card 3
Title: External tools break your flow
Body: Export from one app, upload, download, re-import in Framer. Every screenshot change. Every iteration.
```

### Action
Update les copy strings. Garder le styling cards, l'icônographie, le grid.

---

## SECTION 4 — HOW IT WORKS

### Actuel
"3D mockups in 3 clicks" — 3 steps (Pick device / Drop design / Export in 4K)

### Nouveau
Reformuler step 3 pour mettre en avant le différenciateur unique :

```
Title: 3D mockups in 3 clicks.

Step 01
Pick your device
iPhone 17 Pro, iPhone Air, iPad Pro, iMac, Apple Watch Ultra.

Step 02
Drop your design
Drag any screenshot or video. Image, video, or Lottie.

Step 03
Embed live in Framer
Save your scene. Drop the 3D component on any page. Real-time render, no PNG exports needed. Or capture a 4K snapshot when you need a static asset.
```

### Action
Update copy step 03. Garder la structure visuelle steps + numbering existante.

---

## SECTION 5 — NOUVELLE SECTION — COMPARISON TABLE

À ajouter **entre la section "How it works" et la section "Features"**.

### Contenu

```
Eyebrow: WHY MEMSELON
Title: The first real-time 3D, in Framer.
Subtitle: All other mockup tools export. We embed.
```

Table comparative responsive (desktop : table, mobile : cards stackées) :

| Feature | Rotato | Previewed | Device Frames | **Memselon Mockup** |
|---|---|---|---|---|
| Real-time 3D in your site | ❌ | ❌ | ❌ | ✅ |
| Native Framer integration | ❌ | ❌ | ❌ | ✅ |
| 4K capture export | ✅ | ✅ | ✅ | ✅ |
| MP4 video export | ✅ | ✅ | ✅ | 🚧 Q3 2026 |
| Drag mockup in 3D space | ✅ | ✅ | ✅ | ✅ |
| Animations (cursor, scroll) | ❌ | ❌ | ❌ | ✅ |
| White-label for agencies | ❌ | ❌ | ❌ | ✅ |
| Pricing | $69-239 | $9.99-19/mo | Subscription | **From $19/mo** |

### Style guide
- Highlighter la colonne "Memselon Mockup" (background subtil, border accent color)
- Icons ✅ ❌ 🚧 sur les rows
- Mobile : transformer en accordion ou cards verticales

### Action
Créer un nouveau composant `<ComparisonTable />` dans `/components/sections/`. Le placer dans la page entre les sections existantes.

---

## SECTION 6 — FEATURES (EVERYTHING YOU NEED)

### Actuel
Cards : Real 3D real-time / 5 Apple devices / Free orbit / Video export / Animations
Stats : 0ms idle render / < 2MB / 4K / 5 devices / 60 FPS / On-demand / GPU

### Nouveau
Garder la structure mais ajuster :

**Carte "Video export" → renommer en "Video screens"** :
```
Title: Video screens
Body: Drop videos directly into the device screen. Animate UI interactions. Live in your site.
```
(clarifie qu'on ingère des vidéos en INPUT, pas qu'on exporte des MP4 au launch)

**Ajouter une nouvelle carte "Save & embed"** :
```
Title: Save & embed
Body: Save your 3D scene with animation. Drop the live component on any Framer page.
```

**Stats à garder** : `60 FPS`, `On-demand`, `GPU`, `< 2MB`, `0ms idle render`, `4K max export`, `5 devices`.

**Ajouter** : `WebGL` ou `Three.js`, `Mobile-ready`.

### Action
Update card "Video export". Ajouter card "Save & embed" en respectant le grid layout existant.

---

## SECTION 7 — PRICING — REFONTE COMPLÈTE

### Actuel
3 tiers : Free / Pro $9 / Ultra $29 — toggle Monthly/Yearly avec -27%

### Nouveau
4 tiers principaux + 1 tier spécial Founder Lifetime, pricing en USD

```
Title: Simple, transparent pricing.
Subtitle: All plans include unlimited real-time preview.

Toggle: Monthly | Yearly (save ~17%)
```

#### CARD 1 — FREE
```
Price: $0 forever
Features:
✓ 1 device (iPhone 17 Pro)
✓ 1 saved scene
✓ 2 PNG captures/month (720p)
✓ Memselon watermark on device
✓ Cursor follow animation
CTA: Try free
CTA link: https://www.framer.com/marketplace/plugins/mockup-for-framer/
```

#### CARD 2 — STARTER
```
Price: $19/mo  or  $190/yr
Features:
✓ 3 devices of your choice
✓ 3 saved scenes
✓ 20 PNG captures/month (1080p)
✓ No watermark
✓ Cursor follow + auto rotate + float
🚧 Scroll rotate (coming Q3 2026)
CTA: Get Starter
CTA link: Stripe checkout starter_monthly or starter_yearly selon toggle
```

#### CARD 3 — PRO (most popular badge)
```
Badge top-right: MOST POPULAR
Price: $39/mo  or  $390/yr
Features:
✓ All 5 devices + future devices
✓ Unlimited scenes
✓ Unlimited 4K PNG captures
✓ All animations + custom keyframes
✓ Priority support (24h)
✓ Early access to new features
🚧 MP4 export coming Q3 2026
CTA: Get Pro
CTA link: Stripe checkout pro_monthly or pro_yearly
```

#### CARD 4 — STUDIO
```
Price: $99/mo  or  $990/yr
Features:
✓ Everything in Pro
✓ White-label (no Memselon credit)
✓ Multi-project (10 sites)
✓ Custom agency branding
✓ Onboarding call (30 min)
✓ Private Discord channel
🚧 MP4 4K + transparent WebM Q3 2026
CTA: Get Studio
CTA link: Stripe checkout studio_monthly or studio_yearly
```

#### SPECIAL CARD — FOUNDER LIFETIME
**Visuellement distincte** : gradient border, ou background animé, ou positionnée en pleine largeur en bas, séparée des 4 autres. Doit ressortir.

```
Tag: LIMITED OFFER
Price: $249 one-time
Subtitle: Limited to 100 spots — [X]/100 remaining

Features:
✓ All Pro features for life
✓ All future devices included
✓ All future major features included (incl. MP4 export)
✓ Founder badge in plugin and Framer Marketplace
✓ Direct DM line with Umut

CTA: Claim founder spot
CTA link: Stripe checkout founder_lifetime
```

#### Compteur dynamique Founder Lifetime
- Fetch depuis `/api/founder-lifetime-count` (à créer côté backend, retourne `{ sold, remaining, available }`)
- Affichage : `[X]/100 remaining` mis à jour à chaque page load
- Si `available === false` : la card devient grisée, CTA disabled, texte change en "Sold out — Thank you to our founders 🙏"
- Optionnel : compteur progress bar visuel (X spots filled out of 100)

### Action
Refonte complète de la section pricing. Créer le toggle Monthly/Yearly fonctionnel (state local, pas de URL params nécessaires). Lier les CTAs aux Stripe checkout URLs (à fournir par Claude Code une fois Stripe products créés). Créer `/api/founder-lifetime-count` (Next.js API route ou Edge Function) qui fetch depuis Supabase la table `founder_lifetime_sales` et retourne le count.

---

## SECTION 8 — TESTIMONIALS — DÉCISION CRITIQUE

### Actuel
3 testimonials placeholders : Sarah K, Marc D, Emma L

### Décision : retirer les fakes au launch

**Action V1** : remplacer la section testimonials par une section **"Behind the build"** plus authentique.

```
Eyebrow: BEHIND THE BUILD
Title: Built by a Framer Partner Expert.

Body (en première personne) :
Hey, I'm Umut — design engineer based in Strasbourg, building cinematic web experiences for clients like Jetfly Aviation and BBA Studio. After hours of exporting PNGs from Rotato and re-importing them every time a screenshot changed, I asked: why is there no native 3D in Framer? So I built Memselon Mockup. Real 3D. Real-time. No exports.

CTA secondaire : Follow the build on X (link @memselon)
```

Photo / avatar Umut (à fournir, sinon placeholder élégant).

### V1.1 (semaine 2-3 post-launch)
Remplacer cette section par 3 vrais testimonials de tes 10 beta testers (avec photo, handle X vérifiable, citation).

### Action
Créer un nouveau composant `<BehindTheBuild />` qui remplace `<Testimonials />`. Garder la structure visuelle si réutilisable.

---

## SECTION 9 — NOUVELLE SECTION — FAQ

À ajouter **avant la section CTA finale**.

### Contenu

```
Title: Frequently asked questions.

Q: How is this different from Rotato or Previewed?
A: Those tools export static PNG/MP4 files. Memselon Mockup embeds a real 3D component live in your Framer site — it scrolls, rotates, and reacts to user interaction. You can also capture PNG when needed.

Q: Will my Framer site stay performant?
A: Yes. The 3D component renders on-demand only (0% CPU when idle), uses GPU acceleration, and weighs less than 2MB gzipped. We optimized for 60fps on mobile with adaptive quality based on user device.

Q: Can I use it on client projects?
A: Yes. Even Free tier allows commercial use (with watermark). Starter and above have no watermark. Studio includes white-label and multi-project licensing for agencies.

Q: What about MP4 export?
A: PNG capture is available at launch in all paid tiers. MP4 export is coming Q3 2026 and will be included free for Pro, Studio, and Founder Lifetime plans.

Q: Is the Founder Lifetime really limited?
A: Yes. Only 100 spots. Once they're gone, it's gone. The counter is real-time. Founders get all future features for life — including MP4 export when it ships.

Q: Can I switch plans?
A: Yes, anytime. Upgrade and you're billed prorated. Downgrade and you keep your current tier until the end of the billing period.

Q: Do you offer a refund?
A: 7-day no-questions-asked refund on subscriptions. Founder Lifetime is final sale (since it's lifetime access at a discount).

Q: Which Framer plan do I need?
A: Memselon Mockup works on any Framer plan, including Free.

Q: Where is my data stored?
A: All your scenes, designs, and uploads are stored on Supabase EU servers. We use Cloudflare CDN for fast global delivery.
```

### Style
Accordion items (click to expand) ou liste verticale avec questions en bold et answers below.

### Action
Créer composant `<FAQ />` avec data array. Style accordion avec animation smooth (framer-motion ou CSS transitions).

---

## SECTION 10 — CTA FINAL

### Actuel
"Your mockups deserve better. Start creating studio-grade 3D mockups. Free."

### Nouveau

```
Title: Ship mockups that breathe.
Subtitle: Stop exporting PNGs. Start embedding real 3D.

CTA primaire: Try free — no credit card
CTA secondaire: Claim founder spot (X/100 remaining)

Trust line: Built by a Framer Partner Expert from Strasbourg ☁️
```

### Action
Update copy. Le CTA secondaire doit afficher le count dynamique du Founder Lifetime — si sold out, remplacer par le secondary CTA `See pricing`.

---

## SECTION 11 — FOOTER

### Actuel
"Made with ❤️ by Memselon"

### Nouveau

Layout 3-4 colonnes :

**Col 1 — Brand**
- Logo Memselon Mockup
- Tagline courte : `Real 3D. Real-time. In Framer.`

**Col 2 — Product**
- Features (anchor)
- Pricing (anchor)
- FAQ (anchor)
- Roadmap (mailto: ou page dédiée si tu en crées une)

**Col 3 — Resources**
- Framer Marketplace (link plugin)
- Memselon.com (lien vers ton studio)
- Documentation (placeholder pour future)

**Col 4 — Connect**
- X (@memselon)
- LinkedIn (Umut Sevinc)
- Email (contact@memselon.com)

**Bottom bar**
- © 2026 Memselon ☁️ · Made in Strasbourg, France · Available worldwide
- Privacy · Terms (créer ces pages plates même minimalistes)

### Action
Refonte footer en gardant le style dark si présent. Créer pages `/privacy` et `/terms` plates avec contenu standard SaaS (templates dispos partout, à adapter pour solo founder Estonia OÜ une fois ton statut migré).

---

## MÉTADONNÉES SEO

### Actuel
```
title: Framer Mockup — 3D Device Mockups in Seconds
meta-description: Create stunning 3D interactive mockups of Apple devices directly inside Framer.
```

### Nouveau

```html
<title>Memselon Mockup — Real-time 3D Mockups for Framer</title>
<meta name="description" content="The first real-time 3D mockup studio for Framer. Embed interactive 3D mockups live in your site — no PNG exports needed. iPhone 17, iPhone Air, iPad, iMac, Apple Watch.">
<meta name="keywords" content="framer plugin, 3d mockup, real-time 3d, framer mockup, device mockup, framer studio, memselon, react three fiber, webgl mockup">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="Memselon Mockup — Real 3D. Real-time. In Framer.">
<meta property="og:description" content="Stop exporting PNGs. Ship real 3D mockups live in your Framer site.">
<meta property="og:url" content="https://mockup-landing-rho.vercel.app/">
<meta property="og:image" content="https://mockup-landing-rho.vercel.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Memselon Mockup — Real 3D. Real-time. In Framer.">
<meta name="twitter:description" content="The first real-time 3D mockup studio for Framer.">
<meta name="twitter:image" content="https://mockup-landing-rho.vercel.app/twitter-card.png">
<meta name="twitter:site" content="@memselon">
<meta name="twitter:creator" content="@memselon">

<!-- Canonical (à updater quand domain custom configuré) -->
<link rel="canonical" href="https://mockup-landing-rho.vercel.app/">
```

### Action
Update `app/layout.tsx` (ou équivalent Next.js) avec ces métadonnées. Créer les images `/public/og-image.png` (1200×630) et `/public/twitter-card.png` (1200×630) — placeholder OK au début, asset final avant launch.

---

## ASSETS À CRÉER OU UPDATER

- [ ] Logo Memselon Mockup (white version + dark version) — vérifier `/public/logo/`
- [ ] OG image 1200×630 avec tagline "Real 3D. Real-time. In Framer." + visual 3D mockup
- [ ] Twitter card 1200×630 (peut être identique à OG)
- [ ] Favicon 32×32 + 180×180 (Apple touch)
- [ ] Hero visual : démo 3D interactive OU vidéo loop 8-10 sec MP4 muet
- [ ] Mockup screenshots des 5 devices (iphone17pro, iphoneAir, ipadPro, imac, appleWatchUltra) — vérifier qualité existante dans `/public/devices/`

### Recommandation
Les assets 3D peuvent être générés en batch depuis ton plugin lui-même : créer une scène par device dans Framer Mockup, capturer en 4K, exporter pour la landing.

---

## API ENDPOINTS À CRÉER

### `/api/founder-lifetime-count` (GET)
Retourne le compteur en temps réel. Public endpoint, pas d'auth.

```typescript
// Next.js API route example
export async function GET() {
  const { count } = await supabase
    .from('founder_lifetime_sales')
    .select('*', { count: 'exact', head: true });
  
  const sold = count ?? 0;
  const remaining = Math.max(0, 100 - sold);
  const available = remaining > 0;
  
  return Response.json({ sold, remaining, available });
}
```

Cache : 60 secondes max (suffisant pour landing, pas critique d'avoir le count à la seconde près).

### `/api/health` (GET, optionnel)
Pour monitoring uptime de la landing. Retourne `{ status: 'ok', timestamp }`.

---

## TRACKING / ANALYTICS

Si pas déjà en place, ajouter :
- **Plausible** ou **Vercel Analytics** (lightweight, RGPD-friendly)
- Events à tracker :
  - `cta_try_free_clicked`
  - `cta_pro_clicked`
  - `cta_studio_clicked`
  - `cta_founder_clicked`
  - `pricing_toggle_yearly`
  - `pricing_toggle_monthly`
  - `faq_expanded` (avec question)
  - `comparison_section_viewed`

### Action
Si analytics absent, demander quelle solution utiliser (Plausible, Vercel Analytics, PostHog) avant de l'ajouter.

---

## CHECKLIST FINALE AVANT DEPLOY

### Content
- [ ] Toutes les mentions "Framer Mockup" remplacées par "Memselon Mockup"
- [ ] Tagline "Real 3D. Real-time. In Framer." présente dans hero ET footer
- [ ] Currency partout en USD ($ symbol)
- [ ] Section comparison vs Rotato/Previewed/Device Frames présente
- [ ] FAQ avec 9 questions présente
- [ ] Testimonials placeholders retirés (remplacés par "Behind the build")
- [ ] Mention "MP4 export coming Q3 2026" présente sur Pro, Studio, Founder
- [ ] Mention "Scroll rotate coming Q3 2026" présente sur Starter
- [ ] Trust signals : "Framer Partner Expert" mention dans hero ou footer

### Pricing
- [ ] 4 tiers + Founder Lifetime fonctionnels
- [ ] Toggle Monthly/Yearly fonctionnel avec mention "Save ~17%"
- [ ] Compteur Founder Lifetime dynamique (X/100 remaining)
- [ ] CTAs liés à Stripe checkout URLs (vérifier price_ids corrects)
- [ ] CTA `Try free` mène vers Framer Marketplace install

### SEO / Meta
- [ ] Title et meta description updated
- [ ] OG image 1200×630 créée et linkée
- [ ] Twitter card créée et linkée
- [ ] Twitter creator/site = @memselon
- [ ] Favicon updated

### Performance
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] Hero loads < 2s
- [ ] Vidéo hero (si présente) en lazy load ou autoplay muet correct
- [ ] Pas de layout shift sur le hero
- [ ] Mobile responsive validé sur toutes les nouvelles sections

### Technique
- [ ] Build passe sans erreur ni warning
- [ ] Aucun composant existant cassé visuellement
- [ ] Dark mode preservé si présent
- [ ] API endpoint `/api/founder-lifetime-count` fonctionnel et testé
- [ ] Liens internes (anchors) fonctionnent (#features, #pricing, #faq)
- [ ] Liens externes ouvrent en nouvel onglet (target="_blank" rel="noopener")

### Légal
- [ ] Page `/privacy` créée
- [ ] Page `/terms` créée
- [ ] Lien footer vers ces pages

---

## WORKFLOW FINAL DEMANDÉ

1. Lis ce document en entier
2. Audit du codebase actuel : liste tous les composants/fichiers affectés par section
3. Propose un plan de modification ordonné en milestones :
   - **Milestone 1** : Rebranding (header, footer, meta tags) — risque LOW
   - **Milestone 2** : Hero update — risque LOW
   - **Milestone 3** : Problem section + How it works refresh — risque LOW
   - **Milestone 4** : Comparison table (nouvelle section) — risque MEDIUM
   - **Milestone 5** : Features section update — risque LOW
   - **Milestone 6** : Pricing complete refonte — risque HIGH (logique stripe + counter API)
   - **Milestone 7** : Testimonials → Behind the build — risque LOW
   - **Milestone 8** : FAQ (nouvelle section) — risque MEDIUM
   - **Milestone 9** : CTA final + footer — risque LOW
   - **Milestone 10** : SEO meta + OG images — risque LOW
   - **Milestone 11** : `/api/founder-lifetime-count` endpoint — risque MEDIUM
   - **Milestone 12** : `/privacy` + `/terms` pages — risque LOW
   - **Milestone 13** : Tests E2E + Lighthouse + responsive — VALIDATION
4. Pour chaque milestone : fichiers modifiés, risque, tests à valider, estimation effort
5. **Demande validation avant chaque milestone**
6. **Commits séparés par milestone** pour rollback facile
7. Run `npm run build` après chaque milestone et avant le push final

**Tu commences par me retourner uniquement le plan structuré, pas de code modifications encore.**
