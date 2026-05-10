# Memselon Mockup Landing — Visual Refonte (Premium ElevenLabs-style)

## ⚠️ CONTEXTE CRITIQUE

La structure actuelle (rebranding, copy, sections, footer, SEO, /privacy, /terms) est **VALIDÉE et conservée**. Les commits Phase 1 (M1-M3, M5, M7, M9, M10, M12) sont **gardés**. Cette mission concerne **uniquement la refonte VISUELLE** : design system, hero, sections, motion, ambiance.

L'objectif : transformer la landing actuelle (correcte mais plate) en une expérience **premium cinematic** comparable à elevenlabs.io, linear.app, vercel.com.

**Référence #1** : https://elevenlabs.io (dark, cinematic, gradients, typography contrast, bento)

**Référence #2** : Sphexbook EV (carte interactive plein écran en hero, UI cards flottantes superposées)

**Référence #3** : motionsites.ai pour patterns hero scroll-driven

---

## 🎯 OBJECTIFS DE LA REFONTE

1. **Hero qui démontre le produit en 2 secondes** : iPhone 17 Pro 3D dominant + vidéo qui joue dans le screen DÈS LE LOAD + cursor follow auto-actif + zéro contrôle visible
2. **Ambiance cinematic premium** : noir profond, gradients colorés (purple/teal cohérents avec brand), glow subtils, typography contrastée
3. **ASCII art décoratif** intégré comme signature design distinctive (style hacker/tech moderne, pas années 2010)
4. **Motion fluide** : scroll-driven animations, smooth transitions, parallax subtil
5. **Performance budget respecté** : <300KB CSS gzipped, <500KB total JS, Lighthouse Performance >85

---

## 🎨 DESIGN SYSTEM (à créer dans `app/styles/design-tokens.css` ou Tailwind config)

### Palette colors (dark-first)

```css
:root {
  /* Backgrounds */
  --bg-primary: #050507;      /* Noir profond cinematic, légèrement bleuté */
  --bg-secondary: #0A0A0F;    /* Noir sections alternées */
  --bg-tertiary: #12121A;     /* Cards, surfaces élevées */
  --bg-elevated: #1A1A24;     /* Hover states, modals */
  
  /* Borders & dividers */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-medium: rgba(255, 255, 255, 0.12);
  --border-strong: rgba(255, 255, 255, 0.20);
  
  /* Text */
  --text-primary: #FAFAFA;
  --text-secondary: rgba(250, 250, 250, 0.72);
  --text-tertiary: rgba(250, 250, 250, 0.48);
  --text-muted: rgba(250, 250, 250, 0.32);
  
  /* Brand gradient (cohérent avec Behind the Build avatar) */
  --gradient-brand: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
  --gradient-brand-subtle: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
  --gradient-glow: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  
  /* Accents */
  --accent-purple: #8B5CF6;
  --accent-teal: #06B6D4;
  --accent-warm: #F59E0B;     /* Pour highlights ponctuels */
}
```

### Typography

```css
/* Display (hero H1, H2 majeurs) */
--font-display: "Inter Display", "Inter", -apple-system, sans-serif;
/* Idéalement, ajouter une serif pour accents type ElevenLabs : "Newsreader", "Iowan Old Style", serif */
--font-serif-accent: "Newsreader", Georgia, serif;
/* Body */
--font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
/* Mono (pour ASCII, code, eyebrows uppercase) */
--font-mono: "JetBrains Mono", "SF Mono", Menlo, monospace;
```

**Hierarchy** :
- Hero H1 : 72-96px desktop / 48-56px mobile, font-weight 500-600, letter-spacing -0.03em, line-height 0.95
- Section H2 : 48-64px desktop / 36-40px mobile, font-weight 500
- Section H3 : 28-32px, font-weight 500
- Body : 17-18px, font-weight 400, line-height 1.6
- Eyebrow : 12-13px, font-weight 500, uppercase, letter-spacing 0.15em, font-mono optional
- Small : 14-15px, line-height 1.5

### Spacing scale

```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256
```

Utilise Tailwind v4 spacing par défaut + extensions pour les grandes valeurs si besoin.

### Motion

```css
--ease-cinematic: cubic-bezier(0.32, 0.72, 0, 1);  /* ElevenLabs feel */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 200ms;
--duration-medium: 500ms;
--duration-slow: 800ms;
--duration-cinematic: 1200ms;
```

