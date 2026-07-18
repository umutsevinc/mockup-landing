'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import StudioFeatures from './StudioFeatures'
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
								<svg width={f.size} height={f.size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
									<path d="M16 8 2 22" />
									<path d="M17.5 15H9" />
								</svg>
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
function DemoVideo({ src, aspect, hint }: { src: string; aspect: string; hint?: string }) {
	const [missing, setMissing] = useState(false)
	return (
		<div
			className="relative rounded-[14px] overflow-hidden bg-[#111] border border-white/[0.06]"
			style={{ aspectRatio: aspect }}
		>
			{missing ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
					<div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">Video placeholder</div>
					<div className="text-xs font-mono text-[#e8702a]">{src}</div>
					{hint ? <div className="text-[11px] text-white/30 leading-relaxed max-w-[260px]">{hint}</div> : null}
				</div>
			) : (
				<video
					src={src}
					autoPlay
					muted
					loop
					playsInline
					onError={() => setMissing(true)}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			)}
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
						className="snap-start relative flex-shrink-0 w-[290px] sm:w-[340px] h-[440px] rounded-3xl overflow-hidden bg-white border border-white/[0.07] transition-transform hover:scale-[1.01]"
					>
						{/* Images rognées au contenu (plus de marges blanches intégrées) :
						    pleine largeur de carte, ratio préservé, collées au bord bas. */}
						{d.img ? (
							<Image
								src={d.img}
								alt={d.name}
								width={800}
								height={800}
								quality={95}
								className="absolute bottom-0 left-0 w-full h-auto"
								sizes="(max-width: 640px) 290px, 340px"
							/>
						) : (
							<div className="absolute inset-0 bg-white flex items-center justify-center">
								<div className="text-4xl font-semibold text-neutral-900/10">{d.name.split(' ')[0]}</div>
							</div>
						)}
						{/* Titre superposé — texte sombre directement sur le fond blanc
						    de la photo. Plus de mention de plan : dans la grille finale
						    (Ground/Float/Orbit) tous les devices sont dans tous les plans. */}
						<div className="absolute top-0 left-0 right-0 p-6 pb-10">
							<div className="text-xl font-semibold leading-tight text-neutral-900">{d.name}</div>
							<div className="mt-1 text-sm text-neutral-500">Production-grade GLB</div>
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
			<div className="max-w-[1560px] mx-auto px-6 md:px-16 pt-20 md:pt-28">
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
				<div ref={mediaRef} className="relative h-[420px] sm:h-[560px] lg:h-[640px] overflow-hidden mr-6 md:mr-16 lg:mx-0">
					{/* Poster instantané — capture LOCALE de la scène (18 Ko webp),
					    eager + fetchPriority high. Dimensionné par la HAUTEUR
					    uniquement (comme la caméra 3D de l'iframe : fov vertical →
					    la scène remplit la hauteur), centré sur le même point que
					    l'iframe (x=20%, y=50%) — sinon object-contain faisait
					    varier la taille du device selon le ratio du viewport et le
					    poster ne matchait plus la scène live au swap. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/exports-poster.webp"
						alt="Video 3D mockup"
						loading="eager"
						fetchPriority="high"
						className="absolute pointer-events-none"
						style={{ height: '280%', width: 'auto', maxWidth: 'none', left: '20%', top: '50%', transform: 'translate(-50%, -50%)' }}
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
						<div className="text-4xl font-medium text-[#e8702a] tracking-tight">4K</div>
						<div className="text-sm text-white/60 mt-1">PNG with transparency — WebP coming</div>
					</div>
					<div>
						<div className="text-sm text-white/60 mb-1">Video export</div>
						<div className="text-4xl font-medium text-[#e8702a] tracking-tight">4K&nbsp;60s</div>
						<div className="text-sm text-white/60 mt-1">transparent WebM, rendered offline in your browser</div>
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
	{ name: 'iPhone 17 Pro',    img: '/cards/iphone17pro-apple.webp' },
	{ name: 'iPhone Air',       img: '/cards/iphoneAir-apple.webp' },
	{ name: 'iPad Pro',         img: '/cards/ipadPro-apple.webp' },
	{ name: 'MacBook Pro 14"',  img: '/cards/macbookPro-apple.webp' },
	{ name: 'iMac',             img: '/cards/imac-apple.webp' },
	{ name: 'Studio Display',   img: '/cards/appleProDisplayXDR.jpg' },
	{ name: 'Apple Watch Ultra',img: '/cards/appleWatchUltra.jpg' },
]

// Pattern Dropshot "Drop. Tweak. Shot." — 3 vidéos verticales 3:4,
// numéro + label + une phrase. Vidéos à enregistrer (voir /public/videos/README.md).
const STEPS = [
	{
		n: '1',
		label: 'Drop',
		src: '/videos/step-1-drop.mp4',
		desc: 'Paste any image or video on the canvas. The plugin auto-fits the device screen — portrait, landscape, even Lottie.',
		hint: 'Screen recording verticale : glisser un screenshot sur le canvas du plugin, auto-fit sur l’écran de l’iPhone.',
	},
	{
		n: '2',
		label: 'Pose',
		src: '/videos/step-2-pose.mp4',
		desc: 'Orbit the camera, tilt the device, swap the HDRI, dial the light. Everything previews live in Framer.',
		hint: 'Screen recording verticale : orbite caméra + changement de couleur + HDRI dans le panneau du plugin.',
	},
	{
		n: '3',
		label: 'Ship',
		src: '/videos/step-3-ship.mp4',
		desc: 'Export 4K PNG or video — or paste the code component that renders the live scene on your landing.',
		hint: 'Screen recording verticale : clic export 4K, puis le composant embed collé sur une page Framer publiée.',
	},
]

// Pattern Dropshot "Features" — grille 2 colonnes, une vidéo 4:3 par
// fonctionnalité, titre 16px + description dessous.
const FEATURES = [
	{
		src: '/videos/feature-follow-cursor.mp4',
		title: 'Follow cursor',
		desc: 'The device tracks the visitor’s mouse on your published landing. Page-wide, spring-smoothed.',
		hint: 'Capture 4:3 : le device qui suit la souris sur une landing publiée.',
	},
	{
		src: '/videos/feature-orbit.mp4',
		title: 'Orbit camera',
		desc: 'Free or locked orbit with adjustable speed. Pose the exact angle, or let it drift.',
		hint: 'Capture 4:3 : orbite libre autour de l’iPhone puis orbite auto lente.',
	},
	{
		src: '/videos/feature-float.mp4',
		title: 'Float',
		desc: 'Slow weightless hover — perfect for hero sections that need to breathe.',
		hint: 'Capture 4:3 : device en lévitation lente sur fond sombre.',
	},
	{
		src: '/videos/feature-live-embed.mp4',
		title: 'Live 3D embed',
		desc: 'A Framer code component renders the real scene — interactive — on your published site. No export at all.',
		hint: 'Capture 4:3 : copier le composant embed, le coller sur un site publié, interagir avec la scène.',
	},
	{
		src: '/videos/feature-video-screens.mp4',
		title: 'Video screens',
		desc: 'Drop an MP4 and the device plays it on screen, looped, synced with your camera motion.',
		hint: 'Capture 4:3 : une vidéo (le chat samurai) qui joue sur l’écran du device pendant une orbite.',
	},
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
		blurb: 'For static shots.',
		monthly: '9.99',
		cta: 'Go Ground',
		highlight: false,
		bullets: [
			'All devices',
			'Photo & video screen content',
			'Light intensity on your content',
			'Screen positioning, zoom & pan',
			'Drop shadow + shadow distance',
			'1 GB storage',
			'No 3D animations on this plan',
		],
	},
	{
		name: 'Float',
		blurb: 'For motion.',
		monthly: '29',
		cta: 'Go Float',
		highlight: true,
		bullets: [
			'Everything in Ground',
			'Real-time 3D + all animations',
			'Grab & rotate, auto-rotate, follow-cursor, float, scroll zoom',
			'Custom animation speed',
			'3D animations on iPhone only (for now)',
			'2 GB storage',
		],
	},
	{
		name: 'Orbit',
		blurb: 'Full access.',
		monthly: '39',
		cta: 'Go Orbit',
		highlight: false,
		bullets: [
			'Everything in Float',
			'All 3D animations on every device',
			'10 GB storage',
		],
	},
]

// FAQ — alignée sur le Notion « Launch Kit » (section 7, réponses
// standard) + 2 questions techniques complémentaires (embed, OS).
// Liste devices harmonisée sur les 7 du catalogue réel.
const FAQ = [
	{
		q: 'Why no free plan / free trial?',
		a: 'We’d rather let you try before you buy: there’s a free tool at /free to get a taste, and every plan is monthly — cancel anytime, no lock-in.',
	},
	{
		q: 'Why not just use a free mockup tool?',
		a: 'Free tools export files. Mockiosa lives in your Framer canvas and on your published site — change your design, your mockup updates. No export, no re-import, ever.',
	},
	{
		q: 'Won’t a 3D embed kill my page speed?',
		a: 'That’s the part we’re most proud of: instant poster image, lazy 3D loading, adaptive quality per device and connection. Your Lighthouse score survives — that’s the whole point.',
	},
	{
		q: 'What devices are available?',
		a: 'iPhone 17 Pro, iPhone Air, iPad Pro, MacBook Pro 14", iMac, Studio Display and Apple Watch Ultra — with more on the way.',
	},
	{
		q: 'How does the live 3D embed work?',
		a: 'Orbit users get a Framer code component that they drop on the canvas. It renders the saved scene on the published landing, and checks the owner’s subscription on every mount (cached 30 minutes). If the subscription lapses, the component falls back to a watermarked PNG.',
	},
	{
		q: 'Can I use the mockups commercially?',
		a: 'Yes, on every paid plan.',
	},
	{
		q: 'What about Windows / Linux?',
		a: 'Mockiosa runs in the browser via WebGL — anywhere Framer runs, the plugin runs. Mac, Windows, Linux, ChromeOS.',
	},
	{
		q: 'What does the name mean?',
		a: 'A wink to levitation — our mockups float.',
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

			{/* ════════════ Section 3 — How it works (pattern Dropshot :
			    "Drop. Pose. Ship." + 3 vidéos verticales 3:4) ════════════ */}
			<section className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
					<div data-reveal className="reveal-up mb-12 md:mb-14">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							How it works
						</div>
						<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
							<span className="text-white">Drop.</span>{' '}
							<span className="text-white/45">Pose.</span>{' '}
							<span className="text-white">Ship.</span>
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
						{STEPS.map((s, i) => (
							<div
								key={s.n}
								data-reveal
								className="reveal-up"
								style={{ transitionDelay: `${i * 100}ms` }}
							>
								<DemoVideo src={s.src} aspect="3/4" hint={s.hint} />
								<div className="mt-4 flex items-baseline gap-2.5">
									<span className="text-[13px] font-semibold text-[#e8702a]">{s.n}</span>
									<span className="text-xl font-medium tracking-[-0.01em] text-white">{s.label}</span>
								</div>
								<p className="mt-1.5 text-base text-white/35 leading-[1.45] m-0">{s.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 4 — Features (pattern Dropshot :
			    grille 2 col, une vidéo 4:3 par fonctionnalité) ════════════ */}
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-6 md:gap-y-14">
						{FEATURES.map((f, i) => (
							<div
								key={f.title}
								data-reveal
								className="reveal-up"
								style={{ transitionDelay: `${(i % 2) * 80}ms` }}
							>
								<DemoVideo src={f.src} aspect="4/3" hint={f.hint} />
								<div className="mt-3.5">
									<div className="text-base font-normal text-white mb-1">{f.title}</div>
									<div className="text-base text-white/35 leading-[1.45]">{f.desc}</div>
								</div>
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
									<span className="text-4xl font-medium tracking-tight">${p.monthly}</span>
									<span className="text-sm text-white/55">/month</span>
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
			<section id="docs" className="relative px-6 md:px-16 py-20 md:py-28 border-t border-white/[0.07]">
				<div className="max-w-[1560px] mx-auto">
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
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
							</svg>
							<span className="font-playfair text-xl">Mockiosa</span>
						</div>
						<p className="text-xs text-white/45 max-w-xs leading-relaxed">
							Real-time 3D mockups for Framer. Crafted by a human, one cloud at a time ☁
						</p>
					</div>

					<nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-14 gap-y-3 text-xs" aria-label="Footer">
						{[
							{
								title: 'Product',
								links: [
									{ label: 'Devices', href: '#showcase' },
									{ label: 'Pricing', href: '#pricing' },
									{ label: 'Docs', href: '#docs' },
									{ label: 'Live demo', href: '#live' },
								],
							},
							{
								title: 'Resources',
								links: [
									{ label: '3D Mockups', href: '/mockups' },
									{ label: 'Guides', href: '/guides' },
									{ label: 'Changelog', href: '/changelog' },
									{ label: 'Compare', href: '/compare' },
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
