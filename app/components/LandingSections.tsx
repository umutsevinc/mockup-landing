'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import StudioFeatures from './StudioFeatures'
import PhNavBadge from './PhNavBadge'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from '@/lib/useInView'

// Section interactive "Take a closer look" — 3D chargée client-only.
const CloserLook = dynamic(() => import('./CloserLook'), {
	ssr: false,
	loading: () => <div className="min-h-[620px]" aria-hidden="true" />,
})
import { ArrowRight, Check } from 'lucide-react'

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
 * Easter egg : un clic sur Hermione lâche une volée de plumes à
 * physique réelle (rAF) — burst initial, gravité freinée par la
 * traînée (vitesse terminale de plume), balancement pendulaire
 * gauche-droite pendant la chute. Rendu en portal plein écran :
 * les plumes retombent sur TOUTE la section, pas juste sur le gif.
 */
type FeatherSim = {
	x: number; y: number; vx: number; vy: number
	term: number; swayFreq: number; swayAmp: number; phase: number
	rot0: number; spin: number; t: number; life: number
}

function HermioneEasterEgg() {
	const btnRef = useRef<HTMLButtonElement>(null)
	const [feathers, setFeathers] = useState<{ id: number; size: number }[]>([])
	const simRef = useRef(new Map<number, FeatherSim>())
	const nodesRef = useRef(new Map<number, HTMLSpanElement>())
	const rafRef = useRef(0)
	const lastRef = useRef(0)
	const idRef = useRef(0)
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

	const tick = (now: number) => {
		const dt = Math.min((now - lastRef.current) / 1000, 0.05)
		lastRef.current = now
		const vh = window.innerHeight
		const dead: number[] = []
		simRef.current.forEach((f, id) => {
			f.t += dt
			// Gravité + traînée : une plume n'accélère pas indéfiniment,
			// elle plafonne à sa vitesse terminale (lente).
			f.vy = Math.min(f.vy + 900 * dt, f.term)
			f.vx *= Math.exp(-2.2 * dt)
			// Balancement pendulaire pendant la descente
			const sway = Math.sin(f.t * f.swayFreq + f.phase) * f.swayAmp
			f.x += (f.vx + sway) * dt
			f.y += f.vy * dt
			// L'inclinaison suit le balancement (cos = dérivée du sin)
			const rot = f.rot0 + Math.cos(f.t * f.swayFreq + f.phase) * 42 + f.spin * f.t
			const o = Math.min(1, f.t / 0.12) * Math.max(0, Math.min(1, (f.life - f.t) / 0.6))
			const node = nodesRef.current.get(id)
			if (node) {
				node.style.transform = `translate(${f.x.toFixed(1)}px, ${f.y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`
				node.style.opacity = o.toFixed(2)
			}
			if (f.t >= f.life || f.y > vh + 60) dead.push(id)
		})
		if (dead.length) {
			dead.forEach((id) => { simRef.current.delete(id); nodesRef.current.delete(id) })
			setFeathers((arr) => arr.filter((f) => !dead.includes(f.id)))
		}
		if (simRef.current.size > 0) rafRef.current = requestAnimationFrame(tick)
		else rafRef.current = 0
	}

	const pop = () => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const rect = btnRef.current?.getBoundingClientRect()
		if (!rect) return
		const cx = rect.left + rect.width / 2
		const cy = rect.top + rect.height / 2
		const batch: { id: number; size: number }[] = []
		for (let i = 0; i < 18; i++) {
			const id = idRef.current++
			// Départ sur le POURTOUR du gif (elles émergent de derrière),
			// vélocité en éventail vers le haut.
			const ang = -Math.PI * Math.random()
			const speed = 240 + Math.random() * 420
			simRef.current.set(id, {
				x: cx + Math.cos(ang) * rect.width * 0.55,
				y: cy + Math.sin(ang) * rect.height * 0.45,
				vx: Math.cos(ang) * speed * 0.8,
				vy: Math.sin(ang) * speed,
				term: 55 + Math.random() * 70,
				swayFreq: 1.6 + Math.random() * 1.8,
				swayAmp: 40 + Math.random() * 70,
				phase: Math.random() * Math.PI * 2,
				rot0: (Math.random() - 0.5) * 60,
				spin: (Math.random() - 0.5) * 30,
				t: 0,
				life: 4.5 + Math.random() * 2.5,
			})
			batch.push({ id, size: 13 + Math.random() * 13 })
		}
		setFeathers((arr) => [...arr, ...batch])
		if (!rafRef.current) {
			lastRef.current = performance.now()
			rafRef.current = requestAnimationFrame(tick)
		}
	}

	return (
		<>
			<button
				ref={btnRef}
				type="button"
				onClick={pop}
				aria-label="Wingardium Leviosa"
				className="relative z-10 inline-block p-0 border-0 bg-transparent cursor-pointer mb-8"
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/hermione-mockiosa.gif"
					alt=""
					loading="lazy"
					className="w-[180px] sm:w-[220px] rounded-2xl border border-white/[0.08]"
				/>
			</button>

			{/* Calque plein écran en portal : échappe aux ancêtres transformés
			    (reveal-up) qui casseraient un position:fixed local. */}
			{mounted && feathers.length > 0 &&
				createPortal(
					<div className="fixed inset-0 pointer-events-none z-[95]" aria-hidden>
						{feathers.map((f) => (
							<span
								key={f.id}
								ref={(n) => {
									if (!n) return
									nodesRef.current.set(f.id, n)
									// Positionne immédiatement (évite un flash en 0,0)
									const s = simRef.current.get(f.id)
									if (s) n.style.transform = `translate(${s.x}px, ${s.y}px)`
								}}
								className="absolute top-0 left-0 opacity-0 will-change-transform"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src="/feather-pen-white.svg" alt="Mockiosa" width={f.size} height={f.size} aria-hidden="true" style={{display: 'block'}} />
							</span>
						))}
					</div>,
					document.body,
				)}
		</>
	)
}

