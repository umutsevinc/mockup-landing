'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react'
import {OrbitControls, useGLTF, Environment, Html} from '@react-three/drei'
import {useFrame, createPortal} from '@react-three/fiber'
import * as THREE from 'three'
import type {Device, Mockup} from '@/lib/mockup-types'
import {generateWatermarkDataURL} from '@/lib/generateWatermark'

/**
 * Maps the user-facing environment_id stored on the mockup row to a
 * drei `<Environment preset>` value. Falls back to "studio" so we
 * always have a sane HDR lighting + background.
 */
function presetFor(envId: string | null | undefined): 'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'city' | 'park' | 'lobby' {
	const id = (envId || '').toLowerCase()
	if (id.includes('sunset')) return 'sunset'
	if (id.includes('dawn')) return 'dawn'
	if (id.includes('night')) return 'night'
	if (id.includes('warehouse')) return 'warehouse'
	if (id.includes('forest')) return 'forest'
	if (id.includes('city')) return 'city'
	if (id.includes('park')) return 'park'
	if (id.includes('lobby')) return 'lobby'
	return 'studio'
}

interface MockupSceneProps {
	payload: {
		mockup: Mockup
		device: Device
	}
	transparentBg?: boolean
	/** Pose "présentation" à la Apple : rotation Y additionnelle du
	    modèle + zoom caméra, LERPÉS en douceur (Take a closer look :
	    ouvrir Colours/Finish/Light tourne le device de 3/4 et zoome). */
	pose?: {rotateY?: number; zoom?: number}
	/** URL web posée en iframe LIVE sur l'écran (CSS3D, scrollable). */
	webURL?: string | null
	/** Retour élastique à la Apple : au relâchement d'un drag, la caméra
	    revient en douceur à la vue de face. */
	snapBack?: boolean
	/** Mécanisme memselon:in-viewport du plugin : hors viewport la vidéo
	    d'écran est mise en PAUSE (pas seulement le frameloop R3F) — zéro
	    décodage vidéo pour les scènes hors écran. */
	inViewport?: boolean
}

type MeshAny = THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
const isMesh = (o: THREE.Object3D): o is MeshAny => (o as any).isMesh === true

function getMatNames(mesh: MeshAny) {
	const arr = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
	return arr.map((m: any) => m?.name || '')
}

/** CanvasTexture en mode "height-cover" (remplit 100% de la hauteur, préserve le ratio) */
/** Options écran portées du plugin (PhoneModel.tsx) — rotation/miroir
 *  définis par le device (Supabase) + zoom/exposition sauvegardés avec
 *  la scène. Sans elles certains devices (Apple Watch…) rendent le
 *  contenu à l'envers. */
type ScreenTexOpts = {
	rotationDeg?: number
	orientation?: 'horizontal' | 'vertical'
	/** Miroir horizontal indépendant de l'orientation — pour les GLB
	    locaux dont les UVs écran sont flippés (iPhone Air landing). */
	mirrorX?: boolean
	imageZoom?: number
	screenExposure?: number
	/** device.screen_fit_mode — cover (default) / contain / stretch.
	    Apple Watch is FORCED to contain like in the plugin. */
	fitMode?: 'cover' | 'contain' | 'stretch'
	deviceId?: string
	/** true = média droppé par un visiteur (blob:) → filigrane plumes
	    Mockiosa imprimé dans la texture (anti-screenshot). */
	watermark?: boolean
}

/** Fit d'un média (ratio mediaAspect) dans un écran (screenAspect) —
 *  copie exacte du switch cover/contain/stretch de PhoneModel.tsx,
 *  Apple Watch forcée en contain pour éviter toute déformation. */
function computeFitRect(
	mediaAspect: number,
	screenAspect: number,
	TARGET_W: number,
	TARGET_H: number,
	opts?: ScreenTexOpts,
) {
	const idLc = (opts?.deviceId || '').toLowerCase()
	const isAppleWatch = idLc.includes('applewatch') || idLc.includes('apple-watch')
	const fitMode = isAppleWatch ? 'contain' : opts?.fitMode || 'cover'

	let drawW: number, drawH: number, dx: number, dy: number
	switch (fitMode) {
		case 'stretch':
			drawW = TARGET_W
			drawH = TARGET_H
			dx = 0
			dy = 0
			break
		case 'contain':
			if (mediaAspect > screenAspect) {
				drawW = TARGET_W
				drawH = Math.round(TARGET_W / mediaAspect)
			} else {
				drawH = TARGET_H
				drawW = Math.round(TARGET_H * mediaAspect)
			}
			dx = Math.round((TARGET_W - drawW) / 2)
			dy = Math.round((TARGET_H - drawH) / 2)
			break
		case 'cover':
		default:
			if (mediaAspect > screenAspect) {
				drawH = TARGET_H
				drawW = Math.round(TARGET_H * mediaAspect)
			} else {
				drawW = TARGET_W
				drawH = Math.round(TARGET_W / mediaAspect)
			}
			dx = Math.round((TARGET_W - drawW) / 2)
			dy = Math.round((TARGET_H - drawH) / 2)
			break
	}

	// Zoom centré, ratio préservé (même math que le plugin).
	const zoom = opts?.imageZoom && isFinite(opts.imageZoom) ? opts.imageZoom : 1
	const zW = drawW * zoom
	const zH = drawH * zoom
	return {
		dx: dx - (zW - drawW) / 2,
		dy: dy - (zH - drawH) / 2,
		dw: zW,
		dh: zH,
	}
}

/* ── Filigrane "plumes Mockiosa" ──────────────────────────────────────
   Imprimé DANS la texture écran quand le média vient d'un drop visiteur
   (URL blob:) — une capture d'écran du playground emporte donc la
   marque. Motif diagonal : plume du logo + wordmark, double passe
   (ombre sombre + trait blanc) pour rester lisible sur contenu clair
   comme sombre. Canvas caché par taille (le pipeline vidéo le redessine
   à chaque frame → un drawImage suffit). */
const FEATHER_PATHS = [
	'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z',
	'M16 8 2 22',
	'M17.5 15H9',
]
const wmCanvasCache = new Map<string, HTMLCanvasElement>()