Toutes les animations utilisent ces variables. Pas de transitions à durée arbitraire.

### Shadows & glows

```css
--shadow-card: 0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4);
--shadow-card-hover: 0 2px 4px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5);
--glow-brand: 0 0 60px rgba(139, 92, 246, 0.25);
--glow-brand-strong: 0 0 80px rgba(139, 92, 246, 0.4), 0 0 120px rgba(6, 182, 212, 0.2);
```

---

## 🏠 HERO REFONTE COMPLÈTE

### Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  [Header sticky transparent → noir au scroll]                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  REAL 3D · REAL-TIME · IN FRAMER                                   │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌                                                │
│                                                                    │
│  The first                                                         │
│  real-time 3D                                                      │
│  mockup studio.                       ┌──────────────────┐         │
│                                       │                  │         │
│  Stop exporting PNGs from Rotato.     │  [iPhone 17 Pro  │         │
│  Memselon Mockup ships real 3D —      │   3D rendered    │         │
│  live, scrollable, interactive —      │   with showreel  │         │
│  straight into your Framer site.      │   video playing  │         │
│                                       │   in screen]     │         │
│  [Try free →]  [See it live]          │                  │         │
│                                       │   [follows       │         │
│  Built by a Framer Partner Expert ·   │    cursor]       │         │
│  Crafted by a human ☁️                │                  │         │
│                                       └──────────────────┘         │
│                                       [60FPS]  [4K capture]        │
│                                       [Live in Framer]             │
│                                                                    │
│  [ASCII gradient subtil bottom : signal scroll ↓]                  │
└────────────────────────────────────────────────────────────────────┘
```

### Implémentation hero

**Layout** : Grid 2 colonnes desktop (`grid-cols-12`), `col-span-5` pour text + `col-span-7` pour 3D mockup. Mobile : stack vertical, mockup d'abord puis text dessous.

**Background** :
- Couleur de base `--bg-primary` (#050507)
- Layer 1 : radial gradient subtil purple en haut-gauche `radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.08) 0%, transparent 50%)`
- Layer 2 : radial gradient subtil teal en bas-droite `radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.08) 0%, transparent 50%)`
- Layer 3 (optional, V1.1) : grain noise subtil 0.02 opacity en overlay

**Eyebrow** :
```jsx
<div className="font-mono text-[13px] tracking-[0.15em] uppercase text-text-tertiary mb-8">
  Real 3D <span className="opacity-50">·</span> Real-time <span className="opacity-50">·</span> In Framer
</div>
```

Anime au mount avec `framer-motion` : opacity 0→1, y: 20→0, duration 800ms, ease-cinematic.

**H1** :
```jsx
<h1 className="font-display text-[88px] leading-[0.95] tracking-[-0.03em] font-medium">
  The first<br />
  real-time 3D<br />
  mockup studio.
</h1>
```

Anime au mount avec stagger sur les 3 lignes : chaque ligne opacity 0→1, y: 30→0, delay incrémental 100ms, duration 1000ms, ease-cinematic.

Optionnel premium : un mot en serif italic pour accent, genre "*real-time* 3D" — donne le contraste typo ElevenLabs.

**Subtitle** :
```jsx
<p className="text-[18px] text-text-secondary leading-[1.6] mt-8 max-w-[480px]">
  Stop exporting PNGs from Rotato. Memselon Mockup ships real 3D — 
  live, scrollable, interactive — straight into your Framer site.
</p>
```

**CTAs** :
```jsx
<div className="flex gap-4 mt-10">
  <a href="https://www.framer.com/marketplace/plugins/mockup-for-framer/" 
     className="group relative px-6 py-3.5 bg-white text-black font-medium rounded-full 
                transition-transform hover:scale-[1.02] hover:shadow-glow-brand">
    Try free
    <ArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" />
  </a>
  <a href="#hero-3d" 
     className="px-6 py-3.5 border border-border-medium rounded-full 
                hover:border-border-strong hover:bg-bg-tertiary 
                transition-colors">
    See it live
  </a>
</div>
```

**Trust line** :
```jsx
<p className="text-[14px] text-text-muted mt-12">
  Built by a certified Framer Partner Expert <span className="opacity-50">·</span> 
  Crafted by a human <span className="opacity-80">☁️</span>
