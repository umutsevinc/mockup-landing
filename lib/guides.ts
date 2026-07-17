// ─────────────────────────────────────────────────────────────────────
// Guides longue traîne — recherches "framer + mockup" (faible
// concurrence, forte intention). Un guide = étapes concrètes + CTA.
// ─────────────────────────────────────────────────────────────────────

export type GuideSection = { h2: string; paragraphs: string[] }

export type Guide = {
	slug: string
	title: string
	seoTitle: string
	seoDescription: string
	intro: string
	sections: GuideSection[]
	related: { label: string; href: string }[]
}

export const GUIDES: Guide[] = [
	{
		slug: 'how-to-add-3d-mockup-in-framer',
		title: 'How to add a 3D mockup in Framer',
		seoTitle: 'How to Add a 3D Mockup in Framer (2026 Guide)',
		seoDescription:
			'Add a real 3D device mockup to your Framer site in under five minutes: install a plugin, drop your screenshot, pose the camera, publish. Step-by-step guide.',
		intro:
			'Framer has no native 3D device mockups — the usual workaround is rendering a PNG in another tool and re-importing it forever. Here is the five-minute way to get a real, live 3D mockup on your Framer canvas instead.',
		sections: [
			{
				h2: '1. Install a 3D mockup plugin',
				paragraphs: [
					'Open your Framer project, press ⌘K and search the plugin marketplace for a 3D mockup plugin — Mockiosa is built exactly for this. The plugin opens in a side panel; no separate app, no export/import loop.',
				],
			},
			{
				h2: '2. Pick a device and drop your screenshot',
				paragraphs: [
					'Choose your device (iPhone 17 Pro, iPad Pro, MacBook Pro, iMac, Apple Watch Ultra…). Then drag any image or video onto the canvas — it auto-fits the device screen, portrait or landscape. Video files play directly on the screen, looped.',
				],
			},
			{
				h2: '3. Pose the camera and the light',
				paragraphs: [
					'Orbit with the mouse until the angle sells the shot. Pick a device color (official finishes or your brand hex), adjust the studio light, and preview animations: follow-cursor, float, auto-orbit, scroll-rotate.',
				],
			},
			{
				h2: '4. Publish live — or export 4K',
				paragraphs: [
					'Two ways to ship. Export: a 4K PNG with transparency or an MP4/WebM video, rendered in your browser. Or publish LIVE: paste the code component on your page and the real 3D scene renders on your published site, reacting to your visitors.',
					'The live route is what a static mockup can never do — and it updates automatically when you re-pose the scene in the plugin.',
				],
			},
		],
		related: [
			{ label: 'iPhone 17 Pro mockup (try it live)', href: '/mockups/iphone-17-pro-mockup' },
			{ label: 'Mockiosa vs Rotato', href: '/compare/rotato' },
		],
	},
	{
		slug: 'how-to-embed-interactive-iphone-in-framer',
		title: 'How to embed an interactive iPhone in Framer',
		seoTitle: 'Embed an Interactive 3D iPhone in Framer (Live, Not a Video)',
		seoDescription:
			'Make your Framer hero interactive: embed a real 3D iPhone that visitors can orbit and that follows their cursor. No code, no Blender — step-by-step.',
		intro:
			'A video of a rotating iPhone is fine. An iPhone your visitor can actually grab, orbit and watch follow their cursor is a different landing page. Here is how to embed one in Framer without writing code.',
		sections: [
			{
				h2: 'Why live 3D beats an exported video',
				paragraphs: [
					'A video weighs megabytes, blurs on retina, and ignores the visitor. A live WebGL scene weighs about as much as a large image, stays pixel-sharp at any size, and responds — follow-cursor, grab-to-rotate, scroll motion. Interaction is what makes people stop scrolling.',
				],
			},
			{
				h2: 'Step 1 — Pose your scene in the plugin',
				paragraphs: [
					'In Mockiosa’s panel, pick the iPhone, drop your app screenshot or a screen recording, choose the finish, set the angle. Toggle the animation you want on the published page: follow-cursor is the crowd favorite for heroes.',
				],
			},
			{
				h2: 'Step 2 — Save the scene and copy the component',
				paragraphs: [
					'Save the scene to your library (cloud-synced). The plugin gives you a Framer code component bound to that scene — copy it.',
				],
			},
			{
				h2: 'Step 3 — Paste on your page and publish',
				paragraphs: [
					'Paste the component where the mockup should live, size it like any frame, publish. The published page renders the real 3D scene. Re-pose the scene later in the plugin and the site updates — no re-export, no re-upload.',
					'Performance note: the embed is lazy-loaded, pauses off-screen, and caps its frame budget — it will not tank your Lighthouse score.',
				],
			},
		],
		related: [
			{ label: 'iPhone Air mockup (try it live)', href: '/mockups/iphone-air-mockup' },
			{ label: 'Mockiosa vs Shots.so', href: '/compare/shots-so' },
		],
	},
	{
		slug: 'rotato-vs-framer-plugins',
		title: 'Rotato vs Framer plugins: where should your mockup live?',
		seoTitle: 'Rotato vs Framer Mockup Plugins — Which Workflow Wins in 2026?',
		seoDescription:
			'Rotato renders beautiful device videos on macOS. Framer-native plugins keep the 3D scene inside your site workflow. Honest comparison of both workflows for designers.',
		intro:
			'Rotato is the reference desktop app for 3D device shots. Framer plugins like Mockiosa put the same kind of 3D device directly inside your site builder. The real question is not which renders prettier — both are excellent — it is where your mockup should live.',
		sections: [
			{
				h2: 'The Rotato workflow: render, export, import, repeat',
				paragraphs: [
					'Rotato is a macOS app with a deep device library and fine camera control. You pose, you render a video or PNG, you import it into Framer. It works — until the screenshot changes and the loop starts again. For teams shipping weekly, the loop IS the cost.',
				],
			},
			{
				h2: 'The plugin workflow: the scene lives in your site',
				paragraphs: [
					'A Framer-native plugin renders the device on your canvas. Change the screenshot: drop the new one. Change the angle: drag. The published site can even render the live 3D scene itself — interactive, cursor-reactive — which no exported file can do.',
				],
			},
			{
				h2: 'When Rotato still wins',
				paragraphs: [
					'Multi-device compositions, cinematic camera cuts for a launch film, devices Mockiosa doesn’t ship yet, or a workflow outside Framer entirely (Figma, video editing). Rotato’s library and video compositing remain ahead.',
				],
			},
			{
				h2: 'The verdict',
				paragraphs: [
					'If your deliverable is a video file, Rotato. If your deliverable is a Framer site, a native plugin removes the entire export loop — and adds live interaction Rotato can’t ship. Full feature-by-feature table on our comparison page.',
				],
			},
		],
		related: [
			{ label: 'Mockiosa vs Rotato — full comparison', href: '/compare/rotato' },
			{ label: 'How to add a 3D mockup in Framer', href: '/guides/how-to-add-3d-mockup-in-framer' },
		],
	},
]

export function getGuide(slug: string): Guide | undefined {
	return GUIDES.find((g) => g.slug === slug)
}
