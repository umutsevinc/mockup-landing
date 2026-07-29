import type {ReactNode} from 'react'
import BadgeImg from './BadgeImg'

// Bandeau « Featured on » qui défile à l'infini à l'horizontal, juste
// après le hero. Reprend TOUS les annuaires listés sur /featured. Chaque
// logo est posé sur une pill sombre (comme les cartes de /featured) pour
// garantir le contraste, quel que soit le design du badge (clair/sombre).
//
// ⚠️ Garder en phase avec la liste FEATURES de app/featured/page.tsx.

type Item = {
	name: string
	href: string
	/** Badge image (externe ou auto-hébergé). */
	img?: string
	/** Badge custom (SVG + texte) quand il n'y a pas de simple image. */
	node?: ReactNode
	alt: string
}

const ITEMS: Item[] = [
	{
		name: 'Product Hunt',
		href: 'https://www.producthunt.com/products/mockiosa?launch=mockiosa',
		img: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198954&theme=light',
		alt: 'Mockiosa — Featured on Product Hunt',
	},
	{
		name: 'Launch Llama',
		href: 'https://tools.launchllama.co/products/mockiosa',
		img: 'https://tools.launchllama.co/featured-badge-white.png?v=2',
		alt: 'As seen on Launch Llama',
	},
	{
		name: 'Peerlist',
		href: 'https://peerlist.io/memselon/project/mockiosa',
		img: 'https://peerlist.io/api/v1/projects/embed/PRJHDNDAPLDAA8EAP1NRDJONM9LRBJ?showUpvote=false&theme=light',
		alt: 'Mockiosa on Peerlist',
	},
	{
		name: 'Noon Launch',
		href: 'https://noonlaunch.com/product/mockiosa',
		img: '/noonlaunch-logo.png',
		alt: 'Mockiosa — Featured on Noon Launch',
	},
	{
		name: 'EasyDoFollow',
		href: 'https://easydofollow.dev/saas/https-mockiosa-memselon-com',
		img: 'https://easydofollow.dev/badge/easydofollow-badge-light.svg',
		alt: 'Featured on EasyDoFollow',
	},
	{
		name: 'Tiny Startups',
		href: 'https://www.tinystartups.com/startup/mockiosa',
		alt: 'Mockiosa — Launched on Tiny Startups',
		node: (
			<span className="flex items-center gap-2.5">
				<svg width="30" height="30" viewBox="0 0 100 100" aria-hidden="true" className="shrink-0">
					<defs>
						<linearGradient id="ts-marquee" x1=".1" y1="0" x2=".9" y2="1">
							<stop offset="0%" stopColor="#3525E6" />
							<stop offset="55%" stopColor="#D81FE0" />
							<stop offset="100%" stopColor="#22B8F0" />
						</linearGradient>
					</defs>
					<path
						d="M50 6C52 32 68 48 94 50C68 52 52 68 50 94C48 68 32 52 6 50C32 48 48 32 50 6Z"
						fill="url(#ts-marquee)"
					/>
				</svg>
				<span className="text-[17px] font-extrabold tracking-[-0.025em] text-white whitespace-nowrap">
					Tiny Startups
				</span>
			</span>
		),
	},
	{
		name: 'ProductWatch',
		href: 'https://productwatch.io/products/mockiosa?utm_source=badge',
		img: 'https://productwatch.io/backend/api/v1/badge/featured?productId=7d74c73b-5790-4f90-84cc-a3383ce39bae&darkMode=false',
		alt: 'Mockiosa — Featured on ProductWatch',
	},
	{
		name: 'Twelve Tools',
		href: 'https://twelve.tools',
		img: 'https://twelve.tools/badge2-white.svg',
		alt: 'Featured on Twelve Tools',
	},
	{
		name: 'Plug Your Build',
		href: 'https://plugyourbuild.com/listing/mockiosa-98e4ab',
		img: 'https://plugyourbuild.com/api/badge/mockiosa-98e4ab?style=light',
		alt: 'Listed on Plug Your Build',
	},
	{
		name: 'KittyLaunch',
		href: 'https://kittylaunch.com/p/mockiosa',
		img: 'https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=dark&name=Mockiosa',
		alt: 'Mockiosa on KittyLaunch',
	},
]

function badge(f: Item, key: string, hidden: boolean) {
	return (
		<a
			key={key}
			href={f.href}
			target="_blank"
			rel="noopener noreferrer"
			aria-hidden={hidden || undefined}
			tabIndex={hidden ? -1 : undefined}
			aria-label={f.alt}
			className="mr-4 flex h-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-7 opacity-70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:opacity-100"
		>
			{f.node ? (
				f.node
			) : (
				<BadgeImg
					src={f.img!}
					alt=""
					width={160}
					height={40}
					className="h-8 w-auto"
					fallback={
						<span className="whitespace-nowrap text-[17px] font-extrabold tracking-[-0.025em] text-white">
							{f.name}
						</span>
					}
				/>
			)}
		</a>
	)
}

export default function FeaturedMarquee() {
	return (
		<section
			aria-label="Featured on"
			className="relative w-full overflow-hidden border-y border-white/[0.08] bg-black py-9"
		>
			<p className="mb-7 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">
				Featured on
			</p>
			<div className="marquee-mask marquee-track relative">
				<div className="animate-marquee flex w-max items-center">
					{/* 2 copies identiques → boucle sans couture (translateX -50%) */}
					{ITEMS.map((f, i) => badge(f, `a-${i}`, false))}
					{ITEMS.map((f, i) => badge(f, `b-${i}`, true))}
				</div>
			</div>
		</section>
	)
}
