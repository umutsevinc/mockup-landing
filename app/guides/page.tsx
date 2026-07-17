import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
	title: 'Guides — 3D mockups in Framer | Mockiosa',
	description:
		'Practical guides: add a 3D mockup in Framer, embed an interactive iPhone on your site, choose between Rotato and Framer plugins.',
	alternates: { canonical: 'https://mockiosa.memselon.com/guides' },
}

export default function GuidesHubPage() {
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

			<main className="max-w-[680px] mx-auto px-6 pt-16 pb-32">
				<h1 className="text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
					<span className="text-white">Guides.</span>{' '}
					<span className="text-white/45">Short, practical, honest.</span>
				</h1>

				<div className="mt-12 flex flex-col">
					{GUIDES.map((g) => (
						<Link
							key={g.slug}
							href={`/guides/${g.slug}`}
							className="group py-6 border-t border-white/[0.07] hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
						>
							<div className="text-base text-white group-hover:text-white">{g.title}</div>
							<div className="mt-1 text-sm text-white/40 leading-relaxed">{g.seoDescription}</div>
						</Link>
					))}
					<div className="border-t border-white/[0.07]" />
				</div>

				<footer className="mt-16 pt-8 border-t border-white/[0.07] flex items-center gap-6 text-[13px] text-white/35">
					<Link href="/" className="hover:text-white transition-colors">← Back to Mockiosa</Link>
					<Link href="/mockups" className="hover:text-white transition-colors">Device mockups</Link>
					<Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
				</footer>
			</main>
		</div>
	)
}
