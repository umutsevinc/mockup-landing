import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPARE_ENTRIES } from '@/lib/compare'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

export const metadata: Metadata = {
	title: 'Compare — Mockiosa vs other mockup tools',
	description:
		'Honest comparisons between Mockiosa and Rotato, Shots.so, Mockuuups Studio, Smartmockups and Previewed. Real-time 3D mockups inside Framer vs export-based tools.',
	alternates: { canonical: 'https://mockiosa.memselon.com/compare' },
}

export default function ComparePage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<SiteHeader />

			<main className="max-w-[760px] mx-auto px-6 pt-16 pb-32">
				<header className="mb-14">
					<h1 className="text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
						<span className="text-white">Mockiosa,</span>{' '}
						<span className="text-white/45">compared.</span>
					</h1>
					<p className="mt-4 text-base text-white/50 leading-relaxed m-0 max-w-[560px]">
						Honest side-by-sides with the other mockup tools. Each page says when THEY are the better
						pick — because they sometimes are.
					</p>
				</header>

				<div className="flex flex-col">
					{COMPARE_ENTRIES.map((e) => (
						<Link
							key={e.slug}
							href={`/compare/${e.slug}`}
							className="group grid grid-cols-1 sm:grid-cols-[220px_1fr_auto] gap-1 sm:gap-6 items-baseline py-6 border-t border-white/[0.07] hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
						>
							<span className="text-base text-white">Mockiosa vs {e.competitor}</span>
							<span className="text-sm text-white/40 leading-relaxed">{e.tagline}</span>
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