</p>
```

### 🎬 LE 3D MOCKUP HERO — CRITIQUE

**Comportement attendu** :
- iPhone 17 Pro rendered en 3D via R3F (composant `<HeroDevice />` existant à upgrader)
- **Cursor follow ACTIF par défaut** (rotation Y et X subtile selon position curseur, pas trop agressif — max 15° rotation)
- **Vidéo showreel cinematic qui joue dans le screen DÈS le mount** — autoplay muted loop
- **Zéro contrôle visible** — pas de boutons Upload/Rotate/Follow/Float
- Float animation léger en idle (le device respire doucement même sans curseur)
- Subtle glow purple→teal autour du device (CSS box-shadow ou R3F lightprobe)

**Vidéo dans le screen** :
- Format : MP4 H.264, 1080×2340 (ratio iPhone), durée 8-12 sec, loop seamless
- Contenu : showreel cinematic style trailer film
  - Plan 1 (0-2s) : zoom rapide sur un design web premium qui scroll
  - Plan 2 (2-5s) : transition glitch/morph vers un autre design
  - Plan 3 (5-8s) : reveal d'un produit physique en mockup
  - Plan 4 (8-12s) : transition smooth retour début pour loop seamless
- Storage : `/public/hero-showreel.mp4` (max 3 MB pour perf)
- Fallback poster : `/public/hero-showreel-poster.jpg` pour preload
- Loading : `<video autoPlay muted loop playsInline preload="metadata" />`

**Floating UI cards autour du device** :
3 petites cards qui flottent, subtilement animées en parallax au scroll/cursor :

```jsx
<motion.div className="absolute top-[20%] -left-8 px-3 py-2 bg-bg-tertiary/80 
                       backdrop-blur-md border border-border-medium rounded-full
                       text-[12px] font-mono text-text-secondary"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
  <span className="w-2 h-2 inline-block rounded-full bg-green-400 mr-2 animate-pulse"></span>
  60 FPS
</motion.div>

<motion.div className="..." style={{ top: '50%', right: '-1rem' }}>
  4K capture
</motion.div>

<motion.div className="..." style={{ bottom: '15%', left: '20%' }}>
  Live in Framer
</motion.div>
```

**Performance impératif** :
- Canvas R3F : `frameloop="demand"` activé, on ne render que sur cursor move ou animation idle
- DPR adaptatif via `<PerformanceMonitor />` Drei
- Suspense fallback : un placeholder image low-poly du device pendant load
- Lazy load le composant `<HeroDevice />` avec `dynamic()` Next.js
- La vidéo : autoplay muted respecte autoplay policies, pas de interactive demand

### Header refonte

**Comportement** :
- Sticky top
- Au load : transparent total
- Au scroll > 20px : background `rgba(5, 5, 7, 0.85)` + `backdrop-filter: blur(12px)` + border-bottom subtle
- Transition smooth 300ms

```jsx
<header className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5, 5, 7, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
```

---

## 🎨 ASCII ART INTÉGRATION

### Stratégie

ASCII art utilisé comme **éléments visuels décoratifs**, pas comme texte sélectionnable. Generate via outils tiers (ascii-magic.com ou figlet), exporte en SVG ou PNG transparent, intègre comme `<img>` ou `<svg>`.

**Endroits d'usage** (3 max pour ne pas saturer) :

### 1. Section "How it works" — fond ASCII

Background subtil avec ASCII art représentant 3 devices alignés ou un workflow visuel. Opacity 0.05-0.08, ne distrait pas du contenu mais ajoute texture.

```jsx
<section className="relative py-32 overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    <pre className="font-mono text-[8px] text-text-muted/10 leading-none whitespace-pre 
                    select-none transform rotate-[-2deg] scale-150">
{`
  ╔══════════╗  →  ╔══════════╗  →  ╔══════════╗
  ║          ║     ║   ▓▓▓▓   ║     ║  EMBED   ║
  ║   PICK   ║     ║   ▓▓▓▓   ║     ║   LIVE   ║
  ║   DEVICE ║     ║   DROP   ║     ║   IN     ║
  ║          ║     ║  DESIGN  ║     ║  FRAMER  ║
  ╚══════════╝     ╚══════════╝     ╚══════════╝
`}
    </pre>
  </div>
  {/* contenu section sur z-10 */}