function getWatermarkCanvas(w: number, h: number): HTMLCanvasElement {
	const key = `${w}x${h}`
	const cached = wmCanvasCache.get(key)
	if (cached) return cached

	const canvas = document.createElement('canvas')
	canvas.width = w
	canvas.height = h
	const ctx = canvas.getContext('2d')!

	const s = Math.min(w, h) / 1024 // échelle par rapport à une base 1024
	const iconSize = 44 * s
	const fontSize = Math.round(38 * s)
	const stepX = 340 * s
	const stepY = 250 * s
	ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`
	ctx.textBaseline = 'middle'

	ctx.save()
	ctx.translate(w / 2, h / 2)
	ctx.rotate((-24 * Math.PI) / 180)
	const span = Math.hypot(w, h)
	let row = 0
	for (let y = -span / 2; y < span / 2; y += stepY, row++) {
		// Décalage un rang sur deux (motif en quinconce)
		const offset = (row % 2) * (stepX / 2)
		for (let x = -span / 2 - offset; x < span / 2; x += stepX) {
			// Plume (paths du logo, viewBox 24 → iconSize)
			ctx.save()
			ctx.translate(x, y - iconSize / 2)
			ctx.scale(iconSize / 24, iconSize / 24)
			ctx.lineWidth = 2
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
			for (const pass of [
				{stroke: 'rgba(0,0,0,0.10)', dx: 0.6, dy: 0.6},
				{stroke: 'rgba(255,255,255,0.16)', dx: 0, dy: 0},
			]) {
				ctx.save()
				ctx.translate(pass.dx, pass.dy)
				ctx.strokeStyle = pass.stroke
				for (const p of FEATHER_PATHS) ctx.stroke(new Path2D(p))
				ctx.restore()
			}
			ctx.restore()
			// Wordmark
			ctx.fillStyle = 'rgba(0,0,0,0.10)'
			ctx.fillText('Mockiosa', x + iconSize + 10 * s + 0.6, y + 0.6)
			ctx.fillStyle = 'rgba(255,255,255,0.16)'
			ctx.fillText('Mockiosa', x + iconSize + 10 * s, y)
		}
	}
	ctx.restore()

	wmCanvasCache.set(key, canvas)
	return canvas
}

function drawMockiosaWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
	ctx.drawImage(getWatermarkCanvas(w, h), 0, 0)
}

function applyScreenTexTransform(tex: THREE.Texture, opts?: ScreenTexOpts) {
	const deg = opts?.rotationDeg ?? 0
	if (deg !== 0) {
		tex.center.set(0.5, 0.5)
		tex.rotation = THREE.MathUtils.degToRad(deg)
	}
	if (opts?.orientation === 'horizontal' || opts?.mirrorX) {
		tex.wrapS = THREE.RepeatWrapping
		tex.repeat.x = -1
		tex.offset.x = 1
	}
}

function drawImageHeightCoverTex(
	img: HTMLImageElement,
	screenAspect: number,
	renderer?: THREE.WebGLRenderer | null,
	opts?: ScreenTexOpts,
) {
	if (!isFinite(screenAspect) || screenAspect <= 0) {
		screenAspect = 9 / 19.5
	}

	const TARGET_H = 2048
	const TARGET_W = Math.max(2, Math.round(TARGET_H * screenAspect))

	const canvas = document.createElement('canvas')
	canvas.width = TARGET_W
	canvas.height = TARGET_H

	const ctx = canvas.getContext('2d')!
	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, TARGET_W, TARGET_H)

	const imgAspect = img.width > 0 && img.height > 0 ? img.width / img.height : 1

	if (!isFinite(imgAspect) || imgAspect <= 0) {
		return new THREE.CanvasTexture(canvas)
	}

	const rect = computeFitRect(imgAspect, screenAspect, TARGET_W, TARGET_H, opts)

	// screenExposure: 0.5 = normal — même mapping que le plugin.
	const exposure = typeof opts?.screenExposure === 'number' ? opts.screenExposure : 0.5
	ctx.filter = `brightness(${100 + (exposure - 0.5) * 200}%)`
	ctx.drawImage(img, rect.dx, rect.dy, rect.dw, rect.dh)
	ctx.filter = 'none'
	if (opts?.watermark) drawMockiosaWatermark(ctx, TARGET_W, TARGET_H)

	const tex = new THREE.CanvasTexture(canvas)
	tex.colorSpace = THREE.SRGBColorSpace
	tex.minFilter = THREE.LinearMipmapLinearFilter
	tex.magFilter = THREE.LinearFilter
	tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16
	tex.flipY = false
	tex.wrapS = THREE.ClampToEdgeWrapping
	tex.wrapT = THREE.ClampToEdgeWrapping
	applyScreenTexTransform(tex, opts)
	;(tex as any).userData = {__mockupTexture: true, __preservedAspect: imgAspect}
	return tex
}

/** CanvasTexture pour vidéo en mode "height-cover" */
function drawVideoHeightCoverTex(
	video: HTMLVideoElement,
	screenAspect: number,
	renderer?: THREE.WebGLRenderer | null,
	opts?: ScreenTexOpts,
) {
	if (!isFinite(screenAspect) || screenAspect <= 0) {
		screenAspect = 9 / 19.5
	}

	// Mobile : canvas vidéo 1024px (moitié) — divise par 4 le coût du
	// paint par frame, indiscernable sur petit écran.
	const isCoarse =
		typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
	const TARGET_H = isCoarse ? 1024 : 2048
	const TARGET_W = Math.max(2, Math.round(TARGET_H * screenAspect))

	const canvas = document.createElement('canvas')
	canvas.width = TARGET_W
	canvas.height = TARGET_H
	const ctx = canvas.getContext('2d')!

	const tex = new THREE.CanvasTexture(canvas)
	tex.colorSpace = THREE.SRGBColorSpace
	tex.minFilter = THREE.LinearMipmapLinearFilter
	tex.magFilter = THREE.LinearFilter
	tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16
	tex.flipY = false
	tex.wrapS = THREE.ClampToEdgeWrapping
	tex.wrapT = THREE.ClampToEdgeWrapping
	applyScreenTexTransform(tex, opts)
	;(tex as any).userData = {__mockupTexture: true, __videoCanvas: true}

	const exposure = typeof opts?.screenExposure === 'number' ? opts.screenExposure : 0.5
	const brightnessFilter = `brightness(${100 + (exposure - 0.5) * 200}%)`

	let rafId = 0
	const renderFrame = () => {
		try {
			// Pas de frame décodable (seek, loop, buffering) → skip, sinon
			// on peint un flash noir (même garde que le plugin).
			if (video.readyState < 2 || video.seeking) {
				rafId = requestAnimationFrame(renderFrame)
				return
			}

			ctx.fillStyle = '#000'
			ctx.fillRect(0, 0, TARGET_W, TARGET_H)

			const vidW = video.videoWidth || 1
			const vidH = video.videoHeight || 1
			const vidAspect = vidW > 0 && vidH > 0 ? vidW / vidH : 1

			if (!isFinite(vidAspect) || vidAspect <= 0) {
				rafId = requestAnimationFrame(renderFrame)
				return
			}

			const rect = computeFitRect(vidAspect, screenAspect, TARGET_W, TARGET_H, opts)

			ctx.filter = brightnessFilter
			ctx.drawImage(video, 0, 0, vidW, vidH, rect.dx, rect.dy, rect.dw, rect.dh)
			ctx.filter = 'none'
			if (opts?.watermark) drawMockiosaWatermark(ctx, TARGET_W, TARGET_H)
			tex.needsUpdate = true
		} catch {}
		rafId = requestAnimationFrame(renderFrame)
	}
	// Premier paint SYNCHRONE : attendre le premier RAF laissait un canvas
	// vide (noir) pendant ≥1 frame quand la texture est recréée en live.
	renderFrame()

	const stop = () => {
		if (rafId) cancelAnimationFrame(rafId)
	}

	return {tex, stop}
}


/** Largeur CSS (px) de l'iframe selon la famille de device. */
function webViewportWidthFor(deviceId?: string): number {
	const id = (deviceId || '').toLowerCase()
	if (/watch/.test(id)) return 190
	if (/ipad|tablet/.test(id)) return 834
	if (/iphone|phone|pixel|galaxy/.test(id)) return 390
	if (/imac|mac|display|xdr|studio/.test(id)) return 1366
	return 800
}

/**
 * Couche web CSS3D — PORT du plugin (PhoneModel.WebScreenLayer, 20/07) :
 * iframe LIVE alignée sur le mesh écran via un portal R3F, trou dans le
 * canvas via un punch NoBlending qui réutilise la GÉOMÉTRIE de l'écran
 * (coins arrondis exacts), repère calculé depuis les normales moyennées
 * de la géométrie (l'inclinaison peut être cuite dans les sommets).
 * Pièges drei réglés : scale sur le GROUP (la prop scale de <Html> est
 * ignorée en transform), distanceFactor=400 (sinon ÷40), occluder
 * interne neutralisé (three trie les opaques par programme shader).
 */
function WebScreenLayer({screen, webURL, deviceId}: {screen: MeshAny; webURL: string; deviceId?: string}) {
	const layout = React.useMemo(() => {
		const geo = screen.geometry
		const posAttr = geo.attributes.position as THREE.BufferAttribute | undefined
		if (!posAttr) return null
		const n = new THREE.Vector3()
		const nAttr = geo.attributes.normal as THREE.BufferAttribute | undefined
		if (nAttr) {
			const tmp = new THREE.Vector3()
			const ref = new THREE.Vector3().fromBufferAttribute(nAttr, 0)
			for (let i = 0; i < nAttr.count; i++) {
				tmp.fromBufferAttribute(nAttr, i)
				n.add(tmp.dot(ref) < 0 ? tmp.negate() : tmp)
			}
		}
		if (n.lengthSq() < 1e-8) {
			geo.computeBoundingBox()
			const size = geo.boundingBox!.getSize(new THREE.Vector3())
			const dims = [size.x, size.y, size.z]
			let nIdx = 0
			if (dims[1] < dims[nIdx]) nIdx = 1
			if (dims[2] < dims[nIdx]) nIdx = 2
			n.set(0, 0, 0).setComponent(nIdx, 1)
		}
		n.normalize()
		screen.updateWorldMatrix(true, false)
		const nWorld = n.clone().transformDirection(screen.matrixWorld)
		if (nWorld.z < 0) n.negate()
		const invWorld = new THREE.Matrix4().copy(screen.matrixWorld).invert()
		let up = new THREE.Vector3(0, 1, 0).transformDirection(invWorld)
		up.addScaledVector(n, -up.dot(n))
		if (up.lengthSq() < 1e-6) up = Math.abs(n.y) > 0.9 ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0)
		up.normalize()
		const right = new THREE.Vector3().crossVectors(up, n).normalize()
		let minR = Infinity
		let maxR = -Infinity
		let minU = Infinity
		let maxU = -Infinity
		let sumN = 0
		const v = new THREE.Vector3()
		for (let i = 0; i < posAttr.count; i++) {
			v.fromBufferAttribute(posAttr, i)
			const r = v.dot(right)
			const u = v.dot(up)
			if (r < minR) minR = r
			if (r > maxR) maxR = r
			if (u < minU) minU = u
			if (u > maxU) maxU = u
			sumN += v.dot(n)
		}
		const w = maxR - minR
		const h = maxU - minU
		if (!(w > 0) || !(h > 0)) return null
		const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, n))
		const position = new THREE.Vector3()
			.addScaledVector(right, (minR + maxR) / 2)
			.addScaledVector(up, (minU + maxU) / 2)
			.addScaledVector(n, sumN / posAttr.count + Math.max(w, h) * 0.004)
		return {position, quaternion, w, h}
	}, [screen, webURL])

	// L'écran WebGL ne peint plus pendant que l'iframe est active.
	const punchedRef = useRef<Set<THREE.Material>>(new Set())
	useFrame(() => {
		const mats = (Array.isArray(screen.material) ? screen.material : [screen.material]) as THREE.Material[]
		for (const m of mats) {
			if (m && (m as any).colorWrite !== false) {
				;(m as any).colorWrite = false
				punchedRef.current.add(m)
			}
		}
	})
	useEffect(() => {
		const punched = punchedRef.current
		return () => {
			punched.forEach((m) => {
				try {
					;(m as any).colorWrite = true
				} catch {}
			})
			punched.clear()
		}
	}, [screen, webURL])

	if (!layout) return null
	const wPx = webViewportWidthFor(deviceId)
	const hPx = Math.max(1, Math.round(wPx * (layout.h / layout.w)))
	const scale = layout.w / wPx
	const idLower = (deviceId || '').toLowerCase()
	const cornerPx = /watch/.test(idLower)
		? Math.round(wPx * 0.24)
		: /iphone|phone/.test(idLower)
			? Math.round(wPx * 0.13)
			: /ipad/.test(idLower)
				? Math.round(wPx * 0.045)
				: 10
	return createPortal(
		<>
			<mesh geometry={screen.geometry} renderOrder={99999}>
				<shaderMaterial
					fragmentShader="void main() { gl_FragColor = vec4(0.0); }"
					side={THREE.DoubleSide}
					blending={THREE.NoBlending}
					transparent
					depthWrite={false}
					polygonOffset
					polygonOffsetFactor={-2}
					polygonOffsetUnits={-2}
				/>
			</mesh>
			<group position={layout.position} quaternion={layout.quaternion} scale={scale}>
				<Html
					transform
					occlude="blending"
					zIndexRange={[8, 0]}
					distanceFactor={400}
					material={<meshBasicMaterial colorWrite={false} depthWrite={false} depthTest={false} />}
					style={{width: wPx, height: hPx, overflow: 'hidden', background: '#ffffff', borderRadius: cornerPx}}
				>
					<iframe
						src={webURL}
						title="Website preview"
						style={{width: '100%', height: '100%', border: 'none', display: 'block', background: '#ffffff'}}
						referrerPolicy="no-referrer"
						allow="autoplay; fullscreen"
					/>
				</Html>
			</group>
		</>,
		screen as unknown as THREE.Object3D,
	)
}

export function MockupScene({payload, transparentBg, pose, snapBack = false, inViewport = true, webURL = null}: MockupSceneProps) {
	const {mockup, device} = payload

	// Charger le modèle avec optimisations (draco activé si disponible)
	const gltf: any = useGLTF(device.model_url, true)
	// LANDING : plusieurs Canvas (hero + Take a closer look) chargent le
	// MÊME GLB — useGLTF met l'Object3D en cache et Three.js ne peut le
	// monter que dans UNE scène : le dernier monté "volait" le modèle de
	// l'autre (canvas vide). On clone donc l'arbre ET les matériaux par
	// montage — chaque Canvas a sa copie, les mutations (couleur,
	// texture écran) restent locales.
	const root: THREE.Object3D = useMemo(() => {
		const src = (gltf.scene ?? gltf.nodes?.Scene) as THREE.Object3D
		const cloned = src.clone(true)
		cloned.traverse((o) => {
			if ((o as any).isMesh) {
				const m = o as THREE.Mesh
				m.material = Array.isArray(m.material)
					? m.material.map((x) => (x as THREE.Material).clone())
					: (m.material as THREE.Material).clone()
			}
		})
		return cloned
	}, [gltf])

	const screenRef = useRef<MeshAny | null>(null)
	// Copie React du mesh écran pour monter la couche web (portal CSS3D).
	const [webScreenMesh, setWebScreenMesh] = useState<MeshAny | null>(null)
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const videoCleanupRef = useRef<(() => void) | null>(null)
	// Vidéo d'écran active + visibilité courante (mécanisme in-viewport).
	const videoElRef = useRef<HTMLVideoElement | null>(null)
	const inViewportRef = useRef(inViewport)

	// memselon:in-viewport — la vidéo d'écran ne joue que dans le viewport.
	// Sortie de vue : pause + retour à 0 → chaque entrée dans la vue
	// rejoue la vidéo depuis le début (raccord avec le poster frame 0).
	// Le frameloop R3F est déjà coupé par les parents ; ici on stoppe
	// aussi le DÉCODAGE vidéo.
	useEffect(() => {
		inViewportRef.current = inViewport
		const v = videoElRef.current
		if (!v) return
		if (inViewport) {
			v.play().catch(() => {})
		} else {
			v.pause()
			try {
				v.currentTime = 0
			} catch {}
		}
	}, [inViewport])
	const controlsRef = useRef<any>(null)

	const lightIntensity = mockup.light_intensity ?? 0.5

	// Résolution du mesh écran — porte les heuristiques du plugin
	// (PhoneModel.tsx) pour que les devices sans screen_mesh_name
	// exact soient quand même détectés.
	function isNonScreenElement(mesh: MeshAny): boolean {
		const n = mesh.name.toLowerCase()
		const m = getMatNames(mesh).map((x) => x.toLowerCase())
		const hit = (s: string) => n.includes(s) || m.some((x) => x.includes(s))
		return (
			hit('button') || hit('side') || hit('lateral') || hit('notch') ||
			hit('camera') || hit('sensor') || hit('antenna') ||
			(n.includes('frame') && !n.includes('display')) ||
			(n.includes('back') && !n.includes('display'))
		)
	}

	function pickByHeuristics(meshes: MeshAny[]): MeshAny | null {
		if (!meshes.length) return null
		const target = 9 / 19.5
		let best: {m: MeshAny; score: number} | null = null
		for (const m of meshes) {
			if (isNonScreenElement(m)) continue
			const size = new THREE.Vector3()
			new THREE.Box3().setFromObject(m).getSize(size)
			const a = size.x / (size.y || 1e-6)
			const ratioScore = Math.abs(a - target)
			const flatness = size.z
			const flatScore = Math.min(1, flatness / Math.max(size.x, size.y, 1e-6))
			const mats = getMatNames(m).join(' ')
			const nameBonus = /(display|screen|lcd|écran)/i.test(mats) ? -0.1 : 0
			const score = ratioScore + flatScore + nameBonus
			if (!best || score < best.score) best = {m, score}
		}
		return best?.m || null
	}

	function resolveScreenMesh(rootNode: THREE.Object3D): MeshAny | null {
		// 0) glTF extras (mockupRole="screen")
		let byExtras: MeshAny | null = null
		rootNode.traverse((o) => {
			if (!isMesh(o)) return
			const mesh = o as MeshAny
			if (isNonScreenElement(mesh)) return
			const extras =
				(o as any).userData?.gltfExtensions?.EXT_node_extras ||
				(o as any).userData
			if (extras && extras.mockupRole === 'screen') byExtras = mesh
		})
		if (byExtras) return byExtras

		// 1) Par nom exact
		if (device.screen_mesh_name) {
			let found: MeshAny | null = null
			rootNode.traverse((o) => {
				if (isMesh(o) && o.name === device.screen_mesh_name) found = o as MeshAny
			})
			if (found) return found
		}

		// 2) Par parent puis nom
		if (device.screen_parent_name && device.screen_mesh_name) {
			let parentNode: THREE.Object3D | null = null
			rootNode.traverse((o: THREE.Object3D) => {
				if (o.name === device.screen_parent_name) parentNode = o
			})
			if (parentNode) {
				let found: MeshAny | null = null
				;(parentNode as THREE.Object3D).traverse((o) => {
					if (isMesh(o) && o.name === device.screen_mesh_name) found = o as MeshAny
				})
				if (found) return found
			}
		}

		// 3) Par matériau
		if (device.screen_material_name) {
			let found: MeshAny | null = null
			rootNode.traverse((o) => {
				if (!isMesh(o)) return
				const mats = getMatNames(o)
				if (mats.includes(device.screen_material_name!)) found = o as MeshAny
			})
			if (found) return found
		}

		// 4) Regex sur noms de matériaux
		let byRegex: MeshAny | null = null
		rootNode.traverse((o) => {
			if (!isMesh(o)) return
			const mesh = o as MeshAny
			if (isNonScreenElement(mesh)) return
			const mats = getMatNames(mesh).join(' ')
			if (/(display|screen|lcd|écran)/i.test(mats)) byRegex = mesh
		})
		if (byRegex) return byRegex

		// 5) Heuristique ratio (fallback)
		const candidates: MeshAny[] = []
		rootNode.traverse((o) => {
			if (isMesh(o)) candidates.push(o as MeshAny)
		})
		return pickByHeuristics(candidates)
	}

	// Préserver les matériaux originaux - ne rien modifier sauf l'écran

	// Appliquer l'image/vidéo sur l'écran
	useEffect(() => {
		if (!root) return

		// Résolution avec la rotation du root NEUTRALISÉE : l'heuristique
		// (ratio 9/19.5 + platitude) mesure des Box3 monde — avec la
		// rotation -π/2 les axes x/z sont échangés et elle choisit un
		// mauvais mesh (iPhone 17 Pro gardait son wallpaper d'origine).
		// Le plugin résout au chargement, avant que la rotation du group
		// ne soit propagée, donc géométrie "à plat" = même comportement.
		const prevResolveRot = root.rotation.clone()
		let screenMesh: MeshAny | null = null
		try {
			root.rotation.set(0, 0, 0)
			root.updateMatrixWorld(true)
			screenMesh = resolveScreenMesh(root)
		} finally {
			root.rotation.copy(prevResolveRot)
			root.updateMatrixWorld(true)
		}
		if (!screenMesh) {
			console.warn("Aucun mesh d'écran trouvé")
			return
		}

		screenRef.current = screenMesh
		setWebScreenMesh((prev) => (prev === screenMesh ? prev : (screenMesh as MeshAny)))
		const mesh = screenMesh as MeshAny

		const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[]

		// Nettoyer les textures existantes
		mats.forEach((m: any) => {
			if (m && m.map) {
				try {
					m.map.dispose?.()
					m.map = null
					m.needsUpdate = true
				} catch (e) {
					console.warn('Erreur nettoyage texture:', e)
				}
			}
		})

		const toBasicUnlitFrom = (src: any, opts?: {map?: THREE.Texture | null; color?: number}) => {
			const basic = new THREE.MeshBasicMaterial({
				map: opts?.map ?? null,
				color: opts?.color ?? 0xffffff,
			})
			basic.name = src?.name ? `${src.name}_Unlit` : 'Screen_Unlit'
			basic.toneMapped = false
			basic.transparent = false
			basic.side = THREE.FrontSide
			return basic
		}

		const replaceScreenMaterials = (tex: THREE.Texture | null) => {
			const newMaterials = mats.map((m: any) =>
				toBasicUnlitFrom(m, {map: tex ?? null, color: tex ? 0xffffff : 0x000000}),
			)
			mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0]
			;(mesh as any).materialNeedsUpdate = true
		}

		const clearToBlack = () => {
			replaceScreenMaterials(null)
		}

		// Ratio de l'écran mesuré EXACTEMENT comme le plugin : Box3 MONDE
		// avec la rotation Y de -π/2 appliquée (PhoneModel enveloppe le
		// modèle dans <group rotation={[0,-π/2,0]}> et mesure après).
		// Cette rotation échange largeur/profondeur du mesh (Watch → ~1.0
		// au lieu de 0.70) : c'est CE ratio que le plugin utilise pour
		// dessiner le canvas, donc la parité visuelle exige le même.
		// On force la rotation avant de mesurer pour être déterministe
		// (le timing du commit R3F rendait l'ancienne mesure aléatoire).
		const meshScreenAspect = () => {
			// LANDING : les GLB locaux (/public/3d) ne sont PAS les modèles
			// Supabase — les overrides plugin (imac 16:9…) donnaient un
			// contenu écrasé. Priorité : screen_aspect explicite du config,
			// sinon mesure géométrique monde (inclut les scales parents).
			const explicit = (device as any).screen_aspect
			if (typeof explicit === 'number' && isFinite(explicit) && explicit > 0) return explicit
			const prevRot = root.rotation.clone()
			let a = 9 / 19.5
			try {
				root.rotation.set(0, -Math.PI / 2, 0)
				root.updateMatrixWorld(true)
				const size = new THREE.Vector3()
				new THREE.Box3().setFromObject(mesh).getSize(size)
				if (size.y > 0 && size.x > 0) {
					const r = size.x / size.y
					if (isFinite(r) && r > 0.1 && r < 10.0) a = r
				}
			} finally {
				root.rotation.copy(prevRot)
				root.updateMatrixWorld(true)
			}
			return a
		}

		// Contenu par défaut du plugin (dégradé orange brandé) — affiché
		// quand la scène n'a pas de média OU que son chargement échoue
		// (ex: 503 R2). Jamais d'écran noir/vide sur un lien public.
		const showDefaultScreen = () => {
			try {
				const title = (device as any).title || device.id || 'Mockup'
				const orient: 'horizontal' | 'vertical' =
					(device as any).screen_orientation === 'horizontal' ? 'horizontal' : 'vertical'
				const isSquare = /watch/i.test(device.id || '')
				const url = isSquare
					? generateWatermarkDataURL(title, 1024, 1024, orient)
					: generateWatermarkDataURL(
							title,
							orient === 'horizontal' ? 1920 : 920,
							orient === 'horizontal' ? 1080 : 1920,
							orient,
						)
				const img = new Image()
				img.onload = () => {
					if (cancelled) return
					const canvasTex = drawImageHeightCoverTex(img, meshScreenAspect(), rendererRef.current, screenOpts)
					replaceScreenMaterials(canvasTex)
				}
				img.onerror = () => clearToBlack()
				img.src = url
			} catch {
				clearToBlack()
			}
		}

		// Nettoyer la vidéo précédente
		if (videoCleanupRef.current) {
			videoCleanupRef.current()
			videoCleanupRef.current = null
		}

		// Rotation/miroir du device + zoom/exposition sauvegardés — même
		// pipeline que le plugin, sinon certains devices (Watch) rendent
		// le contenu à l'envers.
		const anims: any = mockup.animations || {}
		const screenOpts: ScreenTexOpts = {
			rotationDeg: (device as any).screen_rotation_deg ?? 0,
			orientation: (device as any).screen_orientation ?? undefined,
			mirrorX: !!(device as any).screen_mirror_x,
			imageZoom: typeof anims.imageZoom === 'number' ? anims.imageZoom : 1,
			screenExposure: typeof anims.screenExposure === 'number' ? anims.screenExposure : 0.5,
			fitMode: (device as any).screen_fit_mode ?? undefined,
			deviceId: device.id,
			// blob: = média droppé par le visiteur → filigrane plumes.
			watermark:
				(mockup.media_type === 'video'
					? mockup.screen_video_url
					: mockup.screen_image_url
				)?.startsWith('blob:') ?? false,
		}

		// Guard: async fallbacks (video error, image error) from a PREVIOUS
		// run must never overwrite the current run's texture — the video
		// teardown itself fires an `error` event which was randomly
		// swapping real content for the default screen.
		let cancelled = false

		// Priorité vidéo
		if (mockup.media_type === 'video' && mockup.screen_video_url) {
			try {
				const video = document.createElement('video')
				video.muted = true
				video.loop = true
				video.playsInline = true
				video.crossOrigin = 'anonymous'
				video.src = mockup.screen_video_url

				const screenAspect = meshScreenAspect()

				const handleCanPlay = () => {
					if (cancelled) return
					// Hors viewport : on n'engage pas la lecture — elle
					// reprendra au retour via l'effet in-viewport.
					if (!inViewportRef.current) return
					try {
						const playPromise = video.play()
						if (playPromise && typeof playPromise.then === 'function') {
							playPromise.catch(() => {
								setTimeout(() => video.play().catch(() => {}), 100)
							})
						}
					} catch (err) {
						console.warn('Erreur lecture vidéo:', err)
					}
				}

				// Réseau qui hoquette (DNS, 5xx transitoire) → 2 retries
				// espacés avant de tomber sur le contenu par défaut.
				let videoRetries = 0
				const handleError = () => {
					if (cancelled) return
					if (videoRetries < 2) {
						videoRetries += 1
						setTimeout(() => {
							if (cancelled) return
							try {
								video.src = mockup.screen_video_url!
								video.load()
							} catch {}
						}, 1200 * videoRetries)
						return
					}
					showDefaultScreen()
				}

				video.addEventListener('canplay', handleCanPlay)
				video.addEventListener('loadeddata', handleCanPlay)
				video.addEventListener('error', handleError)
				video.load()
				videoElRef.current = video

				const {tex: videoCanvasTex, stop} = drawVideoHeightCoverTex(video, screenAspect, rendererRef.current, screenOpts)
				// Anti-flash noir : la texture vidéo n'est attachée qu'à la
				// PREMIÈRE frame décodable — l'ancienne texture (poster/image)
				// reste affichée pendant le chargement.
				let texAttached = false
				const attachVideoTex = () => {
					if (texAttached || cancelled) return
					texAttached = true
					replaceScreenMaterials(videoCanvasTex)
				}
				video.addEventListener('canplay', attachVideoTex)
				video.addEventListener('loadeddata', attachVideoTex)

				videoCleanupRef.current = () => {
					cancelled = true
					if (videoElRef.current === video) videoElRef.current = null
					video.removeEventListener('canplay', attachVideoTex)
					video.removeEventListener('loadeddata', attachVideoTex)
					video.removeEventListener('canplay', handleCanPlay)
					video.removeEventListener('loadeddata', handleCanPlay)
					video.removeEventListener('error', handleError)
					try {
						video.pause()
						video.currentTime = 0
						video.removeAttribute('src')
						video.load()
					} catch (e) {}
					stop()
					try {
						videoCanvasTex.dispose?.()
					} catch (e) {}
				}
			} catch (e) {
				console.error('Erreur vidéo:', e)
				showDefaultScreen()
			}
			return
		}

		// Image — écran noir immédiat pendant le chargement pour ne JAMAIS
		// laisser apparaître le matériau réfléchissant brut du GLB.
		if (mockup.media_type === 'image' && mockup.screen_image_url) {
			clearToBlack()
			const loader = new THREE.TextureLoader()
			let imageAttempts = 0
			const loadImage = () => {
				const t = loader.load(
					mockup.screen_image_url!,
					() => {
						if (cancelled) {
							t.dispose?.()
							return
						}
						const img = t.image as HTMLImageElement
						const screenAspect = meshScreenAspect()
						const canvasTex = drawImageHeightCoverTex(img, screenAspect, rendererRef.current, screenOpts)
						replaceScreenMaterials(canvasTex)
						t.dispose?.()
					},
					undefined,
					(err) => {
						if (cancelled) return
						if (imageAttempts < 2) {
							imageAttempts += 1
							setTimeout(() => {
								if (!cancelled) loadImage()
							}, 1200 * imageAttempts)
							return
						}
						console.error('Erreur chargement image:', err)
						showDefaultScreen()
					},
				)
			}
			loadImage()

			return () => {
				cancelled = true
			}
		}

		// Aucun média → contenu par défaut orange du plugin.
		showDefaultScreen()
		return () => {
			cancelled = true
		}
		// Deps par CHAMPS (pas l'objet mockup) : dans le hero de la landing
		// le payload est reconstruit à chaque changement de couleur — l'objet
		// mockup change d'identité et redéclenchait toute la pipeline écran
		// (teardown vidéo + re-création de texture = flash/"clipping" visible).
		// La couleur a son propre effet ; l'écran ne dépend que du média.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// screenExposure/imageZoom font partie du pipeline de dessin de la
		// texture écran — ils doivent redéclencher le redraw (le slider
		// "Screen exposure" ne faisait rien sans ça).
	}, [
		root,
		device,
		mockup.media_type,
		mockup.screen_image_url,
		mockup.screen_video_url,
		mockup.animations?.screenExposure,
		mockup.animations?.imageZoom,
	])

	// Cleanup vidéo au démontage
	useEffect(() => {
		return () => {
			if (videoCleanupRef.current) {
				videoCleanupRef.current()
				videoCleanupRef.current = null
			}
		}
	}, [])

	const animations = mockup.animations || {}
	// The plugin's Lock button is an EDITING concern (freeze the pose while
	// the designer exports) — visitors always get the saved animations.
	// Only the saved toggles gate behavior here.
	const followCursor = !!animations.followCursor
	const followCursorSpeed = clamp01(
		typeof animations.followCursorSpeed === 'number'
			? animations.followCursorSpeed
			: (animations.followCursorSensitivity ?? 0.5),
	)
	const followCursorRotation = clamp01(
		typeof animations.followCursorRotation === 'number'
			? animations.followCursorRotation
			: (animations.followCursorSensitivity ?? 0.5),
	)
	const followCursorInvert = !!animations.followCursorInvert
	// Default ON — scenes saved before the toggle existed stay rotatable.
	const grabMove = animations.grabMove !== false
	const autoRotate = !!animations.autoRotate
	const autoRotateSensitivity = clamp01(animations.autoRotateSensitivity ?? 0.5)
	// Plugin mapping: autoRotateSpeed = 0.4 + sensitivity * 6 (DeviceMockup
	// line ~1697). Match it 1:1 so a scene reads the same in-plugin and
	// in-embed.
	const autoRotateSpeed = 0.4 + autoRotateSensitivity * 6
	const loopAnimation = !!animations.loopAnimation
	const loopAnimationSensitivity = clamp01(animations.loopAnimationSensitivity ?? 0.5)
	const scrollZoom = animations.scrollZoom !== false // default on
	const deviceColor = typeof animations.deviceColor === 'string' ? animations.deviceColor : null
	const deviceColors = animations.deviceColors && typeof animations.deviceColors === 'object' ? animations.deviceColors : null
	const deviceFinish = typeof animations.deviceFinish === 'string' ? animations.deviceFinish : ''
	const envPreset = useMemo(() => presetFor(mockup.environment_id), [mockup.environment_id])

	// Tell the host Framer code component the model is rendered so it can
	// fade out its poster thumbnail (visitors never see the model load).
	// Same signal dispatched locally so the embed page's OWN poster
	// overlay (thumbnail_url) fades out too.
	useEffect(() => {
		if (!root) return
		try {
			window.parent?.postMessage({type: 'memselon:embed-ready'}, '*')
			window.dispatchEvent(new CustomEvent('memselon:scene-ready'))
		} catch {}
	}, [root])

	// Normalisation matériaux au chargement — PARITÉ PLUGIN (PhoneModel) :
	// 1) combo metal=1+rough=1 (export Sketchfab) = charbon → métal brossé ;
	// 2) noirs dielectriques quasi-miroir (lèvre d'écran) matifiés pour
	//    rester SOMBRES sous l'éclairage (lentilles exclues par nom).
	useEffect(() => {
		if (!root) return
		root.traverse((o: any) => {
			if (!o.isMesh || !o.material) return
			const meshNameLc = (o.name || '').toLowerCase()
			const mats = Array.isArray(o.material) ? o.material : [o.material]
			mats.forEach((m: any) => {
				if (!m || !m.isMeshStandardMaterial) return
				if (m.metalness >= 0.95 && m.roughness >= 0.95) {
					m.metalness = 0.45
					m.roughness = 0.55
					m.envMapIntensity = 1.5
					m.needsUpdate = true
					return
				}
				const isLens = /lens|camera|glass/.test(meshNameLc) || /lens|camera|glass/.test((m.name || '').toLowerCase())
				const c = m.color
				const lum = c ? 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b : 1
				if (!isLens && lum < 0.05 && m.metalness <= 0.2 && m.roughness <= 0.2) {
					m.roughness = 0.75
					m.envMapIntensity = 0.25
					m.needsUpdate = true
				}
			})
		})
	}, [root])

	// Device colors + finish — exact mirror of PhoneModel.tsx:
	// body materials grouped by ORIGINAL hex (key of deviceColors),
	// notch/camera/logo never repainted, finish = metalness/roughness
	// preset ('' = factory).
	useEffect(() => {
		if (!root) return
		// bezel/rim retirés — la bordure d'écran ne se repeint JAMAIS.
		const BODY_RE =
			/back|frame|edge|side|band|case|chassis|button|antenna|body|metal|alumin|titan|steel|housing|shell|cover/
		const isExcluded = (meshNameLc: string, matNamesLc: string[]) => {
			// Prend la couleur de la coque MÊME si le nom matche une
			// exclusion : logo Apple + boutons (dont Camera Control, dont
			// le nom contient "camera") — comme sur les finitions Apple.
			const KEEP_RE = /logo|button|control|apple|uibplfshrnpzcmf/
			if (KEEP_RE.test(meshNameLc) || matNamesLc.some((n) => KEEP_RE.test(n))) return false
			const EX_RE =
				/display|screen|lcd|plane|lens|glass|notch|island|dynamic|pill|cutout|punch|camera|sensor|mic|speaker|port|flash|bezel|rim/
			return EX_RE.test(meshNameLc) || matNamesLc.some((n) => EX_RE.test(n))
		}
		// Taille du device (diagonale monde) — sert à distinguer les
		// grandes surfaces désaturées (panneau dos) des petites pièces
		// neutres (cerclages caméra, vis) dans le filtre plus bas.
		const deviceDiag = (() => {
			const v = new THREE.Vector3()
			new THREE.Box3().setFromObject(root).getSize(v)
			return v.length() || 1
		})()
		const collect = (useFallback: boolean) => {
			const mats: any[] = []
			root.traverse((child) => {
				if (!isMesh(child)) return
				const meshNameLc = child.name.toLowerCase()
				const matNamesLc = getMatNames(child as MeshAny).map((n) => n.toLowerCase())
				if (isExcluded(meshNameLc, matNamesLc)) return
				const bodyLike = BODY_RE.test(meshNameLc) || matNamesLc.some((n) => BODY_RE.test(n))
				if (!useFallback && !bodyLike) return
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				const pv = new THREE.Vector3()
				new THREE.Box3().setFromObject(child).getSize(pv)
				const partRatio = pv.length() / deviceDiag
				materials.forEach((mat: any) => {
					if (mat && (mat.type === 'MeshStandardMaterial' || mat.type === 'MeshPhysicalMaterial')) {
						mat.userData.__partRatio = Math.max(mat.userData.__partRatio || 0, partRatio)
						if (!useFallback || !mat.transparent) mats.push(mat)
					}
				})
			})
			return mats
		}
		let bodyMats = collect(false)
		const strictHit = bodyMats.length > 0
		if (strictHit) for (const m of bodyMats) m.userData.__strictBody = true
		if (!bodyMats.length) bodyMats = collect(true)

		// Passe séparée : logo Apple / boutons / Camera Control — pas
		// "body-like" mais suivent la coque. SÉPARÉE du collect pour ne
		// pas rendre la passe stricte non-vide (ça court-circuitait le
		// fallback qui repeint le châssis aux noms obfusqués).
		{
			const KEEP_RE = /logo|button|control|apple|uibplfshrnpzcmf/
			const known = new Set(bodyMats)
			root.traverse((child) => {
				if (!isMesh(child)) return
				const meshNameLc = child.name.toLowerCase()
				const matNamesLc = getMatNames(child as MeshAny).map((n) => n.toLowerCase())
				if (!KEEP_RE.test(meshNameLc) && !matNamesLc.some((n) => KEEP_RE.test(n))) return
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach((mat: any) => {
					if (!mat || known.has(mat)) return
					if (mat.type !== 'MeshStandardMaterial' && mat.type !== 'MeshPhysicalMaterial') return
					bodyMats.push(mat)
					known.add(mat)
				})
			})
		}

		// 2e filet : les pièces aux noms obfusqués (logo Apple…) qui
		// partagent EXACTEMENT une teinte d'origine de la coque suivent
		// la coque — la géométrie ne les nomme pas, la couleur oui.
		{
			const seed = (mat: any) => {
				if (mat.color && !mat.userData.__origHex) {
					mat.userData.__origHex = `#${mat.color.getHexString()}`
				}
			}
			bodyMats.forEach(seed)
			// Distance RGB (pas égalité stricte) — parité plugin cd27bbd :
			// bouton latéral / logo = oranges VOISINS mais distincts du rail.
			const toRgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
			const bodyRgbs = [...new Set(bodyMats.map((m: any) => m.userData.__origHex).filter(Boolean))].map((h) => toRgb(h as string))
			const nearBody = (hex: string) => {
				const c = toRgb(hex)
				return bodyRgbs.some((r) => Math.hypot(r[0] - c[0], r[1] - c[1], r[2] - c[2]) < 90)
			}
			const known = new Set(bodyMats)
			root.traverse((child) => {
				if (!isMesh(child)) return
				const meshNameLc = child.name.toLowerCase()
				const matNamesLc = getMatNames(child as MeshAny).map((n) => n.toLowerCase())
				if (isExcluded(meshNameLc, matNamesLc)) return
				const materials = Array.isArray(child.material) ? child.material : [child.material]
				materials.forEach((mat: any) => {
					if (!mat || known.has(mat)) return
					if (mat.type !== 'MeshStandardMaterial' && mat.type !== 'MeshPhysicalMaterial') return
					seed(mat)
					if (mat.userData.__origHex && nearBody(mat.userData.__origHex)) {
						bodyMats.push(mat)
						known.add(mat)
					}
				})
			})
		}

		// Mémorise la couleur D'ORIGINE une seule fois par matériau — en
		// interactif (landing), grouper/filtrer sur la couleur COURANTE
		// cassait tout après le 1er repaint : impossible de revenir à une
		// couleur précédente, et les repaints sombres passaient sous le
		// filtre anti-noir et devenaient définitivement inertes.
		for (const mat of bodyMats) {
			if (mat.color && !mat.userData.__origHex) {
				mat.userData.__origHex = `#${mat.color.getHexString()}`
			}
			// Mémorise aussi la baseColor map d'origine : repeindre en
			// laissant la map MULTIPLIE la teinte (bleu × dos orange =
			// marron). À la Apple, la couleur choisie est UNIE → map
			// retirée pendant le repaint, restaurée au reset.
			if (mat.userData.__origMap === undefined) {
				mat.userData.__origMap = mat.map || null
			}
			if (mat.emissive && !mat.userData.__origEmissive) {
				mat.userData.__origEmissive = `#${mat.emissive.getHexString()}`
			}
		}
		// Filets évalués sur la couleur D'ORIGINE :
		//  - anti-noir : notch, joints, verre lentille restent noirs ;
		//  - anti-neutre (fallback seulement) : les GRIS désaturés
		//    (cerclages caméra chromés, vis) ne suivent pas la coque —
		//    seule la teinte colorée du device est repeinte.
		bodyMats = bodyMats.filter((mat) => {
			const hex = mat.userData?.__origHex
			if (!hex) return true
			const c = new THREE.Color(hex)
			const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
			const mx = Math.max(c.r, c.g, c.b)
			const mn = Math.min(c.r, c.g, c.b)
			const sat = mx === 0 ? 0 : (mx - mn) / mx
			// Sombre ET neutre = notch/joint/verre → jamais peint. Sombre
			// mais SATURÉ (dos vert foncé iMac M1) = zone légitime.
			if (lum <= 0.09 && sat < 0.35) return false
			if (!mat.userData.__strictBody) {
				// Désaturé ET petit → pièce neutre (cerclage caméra, vis) :
				// ne suit pas la coque. Désaturé mais GRAND (panneau dos
				// gris) → suit la coque comme chez Apple.
				if (sat < 0.15 && (mat.userData.__partRatio || 0) < 0.45) return false
			}
			return true
		})

		// Groupes par hex D'ORIGINE.
		const groups = new Map<string, any[]>()
		for (const mat of bodyMats) {
			const hex = mat.userData.__origHex || `#${mat.color.getHexString()}`
			if (!groups.has(hex)) groups.set(hex, [])
			groups.get(hex)!.push(mat)
		}
		const hasGroupColors = deviceColors && Object.keys(deviceColors).length > 0
		groups.forEach((mats, hex) => {
			// Zones d'origine quasi noire (rim écran, notch) : jamais
			// repeintes implicitement — parité plugin 7df8528.
			const lumG =
				0.2126 * parseInt(hex.slice(1, 3), 16) +
				0.7152 * parseInt(hex.slice(3, 5), 16) +
				0.0722 * parseInt(hex.slice(5, 7), 16)
			const isDarkOrigin = lumG < 40
			const explicitRaw = hasGroupColors ? deviceColors![hex] : undefined
			const explicit =
				explicitRaw && isDarkOrigin && explicitRaw === deviceColor ? undefined : explicitRaw
			const target = explicit ?? (isDarkOrigin ? '' : hasGroupColors ? deviceColor : deviceColor)
			const c = new THREE.Color(target || hex)
			for (const mat of mats) {
				// Logo & co : la FORME vient de la texture (alpha/émissive) —
				// on la garde et on TEINTE, sinon un carré plein apparaîtrait.
				const isCutout =
					!!mat.alphaMap || /logo|apple|uibplfshrnpzcmf/.test((mat.name || '').toLowerCase())
				if (target) {
					if (!isCutout && mat.map && !(mat.map as any).userData?.__mockupTexture) mat.map = null
					mat.color = c.clone()
					// Règle émissif : on TEINTE tout émissif DÉJÀ ACTIF (panneau
					// dos, logo — sinon leur emissiveMap pêche rayonne par-dessus
					// la couleur), mais on n'ALLUME jamais un émissif éteint
					// (les châssis ont des emissiveMap de bake, facteur noir).
					if (mat.emissive && mat.emissive.getHex() !== 0) {
						mat.emissive = c.clone().multiplyScalar(0.85)
					}
				} else {
					// Reset '' → restaure map, couleur ET émissif d'origine.
					mat.map = mat.userData.__origMap ?? null
					mat.color = c.clone()
					if (mat.emissive && mat.userData.__origEmissive) {
						mat.emissive = new THREE.Color(mat.userData.__origEmissive)
					}
				}
				mat.needsUpdate = true
			}
		})

		const FINISH: Record<string, {metalness: number; roughness: number}> = {
			mat: {metalness: 0.05, roughness: 0.85},
			// metalness 1.0 read almost black under the default env —
			// pulled back so the brushed look keeps some diffuse light.
			metal: {metalness: 0.8, roughness: 0.3},
			glossy: {metalness: 0.7, roughness: 0.12},
		}
		const preset = FINISH[deviceFinish]
		if (preset) {
			for (const mat of bodyMats) {
				mat.metalness = preset.metalness
				mat.roughness = preset.roughness
				mat.needsUpdate = true
			}
		}
	}, [root, deviceColor, deviceColors, deviceFinish])

	return (
		<>
			{/* HDR environment lighting. When `transparentBg` is on
			    (driven by `?bg=transparent` on the embed URL), skip the
			    `background` prop so the panorama is only used for IBL —
			    the iframe stays see-through against whatever's behind. */}
			{/* environmentIntensity suit le knob light_intensity : l'IBL est
			    la source principale de lumière — sans ça le slider "Studio
			    light" ne changeait presque rien à l'image. */}
			{/* HDR "studio" auto-hébergé (/public/hdr) — le CDN drei échouait
			    par moments ("Could not load studio_small_03_1k.hdr"). Les
			    autres presets restent sur le CDN drei. */}
			{transparentBg ? (
				envPreset === 'studio' ? (
					<Environment files="/hdr/studio_small_03_1k.hdr" environmentIntensity={0.35 + lightIntensity * 1.5} />
				) : (
					<Environment preset={envPreset} environmentIntensity={0.35 + lightIntensity * 1.5} />
				)
			) : envPreset === 'studio' ? (
				<Environment
					files="/hdr/studio_small_03_1k.hdr"
					background
					backgroundBlurriness={0.6}
					environmentIntensity={0.35 + lightIntensity * 1.5}
				/>
			) : (
				<Environment
					preset={envPreset}
					background
					backgroundBlurriness={0.6}
					environmentIntensity={0.35 + lightIntensity * 1.5}
				/>
			)}

			<ambientLight intensity={0.25 + lightIntensity * 0.7} />
			{/* Mirror the plugin's light-position knob (0..1 → 0-360° around
			    the device, z fixed) when the scene saved one. */}
			{(() => {
				const lp = typeof animations.lightPosition === 'number' ? animations.lightPosition : null
				const angle = (lp ?? 0.5) * Math.PI * 2
				const pos: [number, number, number] =
					lp == null ? [5, 5, 5] : [Math.cos(angle) * 5, Math.sin(angle) * 5, 5]
				return <directionalLight position={pos} intensity={lightIntensity} />
			})()}

			{root && (
				<LoopFloatGroup enabled={loopAnimation} amplitude={loopAnimationSensitivity * 0.2}>
					<PoseRig pose={pose}>
						{/* y_offset optionnel par device — certains GLB (Watch) ont
						    leur origine décalée vers le bas. */}
						<group position={[0, (device as any).y_offset || 0, 0]}>
							<primitive object={root} scale={device.default_scale || 1} rotation={[0, -Math.PI / 2, 0]} />
							{webURL && webScreenMesh && (
								<WebScreenLayer screen={webScreenMesh} webURL={webURL} deviceId={device.id} />
							)}
						</group>
					</PoseRig>
				</LoopFloatGroup>
			)}

			<OrbitControls
				ref={controlsRef}
				enablePan={false}
				enableDamping
				dampingFactor={0.05}
				minDistance={1}
				maxDistance={8}
				// scrollZoom lets designers keep zoom-on-scroll off (default on).
				enableZoom={scrollZoom}
				// grabMove = the plugin's "Grab (rotate)" toggle: visitors can
				// grab-rotate the device only when the designer enabled it.
				// followCursor takes priority (they'd fight over the camera).
				// Drag possible MÊME avec follow-cursor : le rig se suspend
				// pendant le drag et reprend au relâchement (retour de face).
				enableRotate={grabMove}
				enabled
				autoRotate={autoRotate}
				autoRotateSpeed={autoRotateSpeed}
				mouseButtons={{
					LEFT: THREE.MOUSE.ROTATE,
					MIDDLE: THREE.MOUSE.DOLLY,
					RIGHT: THREE.MOUSE.PAN,
				}}
			/>

			{/* Follow cursor = camera orbit, EXACTLY like the plugin's
			    SceneLiveAnimator — the previous group-tilt version had a
			    different feel and made the saved Speed/Rotation knobs seem
			    ignored. */}
			<SnapBackRig controls={controlsRef} enabled={snapBack} />
			<FollowCursorRig
				controls={controlsRef}
				enabled={followCursor}
				speed={followCursorSpeed}
				rotation={followCursorRotation}
				invert={followCursorInvert}
			/>
		</>
	)
}

