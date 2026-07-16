'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import StudioFeatures from './StudioFeatures'
import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/lib/useInView'

// Section interactive "Take a closer look" — 3D chargée client-only.
const CloserLook = dynamic(() => import('./CloserLook'), {
	ssr: false,
	loading: () => <div className="min-h-[620px]" aria-hidden="true" />,
})
import { ArrowRight, Download, Check, MousePointer2, RotateCw, Wind, Zap } from 'lucide-react'

/**
 * Tiny scroll-reveal hook. Adds an `is-in` class to children when they
 * enter the viewport, then never re-toggles. Keeps the page light vs.
 * importing a full motion library.
 */
function useScrollReveal() {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const el = ref.current
		if (!el) return
		const els = el.querySelectorAll<HTMLElement>('[data-reveal]')
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-in')
						io.unobserve(entry.target)
					}
				})
			},
			{ threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
		)
		els.forEach((e) => io.observe(e))
		return () => io.disconnect()
	}, [])
	return ref
}

/**
 * Carousel "The latest" à la Apple : cartes larges, titre + sous-titre
 * EN HAUT, photo produit EN BAS, scroll-snap horizontal, avance
 * automatique (pause au hover), flèches de navigation.
 */
function DeviceCarousel() {
	const trackRef = useRef<HTMLDivElement>(null)

	const nudge = (dir: 1 | -1) => {
		const el = trackRef.current
		if (!el) return
		const card = el.querySelector<HTMLElement>('[data-card]')
		el.scrollBy({left: dir * ((card ? card.offsetWidth : 340) + 16), behavior: 'smooth'})
	}

	return (
		<div className="relative">
			<div
				ref={trackRef}
				className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{DEVICES.map((d, i) => (
					<div
						key={d.name}
						data-card
						className="snap-start relative flex-shrink-0 w-[290px] sm:w-[340px] h-[440px] rounded-3xl overflow-hidden bg-white/[0.05] border border-white/[0.07] transition-transform hover:scale-[1.01]"
					>
						{/* Photo pleine carte, qualité max — décalée vers le bas
						    pour dégager la zone titre en haut de carte. */}
						{d.img ? (
							<div className="absolute inset-0 top-16">
								<Image
									src={d.img}
									alt={d.name}
									fill
									quality={95}
									className="object-cover object-center"
									sizes="(max-width: 640px) 290px, 680px"
								/>
							</div>
						) : (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-4xl font-semibold text-white/15">{d.name.split(' ')[0]}</div>
							</div>
						)}
						{/* Titre superposé — sans bandeau, juste un voile doux */}
						<div className="absolute top-0 left-0 right-0 p-6 pb-10 bg-gradient-to-b from-black/45 to-transparent">
							<div className="text-xl font-semibold leading-tight text-white">{d.name}</div>
							<div className="mt-1 text-sm text-white/70">Production-grade GLB · {d.tier} plan</div>
						</div>
					</div>
				))}
			</div>

			{/* Flèches nav */}
			<button
				type="button"
				aria-label="Previous devices"
				onClick={() => nudge(-1)}
				className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
			>
				<ArrowRight size={16} className="rotate-180" />
			</button>
			<button
				type="button"
				aria-label="Next devices"
				onClick={() => nudge(1)}
				className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
			>
				<ArrowRight size={16} />
			</button>
		</div>
	)
}

/** Section "exports" à la Apple (réf. page Cameras iPhone) : média
 *  massif à gauche qui déborde du cadre, kicker orange + gros titre,
 *  stats de formats photo/vidéo à droite. */
