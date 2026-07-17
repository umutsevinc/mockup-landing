// ─────────────────────────────────────────────────────────────────────
// Pages "Mockiosa vs X" — données structurées, format inspiré de
// usedropshot.com/compare : TL;DR double, tableau honnête, "quand eux
// sont meilleurs" AVANT "quand nous", conclusion nuancée, lien sortant
// vers le concurrent (signal E-E-A-T).
//
// Règle d'or : rester factuel et fair-play. On ne dénigre pas, on
// segmente les cas d'usage. C'est ce qui fait ranker ces pages ET
// convertir les visiteurs comparateurs.
// ─────────────────────────────────────────────────────────────────────

export type CompareFeature = {
	label: string
	mockiosa: string | boolean
	competitor: string | boolean
	note?: string
}

export type CompareEntry = {
	slug: string
	competitor: string
	competitorUrl: string
	tagline: string
	seoTitle: string
	seoDescription: string
	tldr: { competitor: string; mockiosa: string }
	features: CompareFeature[]
	whenCompetitor: string[]
	whenMockiosa: string[]
	closing: string
}

const SHARED_ROWS = {
	livesInFramer: (competitor: string | boolean): CompareFeature => ({
		label: 'Lives inside Framer',
		mockiosa: 'Native plugin',
		competitor,
		note: 'The device renders on your Framer canvas — no export/import loop.',
	}),
	liveEmbed: (competitor: string | boolean): CompareFeature => ({
		label: 'Live interactive 3D on your published site',
		mockiosa: 'Code component',
		competitor,
		note: 'The real scene — orbit, follow-cursor — running on your live landing, not a rendered file.',
	}),
}

