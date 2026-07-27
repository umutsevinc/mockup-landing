import type { Metadata } from 'next'
import Link from 'next/link'
import { DEVICE_PAGES } from '@/lib/mockup-pages'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

export const metadata: Metadata = {
	title: '3D Device Mockups — iPhone, iPad, MacBook & more | Mockiosa',
	description:
		'Free interactive 3D device mockups: iPhone 17 Pro, iPhone Air, iPad Pro, MacBook Pro, iMac, Apple Watch Ultra and more. Drop your screenshot, orbit the device, use it in Framer.',
	alternates: { canonical: 'https://mockiosa.memselon.com/mockups' },
}

export default function MockupsHubPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<SiteHeader />

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

			</main>
			<SiteFooter />
		</div>
	)
}
