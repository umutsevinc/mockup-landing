import type {Device} from './mockup-types'

/**
 * Devices interactifs de la landing (hero + Take a closer look) —
 * source UNIQUE. GLB servis depuis /public/3d ; les champs écran
 * correspondent aux modèles LOCAUX (qui diffèrent parfois des modèles
 * Supabase du plugin — voir commentaires).
 */
export type PlaygroundDevice = Device & {chip: string}

export const PLAYGROUND_DEVICES: PlaygroundDevice[] = [
	{
		id: 'iphone17pro',
		description: null,
		title: 'iPhone 17 Pro',
		model_url: '/3d/iphone17pro.glb',
		default_scale: 0.42,
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
		default_scale: 0.32,
		// GLB local ≠ modèle Supabase (noms Cube.006_*) — écran = dalle
		// plate émissive texturée, UVs tête-bêche → rot 180 + miroir X.
		screen_mesh_name: 'Cube.006_Material.004_0',
		screen_material_name: 'Material.004',
		screen_parent_name: null,
		screen_rotation_deg: 180,
		screen_mirror_x: true,
		screen_orientation: 'vertical',
		screen_fit_mode: 'cover',
		chip: '/cards/iphoneAir.jpg',
	},
	{
		id: 'ipadPro',
		description: null,
		title: 'iPad Pro',
		model_url: '/3d/ipad.glb',
		default_scale: 0.36,
		screen_mesh_name: 'Display',
		screen_material_name: 'Display',
		screen_parent_name: null,
		screen_rotation_deg: 0,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/ipadPro.jpg',
	},
	{
		id: 'appleWatchUltra',
		description: null,
		title: 'Apple Watch Ultra',
		model_url: '/3d/appleWatchUltra.glb',
		default_scale: 0.48,
		// Origine du GLB décalée vers le bas — remonté dans le frame.
		y_offset: 0.28,
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
		default_scale: 0.03,
		screen_mesh_name: 'Display',
		screen_material_name: 'Display',
		screen_parent_name: null,
		screen_rotation_deg: 180,
		screen_orientation: 'horizontal',
		screen_fit_mode: 'cover',
		chip: '/cards/imac.jpg',
	},
]