function ExportFormatsSection() {
	// Optimisation Apple : l'embed est PRÉCHARGÉ ~1200px avant d'arriver
	// et monté UNE SEULE FOIS (latch) — le démontage au scroll rechargeait
	// GLB+vidéo à chaque retour. Hors viewport la vidéo se met en pause
	// dans l'embed (memselon:in-viewport interne) : coût GPU quasi nul.
	const {ref: mediaRef, inView} = useInView('1200px')
	const [everInView, setEverInView] = useState(false)
	useEffect(() => {
		if (inView) setEverInView(true)
	}, [inView])
	return (
		<section className="relative bg-black border-t border-white/[0.07] overflow-hidden">
			<div className="max-w-[1560px] mx-auto px-6 md:px-16 pt-24 md:pt-32">
				<div data-reveal className="reveal-up text-center mb-14">
					<div className="text-sm font-semibold text-[#e8702a] mb-3">Exports</div>
					<h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight">
						A big export forward.
					</h2>
				</div>
			</div>

			<div className="relative max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-center gap-10">
				{/* Média massif à gauche — LE produit lui-même : la scène vidéo
				    3D statique (composant vidéo du plugin) en gros plan qui
				    déborde du cadre à gauche, chat samurai qui joue en boucle.
				    Pas de reveal ici (demande : aucun fade in/out sur la vidéo)
				    et collé au bord gauche en mobile. */}
				<div ref={mediaRef} className="relative h-[420px] sm:h-[560px] lg:h-[640px] overflow-hidden mr-6 md:mr-16 lg:mx-0">
					{/* Poster instantané — capture LOCALE de la scène (18 Ko webp,
					    même cadrage que l'iframe), eager + fetchPriority high :
					    l'ancienne URL CDN 404ait, d'où la zone vide puis le fondu. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/exports-poster.webp"
						alt="Video 3D mockup"
						loading="eager"
						fetchPriority="high"
						className="absolute object-contain pointer-events-none"
						style={{ width: '300%', maxWidth: 'none', height: '280%', left: '-130%', top: '-90%' }}
					/>
					{everInView && (
						<iframe
							src="https://framer-3d-mockup-embed.vercel.app/embed/b2e6ee46-51d2-4f31-b781-40453ccafdbb?static=true&bg=transparent&showSignature=false&dpr=1&tier=STANDARD"
							title="Video 3D mockup — live static scene"
							className="absolute border-0 pointer-events-none"
							style={{ width: '300%', height: '280%', left: '-130%', top: '-90%' }}
						/>
					)}
				</div>

				{/* Stats à droite */}
				<div data-reveal className="reveal-up flex flex-col gap-10 px-6 md:px-16 lg:px-0 pb-20 lg:pb-0">
					<div>
						<div className="text-sm text-white/60 mb-1">Photo export up to</div>
						<div className="text-5xl font-semibold text-[#e8702a] tracking-tight">4K</div>
						<div className="text-sm text-white/60 mt-1">PNG with transparency — WebP coming</div>
					</div>
					<div>
						<div className="text-sm text-white/60 mb-1">Video export</div>
						<div className="text-5xl font-semibold text-[#e8702a] tracking-tight">4K&nbsp;60s</div>
						<div className="text-sm text-white/60 mt-1">transparent WebM, rendered offline in your browser</div>
					</div>
					<div>
						<div className="text-sm text-white/60 mb-1">Or skip exports entirely</div>
						<div className="text-3xl font-semibold text-white tracking-tight">Live 3D embed</div>
						<div className="text-sm text-white/60 mt-1">the real scene, interactive, on your published Framer site</div>
					</div>
				</div>
			</div>
		</section>
	)
}

// Photos = les cartes officielles du catalogue du plugin (device-models/<id>/card.jpg).
const DEVICES = [
	{ name: 'iPhone 17 Pro',        tier: 'Pro',    img: '/cards/iphone17pro-apple.webp' },
	{ name: 'iPhone Air',           tier: 'Pro',    img: '/cards/iphoneAir-apple.webp' },
	{ name: 'iPhone 16e',           tier: 'Pro' },
	{ name: 'iPad',                 tier: 'Pro',    img: '/cards/ipadPro-apple.webp' },
	{ name: 'MacBook Pro 16"',      tier: 'Pro',    img: '/cards/macbookPro-apple.webp' },
	{ name: 'iMac',                 tier: 'Pro',    img: '/cards/imac-apple.webp' },
	{ name: 'Apple Pro Display XDR',tier: 'Studio',  img: '/cards/appleProDisplayXDR.jpg' },
	{ name: 'Apple Watch Ultra',    tier: 'Pro',    img: '/cards/appleWatchUltra.jpg' },
	{ name: 'Samsung Galaxy S25',   tier: 'Pro' },
	{ name: 'Macintosh 1984',       tier: 'Pro' },
]