/**
 * Vidéo démo autoplay/loop/muted (pattern Dropshot : radius 14, fond
 * #111, object-cover). Tant que le fichier n'existe pas dans
 * /public/videos/, la tuile affiche un placeholder avec le nom du
 * fichier attendu — dépose le .mp4 et elle se remplace toute seule.
 */
function DemoVideo({ src, aspect, hint, pending }: { src: string; aspect: string; hint?: string; pending?: boolean }) {
	// pending = fichier pas encore tourné : placeholder direct, sans
	// requête réseau (les 404 polluaient la console).
	const [missing, setMissing] = useState(!!pending)
	// Lazy mount (audit perf 22/07) : les vidéos features chargeaient
	// unconditionnellement ~6 MB au premier paint. On ne monte le
	// <video> qu'à l'approche du viewport (300 px de marge), et on
	// démonte quand la tuile sort — le browser libère les bytes.
	const [inView, setInView] = useState(false)
	const holderRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		const el = holderRef.current
		if (!el || missing) return
		const obs = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{rootMargin: '300px'},
		)
		obs.observe(el)
		return () => obs.disconnect()
	}, [missing])
	return (
		<div
			ref={holderRef}
			className="relative rounded-[14px] overflow-hidden bg-[#111] border border-white/[0.06]"
			style={{ aspectRatio: aspect }}
		>
			{missing ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
					<div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">Video placeholder</div>
					<div className="text-xs font-mono text-[#e8702a]">{src}</div>
					{hint ? <div className="text-[11px] text-white/30 leading-relaxed max-w-[260px]">{hint}</div> : null}
				</div>
			) : inView ? (
				<video
					src={src}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					onError={() => setMissing(true)}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			) : null}
		</div>
	)
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
						className="snap-start relative flex-shrink-0 w-[290px] sm:w-[340px] h-[440px] rounded-3xl overflow-hidden bg-[#1c1c1e] border border-white/[0.08]"
					>
						{/* Images collées au bord bas, hauteur cappée pour laisser
						    respirer le texte en haut (fix overlap 25/07). object-contain
						    garantit qu'aucune photo n'est étirée. */}
						{d.img ? (
							<Image
								src={d.img}
								alt={d.name}
								width={800}
								height={800}
								quality={95}
								className="absolute bottom-0 left-0 w-full object-contain object-bottom"
								style={{maxHeight: '68%', height: 'auto'}}
								sizes="(max-width: 640px) 290px, 340px"
							/>
						) : (
							<div className="absolute inset-0 bg-[#1c1c1e] flex items-center justify-center">
								<div className="text-4xl font-semibold text-white/10">{d.name.split(' ')[0]}</div>
							</div>
						)}
						{/* Titre superposé — texte clair sur le fond dark grey de la carte.
						    Plus de mention de plan : dans la grille finale
						    (Ground/Float/Orbit) tous les devices sont dans tous les plans. */}
						<div className="absolute top-0 left-0 right-0 p-6 pb-10">
							<div className="text-xl font-semibold leading-tight text-white">{d.name}</div>
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
			<div className="relative z-[2] max-w-[1560px] mx-auto px-6 md:px-16 pt-20 md:pt-28">
				<div data-reveal className="reveal-up text-center mb-14">
					<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4">Exports</div>
					<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
						<span className="text-white">A big export</span>{' '}
						<span className="text-white/45">forward.</span>
					</h2>
				</div>
			</div>

			<div className="relative max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-center gap-10">
				{/* Média massif à gauche — LE produit lui-même : la scène vidéo
				    3D statique (composant vidéo du plugin) en gros plan qui
				    déborde du cadre à gauche, chat samurai qui joue en boucle.
				    Pas de reveal ici (demande : aucun fade in/out sur la vidéo)
				    et collé au bord gauche en mobile. */}
				{/* Rendu IDENTIQUE au composant vidéo du plugin
				    (Framer_3D_Video_Mockups : embed staticScene plein cadre,
				    zoom 1) — l'ancien agrandissement manuel 300 %/280 % zoomait
				    beaucoup trop la scène (bug signalé 18/07). */}
				{/* Device massif qui déborde sur le bord gauche : MP4 pré-rendu
				    (2932×3840) hébergé sur R2, remplace l'iframe embed pour
				    perf max sur la landing (pas de WebGL, pas de 3D à mount). */}
				{/* Mobile : hauteur naturelle, collée au bord gauche viewport
				    (calc(100vw) au lieu de calc(100%+220px) qui laissait une
				    zone noire). Desktop : conserve le débord de -220px. */}
				<div
					ref={mediaRef}
					className="relative z-0 w-full h-[560px] sm:h-[720px] overflow-hidden flex items-center justify-center sm:block sm:overflow-visible"
				>
					{everInView && (
						<video
							src="https://memselon-media.memselon.workers.dev/users/9ee54364-d2bf-472f-8273-6cbd2b8592be/hosted-videos/4eca75e8-fb7f-405e-9b51-c127c6842255.mp4"
							autoPlay
							muted
							loop
							playsInline
							preload="metadata"
							onLoadedData={(e) => e.currentTarget.classList.add('is-loaded')}
							/* Mobile : hauteur du container, contenue et centrée (pas de
							   bande noire). Desktop (lg+) : positionnement custom demandé
							   — 1400px de large, décalée left 17% / top -12%, height 130%,
							   z-0 (le titre Exports passe au-dessus en z-2). */
							className="absolute inset-0 w-full h-full object-cover object-left scale-[0.9] origin-left z-0 sm:inset-auto sm:left-0 sm:top-[-12%] sm:w-[1400px] sm:h-[130%] sm:scale-100 sm:origin-center sm:object-contain sm:object-left pointer-events-none opacity-0 transition-opacity duration-700 ease-out [&.is-loaded]:opacity-100"
						/>
					)}
				</div>

				{/* Stats à droite */}
				<div data-reveal className="reveal-up flex flex-col gap-10 px-6 md:px-16 lg:px-0 pb-20 lg:pb-0">
					<div>
						<div className="text-sm text-white/60 mb-1">Photo export up to</div>
						<div className="text-4xl font-medium text-[#e8702a] tracking-tight">4K</div>
						<div className="text-sm text-white/60 mt-1">PNG with transparency — WebP coming</div>
					</div>
					<div>
						<div className="text-sm text-white/60 mb-1">Video export</div>
						<div className="text-4xl font-medium text-[#e8702a] tracking-tight">MP4 4K</div>
						<div className="text-sm text-white/60 mt-1">high-res H.264, editable background color, rendered offline in your browser</div>
					</div>
					<div>
						<div className="text-sm text-white/60 mb-1">Or skip exports entirely</div>
						<div className="text-2xl font-medium text-white tracking-tight">Live 3D embed</div>
						<div className="text-sm text-white/60 mt-1">the real scene, interactive, on your published Framer site</div>
					</div>
				</div>
			</div>
		</section>
	)
}

