// ─────────────────────────────────────────────────────────────────────
// Changelog data — format inspiré de usedropshot.com/changelog.
//
// ⚠️ ENTRÉES D'AMORÇAGE : reconstruit depuis l'historique réel du
// plugin/embed (git), mais à relire et compléter — remplace les
// headlines/textes par tes propres mots, et ajoute les vraies dates.
//
// Format d'une entrée :
//  - version + name (nom de release, ex. "Ambient") + date
//  - highlight: true → grosse release (visuellement mise en avant)
//  - headline : une phrase d'accroche
//  - story (optionnel, releases majeures) : paragraphes + médias mêlés
//  - items : liste à badges — ✨ nouveauté · 🐛 fix · 🎨 design · ⚡ perf · 🔧 interne
//
// Médias : dépose les fichiers dans /public/changelog/ puis référence
// { video: '/changelog/xxx.mp4' } ou { image: '/changelog/xxx.png' }.
// Tant que le fichier n'existe pas, la page affiche un placeholder.
// ─────────────────────────────────────────────────────────────────────

export type ChangelogMedia = {
	video?: string
	image?: string
	aspect?: string
	caption?: string
}

export type ChangelogItem = {
	kind: '✨' | '🐛' | '🎨' | '⚡' | '🔧'
	text: string
}

export type ChangelogEntry = {
	version: string
	name: string
	date: string
	highlight?: boolean
	headline: string
	story?: (string | ChangelogMedia)[]
	items: ChangelogItem[]
}

export const CHANGELOG: ChangelogEntry[] = [
	{
		version: '1.5.0',
		name: 'Liftoff',
		date: 'July 24, 2026',
		highlight: true,
		headline: 'Mockiosa is live — real 3D device mockups, public in Framer.',
		story: [
			'We opened the doors. The Framer plugin is out, the free playground at /free is open to everyone, and Mockiosa is featured on Product Hunt, Launch Llama, Peerlist and Noon Launch. Drop a screenshot on a real 3D Apple device, pose it, and ship it live on your Framer site — no Blender, no After Effects.',
			'The headline addition this release: Mockiosa now hosts your screen videos for you, so your published Framer site stays light instead of carrying the heavy MP4.',
		],
		items: [
			{ kind: '✨', text: 'Public launch — the Framer plugin and the free playground at /free are open to everyone.' },
			{ kind: '✨', text: 'Video hosting on Mockiosa — screen videos are served from our edge, keeping your Framer site fast instead of shipping a heavy file.' },
			{ kind: '✨', text: 'Live 3D embed (Orbit) — a Framer code component renders your real 3D scene on the published site, re-checks the subscription on each mount, and falls back to a watermarked PNG if the plan lapses.' },
			{ kind: '✨', text: 'Capture your live website straight onto the device screen (Orbit) — the real page, not a screenshot.' },
			{ kind: '🎨', text: 'New brand mark — the Mockiosa feather went full 3D, and now shows up as the favicon everywhere (tab, Google, iOS).' },
		],
	},
	{
		version: '1.4.5',
		name: 'Finishes',
		date: 'July 20, 2026',
		headline: 'Any color, any finish — and room to drop bigger files.',
		items: [
			{ kind: '✨', text: 'Custom device textures — pick any hex color plus matte, brushed metal or glossy finish, on every device.' },
			{ kind: '✨', text: 'Take a closer look now accepts drag-and-drop: drop a photo or video straight onto the 3D device to preview it.' },
			{ kind: '⚡', text: 'Media upload cap raised to 20 MB for both images and video.' },
		],
	},
	{
		version: '1.4.0',
		name: 'Device library',
		date: 'July 16, 2026',
		highlight: true,
		headline: 'Official catalog cards, and devices that sit exactly where they should.',
		story: [
			'The device picker used to be a grid of renders we shot ourselves — serviceable, but every card had its own lighting, its own crop, its own idea of where the device sat. The library now uses the official catalog artwork for every Apple device, trimmed to the pixel so each device anchors to the same corner of its card.',
			{
				video: 'https://memselon-media.memselon.workers.dev/marketing/videos/FullDevice.mp4',
				aspect: '16/10',
				caption: 'Every device, real 3D — the full library in motion.',
			},
			'The iMac M1 GLB also got recentered: its origin is now the screen center, so orbit and float animations pivot around the display instead of the stand.',
		],
		items: [
			{ kind: '🎨', text: 'Device cards rebuilt on official Apple catalog artwork — iPhone 17 Pro, iPhone Air, iPad Pro, MacBook Pro 16", iMac — trimmed to content so devices sit flush in their cards.' },
			{ kind: '🔧', text: 'iMac M1 GLB recentered (origin = screen center) so camera animations pivot around the display.' },
			{ kind: '🐛', text: 'Export poster is recaptured at video start — seamless with the restart-from-0 behavior.' },
		],
	},
	{
		version: '1.3.0',
		name: 'Cloudflare media',
		date: 'July 2026',
		headline: 'Every GLB, screen video and thumbnail now ships from the edge.',
		items: [
			{ kind: '⚡', text: 'All media moved from Supabase Storage to Cloudflare R2 behind a Worker (memselon-media) — GLBs are served immutable for a year with a version buster, so replaced models update instantly without breaking caches.' },
			{ kind: '🐛', text: 'Embed falls back gracefully when a model briefly 503s — never a black scene on a public link.' },
			{ kind: '🔧', text: 'Screen-content color matching (2nd-net by RGB distance) brought to plugin parity in the embed.' },
		],
	},
	{
		version: '1.2.0',
		name: 'Loading feather',
		date: 'July 2026',
		headline: 'The mascot got out of the way.',
		items: [
			{ kind: '🎨', text: 'Loading state is now just the floating feather — no progress strip, no air streams. Quieter, faster to paint.' },
			{ kind: '⚡', text: 'Live embeds pause their render loop when off-screen — near-zero GPU cost until the visitor scrolls back.' },
		],
	},
]