</section>
```

### 2. Section "Behind the build" — silhouette ASCII

Background avec une silhouette humaine en ASCII très light derrière l'avatar Umut. Renforce le côté "human" de la signature.

Generate avec ascii-magic à partir d'une silhouette neutre stock.

### 3. Section transition — séparateur ASCII

Entre 2 sections majeures, un séparateur ASCII subtil qui occupe une ligne pleine width, évoque circuit board ou pattern tech :

```jsx
<div className="font-mono text-[10px] text-text-muted/20 text-center select-none my-32">
  ╌╌╌╌╌╌╌╌╌╌◇╌╌╌╌╌╌╌╌╌╌◇╌╌╌╌╌╌╌╌╌╌◇╌╌╌╌╌╌╌╌╌╌◇╌╌╌╌╌╌╌╌╌╌
</div>
```

### Règles ASCII

- **Toujours** en font-mono avec `select-none`
- **Toujours** en opacity faible (0.05-0.20 selon contexte)
- **Jamais** plus de 3 sections avec ASCII pour éviter saturation
- **Mobile** : caché en `<md` via `hidden md:block` si l'ASCII est large (sinon illisible)

---

## 📦 SECTIONS — REFONTE PAR SECTION

### Section 1 — Problem (refonte visuelle)

**Avant** : 3 cards en grid simple
**Après** : 3 cards bento avec hover glow, eyebrow mono, chaque card a un mini visual ASCII en background

```jsx
<section className="py-32 relative">
  <div className="container mx-auto max-w-6xl px-6">
    <div className="text-center mb-20">
      <p className="font-mono text-[13px] tracking-[0.15em] uppercase text-text-tertiary mb-4">
        The Problem
      </p>
      <h2 className="font-display text-[56px] leading-[1.05] tracking-[-0.02em] font-medium">
        Why are you still<br />
        exporting <span className="italic font-serif-accent text-accent-purple">PNGs</span>?
      </h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 3 cards bento */}
    </div>
  </div>
</section>
```

**Card structure** :
```jsx
<div className="group relative p-8 bg-bg-tertiary border border-border-subtle rounded-2xl
                hover:border-border-medium transition-all duration-500 ease-cinematic
                overflow-hidden">
  {/* ASCII pattern subtle background */}
  <pre className="absolute inset-0 font-mono text-[6px] text-text-muted/[0.03] 
                  pointer-events-none select-none">{asciiPattern}</pre>
  
  {/* Hover glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
  
  <div className="relative z-10">
    <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-4">
      Issue 01
    </div>
    <h3 className="text-[24px] font-medium mb-3">Static mockup tools fall flat</h3>
    <p className="text-[16px] text-text-secondary leading-[1.6]">
      Rotato, Previewed, Device Frames — they all export PNG or MP4 you import as 
      static images. Your site looks frozen.
    </p>
  </div>
</div>
```

### Section 2 — How it works (refonte visuelle)

**Bento grid 3 steps** avec connecteurs visuels entre eux (lignes ASCII ou SVG paths).

Numbering en très grand mono `01 / 02 / 03`, hover subtle, chaque step a une mini illustration custom.

### Section 3 — Comparison Table (déjà spec'd en M4, garder + appliquer design system)

Quand M4 sera fait, applique les nouveaux design tokens : Memselon column highlightée avec gradient brand, autres colonnes muted, hover row subtle.

### Section 4 — Features (bento ElevenLabs-style)

**Avant** : 4 cards simples + stats strip
**Après** : Bento asymétrique style ElevenLabs

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Big card span 2 cols */}
  <div className="md:col-span-2 row-span-2 p-12 bg-bg-tertiary border border-border-subtle 
                  rounded-3xl relative overflow-hidden">
    <div className="absolute top-8 right-8 text-[10px] font-mono uppercase tracking-wider 
                    text-text-tertiary">Feature 01</div>
    <h3 className="text-[40px] leading-[1.05] font-medium mt-16">
      Real 3D, real-time
    </h3>
    <p className="text-[18px] text-text-secondary mt-4 max-w-[400px]">
      Drag, rotate, animate — all rendered in WebGL inside your Framer site.
    </p>
    {/* Visual : mini 3D scene OR ASCII art subtle */}
  </div>
  
  {/* Smaller cards */}
  <div className="p-8 bg-bg-tertiary border border-border-subtle rounded-2xl">...</div>
  <div className="p-8 bg-bg-tertiary border border-border-subtle rounded-2xl">...</div>
  <div className="p-8 bg-bg-tertiary border border-border-subtle rounded-2xl">...</div>
