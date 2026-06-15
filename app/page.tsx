'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import LandingSections from './components/LandingSections'

/**
 * Hero mockup cloud: iPhone centered, the rest fanned out on the sides.
 * Each one fades in with a staggered delay and tracks the cursor with a
 * per-mockup parallax weight (depth illusion). Drag is fully blocked so
 * the visitor can't pull a PNG off the page.
 */
/**
 * Hero mockup lineup — real saved 3D scenes embedded via the public
 * /embed/[id] route of framer-3d-mockup-embed.vercel.app. Each iframe
 * renders the GLB model with the default video playing on the screen
 * mesh, plus the Follow Cursor animation baked into the scene's saved
 * `animations` payload so it tilts toward the cursor as the user
 * hovers over it.
 *
 * Scene UUIDs are pre-seeded in Supabase (Framer 3D Mockups project,
 * mockups table, owner contact@memselon.com). Anyone can swap the
 * config (light, environment, animation knobs, screen video) by
 * opening that scene in the plugin and saving over it — the iframe
 * picks it up on next mount.
 */
/**
 * Hero lineup — one LIVE 3D scene at the center (iPhone 17 Pro)
 * surrounded by 5 still PNG captures of the other devices. All
 * transparent backgrounds, horizontally aligned, with a progressive
 * CSS `perspective + rotateY` that turns the outer devices toward
 * the center so the row reads as a 3D fan in real perspective.
 *
 * The PNGs come from /ren/ (pre-rendered hero shots in this repo).
 * The iframe pulls the seeded "Hero · iPhone 17 Pro" scene from
 * Supabase and forces transparent background via ?bg=transparent.
 */
const EMBED_HOST = 'https://framer-3d-mockup-embed.vercel.app'
const CENTERPIECE_ID = '2c4db93b-b197-4287-9113-58e68b5869b4'

type HeroSide = {
	src: string
	label: string
	size: number
	delay: number
	/** Negative degree on the left, positive on the right. */
	rotateY: number
}
const HERO_LEFT: HeroSide[] = [
	{ src: '/ren/watch.png',  label: 'Apple Watch Ultra', size: 260, delay: 0.55, rotateY: -38 },
	{ src: '/ren/tablet.png', label: 'iPad Pro',          size: 360, delay: 0.42, rotateY: -22 },
	{ src: '/ren/selfie.png', label: 'iPhone Air',        size: 400, delay: 0.32, rotateY: -10 },
]
const HERO_RIGHT: HeroSide[] = [
	{ src: '/ren/hand-phone.png', label: 'iPhone (model)',  size: 400, delay: 0.32, rotateY:  10 },
	{ src: '/ren/scholar.png',    label: 'Pro Display XDR', size: 360, delay: 0.42, rotateY:  22 },
]

