'use client'

import Link from 'next/link'

// Header partagé — réutilise la nav de la home sur toutes les pages
// (logo + liens de section en ABSOLU vers /#… + CTA « Try it free »).
// Sticky pour rester accessible au scroll. Le CTA émet un event GA.
const NAV = [
	{label: 'Plugin', href: '/'},
	{label: 'Showcase', href: '/#showcase'},
	{label: 'Pricing', href: '/#pricing'},
	{label: 'Docs', href: '/#docs'},
	{label: 'Studio', href: '/#live'},
]

export default function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/[0.06]">
			<div className="max-w-[1560px] mx-auto px-6 md:px-16 h-16 flex items-center justify-between gap-4">
				<Link href="/" className="flex items-center gap-2 shrink-0">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/feather-pen-white.svg" alt="Mockiosa" width="24" height="24" />
					<span className="text-white text-xl font-playfair">Mockiosa</span>
				</Link>

				<nav className="hidden md:flex items-center gap-1 bg-white/[0.06] border border-white/[0.1] rounded-full px-2 py-1.5" aria-label="Primary">
					{NAV.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className="px-3.5 py-1.5 rounded-full text-sm font-medium text-white/75 hover:text-white hover:bg-white/[0.08] transition-colors"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<Link
					href="/sign-up"
					onClick={() => {
						try {
							;(window as any).gtag?.('event', 'cta_click', {location: 'header', label: 'try_free'})
						} catch {}
					}}
					className="cta-skeu-light text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-[1.03] shrink-0"
				>
					Try it free
				</Link>
			</div>
		</header>
	)
}
