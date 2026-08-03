import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Link from 'next/link'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import BadgeImg from '@/app/components/BadgeImg'

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
	/** Badge officiel. Absent = fallback wordmark texte (le temps d'avoir le snippet). */
	img?: string
	width?: number
	height?: number
	/** Badge custom (SVG + texte inline) quand l'annuaire n'a pas de simple image. Prioritaire sur `img`. */
	node?: ReactNode
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
	{
		name: 'Peerlist',
		href: 'https://peerlist.io/memselon/project/mockiosa',
		img: 'https://peerlist.io/api/v1/projects/embed/PRJHDNDAPLDAA8EAP1NRDJONM9LRBJ?showUpvote=false&theme=light',
		width: 200,
		height: 72,
		alt: 'Mockiosa',
	},
	{
		// Pas de badge embed chez Noon Launch → leur logo officiel,
		// auto-hébergé (public/noonlaunch-logo.png, fond transparent).
		name: 'Noon Launch',
		href: 'https://noonlaunch.com/product/mockiosa',
		img: '/noonlaunch-logo.png',
		width: 521,
		height: 120,
		alt: 'Mockiosa — Featured on Noon Launch',
	},
	{
		name: 'EasyDoFollow',
		href: 'https://easydofollow.dev/saas/https-mockiosa-memselon-com',
		img: 'https://easydofollow.dev/badge/easydofollow-badge-light.svg',
		width: 188,
		height: 56,
		alt: 'Featured on EasyDoFollow',
	},
	{
		// Pas d'image simple — badge inline (étoile gradient + wordmark),
		// redessiné pour le thème sombre de /featured. Le backlink dofollow
		// vers la fiche startup est l'essentiel (c'est ce que Tiny Startups vérifie).
		name: 'Tiny Startups',
		href: 'https://www.tinystartups.com/startup/mockiosa',
		alt: 'Mockiosa — Launched on Tiny Startups',
		node: (
			<div className="flex items-center gap-3.5">
				<svg width="52" height="52" viewBox="0 0 100 100" aria-hidden="true" className="shrink-0 drop-shadow-lg">
					<defs>
						<linearGradient id="tsg" x1=".1" y1="0" x2=".9" y2="1">
							<stop offset="0%" stopColor="#3525E6" />
							<stop offset="55%" stopColor="#D81FE0" />
							<stop offset="100%" stopColor="#22B8F0" />
						</linearGradient>
					</defs>
					<path
						d="M50 6C52 32 68 48 94 50C68 52 52 68 50 94C48 68 32 52 6 50C32 48 48 32 50 6Z"
						fill="url(#tsg)"
					/>
				</svg>
				<span className="flex flex-col leading-[1.15] text-left">
					<span className="font-mono text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40">
						Launched on
					</span>
					<span className="text-[22px] font-extrabold tracking-[-0.025em] text-white">Tiny Startups</span>
					<span className="mt-1 text-[11px] text-white/40">tinystartups.com</span>
				</span>
			</div>
		),
	},
	{
		name: 'ProductWatch',
		href: 'https://productwatch.io/products/mockiosa?utm_source=badge',
		img: 'https://productwatch.io/backend/api/v1/badge/featured?productId=7d74c73b-5790-4f90-84cc-a3383ce39bae&darkMode=false',
		width: 250,
		height: 54,
		alt: 'Mockiosa — Featured on ProductWatch',
	},
	{
		name: 'Twelve Tools',
		href: 'https://twelve.tools',
		img: 'https://twelve.tools/badge2-white.svg',
		width: 200,
		height: 54,
		alt: 'Featured on Twelve Tools',
	},
	{
		name: 'Plug Your Build',
		href: 'https://plugyourbuild.com/listing/mockiosa-98e4ab',
		img: 'https://plugyourbuild.com/api/badge/mockiosa-98e4ab?style=light',
		width: 180,
		height: 40,
		alt: 'Listed on Plug Your Build',
	},
	{
		name: 'KittyLaunch',
		href: 'https://kittylaunch.com/p/mockiosa',
		img: 'https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=dark&name=Mockiosa',
		width: 280,
		height: 68,
		alt: 'Mockiosa on KittyLaunch',
	},
	{
		// Variante `dark` du badge : c'est celle dessinée POUR un fond sombre
		// (pill #262019), donc la bonne ici — `badge-light.svg` est le blanc cassé.
		name: 'DanielLaunches',
		href: 'https://daniellaunches.com',
		img: 'https://daniellaunches.com/badge-dark.svg',
		width: 200,
		height: 44,
		alt: 'Mockiosa — Featured on DanielLaunches',
	},
	{
		name: 'FoundrList',
		href: 'https://www.foundrlist.com/product/mockiosa?utm_source=badge&utm_medium=embed',
		img: 'https://www.foundrlist.com/api/badge/mockiosa',
		width: 150,
		height: 48,
		alt: 'Mockiosa — Featured on FoundrList',
	},
	{
		// Variante `light` volontaire : le `launchit-dark.svg` (#111111) se
		// confondrait avec la carte sur ce fond, le blanc ressort.
		name: 'Launchit',
		href: 'https://www.launchit.site/launches/mockiosa',
		img: 'https://www.launchit.site/badges/launchit-light.svg',
		width: 200,
		height: 54,
		alt: 'Mockiosa — Featured on Launchit',
	},
	{
		// Idem Launchit : la variante `dark` (#0b1220) disparaîtrait sur la carte.
		// Badge natif en 720x240 (ratio 3:1) — contraint par `h-[50px] w-auto`.
		name: 'ListBulb',
		href: 'https://www.listbulb.com/tools/mockiosa',
		img: 'https://www.listbulb.com/featured-on-listbulb-light.svg',
		width: 720,
		height: 240,
		alt: 'Mockiosa — Featured on ListBulb',
	},
]

export default function FeaturedPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white tracking-[-0.02em]">
			<SiteHeader />

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
							{f.node ? (
								f.node
							) : f.img ? (
								<>
									{/* Badge officiel — repli sur le wordmark ci-dessous si l'image 404. */}
									<BadgeImg
										src={f.img}
										alt={f.alt}
										width={f.width}
										height={f.height}
										className="h-[50px] w-auto drop-shadow-lg"
									/>
									<span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
										{f.name} →
									</span>
								</>
							) : (
								// Fallback sans badge officiel : wordmark texte centré.
								<span className="flex h-[50px] items-center text-xl font-semibold text-white/90">
									{f.name}
									<span className="ml-2 text-white/40 group-hover:text-white/70 transition-colors">→</span>
								</span>
							)}
						</a>
					))}
				</div>

				<p className="mt-12 text-sm text-white/35">
					More coming soon — we&apos;re rolling out across the directories this launch week.
				</p>
			</main>
			<SiteFooter />
		</div>
	)
}