function HeroMockups({cursorX, cursorY}: {cursorX: number; cursorY: number}) {
	const [vw, setVw] = useState(1280)
	const [vh, setVh] = useState(800)
	useEffect(() => {
		const onResize = () => {
			setVw(window.innerWidth)
			setVh(window.innerHeight)
		}
		onResize()
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])
	const cx = vw > 0 ? (cursorX - vw / 2) / (vw / 2) : 0
	const cy = vh > 0 ? (cursorY - vh / 2) / (vh / 2) : 0

	const SideImage = ({m, i, baseDelay}: {m: HeroSide; i: number; baseDelay: number}) => {
		const parallaxX = -cx * 24 * (Math.abs(m.rotateY) / 38)
		const parallaxY = cy * 14 * (Math.abs(m.rotateY) / 38)
		return (
			<div
				className="hero-mockup-anim relative flex items-center justify-center"
				style={{
					width: m.size,
					height: m.size,
					perspective: 900,
					animationDelay: `${baseDelay}s`,
				}}
			>
				<Image
					src={m.src}
					alt={m.label}
					width={m.size * 2}
					height={m.size * 2}
					draggable={false}
					onDragStart={(e) => e.preventDefault()}
					className="w-full h-full object-contain pointer-events-none select-none"
					style={{
						userSelect: 'none',
						WebkitUserDrag: 'none',
						transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotateY(${m.rotateY}deg)`,
						transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
						filter: 'drop-shadow(0 24px 28px rgba(0,0,0,0.45))',
					} as React.CSSProperties}
					priority={i === 1}
				/>
			</div>
		)
	}

	const centerParallaxX = -cx * 12
	const centerParallaxY = cy * 8

	return (
		<div
			className="absolute inset-0 z-40 flex items-center justify-center select-none px-4"
			aria-hidden="true"
		>
			<div
				className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6"
				style={{maxWidth: '100%'}}
			>
				{HERO_LEFT.map((m, i) => (
					<SideImage key={m.src} m={m} i={i} baseDelay={m.delay} />
				))}
				{/* Centerpiece — live 3D iframe, transparent background, no
				    rotation (perfectly head-on), drop-shadow for depth. */}
				<div
					className="hero-mockup-anim relative"
					style={{
						width: 620,
						height: 720,
						animationDelay: '0.25s',
						filter: 'drop-shadow(0 28px 40px rgba(0,0,0,0.55))',
						transform: `translate3d(${centerParallaxX}px, ${centerParallaxY}px, 0)`,
						transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
					}}
				>
					<iframe
						src={`${EMBED_HOST}/embed/${CENTERPIECE_ID}?zoom=1.6&showSignature=false&bg=transparent`}
						title="iPhone 17 Pro"
						loading="eager"
						sandbox="allow-scripts allow-same-origin"
						style={{
							width: '100%',
							height: '100%',
							border: 'none',
							background: 'transparent',
							display: 'block',
							colorScheme: 'normal',
						}}
					/>
				</div>
				{HERO_RIGHT.map((m, i) => (
					<SideImage key={m.src} m={m} i={i} baseDelay={m.delay} />
				))}
			</div>
		</div>
	)
}

const BG_IMAGE_1 =
	'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85'

const BG_IMAGE_2 =
	'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85'

const SPOTLIGHT_R = 260

/**
 * RevealLayer
 * Soft circular spotlight that uncovers the second image where the
 * cursor passes. Implementation: a hidden offscreen canvas is repainted
 * every frame with a radial gradient at (cursorX, cursorY); the
 * resulting bitmap is fed as a CSS mask-image to the second image div.
 */
function RevealLayer({
	image,
	cursorX,
	cursorY,
}: {
	image: string
	cursorX: number
	cursorY: number
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const revealRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const setSize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}
		setSize()
		window.addEventListener('resize', setSize)
		return () => window.removeEventListener('resize', setSize)
	}, [])

	useEffect(() => {
		const canvas = canvasRef.current
		const reveal = revealRef.current
		if (!canvas || !reveal) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
		grad.addColorStop(0, 'rgba(255,255,255,1)')
		grad.addColorStop(0.4, 'rgba(255,255,255,1)')
		grad.addColorStop(0.6, 'rgba(255,255,255,0.75)')
		grad.addColorStop(0.75, 'rgba(255,255,255,0.4)')
		grad.addColorStop(0.88, 'rgba(255,255,255,0.12)')
		grad.addColorStop(1, 'rgba(255,255,255,0)')

		ctx.fillStyle = grad
		ctx.beginPath()
		ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
		ctx.fill()

		const dataURL = canvas.toDataURL()
		reveal.style.maskImage = `url(${dataURL})`
		;(reveal.style as unknown as { webkitMaskImage: string }).webkitMaskImage = `url(${dataURL})`
		reveal.style.maskSize = '100% 100%'
		;(reveal.style as unknown as { webkitMaskSize: string }).webkitMaskSize = '100% 100%'
	}, [cursorX, cursorY])

	return (
		<>
			<canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
			<div
				ref={revealRef}
				className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
				style={{ backgroundImage: `url(${image})` }}
			/>
		</>
	)
}

/**
 * Lithos-style hero, brand-swapped for Memselon Mockup.
 * Wordmark, nav, and copy speak to the Framer 3D mockup plugin; the
 * technical structure (cursor-tracking spotlight reveal, radial
 * gradient mask, premium fade-up animations) matches the design brief
 * to the letter.
 */
export default function HomePage() {
	const mouse = useRef({ x: -999, y: -999 })
	const smooth = useRef({ x: -999, y: -999 })
	const rafRef = useRef<number | null>(null)
	const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			mouse.current.x = e.clientX
			mouse.current.y = e.clientY
		}
		window.addEventListener('mousemove', onMove)

		const tick = () => {
			smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
			smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
			setCursorPos({ x: smooth.current.x, y: smooth.current.y })
			rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)

		return () => {
			window.removeEventListener('mousemove', onMove)
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return (
		<div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
			{/* ───── Nav (fixed, over hero) ───── */}
			<nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
				{/* Left: logo + wordmark */}
				<Link href="/" className="flex items-center gap-2">
					<svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
						<path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
					</svg>
					<span className="text-white text-2xl font-playfair italic">Framer mockup</span>
				</Link>

				{/* Center pill — desktop only */}
				<div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
					<button className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium">
						Plugin
					</button>
					<a
						href="#showcase"
						className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
					>
						Showcase
					</a>
					<a
						href="#pricing"
						className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
					>
						Pricing
					</a>
					<a
						href="#docs"
						className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
					>
						Docs
					</a>
					<a
						href="#live"
						className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
					>
						Live demo
					</a>
				</div>

				{/* Right: Sign Up desktop / hamburger mobile */}
				<Link
					href="/sign-up"
					className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
				>
					Sign Up
				</Link>
				<button
					type="button"
					aria-label="Open menu"
					className="md:hidden p-2 text-white"
				>
					<Menu size={22} strokeWidth={1.75} />
				</button>
			</nav>

			{/* ───── Hero section ───── */}
			<section
				className="relative w-full overflow-hidden h-screen bg-black"
				style={{ height: '100dvh' }}
			>
				{/* BG image layers retired — solid black canvas so the device
				    lineup is the only visual focus. The cursor-reveal mask
				    + Higgs landscape photos are kept in source under a
				    `false &&` so they can be re-enabled later. */}
				{false && (
					<>
						<div
							className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
							style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
						/>
						<RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
					</>
				)}

				{/* Layer 2.5: mockup cloud (fade in + parallax follow cursor) */}
				<HeroMockups cursorX={cursorPos.x} cursorY={cursorPos.y} />

				{/* Layer 3: heading */}
				<div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
					<h1 className="text-white leading-[0.95]">
						<span
							className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
							style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
						>
							Layers hold
						</span>
						<span
							className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
							style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
						>
							tales of time
						</span>
					</h1>
				</div>

				{/* Layer 4: bottom-left paragraph */}
				<div
					className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
					style={{ animationDelay: '0.7s' }}
				>
					<p className="text-sm text-white/80 leading-relaxed">
						Every export captures a moment of design — from the silver shimmer of an iPhone Pro to
						the matte glass of a Pro Display, frozen at 4K, alive in 3D.
					</p>
				</div>

				{/* Layer 5: bottom-right block (paragraph + CTA) */}
				<div
					className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
					style={{ animationDelay: '0.85s' }}
				>
					<p className="text-xs sm:text-sm text-white/80 leading-relaxed">
						Our Framer plugin lets you drop a screenshot on any Apple device, orbit the camera, and
						export 4K — without leaving the canvas. No Blender. No Rotato.
					</p>
					<Link
						href="/sign-up"
						className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
					>
						Try in Framer
					</Link>
				</div>
			</section>

			{/* ───── All sections below the hero ───── */}
			<LandingSections />
		</div>
	)
}
