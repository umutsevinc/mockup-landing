'use client'

// Badge officiel Product Hunt avec compteur d'upvotes live — posé en
// haut à droite de la nav (demande 22/07). Ouvre la page PH Mockiosa.
const PH_URL =
	'https://www.producthunt.com/products/mockiosa?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-mockiosa'
const PH_POST_ID = '1198954'

export default function PhNavBadge() {
	return (
		<a
			href={PH_URL}
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => {
				try {
					;(window as any).gtag?.('event', 'ph_nav_badge_click')
				} catch {}
			}}
			className="inline-flex items-center transition-transform hover:scale-[1.04]"
			aria-label="Mockiosa - Featured on Product Hunt"
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${PH_POST_ID}&theme=light`}
				alt="Mockiosa - Device mockups to real-time 3D, inside Framer | Product Hunt"
				width={210}
				height={45}
				className="h-9 w-auto md:h-[45px] drop-shadow-lg"
			/>
		</a>
	)
}
