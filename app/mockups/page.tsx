import type { Metadata } from 'next'
import Link from 'next/link'
import { DEVICE_PAGES } from '@/lib/mockup-pages'

export const metadata: Metadata = {
	title: '3D Device Mockups — iPhone, iPad, MacBook & more | Mockiosa',
	description:
		'Free interactive 3D device mockups: iPhone 17 Pro, iPhone Air, iPad Pro, MacBook Pro, iMac, Apple Watch Ultra and more. Drop your screenshot, orbit the device, use it in Framer.',
	alternates: { canonical: 'https://mockiosa.memselon.com/mockups' },
}

export default function MockupsHubPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<nav className="flex items-center justify-between px-6 md:px-16 py-5 max-w-[1100px] mx-auto">
				<Link href="/" className="flex items-center gap-2">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
					<span className="font-playfair text-lg">Mockiosa</span>
				</Link>
				<Link
					href="/sign-up"
					className="cta-skeu-light text-gray-900 text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-[1.03]"
				>
					Try it free
				</Link>
			</nav>

			<main className="max-w-[760px] mx-auto px-6 pt-16 pb-32">
				<header className="mb-14">
					<h1 className="text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
						<span className="text-white">Device mockups,</span>{' '}
						<span className="text-white/45">in real 3D.</span>
					</h1>
					<p className="mt-4 text-base text-white/50 leading-relaxed m-0 max-w-[560px]">
						Every device below is a real-time 3D model — not a template. Open a page, drop your
						screenshot, orbit the device. Free to play with, Framer-native to ship.
					</p>
				</header>

				<div className="flex flex-col">
					{DEVICE_PAGES.map((d) => (
						<Link
							key={d.slug}
							href={`/mockups/${d.slug}`}
							className="group grid grid-cols-1 sm:grid-cols-[260px_1fr_auto] gap-1 sm:gap-6 items-baseline py-6 border-t border-white/[0.07] hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
						>
							<span className="text-base text-white">{d.name}</span>
							<span className="text-sm text-white/40 leading-relaxed">
								{d.playgroundId ? 'Interactive 3D — try it on the page' : 'In the Framer plugin'}
							</span>
							<span className="text-white/30 group-hover:text-white/70 transition-colors hidden sm:block">→</span>
						</Link>
					))}
					<div className="border-t border-white/[0.07]" />
				</div>

				<footer className="mt-20 pt-8 border-t border-white/[0.07] flex items-center justify-between text-[13px] text-white/35">
					<Link href="/" className="hover:text-white transition-colors">← Back to Mockiosa</Link>
					<Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
				</footer>
			</main>
		</div>
	)
}