export const COMPARE_ENTRIES: CompareEntry[] = [
	{
		slug: 'rotato',
		competitor: 'Rotato',
		competitorUrl: 'https://rotato.app',
		tagline: 'Rotato alternative that lives inside Framer — and publishes live 3D, not just video files.',
		seoTitle: 'Rotato Alternative for Framer — Mockiosa vs Rotato (3D Mockups)',
		seoDescription:
			'Looking for a Rotato alternative that works inside Framer? Mockiosa renders real-time 3D device mockups on your Framer canvas and publishes them live on your site. Honest comparison.',
		tldr: {
			competitor:
				'Pick Rotato if you want a deep macOS 3D studio with a huge device library and fine-grained video compositing, and you don’t mind the export/import loop.',
			mockiosa:
				'Pick Mockiosa if you design in Framer and want the 3D device ON your canvas — posed live, published live, updated live. No exports unless you want them.',
		},
		features: [
			SHARED_ROWS.livesInFramer('macOS app, export then import'),
			{ label: 'How you run it', mockiosa: 'Framer plugin (browser)', competitor: 'Desktop app (macOS only)' },
			{ label: 'Real-time 3D orbit', mockiosa: true, competitor: true },
			SHARED_ROWS.liveEmbed(false),
			{ label: 'Video on the device screen', mockiosa: true, competitor: true },
			{ label: 'Follow-cursor / scroll animations on your site', mockiosa: true, competitor: false },
			{ label: '4K export with transparency', mockiosa: true, competitor: true },
			{ label: 'Windows / Linux', mockiosa: 'Anywhere Framer runs', competitor: false },
			{ label: 'Device library', mockiosa: '7 production GLBs (growing)', competitor: 'Very large' },
		],
		whenCompetitor: [
			'You need a device Mockiosa doesn’t ship yet — Rotato’s library is much larger today.',
			'You composite multi-device scenes with camera cuts for a full promo video.',
			'You work outside Framer (Figma, plain video editing) — Rotato is tool-agnostic.',
			'You’re on macOS and like a native desktop workflow.',
		],
		whenMockiosa: [
			'Your landing is in Framer — the mockup lives on the canvas you’re already designing in.',
			'You want the REAL 3D scene on your published site, reacting to the visitor’s cursor and scroll. Rotato ships files; Mockiosa ships the scene.',
			'Your design changes weekly — re-pose in place instead of re-exporting from another app.',
			'You want your screenshot swapped in one click, video screens included.',
			'You work on Windows or Linux.',
		],
		closing:
			'Rotato is a fantastic 3D studio — if your deliverable is a video file, it’s hard to beat. Mockiosa plays a different game: the deliverable is your live Framer site itself. If the mockup’s final home is a Framer page, skipping the export loop changes how often you’ll actually update it.',
	},
	{
		slug: 'shots-so',
		competitor: 'Shots.so',
		competitorUrl: 'https://shots.so',
		tagline: 'Shots.so alternative with real 3D, motion, and live embeds for Framer.',
		seoTitle: 'Shots.so Alternative — Mockiosa vs Shots (3D Framer Mockups)',
		seoDescription:
			'Shots.so makes beautiful static mockups. Mockiosa adds real-time 3D, orbit cameras, video screens and live interactive embeds inside Framer. Honest comparison.',
		tldr: {
			competitor:
				'Pick Shots.so if you want gorgeous static mockup images in seconds, with a big template gallery, for social posts and screenshots.',
			mockiosa:
				'Pick Mockiosa if the shot needs to move — orbit, follow the cursor, play a video on screen — or live directly on your Framer site in 3D.',
		},
		features: [
			SHARED_ROWS.livesInFramer('Separate web app'),
			{ label: 'Real-time 3D (orbit camera)', mockiosa: true, competitor: '3D-look presets, fixed angles' },
			{ label: 'Motion / animations', mockiosa: 'Orbit, float, follow-cursor, scroll', competitor: 'Mostly static' },
			SHARED_ROWS.liveEmbed(false),
			{ label: 'Video on the device screen', mockiosa: true, competitor: false },
			{ label: 'Template gallery', mockiosa: 'Scenes, not templates', competitor: 'Large and polished' },
			{ label: '4K export', mockiosa: 'PNG + transparent WebM', competitor: 'High-res images' },
		],
		whenCompetitor: [
			'You need a beautiful static shot in 30 seconds for X or Dribbble — Shots’ presets are excellent.',
			'You want stylized frames, browser windows and gradient backdrops with zero learning curve.',
			'You don’t use Framer at all.',
		],
		whenMockiosa: [
			'Your hero section needs a device that moves — real 3D, not a flat render with a tilt.',
			'You want the visitor to interact with the mockup on your published Framer site.',
			'Your screen content is a video or a Lottie, not a static screenshot.',
			'You’d rather pose the exact angle than pick from preset angles.',
		],
		closing:
			'Shots.so and Mockiosa barely compete: one perfects the static image, the other makes the scene itself live in your site. Plenty of designers use both — Shots for the tweet, Mockiosa for the landing.',
	},
	{
		slug: 'mockuuups-studio',
		competitor: 'Mockuuups Studio',
		competitorUrl: 'https://mockuuups.studio',
		tagline: 'Mockuuups Studio alternative with real-time 3D and live Framer embeds.',
		seoTitle: 'Mockuuups Studio Alternative — Mockiosa vs Mockuuups (Framer 3D)',
		seoDescription:
			'Mockuuups Studio has thousands of photo templates. Mockiosa renders one real-time 3D scene you control completely — inside Framer, published live. Honest comparison.',
		tldr: {
			competitor:
				'Pick Mockuuups Studio if you want thousands of lifestyle photo templates — hands holding phones, desks, real-world contexts — with drag-and-drop simplicity.',
			mockiosa:
				'Pick Mockiosa if you want full control of one clean 3D scene — angle, color, light, motion — living inside your Framer workflow.',
		},
		features: [
			SHARED_ROWS.livesInFramer('Desktop + web app'),
			{ label: 'Approach', mockiosa: 'One real 3D scene, fully posable', competitor: 'Thousands of photo templates' },
			{ label: 'Real-time 3D orbit', mockiosa: true, competitor: false },
			{ label: 'Lifestyle contexts (hands, desks)', mockiosa: false, competitor: true },
			SHARED_ROWS.liveEmbed(false),
			{ label: 'Video on the device screen', mockiosa: true, competitor: false },
			{ label: 'Device colors & finishes', mockiosa: 'Any color, matte/metal/glossy', competitor: 'Per template' },
		],
		whenCompetitor: [
			'You need lifestyle photography context — a phone in a hand at a café — that 3D doesn’t replicate.',
			'You produce dozens of varied static mockups per week for marketing.',
			'Template speed matters more than pixel-level control.',
		],
		whenMockiosa: [
			'You want the exact angle and color YOUR brand needs, not the closest template.',
			'The mockup goes on a Framer landing and should move or react to visitors.',
			'You need video content on the screen.',
			'You want one tool inside Framer, not another app in the stack.',
		],
		closing:
			'Mockuuups is a template library, Mockiosa is a 3D studio in your Framer sidebar. If your output is varied marketing statics, templates win on volume. If your output is a landing page that has to feel premium and alive, real 3D wins on control.',
	},
	{
		slug: 'smartmockups',
		competitor: 'Smartmockups',
		competitorUrl: 'https://smartmockups.com',
		tagline: 'Smartmockups alternative with real-time 3D and interactive embeds for Framer.',
		seoTitle: 'Smartmockups Alternative — Mockiosa vs Smartmockups (Framer)',
		seoDescription:
			'Smartmockups generates static template mockups. Mockiosa renders real-time 3D devices inside Framer with orbit, video screens and live publishing. Honest comparison.',
		tldr: {
			competitor:
				'Pick Smartmockups if you want a huge catalog of static mockup templates (devices, apparel, print) integrated with Canva.',
			mockiosa:
				'Pick Mockiosa if your mockup is a device with YOUR screen on it, in 3D, on a Framer site — posed, animated and published by you.',
		},
		features: [
			SHARED_ROWS.livesInFramer('Web app (Canva ecosystem)'),
			{ label: 'Scope', mockiosa: 'Apple/Samsung devices in 3D', competitor: 'Devices + apparel + print templates' },
			{ label: 'Real-time 3D orbit', mockiosa: true, competitor: false },
			{ label: 'Motion / animations', mockiosa: true, competitor: false },
			SHARED_ROWS.liveEmbed(false),
			{ label: 'Video on the device screen', mockiosa: true, competitor: 'Limited video mockups' },
			{ label: '4K transparent export', mockiosa: true, competitor: 'Image export' },
		],
		whenCompetitor: [
			'You also mock up t-shirts, mugs, books and packaging — Smartmockups covers physical goods.',
			'You live in Canva and want mockups in the same flow.',
			'You need quick statics with photo backgrounds.',
		],
		whenMockiosa: [
			'Device mockups are the point, and they should look like product photography you control.',
			'Your Framer landing deserves an interactive 3D hero, not a flat JPEG.',
			'You need transparency, 4K, video screens, or scroll-reactive motion.',
		],
		closing:
			'Smartmockups is breadth — every product category, static. Mockiosa is depth — one category (device mockups), taken to real-time 3D inside your design tool. Pick by what your week actually looks like.',
	},
	{
		slug: 'previewed',
		competitor: 'Previewed',
		competitorUrl: 'https://previewed.app',
		tagline: 'Previewed alternative for Framer — pose any scene, publish it live in 3D.',
		seoTitle: 'Previewed Alternative — Mockiosa vs Previewed (App Store & Framer)',
		seoDescription:
			'Previewed builds templated App Store previews. Mockiosa gives you a free-form real-time 3D device inside Framer — live embeds, 4K export, video screens. Honest comparison.',
		tldr: {
			competitor:
				'Pick Previewed if you want polished App Store screenshot sets and preview videos from templates, fast.',
			mockiosa:
				'Pick Mockiosa if you want a free-form 3D scene — your angle, your motion — for your website first, with 4K exports that also work for stores.',
		},
		features: [
			SHARED_ROWS.livesInFramer('Web app'),
			{ label: 'Primary output', mockiosa: 'Live Framer scenes + 4K exports', competitor: 'App Store asset sets' },
			{ label: 'Free-form camera', mockiosa: true, competitor: 'Template-driven' },
			SHARED_ROWS.liveEmbed(false),
			{ label: 'Video on the device screen', mockiosa: true, competitor: true },
			{ label: 'Store-format presets (sizes, captions)', mockiosa: false, competitor: true },
			{ label: 'Follow-cursor / scroll animations', mockiosa: true, competitor: false },
		],
		whenCompetitor: [
			'You’re shipping to the App Store this week and need every required size with captions — templates save hours.',
			'You want a guided flow rather than a 3D scene to pose.',
		],
		whenMockiosa: [
			'The website comes first — your Framer hero, Product Hunt gallery, social clips.',
			'You want one scene you re-pose forever instead of re-templating.',
			'You want the live interactive mockup on your site, which no store-asset tool does.',
		],
		closing:
			'Previewed optimizes for store submission day. Mockiosa optimizes for every other day — the landing that sells the app between releases. They coexist happily; they just answer different questions.',
	},
]

