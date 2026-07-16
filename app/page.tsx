'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Menu } from 'lucide-react'
import LandingSections from './components/LandingSections'

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
						<h1 className="text-white leading-[0.98]">
							<span
								className="block font-playfair italic font-normal text-4xl sm:text-6xl lg:text-7xl hero-anim hero-reveal"
								style={{ letterSpacing: '-0.045em', animationDelay: '0.15s' }}
							>
								Real 3D mockups,
							</span>
							<span
								className="block font-normal text-4xl sm:text-6xl lg:text-7xl hero-anim hero-reveal"
								style={{ letterSpacing: '-0.07em', animationDelay: '0.3s' }}
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
		</div>
	)
}
