import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GUIDES, getGuide } from '@/lib/guides'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

export function generateStaticParams() {
	return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params
	const guide = getGuide(slug)
	if (!guide) return {}
	return {
		title: guide.seoTitle,
		description: guide.seoDescription,
		alternates: { canonical: `https://mockiosa.memselon.com/guides/${guide.slug}` },
		openGraph: {
			images: ['/opengraph-image'],
			title: guide.seoTitle,
			description: guide.seoDescription,
			url: `https://mockiosa.memselon.com/guides/${guide.slug}`,
			type: 'article',
		},
	}
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const guide = getGuide(slug)
	if (!guide) notFound()

	const articleJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: guide.title,
		description: guide.seoDescription,
		author: { '@type': 'Organization', name: 'Mockiosa' },
		publisher: { '@type': 'Organization', name: 'Mockiosa', url: 'https://mockiosa.memselon.com' },
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			{/* JSON-LD via next/script : rendu dans le HTML pour les crawlers,
			    sans le <script> brut qui déclenche le warning React « script tag »
			    en navigation soft. Sanitize `<` → < (anti-XSS, cf. doc Next). */}
			<Script
				id={`ld-guide-${guide.slug}`}
				type="application/ld+json"
				strategy="beforeInteractive"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
			/>

			<SiteHeader />

			<main className="max-w-[680px] mx-auto px-6 pt-16 pb-32">
				<Link href="/guides" className="text-[13px] text-white/35 hover:text-white/70 transition-colors">
					← All guides
				</Link>
				<h1 className="mt-5 text-[30px] sm:text-[40px] font-normal tracking-[-0.02em] leading-[1.15] m-0 text-white">
					{guide.title}
				</h1>
				<p className="mt-5 text-base text-white/55 leading-[1.7] m-0">{guide.intro}</p>

				{guide.sections.map((s) => (
					<section key={s.h2} className="mt-10">
						<h2 className="text-xl font-medium tracking-[-0.01em] text-white m-0 mb-3">{s.h2}</h2>
						{s.paragraphs.map((p, i) => (
							<p key={i} className="text-[15px] text-white/55 leading-[1.75] m-0 mb-3">
								{p}
							</p>
						))}
					</section>
				))}

				<div className="mt-12 flex items-center gap-3 flex-wrap">
					<Link
						href="/sign-up"
						className="cta-skeu text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.03]"
					>
						Try Mockiosa free
					</Link>
					<Link
						href="/mockups"
						className="inline-flex items-center bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white/85 text-sm font-medium px-6 py-3 rounded-full transition-colors"
					>
						Play with the 3D mockups
					</Link>
				</div>

				<footer className="mt-14 pt-8 border-t border-white/[0.07]">
					<div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 mb-4">Related</div>
					<div className="flex flex-col gap-2">
						{guide.related.map((r) => (
							<Link key={r.href} href={r.href} className="text-sm text-white/55 hover:text-white transition-colors">
								{r.label} →
							</Link>
						))}
					</div>
				</footer>
			</main>
			<SiteFooter />
		</div>
	)
}
