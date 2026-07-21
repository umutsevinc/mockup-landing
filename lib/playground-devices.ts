import type {Device} from './mockup-types'

/**
 * Devices interactifs de la landing (hero + Take a closer look +
 * viewers /mockups) — MIROIR du catalogue du plugin (table Supabase
 * `devices`, sync 17/07/2026) : GLB téléchargés depuis R2 dans
 * /public/3d, configs écran/scale = valeurs exactes de la table
 * (éprouvées dans l'embed avec ces mêmes modèles).
 */
export type PlaygroundDevice = Device & {chip: string}

/**
 * Finitions officielles par device (max 3 pour l'instant — même rail
 * que la waitlist). La PREMIÈRE couleur est la sélection par défaut.
 */
export const DEVICE_FINISH_COLORS: Record<string, string[]> = {
	iphone17pro: ['#E0762C', '#2F3B4E', '#F1F2F4'], // Cosmic Orange / Deep Blue / Silver
	iphoneAir: ['#BFD3E0', '#E6DCC3', '#39393B'], // Sky Blue / Light Gold / Space Black
	ipadPro: ['#2E2C2E', '#E3E4E5'], // Space Black / Silver
	appleWatchUltra: ['#C6BDAE', '#3A3A3C'], // Natural / Black Titanium
	imac: ['#4C6E8D', '#5F7A5E', '#E3E4E5'], // Blue / Green / Silver
	macbookPro: ['#2E2C2E', '#E3E4E5'], // Space Black / Silver
	appleProDisplayXDR: ['#E3E4E5'], // Silver (Studio Display)
}

export const deviceFinishColors = (id: string): string[] =>
	DEVICE_FINISH_COLORS[id] ?? DEVICE_FINISH_COLORS.iphone17pro

export const defaultFinishColor = (id: string): string => deviceFinishColors(id)[0]

export const PLAYGROUND_DEVICES: PlaygroundDevice[] = [
	{
		id: 'iphone17pro',
		description: null,
		title: 'iPhone 17 Pro',
		model_url: '/3d/iphone17pro.glb',
		default_scale: 0.35,
		screen_mesh_name: 'Object_49',
		screen_material_name: 'BsXHDwLKqtDOfrW',
		screen_parent_name: null,
		screen_rotation_deg: 0,
		screen_orientation: 'vertical',
		screen_fit_mode: 'cover',
		chip: '/cards/iphone17pro.jpg',
	},
	{
		id: 'iphoneAir',
		description: null,
		title: 'iPhone Air',
		model_url: '/3d/iphoneAir.glb',
		default_scale: 0.2,
		screen_mesh_name: 'Object_7',
		screen_material_name: '17Air_Screen',
		screen_parent_name: 'IPhone 17 Air_0',
		screen_rotation_deg: 0,
		screen_orientation: 'vertical',
		screen_fit_mode: 'cover',
		chip: '/cards/iphoneAir.jpg',
	},
	{
		id: 'ipadPro',
		description: null,
		title: 'iPad Pro',
		model_url: '/3d/ipadPro.glb',
		default_scale: 3.2,
		screen_mesh_name: 'Object_10',
		screen_material_name: 'HlUmGTGdgbnvPsa',
		screen_parent_name: null,
		screen_rotation_deg: 180,
		screen_orientation: 'vertical',
		screen_fit_mode: 'cover',
		chip: '/cards/ipadPro.jpg',
	},
	{
		id: 'appleWatchUltra',
		description: null,
		title: 'Apple Watch Ultra',
		model_url: '/3d/appleWatchUltra.glb',
		default_scale: 0.4,
		// GLB (boîtier + bracelet) recentré plus bas dans le frame.
		y_offset: 0.08,
		screen_mesh_name: 'wmnqxNpNCdRfDfA',
		screen_material_name: 'UlFjqascpPnJnyb',
		screen_parent_name: 'JHqGJTYdBJjLpDK',
		screen_rotation_deg: 180,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/appleWatchUltra.jpg',
	},
	{
		id: 'imac',
		description: null,
		title: 'iMac',
		model_url: '/3d/imac.glb',
		default_scale: 1.15,
		screen_mesh_name: 'Retina_screen_vray_screen_0',
		screen_material_name: 'vray_screen',
		screen_parent_name: null,
		screen_rotation_deg: 0,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/imac.jpg',
	},
	{
		id: 'macbookPro',
		description: null,
		title: 'MacBook Pro 14"',
		model_url: '/3d/macbookPro.glb',
		default_scale: 2.5,
		// Origine du GLB au-dessus du centre visuel → le laptop flottait
		// trop haut dans le frame. On le redescend pour le recentrer.
		y_offset: -0.28,
		screen_mesh_name: 'tfTbkkzhxqpKRgC',
		screen_material_name: 'HlQwFCAPWzetDQy',
		screen_parent_name: 'JySHOmMobJSAPQv',
		screen_rotation_deg: 0,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/macbookPro.jpg',
	},
	{
		id: 'appleProDisplayXDR',
		description: null,
		title: 'Studio Display',
		model_url: '/3d/appleProDisplayXDR.glb',
		default_scale: 1,
		screen_mesh_name: 'IyklIWCEUuwKzOr',
		screen_material_name: 'YZsKmgdmwlRdfBy',
		screen_parent_name: 'QjRcrcXBbYCUKZS',
		screen_rotation_deg: 0,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/appleProDisplayXDR.jpg',
	},
]
