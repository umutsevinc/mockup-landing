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
		version: '1.4.0',
		name: 'Device library',
		date: 'July 16, 2026',
		highlight: true,
		headline: 'Official catalog cards, and devices that sit exactly where they should.',
		story: [
			'The device picker used to be a grid of renders we shot ourselves — serviceable, but every card had its own lighting, its own crop, its own idea of where the device sat. The library now uses the official catalog artwork for every Apple device, trimmed to the pixel so each device anchors to the same corner of its card.',
			{
				video: '/changelog/1.4-device-cards.mp4',
				aspect: '16/10',
				caption: 'The device library — official artwork, white full-height cards, devices anchored bottom-right.',
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