</div>
```

**Stats strip** : remplace par une ligne minimaliste mono fonté

```jsx
<div className="flex flex-wrap gap-x-12 gap-y-4 justify-center mt-24 font-mono text-[13px] 
                text-text-tertiary uppercase tracking-wider">
  <div><span className="text-text-primary">60</span> FPS</div>
  <div><span className="text-text-primary">0%</span> CPU idle</div>
  <div><span className="text-text-primary">&lt;2MB</span> bundle</div>
  <div><span className="text-text-primary">4K</span> capture</div>
  <div><span className="text-text-primary">5</span> devices</div>
  <div><span className="text-text-primary">WebGL</span></div>
  <div><span className="text-text-primary">Mobile</span> ready</div>
</div>
```

### Section 5 — Behind the build (refonte visuelle)

**Avant** : avatar gradient + body text + CTA X
**Après** : layout asymétrique, avatar à droite avec glow brand, body à gauche, ASCII silhouette en background subtil

```jsx
<section className="py-32 relative overflow-hidden">
  {/* ASCII silhouette background */}
  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
    <pre className="font-mono text-[10px] leading-none whitespace-pre">{asciiSilhouette}</pre>
  </div>
  
  <div className="container mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    <div>
      <p className="font-mono text-[13px] tracking-[0.15em] uppercase text-accent-purple mb-6">
        Behind the build
      </p>
      <h2 className="text-[56px] leading-[1.05] tracking-[-0.02em] font-medium mb-8">
        Built by a Framer<br />
        Partner <span className="italic font-serif-accent">Expert</span>.
      </h2>
      <p className="text-[18px] text-text-secondary leading-[1.6] mb-8">
        Hey, I'm Umut — design engineer building cinematic web experiences for clients 
        like Jetfly Aviation and BBA Studio. Solo human shipping immersive Framer tools ☁️
      </p>
      <a href="https://x.com/memselon" className="inline-flex items-center gap-2 text-text-primary 
                                                  hover:text-accent-purple transition-colors">
        Follow the build on X →
      </a>
    </div>
    
    <div className="relative aspect-square max-w-[400px] mx-auto">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-brand opacity-20 blur-3xl rounded-full"></div>
      
      {/* Avatar circle */}
      <div className="relative w-full h-full rounded-full overflow-hidden border border-border-medium
                      bg-gradient-brand-subtle flex items-center justify-center">
        {/* Si photo Umut fournie : <img src="/avatar/umut.jpg" /> */}
        {/* Sinon : letter U avec gradient */}
        <span className="text-[120px] font-medium bg-gradient-brand bg-clip-text text-transparent">
          U
        </span>
      </div>
    </div>
  </div>
</section>
```

### Section 6 — CTA Final (refonte visuelle)

**Avant** : title + 2 CTAs simples
**Après** : section pleine hauteur avec gradient glow background, title énorme, CTAs cinematic

```jsx
<section className="relative py-48 overflow-hidden">
  {/* Background glow */}
  <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
  
  <div className="container mx-auto max-w-4xl px-6 text-center relative">
    <h2 className="font-display text-[88px] leading-[0.95] tracking-[-0.03em] font-medium">
      Ship mockups<br />
      that <span className="italic font-serif-accent text-accent-purple">breathe</span>.
    </h2>
    <p className="text-[20px] text-text-secondary mt-8 max-w-[600px] mx-auto">
      Stop exporting PNGs. Start embedding real 3D.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
      <a className="px-8 py-4 bg-white text-black font-medium rounded-full 
                    text-[17px] hover:scale-[1.02] transition-transform shadow-glow-brand">
        Try free — no credit card
      </a>
      <FounderCountCTA />  {/* composant déjà créé en bonus M9 */}
    </div>
    
    <p className="text-[14px] text-text-muted mt-12 font-mono uppercase tracking-wider">
      Crafted by a human <span className="text-text-tertiary">☁️</span>
    </p>
  </div>