const STEPS = [
	{
		n: '01',
		title: 'Drop your screenshot',
		body: 'Paste any image or video on the canvas. The plugin auto-fits the screen of the device — portrait, landscape, even Lottie.',
		icon: <MousePointer2 size={20} strokeWidth={1.5} />,
	},
	{
		n: '02',
		title: 'Pose the device',
		body: 'Orbit the camera, tilt the device, swap the HDRI environment, dial the light. Everything previews live in Framer.',
		icon: <RotateCw size={20} strokeWidth={1.5} />,
	},
	{
		n: '03',
		title: 'Ship 4K — or embed live',
		body: 'Export 4K PNG with transparency, MP4 video of the animation, or paste a Framer code component that renders the scene live on your landing.',
		icon: <Download size={20} strokeWidth={1.5} />,
	},
]

const ANIMATIONS = [
	{ icon: <MousePointer2 size={18} strokeWidth={1.5} />, title: 'Follow cursor', body: 'The device tracks the visitor’s mouse on your published landing.' },
	{ icon: <RotateCw size={18} strokeWidth={1.5} />, title: 'Orbit camera', body: 'Free or locked orbit with adjustable speed.' },
	{ icon: <Wind size={18} strokeWidth={1.5} />, title: 'Float', body: 'Slow weightless hover — perfect for hero sections.' },
	{ icon: <Zap size={18} strokeWidth={1.5} />, title: 'Scroll move', body: 'The device rotates as the visitor scrolls the page.' },
]

const COMPARE = [
	{ feature: 'Lives inside Framer',                 lithos: true,  rotato: false, smart: false, native: true  },
	{ feature: '3D — real-time, orbit camera',        lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: 'Video / animated screens',            lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: '4K transparent export',               lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: 'Embed live 3D scene on published site',lithos: true,  rotato: false, smart: false, native: false },
	{ feature: 'No subscription lock-out on landing',  lithos: 'Studio', rotato: '—', smart: '—',   native: '—'   },
	{ feature: 'Updates automatically when design changes', lithos: true,  rotato: false, smart: false, native: true },
]

// Grille canonique — Notion « Brief Pricing 19/49/99 » (10/07/2026)
// + correction 14/07 : pas de trial, garantie remboursé 7 jours.
const PLANS = [
	{
		name: 'Starter',
		blurb: 'For getting started.',
		monthly: '19',
		yearly: '190',
		cta: 'Go Starter',
		highlight: false,
		bullets: [
			'Photo mode only',
			'50 exports / month, up to 1080p',
			'No watermark',
			'All devices',
			'Orbit camera',
		],
	},
	{
		name: 'Pro',
		blurb: 'For freelance designers.',
		monthly: '49',
		yearly: '490',
		cta: 'Go Pro',
		highlight: true,
		bullets: [
			'Unlimited exports, up to 4K + transparency',
			'All animations (follow cursor, orbit, float, scroll)',
			'Video export (MP4)',
			'Save scenes (cloud sync)',
			'Lottie screens',
			'Priority support',
		],
	},
	{
		name: 'Studio',
		blurb: 'For studios + agencies.',
		monthly: '99',
		yearly: '990',
		cta: 'Go Studio',
		highlight: false,
		bullets: [
			'Everything in Pro',
			'Live 3D embeds on published sites (up to 10 sites)',
			'Static video 3D component',
			'White-label (no backlink)',
			'Performance guarantee — Lighthouse-friendly embeds',
		],
	},
]

