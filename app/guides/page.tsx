import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/lib/guides'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

export const metadata: Metadata = {
	title: 'Guides — 3D mockups in Framer | Mockiosa',
	description:
		'Practical guides: add a 3D mockup in Framer, embed an interactive iPhone on your site, choose between Rotato and Framer plugins.',
	alternates: { canonical: 'https://mockiosa.memselon.com/guides' },
}

export default function GuidesHubPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<SiteHeader />

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

			</main>
			<SiteFooter />
		</div>
	)
}
