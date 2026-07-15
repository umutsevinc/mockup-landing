import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const SITE_URL = 'https://mockup.memselon.com'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: 'Framer Mockup 3D — Real-time 3D mockups for Framer',
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
		title: 'Framer Mockup 3D — Real 3D. Real-time. In Framer.',
		description: 'Stop exporting PNGs. Ship real 3D mockups live in your Framer site.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Framer Mockup 3D — Real 3D. Real-time. In Framer.',
		description: 'The first real-time 3D mockup studio for Framer.',
		site: '@memselon',
		creator: '@memselon',
	},
	icons: {
		icon: '/icon.svg',
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
			name: 'Framer Mockup 3D',
			applicationCategory: 'DesignApplication',
			operatingSystem: 'Web (Framer plugin)',
			url: SITE_URL,
			description:
				'Real-time 3D device mockup plugin for Framer. Drop a screenshot or video on a 3D iPhone, iPad, Apple Watch or iMac, orbit the camera, publish it live on your site or export in 4K.',
			offers: [
				{ '@type': 'Offer', name: 'Starter', price: '19', priceCurrency: 'EUR' },
				{ '@type': 'Offer', name: 'Pro', price: '49', priceCurrency: 'EUR' },
				{ '@type': 'Offer', name: 'Studio', price: '99', priceCurrency: 'EUR' },
				{ '@type': 'Offer', name: 'Founder Lifetime', price: '499', priceCurrency: 'EUR' },
			],
			author: { '@type': 'Organization', name: 'Memselon', url: 'https://memselon.com' },
		},
		{
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'What is Framer Mockup 3D?',
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
			</head>
			<body>{children}</body>
			{/* GA4 — flux "Memselon" (couvre memselon.com et ses sous-domaines) */}
			<GoogleAnalytics gaId="G-XD2DLH1KLL" />
		</html>
	)
}