// Miroir EXACT du catalogue du plugin (table Supabase `devices`, 17/07) :
// 7 devices. Photos = cartes officielles (device-models/<id>/card.jpg).
const DEVICES = [
	{ name: 'iPhone 17 Pro',    img: '/cards/iphone17pro-apple.png' },
	{ name: 'iPhone Air',       img: '/cards/iphoneAir-apple.png' },
	{ name: 'iPad Pro',         img: '/cards/ipad.png' },
	{ name: 'MacBook Pro 14"',  img: '/cards/macbookPro.png' },
	{ name: 'iMac',             img: '/cards/imac.png' },
	{ name: 'Studio Display',   img: '/cards/appleProDisplayXDR.png' },
	{ name: 'Apple Watch Ultra',img: '/cards/appleWatchUltra.png' },
]

// Feature grid — cards texte seulement (les vidéos mockups ont été
// retirées 24/07, remplacées par des cards descriptives + kicker orange).
const FEATURES = [
	{ title: 'Follow cursor',   desc: 'The device tracks the visitor’s mouse on your published landing. Page-wide, spring-smoothed.' },
	{ title: 'Orbit camera',    desc: 'Free or locked orbit with adjustable speed. Pose the exact angle, or let it drift.' },
	{ title: 'Float',           desc: 'Slow weightless hover — perfect for hero sections that need to breathe.' },
	{ title: 'Live 3D embed',   desc: 'A Framer code component renders the real scene — interactive — on your published site. No export at all.' },
	{ title: 'Video screens',   desc: 'Drop an MP4 and the device plays it on screen, looped, synced with your camera motion.' },
	{ title: 'Scroll zoom',     desc: 'The device gently zooms as the visitor scrolls the page — hero to features handoff, done.' },
]