COMPARE_ENTRIES.push(
	{
		slug: 'after-effects',
		competitor: 'After Effects',
		competitorUrl: 'https://www.adobe.com/products/aftereffects.html',
		tagline: 'The device mockup without the After Effects timeline — posed in Framer, published live.',
		seoTitle: 'After Effects Alternative for Device Mockups — Mockiosa vs AE',
		seoDescription:
			'Need a 3D device mockup without learning After Effects? Mockiosa poses, animates and publishes real 3D devices inside Framer — no timeline, no rendering queue. Honest comparison.',
		tldr: {
			competitor:
				'Pick After Effects if you’re producing full motion design — compositing, typography, transitions, sound — and the device shot is one layer among many.',
			mockiosa:
				'Pick Mockiosa if the deliverable IS the device mockup. Pose it in Framer in minutes, animate it with toggles, publish it live — no keyframe graph, no render queue.',
		},
		features: [
			{ label: 'Learning curve', mockiosa: 'Minutes', competitor: 'Weeks to months' },
			{ label: 'Where it runs', mockiosa: 'Framer plugin (browser)', competitor: 'Desktop app (subscription)' },
			{ label: 'Real-time 3D preview', mockiosa: true, competitor: 'Depends on scene / GPU' },
			{ label: 'Render / export time', mockiosa: 'Seconds, in-browser', competitor: 'Render queue' },
			{ label: 'Live interactive 3D on your site', mockiosa: 'Code component', competitor: false },
			{ label: 'Full compositing & motion design', mockiosa: false, competitor: true },
			{ label: 'Device library included', mockiosa: '7 production GLBs', competitor: 'Bring your own models/plugins' },
		],
		whenCompetitor: [
			'You’re making a full launch film — cuts, typography, sound design, transitions.',
			'You need compositing beyond a device on a background.',
			'You already live in Adobe’s ecosystem and render pipeline.',
		],
		whenMockiosa: [
			'You need a hero mockup for a landing page this afternoon, not after an AE course.',
			'The mockup must live ON the site — interactive, cursor-reactive — not as an exported video.',
			'Your design changes weekly and re-rendering an AE comp every time is the bottleneck.',
			'You’re a designer, not a motion designer — and it shows in AE, not in Mockiosa.',
		],
		closing:
			'After Effects is a film studio; Mockiosa is a product-shot studio. If your output is 30 seconds of motion design, AE has no rival. If your output is “my app, on a device, looking premium on my Framer site” — that’s the entire reason Mockiosa exists.',
	},
	{
		slug: 'blender',
		competitor: 'Blender',
		competitorUrl: 'https://www.blender.org',
		tagline: 'Blender-grade 3D device shots, without opening Blender.',
		seoTitle: 'Blender Alternative for Device Mockups — Mockiosa vs Blender',
		seoDescription:
			'Skip modeling, lighting and render setup: Mockiosa gives you production-grade 3D device mockups inside Framer — posed in minutes, published live. Honest comparison with Blender.',
		tldr: {
			competitor:
				'Pick Blender if you need full 3D control — custom scenes, custom models, cinematic lighting, simulation — and you have the skills (or the time to build them).',
			mockiosa:
				'Pick Mockiosa if you need ONE thing Blender does, done in 1% of the time: your screen on a beautiful 3D device, lit correctly, shipped to your Framer site.',
		},
		features: [
			{ label: 'Price', mockiosa: 'From $9.99/mo', competitor: 'Free, open source' },
			{ label: 'Learning curve', mockiosa: 'Minutes', competitor: 'Months' },
			{ label: 'Devices ready out of the box', mockiosa: '7 production GLBs, screens rigged', competitor: 'Find/buy/rig models yourself' },
			{ label: 'Screen content mapping', mockiosa: 'Drop image/video, auto-fit', competitor: 'Manual UV/material setup' },
			{ label: 'Live interactive 3D on your site', mockiosa: 'Code component', competitor: false },
			{ label: 'Custom scenes / any 3D object', mockiosa: false, competitor: true },
			{ label: 'Render engine', mockiosa: 'Real-time WebGL', competitor: 'Cycles/Eevee (offline quality ceiling)' },
		],
		whenCompetitor: [
			'You need a custom scene — the device on a desk, in a hand, exploded views, particles.',
			'You want offline-render quality (Cycles) for print or cinema.',
			'You model your own hardware or non-Apple devices.',
			'Budget is zero and time is unlimited.',
		],
		whenMockiosa: [
			'You need the mockup today and you’ve never rigged a screen material in your life.',
			'The destination is a Framer site — Mockiosa publishes the actual 3D scene there.',
			'You update the screenshot weekly; in Blender that’s a re-render, in Mockiosa it’s a drop.',
			'You want follow-cursor and scroll animations without writing a line of code.',
		],
		closing:
			'Blender can do everything Mockiosa does — the way a machine shop can make you a coffee mug. If device mockups are a daily deliverable and your canvas is Framer, a purpose-built tool wins on time every single week. If you need full 3D freedom, Blender remains the king, and it’s free.',
	},
)

export function getCompareEntry(slug: string): CompareEntry | undefined {
	return COMPARE_ENTRIES.find((e) => e.slug === slug)
}
