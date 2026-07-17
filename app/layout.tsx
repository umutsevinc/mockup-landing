import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const SITE_URL = 'https://mockiosa.memselon.com'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: 'Mockiosa — Real-time 3D mockups for Framer',
	description:
		'Drop your screenshot, get a live 3D device with orbit camera and 4K export. iPhone 17 Pro, iPhone Air, iPad, MacBook Pro, Apple Watch Ultra — all in Framer. No Blender, no Rotato.',
	keywords: [
		'framer plugin',
		'3d mockup',
		'framer mockup',
		'device mockup',
		'rotato alternative',
		'iphone mockup',
		'macbook mockup',
		'real-time 3d',
		'webgl mockup',
		'memselon',
	],
	alternates: { canonical: SITE_URL },
	openGraph: {
		type: 'website',
		url: SITE_URL,
		title: 'Mockiosa — Real 3D. Real-time. In Framer.',
		description: 'Stop exporting PNGs. Ship real 3D mockups live in your Framer site.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Mockiosa — Real 3D. Real-time. In Framer.',
		description: 'The first real-time 3D mockup studio for Framer.',
		site: '@memselon',
		creator: '@memselon',
	},
	icons: {
		// L'icône officielle Mockiosa (carte noire arrondie + plume) partout.
		// ?v=6 : cache-bust — les navigateurs gardent les favicons très longtemps.
		icon: [
			{url: '/icon.svg?v=6', type: 'image/svg+xml'},
			{url: '/brand-icon-512.png?v=6', type: 'image/png', sizes: '512x512'},
		],
		apple: [{url: '/apple-icon.png?v=6', type: 'image/png', sizes: '180x180'}],
	},
}

// JSON-LD — SoftwareApplication + FAQ. Rendered server-side in the
// document head so crawlers and AI answer engines (Google AI Overviews,
// Perplexity, ChatGPT browsing) get structured facts without executing JS.
const JSON_LD = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'SoftwareApplication',
			name: 'Mockiosa',
			applicationCategory: 'DesignApplication',
			operatingSystem: 'Web (Framer plugin)',
			url: SITE_URL,
			description:
				'Real-time 3D device mockup plugin for Framer. Drop a screenshot or video on a 3D iPhone, iPad, Apple Watch or iMac, orbit the camera, publish it live on your site or export in 4K.',
			offers: [
				{ '@type': 'Offer', name: 'Ground', price: '9.99', priceCurrency: 'USD' },
				{ '@type': 'Offer', name: 'Float', price: '29', priceCurrency: 'USD' },
				{ '@type': 'Offer', name: 'Orbit', price: '39', priceCurrency: 'USD' },
			],
			author: { '@type': 'Organization', name: 'Memselon', url: 'https://memselon.com' },
		},
		{
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'What is Mockiosa?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'A Framer plugin that renders real-time 3D device mockups (iPhone 17 Pro, iPhone Air, iPad Pro, Apple Watch Ultra, iMac). You drop a screenshot or video on the screen, orbit the camera, pick device colors, then publish the live 3D scene on your Framer site or export 4K images and videos.',
					},
				},
				{
					'@type': 'Question',
					name: 'Is it a Rotato alternative?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Yes — unlike Rotato or Blender workflows, everything happens inside Framer and the result is a LIVE interactive 3D embed on your published site, not just a rendered export.',
					},
				},
				{
					'@type': 'Question',
					name: 'Can the 3D mockup react to the visitor cursor?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Yes. Follow-cursor, auto-rotate, float and grab-rotate animations are saved with the scene and replay on the published Framer page, across the whole page, not just inside the embed frame.',
					},
				},
			],
		},
	],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
				/>
				{/* Trafic interne : /?internal=1 pose un flag localStorage qui
				    désactive GA sur CE navigateur pour toujours (plus fiable
				    qu'un filtre IP avec une IP résidentielle qui tourne).
				    localhost est toujours exclu. Doit s'exécuter AVANT gtag,
				    donc dans le head. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var id='${process.env.NEXT_PUBLIC_GA_ID ?? 'G-ZQ6Y1NWK9Y'}';if(new URLSearchParams(location.search).get('internal')==='1'){localStorage.setItem('memselon-internal','1');}if(localStorage.getItem('memselon-internal')==='1'||location.hostname==='localhost'){window['ga-disable-'+id]=true;}}catch(e){}})();`,
					}}
				/>
			</head>
			<body>{children}</body>
			{/* GA4 — flux dédié "Mockiosa" (propriété séparée de memselon.com).
			    Surchargable via NEXT_PUBLIC_GA_ID dans les env Vercel. */}
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? 'G-ZQ6Y1NWK9Y'} />
		</html>
	)
}