const COMPARE = [
	{ feature: 'Lives inside Framer',                 lithos: true,  rotato: false, smart: false, native: true  },
	{ feature: '3D — real-time, orbit camera',        lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: 'Video / animated screens',            lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: '4K transparent export',               lithos: true,  rotato: true,  smart: false, native: false },
	{ feature: 'Embed live 3D scene on published site',lithos: true,  rotato: false, smart: false, native: false },
	{ feature: 'No subscription lock-out on landing',  lithos: 'Orbit', rotato: '—', smart: '—',   native: '—'   },
	{ feature: 'Updates automatically when design changes', lithos: true,  rotato: false, smart: false, native: true },
]

// Grille canonique — Notion « Launch Kit » (17/07/2026) :
// Ground $9.99 · Float $29 · Orbit $39, mensuel USD, pas de free plan,
// PAS de refund (cf. terms). Les limites (pas de 3D sur Ground, 3D
// iPhone-only sur Float) sont affichées AVANT l'achat — consigne Merve.
const PLANS = [
	{
		name: 'Ground',
		blurb: 'For static shots + looping video mockups.',
		monthly: '9.99',
		cta: 'Go Ground',
		highlight: false,
		bullets: [
			'All 7 Apple devices',
			'Photo mode — 1080p PNG export, no watermark',
			'Video mode — local MP4 download with custom background',
			'Video hosting on Mockiosa — optimized for Framer',
			'Light intensity, screen positioning, zoom & pan',
			'Drop shadow + shadow distance',
			'Unlimited photo exports',
			'1 GB cloud storage',
		],
	},
	{
		name: 'Float',
		blurb: 'For motion. Real 3D.',
		monthly: '29',
		cta: 'Go Float',
		highlight: true,
		bullets: [
			'Everything in Ground',
			'Real-time 3D + all animations',
			'Grab & rotate, auto-rotate, follow-cursor, float, scroll zoom',
			'Custom animation speed',
			'4K PNG export with transparency',
			'Unlimited exports',
			'3D scenes on iPhone only (for now)',
			'2 GB cloud storage',
		],
	},
	{
		name: 'Orbit',
		blurb: 'Full access. Everything, everywhere.',
		monthly: '39',
		cta: 'Go Orbit',
		highlight: false,
		bullets: [
			'Everything in Float',
			'3D scenes on every device (not just iPhone)',
			'Live 3D embed on your published Framer site',
			'Capture your live website onto the device screen',
			'10 GB cloud storage',
		],
	},
]