const FAQ = [
	{
		q: 'Does it run inside Framer or as a separate app?',
		a: 'Entirely inside Framer — the plugin opens in a side panel and renders the 3D device live on your canvas. No second app, no re-import loop.',
	},
	{
		q: 'How does the live 3D embed work?',
		a: 'Studio users get a Framer code component that they drop on the canvas. It renders the saved scene on the published landing, and checks the owner’s subscription on every mount (cached 30 minutes). If the subscription lapses, the component falls back to a watermarked PNG.',
	},
	{
		q: 'Can I bring my own 3D models?',
		a: 'Custom GLB and USDZ upload is on the V2 roadmap. For now the plugin ships with 10 production-ready Apple + Samsung devices.',
	},
	{
		q: 'Will this slow down my Framer file?',
		a: 'No. The plugin renders only inside the plugin panel during editing. On the published landing, the embed component is opt-in, lazy-loaded, and capped at adaptive DPR + a frame budget.',
	},
	{
		q: 'What about Windows / Linux?',
		a: 'Mockiosa runs in the browser via WebGL — anywhere Framer runs, the plugin runs. Mac, Windows, Linux, ChromeOS.',
	},
	{
		q: 'Can I cancel anytime?',
		a: 'Yes — manage your subscription from the Stripe customer portal, any time.',
	},
]

