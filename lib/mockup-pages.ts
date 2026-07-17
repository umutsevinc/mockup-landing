// ─────────────────────────────────────────────────────────────────────
// SEO programmatique — pages /mockups/[slug] ciblant "[device] mockup".
// Chaque page : viewer 3D interactif (si GLB local dispo), copy unique,
// FAQ (rendue + JSON-LD FAQPage), CTA, maillage interne.
// Ajouter un device = ajouter une entrée ici, rien d'autre.
// ─────────────────────────────────────────────────────────────────────

export type DeviceFaq = { q: string; a: string }

export type DevicePage = {
	slug: string
	/** Nom marketing complet — H1 et title. */
	name: string
	/** id PLAYGROUND_DEVICES si un GLB local existe → viewer interactif. */
	playgroundId?: string
	/** Image carte (fallback quand pas de GLB local). */
	cardImg?: string
	seoTitle: string
	seoDescription: string
	intro: string[]
	faq: DeviceFaq[]
}

export const DEVICE_PAGES: DevicePage[] = [
	{
		slug: 'iphone-17-pro-mockup',
		name: 'iPhone 17 Pro',
		playgroundId: 'iphone17pro',
		cardImg: '/cards/iphone17pro-apple.webp',
		seoTitle: 'iPhone 17 Pro Mockup — Free Interactive 3D (Framer-ready)',
		seoDescription:
			'Drop your screenshot on a real 3D iPhone 17 Pro mockup — orbit it, pick Cosmic Orange, Deep Blue or Silver, export 4K or embed it live in Framer. Try it right on this page.',
		intro: [
			'This is not a PNG template. The iPhone 17 Pro below is a real-time 3D model rendered in your browser — drag to orbit it, switch the official finishes (Cosmic Orange, Deep Blue, Silver), and drop your own screenshot or video straight onto the screen.',
			'When you install Mockiosa in Framer, this exact device lives on your canvas: pose it, animate it (follow-cursor, float, scroll), then export a 4K PNG with transparency or publish the live 3D scene on your site.',
		],
		faq: [
			{ q: 'Is this iPhone 17 Pro mockup free?', a: 'The interactive mockup on this page is free to play with. In Framer, plans start at $9.99/mo (Ground), monthly — cancel anytime.' },
			{ q: 'Can I put a video on the iPhone screen?', a: 'Yes. Drop an MP4 or MOV on the device and it plays on the screen, looped, synced with the 3D motion — on this page and in the plugin.' },
			{ q: 'Which iPhone 17 Pro colors are available?', a: 'The three official finishes: Cosmic Orange, Deep Blue and Silver — plus any custom color and matte, brushed-metal or glossy finishes in the plugin.' },
			{ q: 'Can I use it outside Framer?', a: 'You can export 4K PNGs (with transparency) and videos that work anywhere. The live interactive embed is Framer-specific.' },
		],
	},
	{
		slug: 'iphone-air-mockup',
		name: 'iPhone Air',
		playgroundId: 'iphoneAir',
		cardImg: '/cards/iphoneAir-apple.webp',
		seoTitle: 'iPhone Air Mockup — Free Interactive 3D (Framer-ready)',
		seoDescription:
			'Real-time 3D iPhone Air mockup: drop your screenshot, orbit the thinnest iPhone, pick Sky Blue, Light Gold or Space Black. 4K export or live Framer embed.',
		intro: [
			'The iPhone Air is the thinnest iPhone Apple has ever shipped — and thin devices are exactly where flat mockup templates fall apart, because the silhouette IS the story. In real 3D, the profile reads instantly from any angle.',
			'Orbit the model below, switch between Sky Blue, Light Gold and Space Black, and drop your own design on the screen. In Framer, the same scene can follow the visitor’s cursor on your published site.',
		],
		faq: [
			{ q: 'Why a 3D iPhone Air mockup instead of a template?', a: 'Templates lock you into one angle. The Air’s ultra-thin profile is its selling point — real 3D lets you pose the exact angle that shows it, or let visitors orbit it themselves.' },
			{ q: 'Can I match my brand colors?', a: 'Yes — beyond the official finishes, the plugin lets you set any hex color on the chassis with matte, metal or glossy finishes.' },
			{ q: 'Does the mockup work with portrait video?', a: 'Yes, portrait video fills the screen edge-to-edge and loops. Landscape sources are letterboxed or cropped based on the fit mode you choose.' },
		],
	},
	{
		slug: 'ipad-pro-mockup',
		name: 'iPad Pro',
		playgroundId: 'ipadPro',
		cardImg: '/cards/ipadPro-apple.webp',
		seoTitle: 'iPad Pro Mockup — Free Interactive 3D (Framer-ready)',
		seoDescription:
			'Interactive 3D iPad Pro mockup in your browser: drop a screenshot or video on the screen, orbit the tablet, export 4K or embed it live on your Framer site.',
		intro: [
			'Tablet mockups are where dashboards, web apps and reading experiences get shown — and where a static template with a fixed 3/4 angle gets old fast. This iPad Pro is a real-time 3D model: pose it flat like on a desk, standing like on a stand, or floating like a hero shot.',
			'Drop your app screenshot below. In Framer, the same iPad lives on your canvas in Space Black or Silver, animates on scroll, and exports at 4K with transparency.',
		],
		faq: [
			{ q: 'Is this iPad mockup good for dashboard screenshots?', a: 'Ideal — the large screen and landscape support make it the natural device for SaaS dashboards, admin panels and web apps.' },
			{ q: 'Portrait or landscape?', a: 'Both. The screen auto-fits your content orientation, and you can rotate the device to landscape in one tap in the plugin.' },
			{ q: 'Can visitors interact with it on my site?', a: 'Yes — with the Orbit plan, the published Framer page renders this exact 3D scene, and visitors can orbit the iPad or watch it follow their cursor.' },
		],
	},
	{
		slug: 'apple-watch-ultra-mockup',
		name: 'Apple Watch Ultra',
		playgroundId: 'appleWatchUltra',
		cardImg: '/cards/appleWatchUltra.jpg',
		seoTitle: 'Apple Watch Ultra Mockup — Free Interactive 3D',
		seoDescription:
			'Real-time 3D Apple Watch Ultra mockup: drop your watch face or app screen, orbit the titanium case, export 4K. Built for Framer.',
		intro: [
			'Watch apps are brutally hard to mock up — the screen is tiny, the case is sculptural, and flat templates flatten exactly what makes the Ultra look premium: the titanium, the crown guard, the depth.',
			'This is the real 3D case. Drop your watch face or app screen on it (it fits automatically with the right rounding), orbit around the crown, and ship it as a 4K render or a live scene in Framer.',
		],
		faq: [
			{ q: 'How does my screen fit the round-cornered display?', a: 'The screen mesh applies your content in “contain” mode with the exact corner mask of the real display — no manual masking.' },
			{ q: 'Natural or Black Titanium?', a: 'Both finishes are available, plus custom colors and material finishes in the plugin.' },
			{ q: 'Can I show a complication-heavy watch face?', a: 'Yes — drop any image at the Watch’s aspect ratio and it renders pixel-sharp on the display.' },
		],
	},
	{
		slug: 'imac-mockup',
		name: 'iMac',
		playgroundId: 'imac',
		cardImg: '/cards/imac-apple.webp',
		seoTitle: 'iMac Mockup — Free Interactive 3D (Framer-ready)',
		seoDescription:
			'Interactive 3D iMac mockup: put your website or app on the 24-inch display, pick Blue, Green or Silver, orbit the scene, export 4K or embed it live in Framer.',
		intro: [
			'Desktop mockups sell websites — and the iMac’s colored chassis makes it the most recognizable desktop canvas there is. This is the real 3D model, recentered so camera moves pivot around the display, not the stand.',
			'Drop a full-width website screenshot below and orbit. In Framer, pair it with the scroll animation: the iMac rotates as your visitor scrolls the page.',
		],
		faq: [
			{ q: 'What screenshot size works best?', a: 'Anything at 16:9 or wider fills the 24-inch display cleanly. Full-page screenshots are cropped from the top by default.' },
			{ q: 'Which colors are available?', a: 'Blue, Green and Silver on this page — the plugin adds custom colors and finishes.' },
			{ q: 'Is this better than a flat browser mockup?', a: 'Different job: a browser frame shows UI detail, the iMac sells context and desirability. Landing heroes usually want the second.' },
		],
	},
	{
		slug: 'macbook-pro-mockup',
		name: 'MacBook Pro 14"',
		playgroundId: 'macbookPro',
		cardImg: '/cards/macbookPro-apple.webp',
		seoTitle: 'MacBook Pro Mockup — Real 3D for Framer',
		seoDescription:
			'3D MacBook Pro 14" mockup for Framer: drop your website or app on the Liquid Retina XDR display, pose the lid angle, export 4K or embed the live scene.',
		intro: [
			'The MacBook Pro is the default “serious product” mockup — code editors, SaaS dashboards, pro tools. In Mockiosa it’s a production-grade GLB with a posable lid: closed-to-open reveals are one keyframe away.',
			'Drop your website or dashboard screenshot below and orbit the laptop — same model, same materials as in the Framer plugin.',
		],
		faq: [
			{ q: 'Can I animate the lid opening?', a: 'The lid angle is posable in the plugin; the opening animation is on the roadmap.' },
			{ q: 'Space Black or Silver?', a: 'Both official finishes, plus custom colors with matte, metal and glossy materials.' },
			{ q: 'Does it work for non-Mac apps?', a: 'Of course — any screenshot or video renders on the display. Windows apps included, we won’t tell.' },
		],
	},
	{
		slug: 'studio-display-mockup',
		name: 'Studio Display',
		playgroundId: 'appleProDisplayXDR',
		cardImg: '/cards/appleProDisplayXDR.jpg',
		seoTitle: 'Apple Studio Display Mockup — Real 3D for Framer',
		seoDescription:
			'3D Apple Studio Display mockup: your design on the 27-inch 5K display, in real 3D, inside Framer. Drop a screenshot, pose the scene, publish it live.',
		intro: [
			'When the design itself is the product — brand systems, portfolios, pro tools — the Studio Display is the frame that says “studio grade”. Clean aluminum, thin bezels, the desktop monitor designers actually recognize.',
			'The device ships in the Mockiosa plugin: drop your screenshot on the 5K display, pose the angle, and publish the scene live on your Framer site or export it in 4K.',
		],
		faq: [
			{ q: 'Why mock up on a Studio Display?', a: 'It signals a pro-grade desk context: studios, agencies, serious software. For portfolio heroes it reads more “craft” than a laptop.' },
			{ q: 'What screenshot size works best?', a: 'The panel is 5K 16:9 — any wide screenshot fills it cleanly; full-page captures are cropped from the top by default.' },
			{ q: 'Which plan includes it?', a: 'Like every device, Studio Display is available on all plans — full 3D animations for it live in the Orbit plan.' },
		],
	},
]

export function getDevicePage(slug: string): DevicePage | undefined {
	return DEVICE_PAGES.find((d) => d.slug === slug)
}