/** Lerp doux de la pose présentation : rotation Y du wrapper + zoom
 *  caméra (camera.zoom, orthogonal aux OrbitControls — pas de conflit). */
function PoseRig({pose, children}: {pose?: {rotateY?: number; zoom?: number}; children: React.ReactNode}) {
	const group = useRef<THREE.Group>(null)
	useFrame((state, dt) => {
		const k = Math.min(1, dt * 4)
		const targetRot = pose?.rotateY ?? 0
		const targetZoom = pose?.zoom ?? 1
		if (group.current) {
			group.current.rotation.y += (targetRot - group.current.rotation.y) * k
		}
		const cam = state.camera as THREE.PerspectiveCamera
		if (Math.abs(cam.zoom - targetZoom) > 0.001) {
			cam.zoom += (targetZoom - cam.zoom) * k
			cam.updateProjectionMatrix()
		}
	})
	return <group ref={group}>{children}</group>
}

/** Retour élastique : quand aucun drag n'est en cours, ramène
 *  azimuth/polar des OrbitControls vers la vue de face (lerp). */
function SnapBackRig({controls, enabled}: {controls: React.RefObject<any>; enabled: boolean}) {
	const dragging = useRef(false)
	useEffect(() => {
		const ctrl = controls.current
		if (!ctrl || !enabled) return
		const onStart = () => {
			dragging.current = true
		}
		const onEnd = () => {
			dragging.current = false
		}
		ctrl.addEventListener('start', onStart)
		ctrl.addEventListener('end', onEnd)
		return () => {
			ctrl.removeEventListener('start', onStart)
			ctrl.removeEventListener('end', onEnd)
		}
	}, [controls, enabled])
	useFrame((_, dt) => {
		if (!enabled || dragging.current) return
		const ctrl = controls.current
		if (!ctrl) return
		const az = ctrl.getAzimuthalAngle?.() ?? 0
		const po = ctrl.getPolarAngle?.() ?? Math.PI / 2
		if (Math.abs(az) < 0.002 && Math.abs(po - Math.PI / 2) < 0.002) return
		const k = Math.min(1, dt * 5)
		ctrl.setAzimuthalAngle?.(az * (1 - k))
		ctrl.setPolarAngle?.(Math.PI / 2 + (po - Math.PI / 2) * (1 - k))
		ctrl.update?.()
	})
	return null
}

