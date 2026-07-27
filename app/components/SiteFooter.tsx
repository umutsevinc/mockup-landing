import Link from 'next/link'
import PhNavBadge from './PhNavBadge'

// Footer partagé — même design que la home, réutilisé sur toutes les
// pages pour faciliter la navigation. Les ancres de section pointent en
// ABSOLU (/#…) pour fonctionner depuis n'importe quelle page.
const COLS = [
	{
		title: 'Product',
		links: [
			{label: 'Devices', href: '/#showcase'},
			{label: 'Pricing', href: '/#pricing'},
			{label: 'Docs', href: '/#docs'},
			{label: 'Studio', href: '/#live'},
		],
	},
	{
		title: 'Resources',
		links: [
			{label: '3D Mockups', href: '/mockups'},
			{label: 'Guides', href: '/guides'},
			{label: 'Changelog', href: '/changelog'},
			{label: 'Compare', href: '/compare'},
			{label: 'Featured on', href: '/featured'},
		],
	},
	{
		title: 'Account',
		links: [
			{label: 'Sign in', href: '/sign-in'},
			{label: 'Sign up', href: '/sign-up'},
			{label: 'Report a bug', href: '/report-bug'},
		],
	},
	{
		title: 'Legal',
		links: [
			{label: 'Privacy', href: '/privacy'},
			{label: 'Terms', href: '/terms'},
			{label: 'hi@memselon.com', href: 'mailto:hi@memselon.com'},
		],
	},
]

export default function SiteFooter() {
	return (
		<footer className="relative border-t border-white/[0.07] px-6 md:px-16 py-14 bg-[#0a0a0a]">
			<div className="max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
				<div>
					<div className="flex items-center gap-2 mb-3">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/feather-pen-white.svg" alt="Mockiosa" width="20" height="20" aria-hidden="true" />
						<span className="font-playfair text-xl">Mockiosa</span>
					</div>
					<p className="text-xs text-white/45 max-w-xs leading-relaxed mb-4">
						Build with 🫰 by{' '}
						<a href="https://x.com/memselon" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2 decoration-white/20 hover:decoration-white transition-colors">Memselon</a>
						{' & '}
						<a href="https://x.com/meiiyve" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2 decoration-white/20 hover:decoration-white transition-colors">May</a>
					</p>
					<Link
						href="/changelog"
						className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.1] px-3 py-1.5 text-[11px] text-white/70 hover:text-white hover:bg-white/[0.09] transition-colors"
					>
						<span className="font-mono text-[10px] tracking-[0.04em] text-white/45">v1.5</span>
						Liftoff
						<span className="text-white/40">→</span>
					</Link>
				</div>

				<nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-14 gap-y-3 text-xs" aria-label="Footer">
					{COLS.map((col) => (
						<div key={col.title} className="flex flex-col gap-3">
							<div className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/35">{col.title}</div>
							{col.links.map((l) =>
								l.href.startsWith('mailto:') ? (
									<a key={l.label} href={l.href} className="text-white/60 hover:text-white transition-colors">
										{l.label}
									</a>
								) : (
									<Link key={l.label} href={l.href} className="text-white/60 hover:text-white transition-colors">
										{l.label}
									</Link>
								),
							)}
						</div>
					))}
				</nav>
			</div>
			{/* PH badge en mobile — desktop l'a déjà fixé bottom-right. */}
			<div className="sm:hidden mt-8 flex justify-center">
				<PhNavBadge />
			</div>
			<div className="max-w-[1560px] mx-auto mt-10 pt-6 border-t border-white/[0.05] text-[10px] tracking-wider uppercase text-white/40 flex flex-wrap items-center justify-between gap-3">
				<span>© 2026 Mockiosa</span>
				<span>Made for Framer designers</span>
			</div>
		</footer>
	)
}