// Coming soon — features déjà câblées côté UI (paywall preview) mais pas
// encore expédiées. On les listes AVANT achat pour que l'user sache ce
// qu'il achète maintenant et ce qui arrive « for free » sur son plan.
const COMING_SOON = [
	{
		title: 'Generated 3D environments',
		desc: 'Drop your mockup into a real scene — desks, studios, cafes — generated on demand.',
		when: 'Orbit',
	},
	{
		title: 'Interactive website on the screen',
		desc: 'Pin your live, scrollable website straight on the device screen. Not a screenshot — the real page.',
		when: 'Orbit',
	},
	{
		title: 'Appear animations',
		desc: 'Preset entrance animations + custom timeline (start/end points, replay). Pose the arrival of your device.',
		when: 'Float · Orbit',
	},
	{
		title: 'Batch export',
		desc: 'Queue a scene across 7 devices at once — one click, all your marketing shots ready.',
		when: 'Orbit',
	},
]

// FAQ — alignée sur le Notion « Launch Kit » (section 7, réponses
// standard) + 2 questions techniques complémentaires (embed, OS).
// Liste devices harmonisée sur les 7 du catalogue réel.
const FAQ = [
	{
		q: 'Is it free to try?',
		a: 'Yes — the free tool at /free lets you drop your own screenshots onto real 3D Apple devices right in the browser: orbit them, recolor them, see exactly what you’ll ship. No signup. Then every plan is monthly — cancel anytime from the Stripe portal, no lock-in.',
	},
	{
		q: 'What’s free and what’s in the plugin?',
		a: '/free is for testing — drop a screenshot on a device and look around. Everything you actually ship happens in the Framer plugin: pose and animate the scene, export a 4K PNG or an MP4, or embed the live 3D on your published site.',
	},
	{
		q: 'Why not just use a free mockup tool?',
		a: 'Free tools hand you a flat PNG. Mockiosa is real 3D that lives in your Framer canvas and on your published site — change your design and the mockup updates. No export, no re-import, ever.',
	},
	{
		q: 'What devices are available?',
		a: 'iPhone 17 Pro, iPhone Air, iPad Pro, MacBook Pro 14", iMac, Studio Display and Apple Watch Ultra — with more on the way.',
	},
	{
		q: 'Can I put a video on the screen?',
		a: 'Yes. Drop an MP4 or MOV and it plays on the device screen, looped and synced with the 3D motion. Mockiosa hosts the video for you, so your Framer site stays light instead of carrying the heavy file.',
	},
	{
		q: 'How does the live 3D embed work?',
		a: 'Orbit users get a Framer code component to drop on the canvas. It renders your saved 3D scene on the published site and re-checks the subscription on each mount (cached 30 minutes). If the plan lapses, it falls back to a watermarked PNG.',
	},
	{
		q: 'Won’t a 3D embed kill my page speed?',
		a: 'That’s the part we’re most proud of: instant poster image, lazy 3D loading, adaptive quality per device and connection. Your Lighthouse score survives — that’s the whole point.',
	},
	{
		q: 'Can I use the mockups commercially?',
		a: 'Yes, on every paid plan.',
	},
	{
		q: 'Do I need Blender or After Effects?',
		a: 'No — that’s the whole point. Mockiosa is real-time 3D right inside Framer: pose the device, add motion, export in a couple of clicks. No Blender, no After Effects, no Rotato, no render farm.',
	},
	{
		q: 'What does the name mean?',
		a: 'A wink to levitation — our mockups float. A distant cousin of Wingardium Leviosa, except this one only works on your electronics.',
	},
]

