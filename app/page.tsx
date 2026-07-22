'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Menu } from 'lucide-react'
import LandingSections from './components/LandingSections'
import ProductHuntBanner from './components/ProductHuntBanner'

/**
 * Pill central de la nav — le highlight blanc GLISSE d'un onglet à
 * l'autre en spring (Motion layoutId) : au clic, et au scroll via un
 * scroll-spy sur les ancres de section. Après un clic, le spy est
 * suspendu ~900ms pour ne pas faire zigzaguer le pill pendant le
 * smooth-scroll à travers les sections intermédiaires.
 */
const NAV_ITEMS = [
	{ id: 'plugin', label: 'Plugin', href: '#' },
	{ id: 'live', label: 'Studio', href: '#live' },
	{ id: 'showcase', label: 'Showcase', href: '#showcase' },
	{ id: 'pricing', label: 'Pricing', href: '#pricing' },
	{ id: 'docs', label: 'Docs', href: '#docs' },
]
// Ordre DOM réel des sections (le spy prend la DERNIÈRE passée sous le seuil)
const SPY_ORDER = ['live', 'showcase', 'pricing', 'docs']

function NavCenter() {
	const [active, setActive] = useState('plugin')
	const clickedAt = useRef(0)

	useEffect(() => {
		const onScroll = () => {
			if (performance.now() - clickedAt.current < 900) return
			let current = 'plugin'
			for (const id of SPY_ORDER) {
				const el = document.getElementById(id)
				if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id
			}
			setActive(current)
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
			{NAV_ITEMS.map((item) => (
				<a
					key={item.id}
					href={item.href}
					onClick={(e) => {
						clickedAt.current = performance.now()
						setActive(item.id)
						if (item.id === 'plugin') {
							e.preventDefault()
							window.scrollTo({ top: 0, behavior: 'smooth' })
						}
					}}
					className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
						active === item.id ? 'text-gray-900' : 'text-white/80 hover:text-white'
					}`}
				>
					{active === item.id && (
						<motion.span
							layoutId="nav-pill"
							transition={{ type: 'spring', stiffness: 400, damping: 34 }}
							className="absolute inset-0 rounded-full bg-white"
						/>
					)}
					<span className="relative z-10">{item.label}</span>
				</a>
			))}
		</div>
	)
}

// 3D playground loaded client-side only — the hero text paints first
// (LCP), the model fades in when rendered.
const HeroPlayground = dynamic(() => import('./components/HeroPlayground'), {
	ssr: false,
	loading: () => <div className="w-full h-full" aria-hidden="true" />,
})

/**
 * Hero — left: title + pitch + CTA. Right: live interactive 3D
 * playground (switch device, pick a color, drop your own content).
 * The visitor understands the product in one second, then scrolls
 * into the landing sections.
 */
export default function HomePage() {
	return (
		<div className="min-h-screen bg-white tracking-[-0.02em]">
			{/* ───── Nav (fixed, over hero) ───── */}
			<nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 max-sm:bg-gradient-to-b max-sm:from-black max-sm:via-black/80 max-sm:to-transparent max-sm:pb-24 pointer-events-none [&>*]:pointer-events-auto">
				<Link href="/" className="flex items-center gap-2">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
					</svg>
					<span className="text-white text-2xl font-playfair italic">Mockiosa</span>
				</Link>

				{/* Center pill — desktop only, highlight animé (spring) */}
				<NavCenter />

				<Link
					href="/sign-up"
					className="cta-skeu-light hidden md:block text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-[1.03]"
				>
					Sign Up
				</Link>
				<button type="button" aria-label="Open menu" className="md:hidden p-2 text-white">
					<Menu size={22} strokeWidth={1.75} />
				</button>
			</nav>

			{/* ───── Hero section ───── */}
			<section
				className="relative w-full overflow-hidden bg-black"
				style={{ minHeight: '100dvh' }}
				aria-label="Interactive 3D mockup demo"
			>
				<div className="relative z-10 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-0 items-center px-6 md:px-16 pt-28 lg:pt-20 pb-8 min-h-[100dvh]">
					{/* Left: title + pitch + CTA */}
					<div className="flex flex-col items-start gap-6 max-w-xl">
						{/* Badge version → changelog (pattern Dropshot : montre que le produit vit) */}
						<Link
							href="/changelog"
							className="hero-anim hero-fade inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.1] px-4 py-2 text-[13px] text-white/80 hover:bg-white/[0.09] transition-colors"
							style={{ animationDelay: '0.05s' }}
						>
							<span className="font-mono text-[11px] tracking-[0.04em] text-white/50">v1.4</span>
							White full-height device cards
							<span className="text-white/45">→</span>
						</Link>
						<h1 className="text-white leading-[1.1] m-0">
							<span
								className="block font-normal text-[34px] sm:text-5xl hero-anim hero-reveal"
								style={{ letterSpacing: '-0.01em', animationDelay: '0.15s' }}
							>
								Real 3D mockups,
							</span>
							<span
								className="block font-normal text-[34px] sm:text-5xl text-white/45 hero-anim hero-reveal"
								style={{ letterSpacing: '-0.01em', animationDelay: '0.3s' }}
							>
								live in Framer.
							</span>
						</h1>
						<p
							className="text-sm sm:text-base text-white/75 leading-relaxed max-w-md hero-anim hero-fade"
							style={{ animationDelay: '0.5s' }}
						>
							Drop a screenshot or a video on a real 3D Apple device — iPhone 17 Pro, iPad Pro,
							Apple Watch Ultra, iMac — orbit the camera, pick a color, and publish it live on
							your Framer site or export in 4K. No Blender. No Rotato. No After Effects.
						</p>
						<div className="flex items-center gap-4 hero-anim hero-fade" style={{ animationDelay: '0.65s' }}>
							<Link
								href="/sign-up"
								className="cta-skeu text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03]"
							>
								Try in Framer — free
							</Link>
							<a
								href="#pricing"
								className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
							>
								See pricing
							</a>
						</div>
						<p className="text-xs text-white/40 hero-anim hero-fade" style={{ animationDelay: '0.8s' }}>
							Try it right here → switch the device, pick a color, drop your own content.
						</p>
					</div>

					{/* Right: interactive playground */}
					<div className="relative h-[52vh] sm:h-[60vh] lg:h-[78vh] hero-anim hero-fade" style={{ animationDelay: '0.35s' }}>
						<HeroPlayground />
					</div>
				</div>
			</section>

			{/* ───── All sections below the hero ───── */}
			<LandingSections />

			{/* Lancement Product Hunt — carte dismissible en bas à droite */}
			<ProductHuntBanner />
		</div>
	)
}
