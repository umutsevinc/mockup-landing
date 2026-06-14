import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://mockup.memselon.com'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: 'Memselon Mockup — Real-time 3D mockups for Framer',
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
		title: 'Memselon Mockup — Real 3D. Real-time. In Framer.',
		description: 'Stop exporting PNGs. Ship real 3D mockups live in your Framer site.',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Memselon Mockup — Real 3D. Real-time. In Framer.',
		description: 'The first real-time 3D mockup studio for Framer.',
		site: '@memselon',
		creator: '@memselon',
	},
	icons: {
		icon: '/icon.svg',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