function clamp01(n: number): number {
	if (typeof n !== 'number' || !isFinite(n)) return 0.5
	if (n < 0) return 0
	if (n > 1) return 1
	return n
}

// Pointeur global relayé par la page hôte (composant Framer) via
// postMessage {type:'memselon:pointer', x, y} — coordonnées normalisées
// au rect de l'iframe, convention r3f (y positif vers le HAUT). Permet
// au follow-cursor de suivre la souris même HORS de l'iframe : quand le
// curseur est dedans, le parent ne reçoit plus de mousemove, le message
// devient stale (>500ms) et le pointeur local r3f reprend la main.
const externalPointer = {x: 0, y: 0, t: 0}
if (typeof window !== 'undefined') {
	window.addEventListener('message', (e: MessageEvent) => {
		const d = e?.data
		if (d && d.type === 'memselon:pointer' && typeof d.x === 'number' && typeof d.y === 'number') {
			externalPointer.x = Math.max(-1, Math.min(1, d.x))
			externalPointer.y = Math.max(-1, Math.min(1, d.y))
			externalPointer.t = performance.now()
		}
	})
}

/**
 * Follow cursor = camera orbit around the device — EXACT copy of the
 * plugin's SceneLiveAnimator (DeviceMockup.tsx): azimuth/polar eased
 * toward the pointer, `rotation` (0..1) → swing amplitude, `speed`
 * (0..1) → lerp rate (1 + speed*8).
 */