export default function LandingSections() {
	const containerRef = useScrollReveal()
	const [yearly, setYearly] = useState(false)

	return (
		<div ref={containerRef} className="bg-[#0a0a0a] text-white overflow-hidden">
			{/* ════════════ Section 1 — Pitch ════════════ */}
			<section className="relative px-6 md:px-16 py-32 md:py-48 max-w-[1560px] mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div data-reveal className="reveal-up">
						<div className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-6 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The plugin
						</div>
						<h2 className="text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
							<span className="font-playfair italic font-normal" style={{ letterSpacing: '-0.04em' }}>Stop exporting.</span>{' '}
							<span className="text-white/70">Start designing</span>{' '}
							<span className="font-playfair italic font-normal" style={{ letterSpacing: '-0.04em' }}>in 3D.</span>
						</h2>
						<p className="mt-10 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
							You design in Framer. Then you open another tool — Rotato, Blender, After Effects. You
							re-import. You re-export. Every time the mockup changes, you do it again. Mockiosa
							ends that loop — the device lives on your canvas, your screenshot is its screen, and the
							published landing renders the same 3D scene you just posed.
						</p>
					</div>

					{/* Démo vidéo du plugin — même carte que la page login */}
					<div data-reveal className="reveal-up relative hidden lg:block min-h-[460px] rounded-3xl overflow-hidden border border-white/[0.08]">
						<video
							src="/auth-demo.mp4"
							poster="/auth-demo-poster.jpg"
							autoPlay
							muted
							loop
							playsInline
							className="absolute inset-0 w-full h-full object-cover"
						/>
					</div>
				</div>
			</section>

			{/* ════════════ Section 1.5 — Take a closer look (interactif) ════════════ */}
			<CloserLook />

			{/* ════════════ Section 2 — Showcase devices ════════════ */}
			<section id="showcase" className="relative px-6 md:px-16 pt-20 pb-32 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up flex items-end justify-between flex-wrap gap-6 mb-14">
						<div>
							<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
								<span className="w-8 h-px bg-[#e8702a]" />
								The library
							</div>
							<h2 className="text-3xl sm:text-5xl md:text-6xl tracking-tight">
								<span className="font-playfair italic font-normal">Ten</span> production-grade devices.
							</h2>
						</div>
						<p className="max-w-md text-sm sm:text-base text-white/60 leading-relaxed">
							Every device is a properly modelled GLB with PBR materials, light bake, and a screen mesh
							ready to receive your texture. Updated as Apple ships.
						</p>
					</div>

					<DeviceCarousel />
				</div>
			</section>

			{/* ════════════ Section 3 — How it works ════════════ */}
			<section className="relative bg-[#f5f4ef] text-[#0a0a0a] px-6 md:px-16 py-32 md:py-40">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up max-w-3xl mb-20">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							How it works
						</div>
						<h2 className="text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
							<span className="font-playfair italic font-normal">Three clicks</span> from a flat screenshot to a 3D
							mockup ready to ship.
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-8 md:gap-12">
						{STEPS.map((s, i) => (
							<div
								key={s.n}
								data-reveal
								className="reveal-up relative"
								style={{ transitionDelay: `${i * 80}ms` }}
							>
								<div className="text-8xl font-playfair italic text-[#e8702a]/15 leading-none mb-4">{s.n}</div>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-9 h-9 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center">
										{s.icon}
									</div>
									<h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
								</div>
								<p className="text-base text-[#0a0a0a]/65 leading-relaxed">{s.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 4 — Animations ════════════ */}
			<section className="relative px-6 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up max-w-3xl mb-16">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The movement
						</div>
						<h2 className="text-4xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
							<span className="font-playfair italic font-normal">Four animations</span>, no Blender.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl">
							Toggle one behavior. The device responds in real time on your canvas, and on the published
							landing once you embed the 3D component.
						</p>
					</div>

					{/* Bento à la Apple : grande tuile héro + tuiles compactes,
					    coins très arrondis, photos catalogue en fond. */}
					<div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[190px] gap-4">
						{/* Grande tuile — Follow cursor */}
						<div data-reveal className="reveal-up col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden bg-white/[0.04] border border-white/[0.07] p-8 flex flex-col justify-between hover:border-white/[0.15] transition-all">
							<div>
								<div className="w-11 h-11 rounded-2xl bg-[#e8702a]/15 text-[#e8702a] flex items-center justify-center mb-5">
									{ANIMATIONS[0].icon}
								</div>
								<div className="text-2xl font-semibold mb-2">{ANIMATIONS[0].title}</div>
								<div className="text-sm text-white/60 leading-relaxed max-w-sm">{ANIMATIONS[0].body}</div>
							</div>
							<div className="absolute right-[-40px] bottom-[-60px] w-[280px] h-[280px] opacity-70 pointer-events-none">
								<Image src="/cards/iphone17pro.jpg" alt="" fill className="object-cover rounded-3xl rotate-6" sizes="280px" />
							</div>
							<div className="text-xs text-white/40">Replays page-wide on your published Framer site</div>
						</div>
						{/* Tuiles compactes */}
						{ANIMATIONS.slice(1).map((a, i) => (
							<div
								key={a.title}
								data-reveal
								className="reveal-up col-span-1 row-span-1 p-6 rounded-[2rem] bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.15] transition-all flex flex-col justify-between"
								style={{ transitionDelay: `${i * 60}ms` }}
							>
								<div className="w-10 h-10 rounded-xl bg-[#e8702a]/15 text-[#e8702a] flex items-center justify-center">
									{a.icon}
								</div>
								<div>
									<div className="text-base font-semibold mb-1">{a.title}</div>
									<div className="text-xs text-white/55 leading-relaxed">{a.body}</div>
								</div>
							</div>
						))}
						{/* Tuile stat 4K */}
						<div data-reveal className="reveal-up col-span-1 row-span-1 p-6 rounded-[2rem] bg-[#e8702a] text-white flex flex-col justify-between">
							<div className="text-4xl font-bold tracking-tight">4K</div>
							<div className="text-xs leading-relaxed text-white/85">PNG & transparent video export, rendered offline in your browser</div>
						</div>
					</div>
				</div>
			</section>

			{/* ════════════ Section 4.2 — Inside the studio ════════════ */}
			<StudioFeatures />

			{/* ════════════ Section 4.5 — Exports (à la Apple) ════════════ */}
			<ExportFormatsSection />

			{/* ════════════ Section 5 — Comparison ════════════ */}
			<section className="relative px-6 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-6xl mx-auto">
					<div data-reveal className="reveal-up text-center mb-16">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The benchmark
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-4xl sm:text-6xl tracking-tight">
							<span className="font-playfair italic font-normal">Why</span> Mockiosa.
						</h2>
					</div>

					<div data-reveal className="reveal-up overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
						<table className="w-full min-w-[640px] text-sm">
							<thead>
								<tr className="border-b border-white/[0.08]">
									<th className="text-left p-5 font-semibold text-white/50 text-xs uppercase tracking-wider">Feature</th>
									<th className="p-5 font-semibold text-white text-xs uppercase tracking-wider">Mockiosa</th>
									<th className="p-5 font-medium text-white/55 text-xs uppercase tracking-wider">Rotato</th>
									<th className="p-5 font-medium text-white/55 text-xs uppercase tracking-wider">Smart Mockups</th>
									<th className="p-5 font-medium text-white/55 text-xs uppercase tracking-wider">Framer 2D</th>
								</tr>
							</thead>
							<tbody>
								{COMPARE.map((row, i) => (
									<tr key={row.feature} className={i % 2 ? 'bg-white/[0.015]' : ''}>
										<td className="p-5 text-white/85">{row.feature}</td>
										<Cell v={row.lithos} highlight />
										<Cell v={row.rotato} />
										<Cell v={row.smart} />
										<Cell v={row.native} />
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* ════════════ Section 6 — Pricing ════════════ */}
			<section id="pricing" className="relative bg-[#0a0a0a] px-6 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up text-center mb-12">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Pricing
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-4xl sm:text-6xl md:text-7xl tracking-tight">
							<span className="font-playfair italic font-normal">Pay</span> what fits.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-white/65 max-w-xl mx-auto">
							7-day money-back guarantee, no questions asked. Cancel any time.
						</p>

						{/* Monthly / yearly toggle */}
						<div className="mt-10 inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
							<button
								type="button"
								onClick={() => setYearly(false)}
								className={
									'text-sm px-5 py-2 rounded-full transition-all ' +
									(!yearly ? 'bg-white text-[#0a0a0a] font-semibold' : 'text-white/70 hover:text-white')
								}
							>
								Monthly
							</button>
							<button
								type="button"
								onClick={() => setYearly(true)}
								className={
									'text-sm px-5 py-2 rounded-full transition-all flex items-center gap-2 ' +
									(yearly ? 'bg-white text-[#0a0a0a] font-semibold' : 'text-white/70 hover:text-white')
								}
							>
								Yearly
								<span className={'text-[10px] font-bold px-1.5 py-0.5 rounded-full ' + (yearly ? 'bg-[#e8702a] text-white' : 'bg-[#e8702a]/20 text-[#e8702a]')}>
									-28%
								</span>
							</button>
						</div>
					</div>

					<div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-14">
						{PLANS.map((p, i) => (
							<div
								key={p.name}
								data-reveal
								className={
									'reveal-up relative rounded-3xl p-8 border transition-all ' +
									(p.highlight
										? 'bg-gradient-to-b from-[#e8702a]/20 to-[#0a0a0a] border-[#e8702a]/40 shadow-2xl shadow-[#e8702a]/10'
										: 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14]')
								}
								style={{ transitionDelay: `${i * 80}ms` }}
							>
								{p.highlight ? (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#e8702a] text-white">
										Most popular
									</div>
								) : null}
								<div className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/70">{p.name}</div>
								<div className="text-sm text-white/55 mb-6">{p.blurb}</div>
								<div className="mb-2 flex items-baseline gap-1">
									<span className="text-5xl font-bold tracking-tight">${yearly ? p.yearly : p.monthly}</span>
									<span className="text-sm text-white/55">/{yearly ? 'year' : 'month'}</span>
								</div>
								<Link
									href={'/sign-up'}
									className={
										'mt-6 block w-full text-center text-sm font-semibold px-5 py-3 rounded-full transition-all ' +
										(p.highlight
											? 'cta-skeu text-white hover:scale-[1.02]'
											: 'cta-skeu-light text-[#0a0a0a] hover:scale-[1.02]')
									}
								>
									{p.cta}
								</Link>
								<ul className="mt-8 space-y-3">
									{p.bullets.map((b) => (
										<li key={b} className="flex items-start gap-3 text-sm text-white/80">
											<Check size={16} strokeWidth={2.5} className="flex-shrink-0 mt-0.5 text-[#e8702a]" />
											<span>{b}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

				</div>
			</section>

			{/* ════════════ Section 7 — FAQ ════════════ */}
			<section id="docs" className="relative px-6 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-4xl mx-auto">
					<div data-reveal className="reveal-up mb-14">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Questions
						</div>
						<h2 className="text-4xl sm:text-6xl tracking-tight">
							<span className="font-playfair italic font-normal">Answers</span>, before you ask.
						</h2>
					</div>
					<div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
						{FAQ.map((item) => (
							<FaqRow key={item.q} q={item.q} a={item.a} />
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 8 — Final CTA ════════════ */}
			<section id="live" className="relative px-6 md:px-16 py-32 md:py-44 border-t border-white/[0.07] overflow-hidden">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#e8702a]/[0.08] blur-3xl" />
				</div>
				<div data-reveal className="reveal-up relative max-w-4xl mx-auto text-center">
					{/* Hermione à la place de l'icône — on prononce bien le nom. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/hermione-mockiosa.gif"
						alt=""
						loading="lazy"
						className="mx-auto mb-8 w-[180px] sm:w-[220px] rounded-2xl border border-white/[0.08]"
					/>
					<h2 className="text-5xl sm:text-7xl md:text-8xl leading-[0.98] tracking-tight">
						It&apos;s <span className="font-playfair italic font-normal">Mockiosa</span>,{' '}
						<span className="text-white/65">not Mockiosaaaaaaa.</span>
					</h2>
					<p className="mt-8 text-base sm:text-lg text-white/65 max-w-xl mx-auto">
						The plugin is free to install — try it in demo mode, then go paid with a 7-day money-back guarantee.
					</p>
					<div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
						<Link
							href="/sign-up"
							className="cta-skeu inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03]"
						>
							Install the plugin
							<ArrowRight size={16} />
						</Link>
						<Link
							href="/sign-in"
							className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.14] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all"
						>
							Sign in
						</Link>
					</div>

				</div>
			</section>

			{/* ════════════ Footer ════════════ */}
			<footer className="relative border-t border-white/[0.07] px-6 md:px-16 py-14">
				<div className="max-w-[1560px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
					<div>
						<div className="flex items-center gap-2 mb-3">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
							</svg>
							<span className="font-playfair italic text-xl">Mockiosa</span>
						</div>
						<p className="text-xs text-white/45 max-w-xs leading-relaxed">
							Real-time 3D mockups for Framer. Crafted by a human, one cloud at a time ☁
						</p>
					</div>
					<nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/60">
						<a href="#showcase" className="hover:text-white">Devices</a>
						<a href="#pricing" className="hover:text-white">Pricing</a>
						<a href="#docs" className="hover:text-white">Docs</a>
						<Link href="/sign-in" className="hover:text-white">Sign in</Link>
						<Link href="/sign-up" className="hover:text-white">Sign up</Link>
						<Link href="/privacy" className="hover:text-white">Privacy</Link>
						<Link href="/terms" className="hover:text-white">Terms</Link>
						<a href="mailto:hi@memselon.com" className="hover:text-white">hi@memselon.com</a>
					</nav>
				</div>
				<div className="max-w-[1560px] mx-auto mt-10 pt-6 border-t border-white/[0.05] text-[10px] tracking-wider uppercase text-white/40 flex flex-wrap items-center justify-between gap-3">
					<span>© 2026 Mockiosa</span>
					<span>Made for Framer designers</span>
				</div>
			</footer>
		</div>
	)
}

function Cell({ v, highlight = false }: { v: boolean | string; highlight?: boolean }) {
	const base = 'p-5 text-center text-sm'
	if (typeof v === 'string') {
		return (
			<td className={base + (highlight ? ' text-[#e8702a] font-semibold' : ' text-white/65')}>{v}</td>
		)
	}
	if (v) {
		return (
			<td className={base + (highlight ? ' text-[#e8702a]' : ' text-white/85')}>
				<Check size={18} strokeWidth={2.5} className="inline" />
			</td>
		)
	}
	return <td className={base + ' text-white/30'}>—</td>
}

function FaqRow({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false)
	return (
		<div className="py-2" data-reveal style={{ /* reveal-up applied via JS */ }}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-6 py-5 text-left group"
			>
				<span className="text-base sm:text-lg text-white/90 group-hover:text-white transition-colors">{q}</span>
				<span
					className={
						'flex-shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/70 transition-transform ' +
						(open ? 'rotate-45' : 'rotate-0')
					}
				>
					+
				</span>
			</button>
			<div
				className="overflow-hidden transition-all duration-300 ease-out"
				style={{ maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0 }}
			>
				<p className="pb-5 pr-12 text-sm text-white/60 leading-relaxed">{a}</p>
			</div>
		</div>
	)
}
