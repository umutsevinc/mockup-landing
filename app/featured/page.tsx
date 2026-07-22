import type {Metadata} from 'next'
import Link from 'next/link'

// Page « Featured on » — liste TOUS les annuaires / newsletters / plateformes
// de lancement où Mockiosa apparaît, avec le badge officiel de chacun. Évite
// d'empiler 50 badges sur la home/waitlist. Indexable (backlinks + SEO).
// Ajouter un annuaire = ajouter une entrée dans FEATURES, rien d'autre.

export const metadata: Metadata = {
	title: 'Featured on — Mockiosa',
	description:
		'Directories, newsletters and launch platforms featuring Mockiosa — real-time 3D device mockups, right inside Framer.',
	alternates: {canonical: 'https://mockiosa.memselon.com/featured'},
}

type Feature = {
	name: string
	href: string
	img: string
	width: number
	height: number
	alt: string
}

const FEATURES: Feature[] = [
	{
		name: 'Product Hunt',
		href: 'https://www.producthunt.com/products/mockiosa?launch=mockiosa',
		img: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198954&theme=light',
		width: 250,
		height: 54,
		alt: 'Mockiosa — Featured on Product Hunt',
	},
	{
		name: 'Launch Llama',
		href: 'https://tools.launchllama.co/products/mockiosa',
		img: 'https://tools.launchllama.co/featured-badge-white.png?v=2',
		width: 200,
		height: 50,
		alt: 'As seen on Launch Llama Newsletter',
	},
]

export default function FeaturedPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white tracking-[-0.02em]">
			{/* Header minimal */}
			<header className="max-w-[1560px] mx-auto px-6 md:px-16 py-6 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
					</svg>
					<span className="text-xl font-playfair">Mockiosa</span>
				</Link>
				<Link href="/" className="text-sm text-white/55 hover:text-white transition-colors">
					← Back home
				</Link>
			</header>

			<main className="max-w-[1560px] mx-auto px-6 md:px-16 py-16 md:py-24">
				<div className="max-w-2xl">
					<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-5 flex items-center gap-3">
						<span className="w-8 h-px bg-[#e8702a]" />
						Featured on
					</div>
					<h1 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
						<span className="text-white">Where Mockiosa</span>{' '}
						<span className="text-white/45">shows up.</span>
					</h1>
					<p className="mt-5 text-sm sm:text-base text-white/60 leading-relaxed">
						The directories, newsletters and launch platforms featuring Mockiosa. If we&apos;re on it,
						a little support there goes a long way 🙌
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
					{FEATURES.map((f) => (
						<a
							key={f.name}
							href={f.href}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-col items-center justify-center gap-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 min-h-[168px] transition-colors hover:border-white/20 hover:bg-white/[0.05]"
							aria-label={f.alt}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={f.img}
								alt={f.alt}
								width={f.width}
								height={f.height}
								className="h-[50px] w-auto drop-shadow-lg"
							/>
							<span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
								{f.name} →
							</span>
						</a>
					))}
				</div>

				<p className="mt-12 text-sm text-white/35">
					More coming soon — we&apos;re rolling out across the directories this launch week.
				</p>
			</main>
		</div>
	)
}