export default function LandingSections() {
	const containerRef = useScrollReveal()
	// FAQ en accordéon exclusif : ouvrir un bloc ferme le précédent.
	const [openFaq, setOpenFaq] = useState<number | null>(null)

	return (
		<div ref={containerRef} className="bg-[#0a0a0a] text-white overflow-hidden">
			{/* ════════════ Section 1 — Pitch ════════════ */}
			<section className="relative px-6 md:px-16 py-20 md:py-28 max-w-[1560px] mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div data-reveal className="reveal-up">
						<div className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-6 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The plugin
						</div>
						{/* Manifesto façon Dropshot : un seul paragraphe 20/28px,
						    hiérarchie par la couleur (blanc / blanc 45%), weight 400. */}
						<p className="text-xl sm:text-[28px] leading-[1.4] font-normal tracking-[-0.01em] m-0">
							<span className="text-white">Stop exporting. Start designing in 3D.</span>
							<br />
							<br />
							<span className="text-white/45">
								You design in Framer, then you open another tool — Rotato, Blender, After Effects.
								Re-import, re-export, every time the mockup changes. Mockiosa ends that loop: the
								device lives on your canvas, your screenshot is its screen, and the published landing
								renders the same 3D scene you just posed.
							</span>
							<br />
							<br />
							<span className="text-white">No Blender. No After Effects. All in Framer.</span>
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
							suppressHydrationWarning
							className="absolute inset-0 w-full h-full object-cover"
						/>
					</div>
				</div>
			</section>

			{/* ════════════ Section 1.5 — Take a closer look (interactif) ════════════ */}
			<CloserLook />

			{/* ════════════ Section 2 — Showcase devices ════════════ */}
			<section id="showcase" className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up flex items-end justify-between flex-wrap gap-6 mb-14">
						<div>
							<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
								<span className="w-8 h-px bg-[#e8702a]" />
								The library
							</div>
							<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
								<span className="text-white">Seven production-grade devices.</span>
								<br />
								<span className="text-white/45">Updated as Apple ships.</span>
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

			{/* ════════════ Section 4 — Features (grille texte 3 col, sans vidéos) ════════════ */}
			<section className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up mb-12 md:mb-14">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Features
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Built for motion.</span>
							<br />
							<span className="text-white/45">No Blender required.</span>
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
						{FEATURES.map((f, i) => (
							<div
								key={f.title}
								data-reveal
								className="reveal-up rounded-2xl p-6 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all"
								style={{ transitionDelay: `${(i % 3) * 60}ms` }}
							>
								<div className="text-base font-medium text-white mb-2">{f.title}</div>
								<p className="text-sm text-white/55 leading-relaxed m-0">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 4.2 — Inside the studio ════════════ */}
			<StudioFeatures />

			{/* ════════════ Section 4.5 — Exports (à la Apple) ════════════ */}
			<ExportFormatsSection />

			{/* ════════════ Section 5 — Comparison ════════════
			    Tableau volontairement plus étroit que les autres sections :
			    à 1560px les colonnes s'étalent et les ✓ flottent loin des
			    labels — 1024px garde les lignes lisibles. */}
			<section className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-5xl mx-auto">
					<div data-reveal className="reveal-up text-center mb-16">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The benchmark
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Why</span>{' '}
							<span className="text-white/45">Mockiosa.</span>
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

			{/* ════════════ Section 6 — Pricing ════════════
			    Comme le tableau comparatif : 1024px max — 3 cartes à 1560px
			    devenaient des paquebots illisibles. */}
			<section id="pricing" className="relative bg-[#0a0a0a] px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-5xl mx-auto">
					<div data-reveal className="reveal-up text-center mb-12">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Pricing
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Pay</span>{' '}
							<span className="text-white/45">what fits.</span>
						</h2>
						<p className="mt-6 text-base sm:text-lg text-white/65 max-w-xl mx-auto">
							Monthly plans, no lock-in. Cancel any time from the Stripe portal.
						</p>
					</div>

					{/* Offre de lancement — coupon Stripe Mockiosaaaaa (-30% sur 3 mois,
					    50 places). max_redemptions=50 côté Stripe : le code se
					    désactive tout seul une fois épuisé. */}
					<div
						data-reveal
						className="reveal-up max-w-2xl mx-auto -mt-2 mb-12 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-[#e8702a]/45 bg-gradient-to-r from-[#e8702a]/[0.14] to-[#e8702a]/[0.04] px-5 py-3.5 text-center"
					>
						<span className="text-sm sm:text-[15px] font-semibold text-white">
							🚀 Launch offer — 30% off your first 3 months
						</span>
						<span className="text-sm text-white/60">
							First 50 only · code{' '}
							<span className="font-mono font-semibold text-[#e8702a] bg-[#e8702a]/15 border border-[#e8702a]/30 rounded px-2 py-0.5">
								Mockiosaaaaa
							</span>
						</span>
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
								<div className="mb-2">
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-medium tracking-tight text-white">${(Number(p.monthly) * 0.7).toFixed(2)}</span>
										<span className="text-lg text-white/40 line-through">${p.monthly}</span>
										<span className="text-sm text-white/55">/month</span>
									</div>
									<div className="mt-1.5 text-xs font-medium text-[#e8702a]">−30% for your first 3 months</div>
									<div className="text-[11px] text-white/40">then ${p.monthly}/month</div>
								</div>
								<Link
									href={'/sign-up'}
									onClick={() => {
										try {
											;(window as any).gtag?.('event', 'cta_click', {location: 'pricing', label: p.name.toLowerCase()})
										} catch {}
									}}
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

			{/* ════════════ Section 6.5 — Coming soon (roadmap-as-value) ════════════
			    On liste les features déjà UI-visibles (paywall preview) mais pas
			    encore shippées, avec le plan sur lequel elles arriveront. Ça
			    rassure : ce que tu paies aujourd'hui grossit sans surcoût. */}
			<section className="relative bg-[#0a0a0a] px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-5xl mx-auto">
					<div data-reveal className="reveal-up text-center mb-14">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Coming soon
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Ship today,</span>{' '}
							<span className="text-white/45">grow tomorrow.</span>
						</h2>
						<p className="mt-6 text-base text-white/60 max-w-xl mx-auto">
							Your subscription unlocks everything below as it lands — no upgrade fee, no waiting
							for the next tier.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
						{COMING_SOON.map((c, i) => (
							<div
								key={c.title}
								data-reveal
								className="reveal-up rounded-2xl p-6 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all"
								style={{ transitionDelay: `${(i % 2) * 60}ms` }}
							>
								<div className="flex items-start justify-between gap-4 mb-2">
									<div className="text-base font-medium text-white">{c.title}</div>
									<div className="flex-shrink-0 text-[10px] font-mono uppercase tracking-[0.12em] text-[#e8702a] border border-[#e8702a]/40 rounded-full px-2.5 py-1">
										{c.when}
									</div>
								</div>
								<p className="text-sm text-white/55 leading-relaxed m-0">{c.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 7 — FAQ ════════════ */}
			<section id="docs" className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-5xl mx-auto">
					<div data-reveal className="reveal-up mb-14">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							Questions
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Answers,</span>{' '}
							<span className="text-white/45">before you ask.</span>
						</h2>
					</div>
					<div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
						{FAQ.map((item, i) => (
							<FaqRow
								key={item.q}
								q={item.q}
								a={item.a}
								open={openFaq === i}
								onToggle={() => setOpenFaq(openFaq === i ? null : i)}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 8 — Final CTA ════════════ */}
			<section className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07] overflow-hidden">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#e8702a]/[0.08] blur-3xl" />
				</div>
				<div data-reveal className="reveal-up relative max-w-[1560px] mx-auto text-center">
					{/* Hermione à la place de l'icône — on prononce bien le nom.
					    Clique dessus : Wingardium Leviosa 🪶 */}
					<HermioneEasterEgg />
					<h2 className="text-[34px] sm:text-5xl font-normal tracking-[-0.02em] leading-[1.05] m-0">
						It&apos;s <span className="font-playfair">Mockiosa</span>,{' '}
						<span className="text-white/45">not Mockiosaaaaaaa.</span>
					</h2>
					<p className="mt-8 text-base sm:text-lg text-white/65 max-w-xl mx-auto">
						The plugin is free to install — try it in demo mode, then go paid when you’re ready. Cancel anytime.
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
				{/* Footer en colonnes : marque à gauche, 4 colonnes de liens. */}
				<div className="max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
					<div>
						<div className="flex items-center gap-2 mb-3">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src="/feather-pen-white.svg" alt="Mockiosa" width="20" height="20" aria-hidden="true" />
							<span className="font-playfair text-xl">Mockiosa</span>
						</div>
						<p className="text-xs text-white/45 max-w-xs leading-relaxed mb-4">
							Build with 🫰 by{' '}
							<a href="https://x.com/memselon" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2 decoration-white/20 hover:decoration-white transition-colors">Memselon</a>
							{' & '}
							<a href="https://x.com/meiiyve" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2 decoration-white/20 hover:decoration-white transition-colors">May</a>
						</p>
						{/* Badge changelog déplacé depuis le hero — reste visible et
						    cliquable, mais laisse place à la pill « Featured on » en
						    haut de page (launch day). */}
						<Link
							href="/changelog"
							className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.1] px-3 py-1.5 text-[11px] text-white/70 hover:text-white hover:bg-white/[0.09] transition-colors"
						>
							<span className="font-mono text-[10px] tracking-[0.04em] text-white/45">v1.4</span>
							Device library
							<span className="text-white/40">→</span>
						</Link>
					</div>

					<nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-14 gap-y-3 text-xs" aria-label="Footer">
						{[
							{
								title: 'Product',
								links: [
									{ label: 'Devices', href: '#showcase' },
									{ label: 'Pricing', href: '#pricing' },
									{ label: 'Docs', href: '#docs' },
									{ label: 'Studio', href: '#live' },
								],
							},
							{
								title: 'Resources',
								links: [
									{ label: '3D Mockups', href: '/mockups' },
									{ label: 'Guides', href: '/guides' },
									{ label: 'Changelog', href: '/changelog' },
									{ label: 'Compare', href: '/compare' },
									{ label: 'Featured on', href: '/featured' },
								],
							},
							{
								title: 'Account',
								links: [
									{ label: 'Sign in', href: '/sign-in' },
									{ label: 'Sign up', href: '/sign-up' },
									{ label: 'Report a bug', href: '/report-bug' },
								],
							},
							{
								title: 'Legal',
								links: [
									{ label: 'Privacy', href: '/privacy' },
									{ label: 'Terms', href: '/terms' },
									{ label: 'hi@memselon.com', href: 'mailto:hi@memselon.com' },
								],
							},
						].map((col) => (
							<div key={col.title} className="flex flex-col gap-3">
								<div className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">{col.title}</div>
								{col.links.map((l) =>
									l.href.startsWith('#') || l.href.startsWith('mailto:') ? (
										<a key={l.label} href={l.href} className="text-white/60 hover:text-white transition-colors">
											{l.label}
										</a>
									) : (
										<Link key={l.label} href={l.href} className="text-white/60 hover:text-white transition-colors">
											{l.label}
										</Link>
									),
								)}
							</div>
						))}
					</nav>
				</div>
				{/* PH badge en mobile (fix 26/07) — desktop l'a déjà fixé bottom-right ;
				    ici c'est la version footer, visible uniquement sous sm. */}
				<div className="sm:hidden mt-8 flex justify-center">
					<PhNavBadge />
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

function FaqRow({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
	return (
		<div className="py-2" data-reveal style={{ /* reveal-up applied via JS */ }}>
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={open}
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
