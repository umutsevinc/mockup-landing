'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Camera, Download, Sparkles, Check, MousePointer2, RotateCw, Wind, Zap } from 'lucide-react'

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

const DEVICES = [
	{ name: 'iPhone 17 Pro',        tier: 'Pro',    img: '/ren/hand-phone.png' },
	{ name: 'iPhone Air',           tier: 'Pro',    img: '/ren/selfie.png' },
	{ name: 'iPhone 16e',           tier: 'Pro' },
	{ name: 'iPad',                 tier: 'Free',   img: '/ren/tablet.png' },
	{ name: 'MacBook Pro 16"',      tier: 'Pro' },
	{ name: 'iMac',                 tier: 'Pro' },
	{ name: 'Apple Pro Display XDR',tier: 'Ultra',  img: '/ren/scholar.png' },
	{ name: 'Apple Watch Ultra',    tier: 'Pro',    img: '/ren/watch.png' },
	{ name: 'Samsung Galaxy S25',   tier: 'Pro' },
	{ name: 'Macintosh 1984',       tier: 'Free' },
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
	{ feature: 'No subscription lock-out on landing',  lithos: 'Ultra', rotato: '—', smart: '—',   native: '—'   },
	{ feature: 'Updates automatically when design changes', lithos: true,  rotato: false, smart: false, native: true },
]