</section>
```

### Section 7 — Footer (refonte visuelle)

Garde la structure 4-col existante, applique :
- Background `--bg-secondary`
- Border-top `--border-subtle`
- Logo Memselon avec lien vers memselon.com
- Liens en text-text-secondary, hover text-primary
- Bottom bar avec font-mono pour les mentions légales

---

## 🎬 MOTION & ANIMATIONS

### Scroll-driven animations

Utilise `framer-motion` (déjà installé) avec `useScroll` + `useTransform` :

```jsx
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ["start start", "end start"]
});

const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

return (
  <motion.section style={{ opacity: heroOpacity, y: heroY }}>
    {/* Hero content */}
  </motion.section>
);
```

### Section reveal au scroll

Toutes les sections autres que hero animent au reveal :

```jsx
<motion.section
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
>
```

### Cursor follow sur le 3D

Déjà géré côté R3F via `useFrame` qui met à jour la rotation du device. Implémentation à vérifier dans `<HeroDevice />` existant — si déjà cursor follow, garde tel quel. Sinon ajoute :

```jsx
useFrame((state) => {
  if (!meshRef.current) return;
  const targetRotY = (state.mouse.x * Math.PI) / 12; // max 15°
  const targetRotX = (state.mouse.y * Math.PI) / 24; // max 7.5°
  meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
  meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
});
```

---

## 📋 PLAN DE MODIFICATION — 8 MILESTONES

### V1 — Visual Refonte

**M14 — Design system tokens** (LOW, ~1h)
- Créer `app/styles/design-tokens.css` avec palette, typography, motion, shadows
- Mettre à jour `tailwind.config.ts` pour exposer les tokens
- Importer Newsreader (Google Fonts) pour serif accent
- Vérifier JetBrains Mono pour mono
- Build clean
- Commit : `feat(design): introduce premium design tokens system`

**M15 — Hero refonte** (HIGH, ~2h)
- Refonte layout grid 12 cols
- Eyebrow mono + H1 grand display + subtitle + CTAs cinematic + trust line
- Background gradients radial purple/teal
- Header sticky avec scroll detection (transparent → blur)
- Diff complet à valider AVANT commit
- Commit : `feat(hero): cinematic ElevenLabs-style refonte`

**M16 — HeroDevice 3D upgrade** (HIGH, ~2h)
- Vidéo showreel autoplay loop dans le screen iPhone
- Cursor follow auto-actif (max 15° rotation)
- Float animation idle
- 3 floating UI cards autour du device (60FPS, 4K capture, Live in Framer)
- Suppression des contrôles Upload/Rotate/Follow/Float si présents
- Performance budget : `frameloop="demand"`, lazy load via `dynamic()`
- ⚠️ Note importante : la vidéo `/public/hero-showreel.mp4` n'existe PAS encore. Pour V1, utilise un placeholder vidéo ou un fallback couleur. Je fournirai le vrai showreel ensuite. Implémente le mécanisme de fallback (si vidéo absente, juste un design statique dans le screen).
- Diff complet à valider
- Commit : `feat(hero-3d): autoplay showreel + cursor follow + floating cards`

**M17 — Sections Problem + How it works refonte** (MEDIUM, ~1h30)
- Bento cards avec hover glow
- Eyebrow mono + H2 large + body
- ASCII pattern background subtle pour How it works
- Numbering 01 / 02 / 03 grand mono
- Diff à valider
- Commit : `feat(sections): refonte Problem + How it works premium`

**M18 — Section Features bento + Behind the build refonte** (MEDIUM, ~1h30)
- Features bento asymétrique (1 big card + 3 small)
- Stats strip mono minimaliste
- Behind the build avec layout asymétrique + glow + ASCII silhouette
- Diff à valider
- Commit : `feat(sections): refonte Features bento + Behind the build`

**M19 — CTA final + Footer refonte** (LOW, ~45min)
- CTA section pleine hauteur avec gradient glow
- H2 énorme avec serif italic accent
- Footer avec design tokens appliqués
- Commit direct si build passe
- Commit : `feat(sections): refonte CTA final + Footer`

**M20 — Motion + scroll-driven animations** (MEDIUM, ~1h)
- Hero parallax scroll-driven
- Section reveal animations (opacity + y)
- Header scroll detection (transparent → blur)
- Stagger animations sur cards
- Diff à valider
- Commit : `feat(motion): scroll-driven animations + section reveals`

**M21 — Validation finale + perf check** (~1h)
- Lighthouse desktop + mobile (target Performance >85)
- Walk-through responsive 375 / 768 / 1280 / 1920
- Bundle size check (target <500KB JS, <300KB CSS gzipped)
- Vidéo showreel intégrée (si je l'ai fournie)
- Pas de commit, juste rapport validation

---

## ⚠️ POINTS DE VIGILANCE

### Performance impérative

La refonte ne doit PAS détruire les perfs Phase 1. Surveille :
- Bundle JS total : doit rester <500KB gzipped
- LCP (Largest Contentful Paint) : <2.5s sur connexion 4G
- CLS (Cumulative Layout Shift) : <0.1 (utilise `aspect-ratio` partout pour images/vidéos)
- TBT (Total Blocking Time) : <300ms

Si la refonte explose le bundle, identifier les coupables (Newsreader font, framer-motion features non utilisées, etc.) et optimiser.

### Vidéo showreel — Fallback obligatoire

La vidéo `hero-showreel.mp4` n'existe pas encore. Implémente DÈS M16 un fallback élégant :
```jsx
{videoExists ? (
  <video src="/hero-showreel.mp4" autoPlay muted loop playsInline />
) : (
  <div className="w-full h-full bg-gradient-brand-subtle flex items-center justify-center">
    <span className="font-mono text-[12px] uppercase tracking-wider text-text-tertiary">
      Showreel coming
    </span>
  </div>
)}
```

### Mobile-first impératif

Toute section doit être validée en 375px AVANT desktop. Pas l'inverse. Les designs ElevenLabs-style avec grands titres se cassent facilement en mobile si pas pensés dès le départ.

Hero mobile : stack vertical, mockup d'abord (taille raisonnable, max 60vh), text dessous.

---

## ✅ CHECKLIST FINALE

### Visual
- [ ] Design tokens centralisés dans `design-tokens.css`
- [ ] Palette dark cinematic appliquée partout
- [ ] Typography contrast (display + serif italic accent + mono eyebrows)
- [ ] Gradients brand purple→teal cohérents avec Behind the build avatar
- [ ] Glows subtils sur CTAs et sections clés
- [ ] ASCII art intégré dans 2-3 endroits (How it works, Behind the build, transitions)

### Hero
- [ ] iPhone 17 Pro 3D dominant à droite
- [ ] Vidéo showreel autoplay muted loop dans screen (ou fallback élégant si vidéo absente)
- [ ] Cursor follow auto-actif (max 15° rotation)
- [ ] Pas de contrôles visibles (Upload/Rotate/Follow/Float supprimés)
- [ ] 3 floating UI cards (60FPS / 4K capture / Live in Framer)
- [ ] Float animation idle subtil
- [ ] Glow brand autour du device

### Motion
- [ ] Hero parallax scroll-driven
- [ ] Section reveals (opacity + y)
- [ ] Header scroll detection (transparent → blur)
- [ ] Stagger animations sur cards
- [ ] Smooth transitions partout (ease cinematic)

### Performance
- [ ] Lighthouse Performance >85 desktop ET mobile
- [ ] Bundle JS <500KB gzipped
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] frameloop="demand" sur Canvas R3F
- [ ] Lazy load HeroDevice via dynamic()

### Responsive
- [ ] Mobile 375px : layout stack vertical hero, lisible
- [ ] Tablet 768px : transition propre
- [ ] Desktop 1280px : layout grid optimal
- [ ] Wide 1920px+ : pas de zones vides désertes

---

## 🎬 WORKFLOW DEMANDÉ

1. Lis ce document en entier
2. Confirme que tu as tout compris
3. Audit du codebase actuel : liste les composants impactés par la refonte
4. Propose un plan détaillé pour chaque milestone (M14 → M21)
5. **Demande validation avant chaque milestone**
6. Pour les milestones MEDIUM/HIGH risk : montre les diffs avant commit
7. Pour les milestones LOW risk : commit direct si build passe
8. À chaque commit : envoie un récap court (3-4 lignes) avec hash + fichiers modifiés
9. Run `npm run build` après chaque milestone
10. Lighthouse check à M21

**Tu commences par retourner uniquement le plan détaillé, pas de modifications code à ce stade.**