function FollowCursorRig({
	controls,
	enabled,
	speed = 0.5,
	rotation = 0.5,
	invert = false,
}: {
	controls: React.RefObject<any>
	enabled: boolean
	speed?: number
	rotation?: number
	invert?: boolean
}) {
	// Suspendu pendant un drag utilisateur — sinon les deux se battent
	// pour la caméra. Au relâchement, le lerp du follow ramène le modèle
	// vers la pose pilotée par le curseur (retour de face naturel).
	const dragging = useRef(false)
	useEffect(() => {
		const ctrl = controls.current
		if (!ctrl || !enabled) return
		const onStart = () => {
			dragging.current = true
		}
		const onEnd = () => {
			dragging.current = false
		}
		ctrl.addEventListener('start', onStart)
		ctrl.addEventListener('end', onEnd)
		return () => {
			ctrl.removeEventListener('start', onStart)
			ctrl.removeEventListener('end', onEnd)
		}
	}, [controls, enabled])
	useFrame((state, dt) => {
		if (!enabled || dragging.current) return
		const ctrl = controls.current
		if (!ctrl) return
		// Pointeur externe (souris hors iframe, relayée par le parent)
		// prioritaire tant qu'il est frais ; sinon pointeur local r3f.
		const extFresh = performance.now() - externalPointer.t < 500
		const px = extFresh ? externalPointer.x : state.pointer.x
		const py = extFresh ? externalPointer.y : state.pointer.y
		const maxAzRad = rotation * 1.0
		const maxPoRad = rotation * 0.6
		const targetAzimuth = -px * maxAzRad
		const pitchSign = invert ? 1 : -1
		const targetPolar = Math.PI / 2 + pitchSign * py * maxPoRad
		const curAz = ctrl.getAzimuthalAngle?.() ?? 0
		const curPo = ctrl.getPolarAngle?.() ?? Math.PI / 2
		const lerpRate = 1 + speed * 8
		const k = Math.min(1, dt * lerpRate)
		ctrl.setAzimuthalAngle?.(curAz + (targetAzimuth - curAz) * k)
		ctrl.setPolarAngle?.(curPo + (targetPolar - curPo) * k)
		ctrl.update?.()
	})
	return null
}

/**
 * Wraps the device in a group whose Y position eases up and down in a
 * sine wave. Plugin's loopAnimation targets ctrl.target.y with amp
 * 0..0.2; here we bob the wrapping group's y directly for the same
 * visible motion without touching OrbitControls' target (which is
 * clamped by damping).
 */
function LoopFloatGroup({
	enabled,
	amplitude = 0.1,
	children,
}: {
	enabled: boolean
	amplitude?: number
	children: React.ReactNode
}) {
	const groupRef = useRef<THREE.Group>(null)
	useFrame((state) => {
		if (!groupRef.current) return
		const t = state.clock.getElapsedTime()
		groupRef.current.position.y = enabled ? Math.sin(t * 1.2) * amplitude : 0
	})
	return <group ref={groupRef}>{children}</group>
}
