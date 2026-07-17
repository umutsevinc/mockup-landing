import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { DEVICE_PAGES, getDevicePage } from '@/lib/mockup-pages'
import DeviceViewerLazy from '@/app/components/DeviceViewerLazy'

export function generateStaticParams() {
	return DEVICE_PAGES.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params
	const page = getDevicePage(slug)
	if (!page) return {}
	return {
		title: page.seoTitle,
		description: page.seoDescription,
		alternates: { canonical: `https://mockiosa.memselon.com/mockups/${page.slug}` },
		openGraph: {
			title: page.seoTitle,
			description: page.seoDescription,
			url: `https://mockiosa.memselon.com/mockups/${page.slug}`,
			type: 'website',
		},
	}
}

export default async function DeviceMockupPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const page = getDevicePage(slug)
	if (!page) notFound()

	// JSON-LD FAQPage — les FAQ par device sont le carburant des
	// AI Overviews / featured snippets sur "[device] mockup".
	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: page.faq.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a },
		})),
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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

			<main className="max-w-[1100px] mx-auto px-6 md:px-16 pt-12 pb-32">
				<header className="mb-10">
					<Link href="/mockups" className="text-[13px] text-white/35 hover:text-white/70 transition-colors">
						← All device mockups
					</Link>
					<h1 className="mt-5 text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
						<span className="text-white">{page.name} mockup,</span>
						<br />
						<span className="text-white/45">in real 3D.</span>
					</h1>
				</header>

				{/* Viewer interactif (GLB local) ou visuel catalogue */}
				{page.playgroundId ? (
					<>
						<DeviceViewerLazy deviceId={page.playgroundId} />
						<p className="mt-3 text-[13px] text-white/30">
							Drag to orbit · pick a finish · drop your own screenshot or video on the screen. Dropped
							media is watermarked on this free page — the Framer plugin exports clean.
						</p>
					</>
				) : page.cardImg ? (
					<div className="relative rounded-3xl overflow-hidden bg-white border border-white/[0.07] h-[420px] md:h-[520px]">
						<Image src={page.cardImg} alt={`${page.name} mockup`} fill className="object-contain p-10" sizes="1100px" />
					</div>
				) : (
					<div className="rounded-3xl bg-white/[0.03] border border-white/[0.07] h-[320px] flex items-center justify-center">
						<span className="text-white/25 text-xl">{page.name}</span>
					</div>
				)}

				{/* Copy unique */}
				<div className="mt-12 max-w-[720px]">
					{page.intro.map((p, i) => (
						<p key={i} className="text-base text-white/60 leading-[1.7] m-0 mb-4">
							{p}
						</p>
					))}
				</div>

				{/* CTA */}
				<div className="mt-10 flex items-center gap-3 flex-wrap">
					<Link
						href="/sign-up"
						className="cta-skeu text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.03]"
					>
						Use it in Framer — free
					</Link>
					<Link
						href="/#pricing"
						className="inline-flex items-center bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white/85 text-sm font-medium px-6 py-3 rounded-full transition-colors"
					>
						See pricing
					</Link>
				</div>

				{/* FAQ */}
				<section className="mt-16 max-w-[720px]">
					<h2 className="text-xl font-medium tracking-[-0.01em] text-white mb-6">
						{page.name} mockup — FAQ
					</h2>
					<div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
						{page.faq.map((f) => (
							<details key={f.q} className="group py-4">
								<summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15px] text-white/85 hover:text-white transition-colors">
									{f.q}
									<span className="text-white/40 group-open:rotate-45 transition-transform">+</span>
								</summary>
								<p className="mt-3 text-sm text-white/50 leading-[1.65] m-0">{f.a}</p>
							</details>
						))}
					</div>
				</section>

				{/* Maillage interne */}
				<footer className="mt-16 pt-8 border-t border-white/[0.07]">
					<div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 mb-4">
						More device mockups
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						{DEVICE_PAGES.filter((d) => d.slug !== page.slug).map((d) => (
							<Link
								key={d.slug}
								href={`/mockups/${d.slug}`}
								className="text-sm text-white/50 hover:text-white transition-colors"
							>
								{d.name}
							</Link>
						))}
					</div>
					<div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/35">
						<Link href="/compare" className="hover:text-white/70 transition-colors">Compare Mockiosa to other tools</Link>
						<Link href="/changelog" className="hover:text-white/70 transition-colors">Changelog</Link>
					</div>
				</footer>
			</main>
		</div>
	)
}
