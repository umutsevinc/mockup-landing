'use client'

import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {MockupScene} from './mockup/MockupScene'
import {PixelCatRunner} from './PixelCatRunner'
import type {Device, Mockup} from '@/lib/mockup-types'
import {PLAYGROUND_DEVICES, defaultFinishColor, deviceFinishColors} from '@/lib/playground-devices'
import {useInView} from '@/lib/useInView'

/** Mascotte de chargement — le pixel cat galope en boucle pendant que
 *  le GLB du device charge (fade entre les mockups). */
function MascotLoading({visible}: {visible: boolean}) {
	const [pct, setPct] = useState(0)
	useEffect(() => {
		if (!visible) return
		let raf = 0
		const t0 = performance.now()
		const tick = (t: number) => {
			setPct((((t - t0) / 1800) * 100) % 100)
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [visible])
	return (
		<div
			className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-10"
			style={{opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease'}}
			aria-hidden="true"
		>
			<div style={{width: 190}}>
				<PixelCatRunner progressPct={pct} color="#ffffff" />
			</div>
			<p className="text-[11px] tracking-[0.14em] uppercase text-white/45">Loading model</p>
		</div>
	)
}

/**
 * Interactive hero playground — the visitor understands the product in
 * one second: a live 3D device, swap the model, pick a color, drop
 * their own screenshot/video on it. Device switch KEEPS color+content.
 *
 * GLBs are served from /public/3d (same-origin, instant), screen
 * params mirror the Supabase `devices` rows so the rendering matches
 * the plugin/embed exactly.
 */

const DEVICES = PLAYGROUND_DEVICES

const DEMO_UPLOAD_FN = 'https://slfsatozvrdsbozzqgcx.supabase.co/functions/v1/demo-upload-url'
// 5 Mo max (image ET vidéo) — protège le quota Cloudflare R2.
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

type DroppedMedia = {url: string; type: 'image' | 'video'} | null

/** Fire-and-forget: mirror the dropped file to R2 (demo/ prefix) so we
 *  can see what visitors test with. The 3D preview never waits for it —
 *  it uses the local object URL immediately. */
async function uploadDemoFile(file: File) {
	try {
		const res = await fetch(DEMO_UPLOAD_FN, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				fileName: file.name,
				contentType: file.type,
				sizeBytes: file.size,
			}),
		})
		if (!res.ok) return
		const {uploadUrl} = await res.json()
		if (!uploadUrl) return
		await fetch(uploadUrl, {
			method: 'PUT',
			headers: {'Content-Type': file.type},
			body: file,
		})
	} catch {
		/* demo mirror only — never block the visitor */
	}
}

export default function HeroPlayground({teaser = false}: {teaser?: boolean} = {}) {
	// Mode teaser (waitlist) : iPhone uniquement, pas d'upload — les
	// interactions verrouillées répondent "Coming soon".
	const [deviceId, setDeviceId] = useState<string>(DEVICES[0].id)
	const [color, setColor] = useState<string>(defaultFinishColor(DEVICES[0].id))
	const [media, setMedia] = useState<DroppedMedia>(null)
	const [dragOver, setDragOver] = useState(false)
	const [modelReady, setModelReady] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [screenshotTroll, setScreenshotTroll] = useState(false)
	const [comingSoon, setComingSoon] = useState(false)
	// Teaser : toggle Image (placeholder orange) / Vidéo (démo mutée).
	const [teaserMedia, setTeaserMedia] = useState<'image' | 'video'>('image')
	// Mobile (pointer coarse) : pas de follow-cursor — drag libre au doigt.
	const [isTouch, setIsTouch] = useState(false)
	useEffect(() => {
		try {
			setIsTouch(window.matchMedia('(pointer: coarse)').matches)
		} catch {}
	}, [])
	const demoVideoReady = useRef(false)
	useEffect(() => {
		if (!teaser) return
		// Précharge la démo en cache navigateur dès le mount.
		const v = document.createElement('video')
		v.preload = 'auto'
		v.muted = true
		v.src = '/waitlist-demo.mp4'
		v.addEventListener('canplaythrough', () => {
			demoVideoReady.current = true
		})
		v.load()
	}, [teaser])
	useEffect(() => {
		if (!teaser) return
		if (teaserMedia !== 'video') {
			setMedia(null)
			return
		}
		// Anti-écran-noir : frame poster immédiate, puis la vidéo (déjà
		// préchargée → départ instantané).
		setMedia({url: '/waitlist-demo-poster.png', type: 'image'})
		const t = setTimeout(
			() => setMedia({url: '/waitlist-demo.mp4', type: 'video'}),
			demoVideoReady.current ? 350 : 1200,
		)
		return () => clearTimeout(t)
	}, [teaser, teaserMedia])
	const fileInputRef = useRef<HTMLInputElement>(null)
	// Distingue un CLIC (ouvre le sélecteur de fichier) d'un DRAG
	// (grab-rotate du modèle) : seuil de 6px entre down et up.
	const pointerDownRef = useRef<{x: number; y: number} | null>(null)
	// Perf : frameloop coupé quand le hero est hors viewport (scroll).
	const {ref: viewRef, inView} = useInView()

	const device = DEVICES.find((d) => d.id === deviceId) || DEVICES[0]

	// Fade entre les mockups : reset à chaque changement de device, la
	// mascotte pixel cat couvre le chargement du GLB, puis le modèle
	// fade-in au signal memselon:scene-ready.
	useEffect(() => {
		setModelReady(false)
		const onReady = () => setModelReady(true)
		window.addEventListener('memselon:scene-ready', onReady)
		const t = setTimeout(() => setModelReady(true), 12000)
		return () => {
			window.removeEventListener('memselon:scene-ready', onReady)
			clearTimeout(t)
		}
	}, [deviceId])

	// Anti-capture (best effort navigateur). IMPORTANT : les captures
	// SYSTÈME (Cmd+Shift+3/4 macOS, outil Capture Windows) sont
	// interceptées par l'OS avant le navigateur — AUCUN site web ne peut
	// les détecter. On troll donc tout ce qui est détectable : touche
	// Impr. écran (Windows), clic droit et copie sur le mockup.
	const triggerTroll = useCallback(() => {
		setScreenshotTroll(true)
		setTimeout(() => setScreenshotTroll(false), 2800)
	}, [])
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'PrintScreen') triggerTroll()
		}
		const onCopy = () => triggerTroll()
		window.addEventListener('keydown', onKey)
		document.addEventListener('copy', onCopy)
		return () => {
			window.removeEventListener('keydown', onKey)
			document.removeEventListener('copy', onCopy)
		}
	}, [triggerTroll])

	// Global follow-cursor: the whole page drives the model, not just
	// the canvas. Same postMessage channel the embed uses, so the
	// MockupScene module listener picks it up as an external pointer.
	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			const w = window.innerWidth / 2
			const h = window.innerHeight / 2
			if (!w || !h) return
			window.postMessage(
				{
					type: 'memselon:pointer',
					x: (e.clientX - w) / w,
					y: -((e.clientY - h) / h),
				},
				'*',
			)
		}
		window.addEventListener('mousemove', onMove, {passive: true})
		return () => window.removeEventListener('mousemove', onMove)
	}, [])

	const showComingSoon = useCallback(() => {
		setComingSoon(true)
		setTimeout(() => setComingSoon(false), 2200)
	}, [])

	const handleFile = useCallback((file: File | undefined | null) => {
		if (teaser) return
		if (!file) return
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')
		if (!isImage && !isVideo) {
			setUploadError('Image or video only (PNG, JPG, WebP, MP4, WebM)')
			setTimeout(() => setUploadError(null), 3200)
			return
		}
		if (file.size > MAX_UPLOAD_BYTES) {
			setUploadError('Max upload 5 MB — compress your file and retry')
			setTimeout(() => setUploadError(null), 3200)
			return
		}
		const url = URL.createObjectURL(file)
		setMedia((prev) => {
			if (prev?.url.startsWith('blob:')) {
				try {
					URL.revokeObjectURL(prev.url)
				} catch {}
			}
			return {url, type: isImage ? 'image' : 'video'}
		})
		void uploadDemoFile(file)
	}, [teaser])

	// Synthetic scene payload — device switch keeps the content; the
	// color snaps to the new device's default finish (see bottom bar).
	// MockupScene re-resolves the screen mesh on the new model.
	const payload = useMemo(() => {
		const mockup = {
			id: 'hero-playground',
			device_id: device.id,
			name: 'Hero playground',
			media_type: media?.type ?? 'none',
			screen_image_url: media?.type === 'image' ? media.url : null,
			screen_video_url: media?.type === 'video' ? media.url : null,
			environment_id: 'studio',
			environment_offset: 0.5,
			// Même lumière que la waitlist partout — à 0.65 l'orange
			// Cosmic vire au jaune délavé face au render Apple.
			light_intensity: 0.22,
			camera_position: 'free',
			is_locked: false,
			animations: {
				// Hero : drag (grab-rotate). Waitlist/teaser : follow-cursor —
				// le grab y est verrouillé, le modèle suit la souris page-wide.
				followCursor: teaser && !isTouch,
				// Teaser : suivi plus vif et plus ample (demande waitlist).
				followCursorSpeed: teaser ? 0.7 : 0.45,
				followCursorRotation: teaser ? 0.75 : 0.5,
				followCursorInvert: true,
				grabMove: true,
				autoRotate: false,
				loopAnimation: true,
				loopAnimationSensitivity: 0.05,
				scrollZoom: false,
				imageZoom: 1,
				screenExposure: 0.5,
				showShadow: false,
				shadowDistance: 0.5,
				deviceColor: color,
				deviceColors: {},
				deviceFinish: '',
			},
		} as unknown as Mockup
		return {mockup, device: device as Device}
	}, [device, color, media, teaser, isTouch])

	return (
		<div ref={viewRef} className="relative w-full h-full flex flex-col">
			{/* ── 3D stage ── */}
			<div
				className="relative flex-1 min-h-[380px] cursor-pointer"
				onDragOver={(e) => {
					e.preventDefault()
					if (!teaser) setDragOver(true)
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={(e) => {
					e.preventDefault()
					setDragOver(false)
					handleFile(e.dataTransfer.files?.[0])
				}}
				onContextMenu={(e) => {
					e.preventDefault()
					triggerTroll()
				}}
				onPointerDown={(e) => {
					pointerDownRef.current = {x: e.clientX, y: e.clientY}
				}}
				onPointerUp={(e) => {
					const d = pointerDownRef.current
					pointerDownRef.current = null
					if (!d) return
					const dist = Math.hypot(e.clientX - d.x, e.clientY - d.y)
					if (dist < 6) {
						if (teaser) showComingSoon()
						else fileInputRef.current?.click()
					}
				}}
			>
				<div
					className="absolute inset-0"
					style={{opacity: modelReady ? 1 : 0, transition: 'opacity 0.55s ease'}}
				>
					<Canvas
						frameloop={inView ? 'always' : 'never'}
						camera={{position: [0, 0, teaser ? 3.35 : 3.1], fov: 20, near: 0.1, far: 1000}}
						dpr={
							typeof window !== 'undefined'
								? Math.min(window.devicePixelRatio || 1, 2)
								: 1
						}
						gl={{
							antialias: true,
							alpha: true,
							premultipliedAlpha: false,
							powerPreference: 'high-performance',
						}}
						style={{background: 'transparent'}}
					>
						<Suspense fallback={null}>
							<MockupScene payload={payload} transparentBg snapBack={teaser && isTouch} inViewport={inView} />
						</Suspense>
					</Canvas>
				</div>

				{/* Drop overlay */}
				<div
					className={`absolute inset-4 rounded-2xl border-2 border-dashed pointer-events-none transition-all duration-200 flex items-center justify-center ${
						dragOver ? 'border-[#e8702a] bg-[#e8702a]/10 opacity-100' : 'border-white/0 opacity-0'
					}`}
				>
					<p className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
						Drop it — your content goes on screen
					</p>
				</div>

				{/* Mascotte pixel cat pendant le chargement du modèle */}
				<MascotLoading visible={!modelReady} />

				{/* Teaser : toggle Image / Vidéo au-dessus du phone */}
				{teaser && (
					<div
						className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 flex items-center gap-1 bg-white/[0.08] border border-white/[0.12] backdrop-blur rounded-full p-1"
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						role="group"
						aria-label="Screen content"
					>
						{(['image', 'video'] as const).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setTeaserMedia(m)}
								aria-pressed={teaserMedia === m}
								className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
									teaserMedia === m ? 'bg-white text-black' : 'text-white/70 hover:text-white'
								}`}
							>
								{m === 'image' ? 'Image' : 'Video'}
							</button>
						))}
					</div>
				)}

				{/* Teaser : interactions verrouillées */}
				{comingSoon && (
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-xs sm:text-sm text-white font-medium bg-black/80 backdrop-blur border border-white/20 px-4 py-2.5 rounded-full whitespace-nowrap">
						Coming soon — join the list to get it first 👀
					</div>
				)}

				{/* Erreur upload (5 Mo max) */}
				{uploadError && (
					<div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-30 text-xs sm:text-sm text-white font-medium bg-[#c62828]/90 backdrop-blur border border-white/20 px-4 py-2.5 rounded-full whitespace-nowrap">
						{uploadError}
					</div>
				)}

				{/* Color swatches — right side. stopPropagation partout : la
				    zone parente ouvre le sélecteur de fichier au clic, les
				    couleurs ne doivent JAMAIS le déclencher. */}
				{/* Carte sombre arrondie façon "Take a closer look" */}
				<div
					className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20 bg-[#1c1c1e]/90 backdrop-blur border border-white/[0.08] rounded-2xl p-3"
					role="group"
					aria-label="Device color"
					onPointerDown={(e) => e.stopPropagation()}
					onPointerUp={(e) => e.stopPropagation()}
					onClick={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
					onTouchEnd={(e) => e.stopPropagation()}
				>
					{deviceFinishColors(device.id).map((c) => (
						<button
							key={c}
							type="button"
							aria-label={`Color ${c}`}
							onClick={() => setColor(c)}
							className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
								color === c ? 'border-white scale-110' : 'border-white/20'
							}`}
							style={{backgroundColor: c}}
						/>
					))}
					{/* Pastille "couleur libre" — hero uniquement, la waitlist
					    garde ses 3 finitions verrouillées. */}
					{!teaser && (
						<label
							aria-label="Custom color"
							className={`relative w-8 h-8 rounded-full border-2 cursor-pointer overflow-hidden transition-transform hover:scale-110 ${
								!deviceFinishColors(device.id).includes(color) ? 'border-white scale-110' : 'border-white/20'
							}`}
							style={{
								background:
									'conic-gradient(from 0deg, #ff5f5f, #ffc14d, #7ee081, #57c8ff, #a97fff, #ff5f5f)',
							}}
						>
							<input
								type="color"
								value={color || defaultFinishColor(device.id)}
								onChange={(e) => setColor(e.target.value)}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
						</label>
					)}
				</div>
			</div>

			{/* ── Bottom bar: segmented device switch (style closer look) ── */}
			<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pb-2 z-10">
				<div
					className="flex items-center gap-1 bg-white/[0.08] border border-white/[0.12] backdrop-blur rounded-full p-1 overflow-x-auto max-w-full"
					role="group"
					aria-label="Choose a device"
				>
					{DEVICES.map((d) => (
						<button
							key={d.id}
							type="button"
							onClick={() => {
								if (teaser) return showComingSoon()
								setDeviceId(d.id)
								// Chaque mockup arrive avec SA finition par défaut.
								setColor(defaultFinishColor(d.id))
							}}
							aria-pressed={deviceId === d.id}
							className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
								deviceId === d.id ? 'bg-white text-black' : 'text-white/70 hover:text-white'
							}`}
						>
							{d.title}
						</button>
					))}
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
					className="hidden"
					onChange={(e) => handleFile(e.target.files?.[0])}
				/>
			</div>

			{/* Anti-capture ironique — Impr. écran / combos détectés */}
			{screenshotTroll && (
				<div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-black/92 px-6">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/keanu.gif" alt="" className="w-[70vw] max-w-[420px] rounded-2xl" />
					<p className="text-white text-base sm:text-lg font-medium text-center">
						Nice try 😏 — it&apos;s live 3D. Come play with it instead.
					</p>
				</div>
			)}
		</div>
	)
}
