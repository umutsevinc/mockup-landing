import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COMPARE_ENTRIES, getCompareEntry, type CompareFeature } from '@/lib/compare'

export function generateStaticParams() {
	return COMPARE_ENTRIES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params
	const entry = getCompareEntry(slug)
	if (!entry) return {}
	return {
		title: entry.seoTitle,
		description: entry.seoDescription,
		alternates: { canonical: `https://mockiosa.memselon.com/compare/${entry.slug}` },
		openGraph: {
			title: entry.seoTitle,
			description: entry.seoDescription,
			url: `https://mockiosa.memselon.com/compare/${entry.slug}`,
			type: 'article',
		},
	}
}

function FeatureCell({ value }: { value: string | boolean }) {
	if (value === true) return <span className="text-[#e8702a]">✓</span>
	if (value === false) return <span className="text-white/25">—</span>
	return <span className="text-white/70">{value}</span>
}

function FeatureRow({ row, competitor }: { row: CompareFeature; competitor: string }) {
	return (
		<tr className="border-t border-white/[0.06]">
			<td className="py-4 pr-4 text-sm text-white/75 align-top">
				{row.label}
				{row.note ? <div className="mt-1 text-[12px] text-white/35 leading-relaxed">{row.note}</div> : null}
			</td>
			<td className="py-4 px-4 text-sm align-top">
				<FeatureCell value={row.mockiosa} />
			</td>
			<td className="py-4 pl-4 text-sm align-top" aria-label={competitor}>
				<FeatureCell value={row.competitor} />
			</td>
		</tr>
	)
}

function BulletList({ items }: { items: string[] }) {
	return (
		<ul className="list-none m-0 p-0 flex flex-col gap-3">
			{items.map((item, i) => (
				<li key={i} className="flex items-start gap-3 text-[15px] text-white/60 leading-[1.6]">
					<span className="flex-shrink-0 mt-[9px] w-1 h-1 rounded-full bg-[#e8702a]" />
					{item}
				</li>
			))}
		</ul>
	)
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-xl font-medium tracking-[-0.01em] text-white mt-14 mb-5">{children}</h2>
	)
}

export default async function CompareSlugPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const entry = getCompareEntry(slug)
	if (!entry) notFound()

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
				<header className="mb-12">
					<Link href="/compare" className="text-[13px] text-white/35 hover:text-white/70 transition-colors">
						← All comparisons
					</Link>
					<h1 className="mt-5 text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
						<span className="text-white">Mockiosa</span>{' '}
						<span className="text-white/45">vs {entry.competitor}.</span>
					</h1>
					<p className="mt-4 text-base text-white/50 leading-relaxed m-0 max-w-[600px]">{entry.tagline}</p>
				</header>

				{/* TL;DR — fair-play des deux côtés */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
						<div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 mb-2.5">
							Pick {entry.competitor}
						</div>
						<p className="text-sm text-white/60 leading-[1.6] m-0">{entry.tldr.competitor}</p>
					</div>
					<div className="rounded-2xl border border-[#e8702a]/25 bg-[#e8702a]/[0.05] p-5">
						<div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#e8702a] mb-2.5">
							Pick Mockiosa
						</div>
						<p className="text-sm text-white/60 leading-[1.6] m-0">{entry.tldr.mockiosa}</p>
					</div>
				</div>

				{/* Tableau */}
				<SectionTitle>Feature by feature</SectionTitle>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[520px] border-collapse">
						<thead>
							<tr>
								<th className="text-left pb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">Feature</th>
								<th className="text-left pb-3 px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white">Mockiosa</th>
								<th className="text-left pb-3 pl-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">{entry.competitor}</th>
							</tr>
						</thead>
						<tbody>
							{entry.features.map((row) => (
								<FeatureRow key={row.label} row={row} competitor={entry.competitor} />
							))}
						</tbody>
					</table>
				</div>

				<SectionTitle>When {entry.competitor} is the better choice</SectionTitle>
				<BulletList items={entry.whenCompetitor} />

				<SectionTitle>When Mockiosa fits better</SectionTitle>
				<BulletList items={entry.whenMockiosa} />

				<SectionTitle>The honest take</SectionTitle>
				<p className="text-[15px] text-white/60 leading-[1.7] m-0">{entry.closing}</p>

				{/* CTA */}
				<div className="mt-14 flex items-center gap-3 flex-wrap">
					<Link
						href="/sign-up"
						className="cta-skeu text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.03]"
					>
						Try Mockiosa free
					</Link>
					<Link
						href="/#pricing"
						className="inline-flex items-center bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white/85 text-sm font-medium px-6 py-3 rounded-full transition-colors"
					>
						See pricing
					</Link>
					<Link
						href="/"
						className="text-sm text-white/45 hover:text-white/80 underline underline-offset-4 decoration-white/20 px-2 transition-colors"
					>
						Explore Mockiosa
					</Link>
				</div>

				{/* Lien sortant honnête vers le concurrent — signal E-E-A-T */}
				<p className="mt-12 text-[12px] text-white/30 leading-relaxed">
					Looking for {entry.competitor}&apos;s official site? It&apos;s at{' '}
					<a
						href={entry.competitorUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-white/50 underline underline-offset-2 hover:text-white/80 transition-colors"
					>
						{entry.competitorUrl.replace('https://', '')}
					</a>
					. This page is our honest take — go see theirs too.
				</p>

				{/* Maillage interne vers les autres comparaisons */}
				<footer className="mt-16 pt-8 border-t border-white/[0.07]">
					<div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 mb-4">
						More comparisons
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						{COMPARE_ENTRIES.filter((e) => e.slug !== entry.slug).map((e) => (
							<Link
								key={e.slug}
								href={`/compare/${e.slug}`}
								className="text-sm text-white/50 hover:text-white transition-colors"
							>
								vs {e.competitor}
							</Link>
						))}
					</div>
				</footer>
			</main>
		</div>
	)
}
