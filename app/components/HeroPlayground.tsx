'use client'

import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {MockupScene} from './mockup/MockupScene'
import {FeatherFloat} from './FeatherRunner'
import type {Device, Mockup} from '@/lib/mockup-types'
import {PLAYGROUND_DEVICES, defaultFinishColor, deviceFinishColors} from '@/lib/playground-devices'
import {useInView} from '@/lib/useInView'

/** Mascotte de chargement — la plume Mockiosa qui lévite, seule,
 *  pendant que le GLB du device charge (fade entre les mockups). */
function MascotLoading({visible}: {visible: boolean}) {
	return (
		<div
			className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-10"
			style={{opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease'}}
			aria-hidden="true"
		>
			<FeatherFloat size={34} color="#ffffff" />
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

// Hero uniquement : le mockup reste l'iPhone 17 Pro — les autres pilules
// renvoient vers la section « The studio » (#live) où tous les devices
// sont essayables. MacBook Pro + Studio Display + iMac (retiré 20/07)
// sont repliés derrière « and more… » pour garder la barre courte.
const HERO_HIDDEN_DEVICES = new Set(['macbookPro', 'appleProDisplayXDR', 'imac', 'appleWatchUltra'])

const DEMO_UPLOAD_FN = 'https://slfsatozvrdsbozzqgcx.supabase.co/functions/v1/demo-upload-url'
// 5 Mo max (image ET vidéo) — protège le quota Cloudflare R2.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

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
	const imageInputRef = useRef<HTMLInputElement>(null)
	const videoInputRef = useRef<HTMLInputElement>(null)
	// Colonne d'options gauche (demande 20/07) : Image / Video / Site /
	// Animation — miroir de la sidebar du plugin.
	const [siteOpen, setSiteOpen] = useState(false)
	// Quelle option a posé le média courant (badge croix rouge sur
	// l'icône correspondante, demande 20/07).
	const [mediaSource, setMediaSource] = useState<'image' | 'video' | 'site' | null>(null)
	const [siteUrl, setSiteUrl] = useState('')
	const [siteCapturing, setSiteCapturing] = useState(false)
	// Embed LIVE du site sur l'écran 3D (iframe CSS3D dans MockupScene).
	const [siteEmbed, setSiteEmbed] = useState<string | null>(null)
	// Scrollable = la souris pilote le SITE (canvas pointer-events none) ;
	// décoché = interactions 3D normales, l'iframe reste affichée.
	const [siteScroll, setSiteScroll] = useState(true)
	// Popup Animation : follow-cursor (vitesse + rotation) et auto-rotate.
	const [animOpen, setAnimOpen] = useState(false)
	const [animFollow, setAnimFollow] = useState(false)
	const [animFollowSpeed, setAnimFollowSpeed] = useState(0.6)
	const [animFollowRotation, setAnimFollowRotation] = useState(0.6)
	const [animAutoRotate, setAnimAutoRotate] = useState(false)
	const animActive = animFollow || animAutoRotate
	// Embed LIVE (plus de capture photo — demande 20/07) : le site est
	// une vraie iframe scrollable sur l'écran du device. AVANT d'iframer,
	// on vérifie côté serveur que le site l'autorise — un refus
	// X-Frame-Options/CSP n'est pas détectable en JS et laissait un
	// écran blanc (apple.com, bug 20/07).
	const captureSite = useCallback(async () => {
		let u = siteUrl.trim()
		if (!u) return
		if (!/^https?:\/\//i.test(u)) u = `https://${u}`
		setSiteCapturing(true)
		try {
			const res = await fetch('https://slfsatozvrdsbozzqgcx.supabase.co/functions/v1/capture-website', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({url: u, check: true}),
			})
			const info = res.ok ? await res.json() : {embeddable: true}
			if (info && info.embeddable === false) {
				setUploadError('This site blocks embedding — try another URL')
				setTimeout(() => setUploadError(null), 3600)
				return
			}
			setSiteEmbed(u)
			setMediaSource('site')
			// URL validée → on referme le panel (demande 20/07).
			setSiteOpen(false)
		} catch {
			// Vérif injoignable : on tente l'iframe quand même.
			setSiteEmbed(u)
			setMediaSource('site')
			setSiteOpen(false)
		} finally {
			setSiteCapturing(false)
		}
	}, [siteUrl])
	// Distingue un CLIC (ouvre le sélecteur de fichier) d'un DRAG
	// (grab-rotate du modèle) : seuil de 6px entre down et up.
	const pointerDownRef = useRef<{x: number; y: number} | null>(null)
	// Perf : frameloop coupé quand le hero est hors viewport (scroll).
	// Marge large : la vidéo (re)démarre bien AVANT d'arriver dessus et
	// ne coupe que bien après la sortie — zéro écran figé visible.
	const {ref: viewRef, inView} = useInView('600px')

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
			setUploadError('Max upload 10 MB — compress your file and retry')
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
		setSiteEmbed(null)
		setMediaSource(isImage ? 'image' : 'video')
		void uploadDemoFile(file)
	}, [teaser])

	const clearMedia = useCallback(() => {
		setMedia((prev) => {
			if (prev?.url.startsWith('blob:')) {
				try {
					URL.revokeObjectURL(prev.url)
				} catch {}
			}
			return null
		})
		setSiteEmbed(null)
		setMediaSource(null)
	}, [])

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
				// Le bouton Animation de la colonne gauche active le
				// follow-cursor aussi sur le hero.
				followCursor: (teaser || animFollow) && !isTouch,
				// Teaser : suivi plus vif et plus ample (demande waitlist).
				followCursorSpeed: teaser ? 0.7 : animFollowSpeed,
				followCursorRotation: teaser ? 0.75 : animFollowRotation,
				followCursorInvert: true,
				grabMove: true,
				autoRotate: !teaser && animAutoRotate,
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
	}, [device, color, media, teaser, isTouch, animFollow, animFollowSpeed, animFollowRotation, animAutoRotate])

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
						style={{
							background: 'transparent',
							// Scrollable : la souris traverse le canvas et va au SITE
							// (l'iframe CSS3D est derrière, pointer-events auto).
							pointerEvents: siteEmbed && siteScroll ? 'none' : 'auto',
						}}
					>
						<Suspense fallback={null}>
							<MockupScene
								payload={payload}
								transparentBg
								snapBack={teaser && isTouch}
								inViewport={inView}
								webURL={teaser ? null : siteEmbed}
								webInteractive={siteScroll}
							/>
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

				{/* Colonne d'options — gauche (hero uniquement) : Image, Video,
				    Site (capture serveur), Animation. Même carte sombre que les
				    swatches ; stopPropagation pour ne pas ouvrir le picker de la
				    zone parente. */}
				{!teaser && (
					<div
						className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 bg-[#1c1c1e]/90 backdrop-blur border border-white/[0.08] rounded-2xl p-2.5"
						role="group"
						aria-label="Screen content options"
						onPointerDown={(e) => e.stopPropagation()}
						onPointerUp={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						onTouchStart={(e) => e.stopPropagation()}
						onTouchEnd={(e) => e.stopPropagation()}
					>
						<div className="relative">
							{mediaSource === 'image' && (
								<button
									type="button"
									aria-label="Remove"
									onClick={(e) => {
										e.stopPropagation()
										clearMedia()
									}}
									className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center z-10"
								>
									✕
								</button>
							)}
							<button
							type="button"
							aria-label="Set an image on the screen"
							title="Image"
							onClick={() => imageInputRef.current?.click()}
							className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
						>
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<path d="m21 15-5-5L5 21" />
							</svg>
						</button>
						</div>
						<div className="relative">
							{mediaSource === 'video' && (
								<button
									type="button"
									aria-label="Remove"
									onClick={(e) => {
										e.stopPropagation()
										clearMedia()
									}}
									className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center z-10"
								>
									✕
								</button>
							)}
							<button
							type="button"
							aria-label="Set a video on the screen"
							title="Video"
							onClick={() => videoInputRef.current?.click()}
							className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
						>
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="m22 8-6 4 6 4V8Z" />
								<rect x="2" y="6" width="14" height="12" rx="2" />
							</svg>
						</button>
						</div>
						<div className="relative">
							{mediaSource === 'site' && (
								<button
									type="button"
									aria-label="Remove"
									onClick={(e) => {
										e.stopPropagation()
										clearMedia()
									}}
									className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center z-10"
								>
									✕
								</button>
							)}
							<button
								type="button"
								aria-label="Put a website on the screen"
								title="Website"
								onClick={() => {
									setAnimOpen(false)
									setSiteOpen((v) => !v)
								}}
								className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
									siteOpen ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'
								}`}
							>
								<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10" />
									<path d="M2 12h20" />
									<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
								</svg>
							</button>
							{siteOpen && (
								<div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex flex-col gap-2 bg-[#1c1c1e]/95 border border-white/[0.1] rounded-xl p-2 whitespace-nowrap">
									<div className="flex items-center gap-1.5">
									<input
										type="url"
										autoFocus
										placeholder="yoursite.com"
										value={siteUrl}
										onChange={(e) => setSiteUrl(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') void captureSite()
											if (e.key === 'Escape') setSiteOpen(false)
										}}
										className="w-36 h-8 px-2.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-white text-xs outline-none placeholder:text-white/30"
									/>
									<button
										type="button"
										onClick={() => void captureSite()}
										disabled={siteCapturing}
										className="h-8 px-3 rounded-lg bg-[#e8702a] text-white text-xs font-medium disabled:opacity-60 flex items-center justify-center"
									>
										{siteCapturing ? (
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												strokeLinecap="round"
												className="animate-spin"
												aria-label="Capturing"
											>
												<path d="M21 12a9 9 0 1 1-6.219-8.56" />
											</svg>
										) : (
											'Go'
										)}
									</button>
									</div>
									<label className="flex items-center gap-2 text-white/85 text-xs font-medium cursor-pointer select-none">
										<input
											type="checkbox"
											checked={siteScroll}
											onChange={(e) => setSiteScroll(e.target.checked)}
											className="accent-[#e8702a] w-3.5 h-3.5"
										/>
										Scrollable (mouse controls the site)
									</label>
								</div>
							)}
						</div>
						<div className="relative">
							<button
								type="button"
								aria-label="Animation options"
								title="Animation"
								onClick={() => {
									setSiteOpen(false)
									setAnimOpen((v) => !v)
								}}
								className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
									animOpen || animActive ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'
								}`}
							>
								<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							</button>
							{animOpen && (
								<div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-52 bg-[#1c1c1e]/95 border border-white/[0.1] rounded-xl p-3 flex flex-col gap-2.5">
									<label className="flex items-center gap-2 text-white/85 text-xs font-medium cursor-pointer select-none">
										<input
											type="checkbox"
											checked={animFollow}
											onChange={(e) => {
												setAnimFollow(e.target.checked)
												// Exclusif avec Auto rotate (demande 20/07).
												if (e.target.checked) setAnimAutoRotate(false)
											}}
											className="accent-[#e8702a] w-3.5 h-3.5"
										/>
										Follow cursor
									</label>
									{animFollow && (
										<>
											<div className="flex items-center justify-between text-[11px] text-white/55">
												<span>Speed</span>
												<span>{Math.round(animFollowSpeed * 100)}%</span>
											</div>
											<input
												type="range"
												min={0}
												max={100}
												value={Math.round(animFollowSpeed * 100)}
												onChange={(e) => setAnimFollowSpeed(Number(e.target.value) / 100)}
												className="w-full accent-[#e8702a] h-1"
												aria-label="Follow cursor speed"
											/>
											<div className="flex items-center justify-between text-[11px] text-white/55">
												<span>Rotation</span>
												<span>{Math.round(animFollowRotation * 100)}%</span>
											</div>
											<input
												type="range"
												min={0}
												max={100}
												value={Math.round(animFollowRotation * 100)}
												onChange={(e) => setAnimFollowRotation(Number(e.target.value) / 100)}
												className="w-full accent-[#e8702a] h-1"
												aria-label="Follow cursor rotation"
											/>
										</>
									)}
									<label className="flex items-center gap-2 text-white/85 text-xs font-medium cursor-pointer select-none border-t border-white/[0.08] pt-2.5">
										<input
											type="checkbox"
											checked={animAutoRotate}
											onChange={(e) => {
												setAnimAutoRotate(e.target.checked)
												// Exclusif avec Follow cursor (demande 20/07).
												if (e.target.checked) setAnimFollow(false)
											}}
											className="accent-[#e8702a] w-3.5 h-3.5"
										/>
										Auto rotate
									</label>
								</div>
							)}
						</div>
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
					{DEVICES.filter((d) => !HERO_HIDDEN_DEVICES.has(d.id)).map((d) => (
						<button
							key={d.id}
							type="button"
							onClick={() => {
								if (teaser) return showComingSoon()
								// Landing : les autres devices s'essaient dans « The
								// studio » (#live). Waitlist (pas de section #live) :
								// on swappe réellement le modèle.
								if (d.id !== deviceId) {
									const live = document.getElementById('live')
									if (live) live.scrollIntoView({behavior: 'smooth'})
									else setDeviceId(d.id)
								}
							}}
							aria-pressed={deviceId === d.id}
							className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
								deviceId === d.id ? 'bg-white text-black' : 'text-white/70 hover:text-white'
							}`}
						>
							{d.title}
						</button>
					))}
					{!teaser && (
						<button
							type="button"
							onClick={() => {
								const live = document.getElementById('live')
								if (live) live.scrollIntoView({behavior: 'smooth'})
								else showComingSoon()
							}}
							className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors text-white/70 hover:text-white"
						>
							and more…
						</button>
					)}
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
					className="hidden"
					onChange={(e) => handleFile(e.target.files?.[0])}
				/>
				<input
					ref={imageInputRef}
					type="file"
					accept="image/png,image/jpeg,image/webp"
					className="hidden"
					onChange={(e) => handleFile(e.target.files?.[0])}
				/>
				<input
					ref={videoInputRef}
					type="file"
					accept="video/mp4,video/webm"
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