const PLANS = [
	{
		name: 'Trial',
		blurb: 'Try Ultra for 7 days. No card required.',
		monthly: '0',
		yearly: '0',
		cta: 'Start free trial',
		highlight: false,
		isTrial: true,
		bullets: [
			'7 days of full Ultra access',
			'All 10 devices, 4K exports',
			'All animations + live 3D embed',
			'Cancel anytime — no card asked',
		],
	},
	{
		name: 'Pro',
		blurb: 'For freelance designers.',
		monthly: '9',
		yearly: '79',
		cta: 'Go Pro',
		highlight: true,
		bullets: [
			'50 exports / month, 1080p',
			'No watermark',
			'All 10 devices',
			'Orbit camera',
			'Save scenes (cloud sync)',
		],
	},
	{
		name: 'Ultra',
		blurb: 'For studios + agencies.',
		monthly: '29',
		yearly: '249',
		cta: 'Go Ultra',
		highlight: false,
		bullets: [
			'Unlimited exports, 4K',
			'Transparent PNG + MP4 video',
			'All animations (follow cursor, orbit, float, scroll)',
			'Live 3D Framer component (embed on landings)',
			'Lottie screens',
			'Priority support',
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
		a: 'Ultra users get a Framer code component that they drop on the canvas. It renders the saved scene on the published landing, and checks the owner’s subscription on every mount (cached 30 minutes). If the subscription lapses, the component falls back to a watermarked PNG.',
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
		a: 'Memselon Mockup runs in the browser via WebGL — anywhere Framer runs, the plugin runs. Mac, Windows, Linux, ChromeOS.',
	},
	{
		q: 'Can I cancel anytime?',
		a: 'Yes — manage your subscription from the Stripe customer portal. Founder Lifetime is one-time, no recurring charge.',
	},
]

export default function LandingSections() {
	const containerRef = useScrollReveal()
	const [yearly, setYearly] = useState(false)

	return (
		<div ref={containerRef} className="bg-[#0a0a0a] text-white overflow-hidden">
			{/* ════════════ Section 1 — Pitch ════════════ */}
			<section className="relative px-6 sm:px-10 md:px-16 py-32 md:py-48 max-w-7xl mx-auto">
				<div data-reveal className="reveal-up max-w-4xl">
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
						You design in Framer. Then you open Rotato. You re-import. You re-export. Every time the
						mockup changes, you do it again. Memselon Mockup ends that loop — the device lives on your
						canvas, your screenshot is its screen, and the published landing renders the same 3D scene
						you just posed.
					</p>
				</div>
			</section>

			{/* ════════════ Section 2 — Showcase devices ════════════ */}
			<section id="showcase" className="relative px-6 sm:px-10 md:px-16 pt-20 pb-32 border-t border-white/[0.07]">
				<div className="max-w-7xl mx-auto">
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

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
						{DEVICES.map((d, i) => (
							<div
								key={d.name}
								data-reveal
								className="reveal-up relative aspect-[3/4] rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden group transition-all hover:bg-white/[0.05] hover:border-white/[0.12]"
								style={{ transitionDelay: `${i * 30}ms` }}
							>
								{d.img ? (
									<Image
										src={d.img}
										alt={d.name}
										fill
										className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
										sizes="(max-width: 768px) 50vw, 25vw"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.08]">
										<div className="text-3xl text-white/20 font-playfair italic">{d.name.split(' ')[0]}</div>
									</div>
								)}
								<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
									<div className="flex items-end justify-between">
										<div className="text-sm font-medium leading-tight">{d.name}</div>
										<div
											className={
												'text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ' +
												(d.tier === 'Free'
													? 'bg-white/15 text-white/80'
													: d.tier === 'Pro'
													? 'bg-[#e8702a]/20 text-[#e8702a]'
													: 'bg-white text-black')
											}
										>
											{d.tier}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 3 — How it works ════════════ */}
			<section className="relative bg-[#f5f4ef] text-[#0a0a0a] px-6 sm:px-10 md:px-16 py-32 md:py-40">
				<div className="max-w-7xl mx-auto">
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
			<section className="relative px-6 sm:px-10 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-7xl mx-auto">
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

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{ANIMATIONS.map((a, i) => (
							<div
								key={a.title}
								data-reveal
								className="reveal-up p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
								style={{ transitionDelay: `${i * 60}ms` }}
							>
								<div className="w-10 h-10 rounded-xl bg-[#e8702a]/15 text-[#e8702a] flex items-center justify-center mb-5">
									{a.icon}
								</div>
								<div className="text-base font-semibold mb-2">{a.title}</div>
								<div className="text-sm text-white/55 leading-relaxed">{a.body}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ════════════ Section 5 — Comparison ════════════ */}
			<section className="relative px-6 sm:px-10 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-6xl mx-auto">
					<div data-reveal className="reveal-up text-center mb-16">
						<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 inline-flex items-center gap-3">
							<span className="w-8 h-px bg-[#e8702a]" />
							The benchmark
							<span className="w-8 h-px bg-[#e8702a]" />
						</div>
						<h2 className="text-4xl sm:text-6xl tracking-tight">
							<span className="font-playfair italic font-normal">Why</span> not Rotato.
						</h2>
					</div>

					<div data-reveal className="reveal-up overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02]">
						<table className="w-full min-w-[640px] text-sm">
							<thead>
								<tr className="border-b border-white/[0.08]">
									<th className="text-left p-5 font-semibold text-white/50 text-xs uppercase tracking-wider">Feature</th>
									<th className="p-5 font-semibold text-white text-xs uppercase tracking-wider">Memselon</th>
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
			<section id="pricing" className="relative bg-[#0a0a0a] px-6 sm:px-10 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
				<div className="max-w-7xl mx-auto">
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
							A Free tier to test. Pro for freelance. Ultra for everything else. Cancel any time.
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
									{p.isTrial ? (
										<>
											<span className="text-5xl font-bold tracking-tight">€0</span>
											<span className="text-sm text-white/55">/ 7 days</span>
										</>
									) : (
										<>
											<span className="text-5xl font-bold tracking-tight">€{yearly ? p.yearly : p.monthly}</span>
											<span className="text-sm text-white/55">/{yearly ? 'year' : 'month'}</span>
										</>
									)}
								</div>
								<Link
									href={p.isTrial ? '/sign-up?trial=ultra' : '/sign-up'}
									className={
										'mt-6 block w-full text-center text-sm font-semibold px-5 py-3 rounded-full transition-all ' +
										(p.highlight
											? 'bg-[#e8702a] hover:bg-[#d2611f] text-white hover:scale-[1.02] active:scale-95'
											: 'bg-white text-[#0a0a0a] hover:bg-white/90')
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

					{/* Founder Lifetime */}
					<div data-reveal className="reveal-up mt-10 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-white/[0.05] to-transparent p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-3">
								<Sparkles size={18} strokeWidth={1.5} className="text-[#e8702a]" />
								<div className="text-xs font-bold tracking-wider uppercase text-[#e8702a]">Founder Lifetime — 100 places only</div>
							</div>
							<h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
								Pay <span className="font-playfair italic">once</span>, keep <span className="font-playfair italic">Ultra</span> forever.
							</h3>
							<p className="text-sm text-white/65 max-w-xl">
								One-time payment. All Ultra features, no recurring charge. Locked to the first 100
								Memselon believers — counter ticks down in the plugin.
							</p>
						</div>
						<Link
							href="/sign-up?plan=founder"
							className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-[#0a0a0a] text-sm font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-all hover:scale-[1.03]"
						>
							€199 — claim a slot
							<ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</section>

			{/* ════════════ Section 7 — FAQ ════════════ */}
			<section id="docs" className="relative px-6 sm:px-10 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
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
			<section id="live" className="relative px-6 sm:px-10 md:px-16 py-32 md:py-44 border-t border-white/[0.07] overflow-hidden">
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#e8702a]/[0.08] blur-3xl" />
				</div>
				<div data-reveal className="reveal-up relative max-w-4xl mx-auto text-center">
					<Camera size={36} strokeWidth={1.25} className="mx-auto mb-8 text-[#e8702a]" />
					<h2 className="text-5xl sm:text-7xl md:text-8xl leading-[0.98] tracking-tight">
						<span className="font-playfair italic font-normal">Open</span> Framer.{' '}
						<span className="text-white/65">Drop a screenshot.</span>{' '}
						<span className="font-playfair italic font-normal">Ship 3D.</span>
					</h2>
					<p className="mt-8 text-base sm:text-lg text-white/65 max-w-xl mx-auto">
						The plugin is free to install. Two exports a month, every month, on the house.
					</p>
					<div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
						<Link
							href="/sign-up"
							className="inline-flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-[1.03] active:scale-95 hover:shadow-xl hover:shadow-[#e8702a]/30"
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
			<footer className="relative border-t border-white/[0.07] px-6 sm:px-10 md:px-16 py-14">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
					<div>
						<div className="flex items-center gap-2 mb-3">
							<svg width="20" height="20" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
								<path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
							</svg>
							<span className="font-playfair italic text-xl">Memselon</span>
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
				<div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.05] text-[10px] tracking-wider uppercase text-white/40 flex flex-wrap items-center justify-between gap-3">
					<span>© 2026 Memselon</span>
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
