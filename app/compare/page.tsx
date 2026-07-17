import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPARE_ENTRIES } from '@/lib/compare'

export const metadata: Metadata = {
	title: 'Compare — Mockiosa vs other mockup tools',
	description:
		'Honest comparisons between Mockiosa and Rotato, Shots.so, Mockuuups Studio, Smartmockups and Previewed. Real-time 3D mockups inside Framer vs export-based tools.',
	alternates: { canonical: 'https://mockiosa.memselon.com/compare' },
}

export default function ComparePage() {
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

				<footer className="mt-20 pt-8 border-t border-white/[0.07] flex items-center justify-between text-[13px] text-white/35">
					<Link href="/" className="hover:text-white transition-colors">← Back to Mockiosa</Link>
					<Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
				</footer>
			</main>
		</div>
	)
}
