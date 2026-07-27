'use client'

import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {Plus, Minus} from 'lucide-react'
import {MockupScene} from './mockup/MockupScene'
import {FeatherFloat} from './FeatherRunner'
import type {Mockup} from '@/lib/mockup-types'
import {PLAYGROUND_DEVICES, defaultFinishColor, deviceFinishColors} from '@/lib/playground-devices'
import {useInView} from '@/lib/useInView'

/**
 * "Take a closer look" — section interactive à la Apple (iPhone 17 page):
 * pills de fonctionnalités à gauche ; chaque pill ouverte montre une
 * carte de description + l'UI SIMPLIFIÉE du plugin pour cette
 * fonctionnalité, et le mockup 3D à droite réagit en direct.
 */

const CL_DEVICES = PLAYGROUND_DEVICES

const FINISHES = [
	{id: '', label: 'Factory'},
	{id: 'mat', label: 'Matte'},
	{id: 'metal', label: 'Brushed metal'},
	{id: 'glossy', label: 'Glossy'},
]

// iMac trop grand dans cette section (caméra plus reculée qu'au hero) :
// on le réduit UNIQUEMENT ici, sans toucher au scale global (hero, /mockups).
const CL_SCALE_OVERRIDE: Record<string, number> = {imac: 1.25, appleProDisplayXDR: 1.2}

// 20 Mo max — même limite que le hero.
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

/** Plume Mockiosa qui lévite pendant le chargement du GLB — fade entre
 *  les mockups au changement de device (comme le hero). */
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

type FeatureId = 'colors' | 'finish' | 'animations' | 'light'

/* Composants UI au niveau MODULE — les définir dans le corps du
   composant leur donnait une nouvelle identité à chaque render, React
   remontait tout le sous-arbre et le DRAG des sliders était interrompu
   à la première valeur (seul le clic marchait). */

function Pill({active, label, onClick}: {active: boolean; label: string; onClick: () => void}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-expanded={active}
			className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full text-sm font-medium transition-colors ${
				active ? 'bg-white text-black' : 'bg-white/[0.09] text-white hover:bg-white/[0.15]'
			}`}
		>
			<span
				className={`w-6 h-6 rounded-full flex items-center justify-center ${
					active ? 'bg-black/10' : 'bg-white/12'
				}`}
			>
				{active ? <Minus size={13} /> : <Plus size={13} />}
			</span>
			{label}
		</button>
	)
}

function Card({children}: {children: React.ReactNode}) {
	return (
		<div className="bg-[#1c1c1e] rounded-2xl p-5 text-sm text-white/80 leading-relaxed max-w-sm">
			{children}
		</div>
	)
}

function Toggle({on, set, label}: {on: boolean; set: (v: boolean) => void; label: string}) {
	return (
		<button
			type="button"
			onClick={() => set(!on)}
			className="flex items-center justify-between w-full py-1.5"
			aria-pressed={on}
		>
			<span className="text-white/85">{label}</span>
			<span className={`w-10 h-6 rounded-full relative transition-colors ${on ? 'bg-[#e8702a]' : 'bg-white/20'}`}>
				<span
					className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-[18px]' : 'left-0.5'}`}
				/>
			</span>
		</button>
	)
}

export default function CloserLook() {
	// Tous les menus FERMÉS au départ — le phone se présente de face,
	// et l'ouverture d'une pill le tourne de 3/4 + zoome (à la Apple).
	const [open, setOpen] = useState<FeatureId | null>(null)
	const [deviceId, setDeviceId] = useState(CL_DEVICES[0].id)
	const device = CL_DEVICES.find((d) => d.id === deviceId) || CL_DEVICES[0]
	const [color, setColor] = useState(defaultFinishColor(CL_DEVICES[0].id))
	const [finish, setFinish] = useState('')
	const [followCursor, setFollowCursor] = useState(false)
	const [autoRotate, setAutoRotate] = useState(false)
	const [float, setFloat] = useState(true)
	// Défaut aligné sur la waitlist — 0.65 délavait l'orange Cosmic.
	const [light, setLight] = useState(0.22)
	const [media, setMedia] = useState<{url: string; type: 'image' | 'video'} | null>(null)
	const [dragOver, setDragOver] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [modelReady, setModelReady] = useState(false)
	const fileRef = useRef<HTMLInputElement>(null)
	// Distingue un CLIC (ouvre le sélecteur de fichier) d'un DRAG
	// (grab-rotate du modèle) : seuil de 6px entre down et up.
	const pointerDownRef = useRef<{x: number; y: number} | null>(null)
	// Perf : la section est sous le fold — frameloop coupé hors viewport.
	// Marge large : la vidéo (re)démarre avant l'arrivée, coupe après la sortie.
	const {ref: viewRef, inView} = useInView('600px')

	// Fade entre les mockups : reset à chaque changement de device, la
	// plume couvre le chargement du GLB, puis fade-in au signal scene-ready.
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

	const handleFile = useCallback((file: File | undefined | null) => {
		if (!file) return
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')
		if (!isImage && !isVideo) {
			setUploadError('Image or video only (PNG, JPG, WebP, MP4, WebM)')
			setTimeout(() => setUploadError(null), 3200)
			return
		}
		if (file.size > MAX_UPLOAD_BYTES) {
			setUploadError('Max upload 20 MB — compress your file and retry')
			setTimeout(() => setUploadError(null), 3200)
			return
		}
		setMedia((prev) => {
			if (prev?.url.startsWith('blob:')) {
				try {
					URL.revokeObjectURL(prev.url)
				} catch {}
			}
			return {url: URL.createObjectURL(file), type: isImage ? 'image' : 'video'}
		})
	}, [])

	const payload = useMemo(() => {
		const mockup = {
			id: 'closer-look',
			device_id: device.id,
			name: 'Closer look',
			media_type: media?.type ?? 'none',
			screen_image_url: media?.type === 'image' ? media.url : null,
			screen_video_url: media?.type === 'video' ? media.url : null,
			environment_id: 'studio',
			light_intensity: light,
			camera_position: 'free',
			is_locked: false,
			animations: {
				followCursor,
				followCursorSpeed: 0.45,
				followCursorRotation: 0.5,
				followCursorInvert: true,
				grabMove: true,
				autoRotate,
				autoRotateSensitivity: 0.25,
				loopAnimation: float,
				loopAnimationSensitivity: 0.05,
				scrollZoom: false,
				imageZoom: 1,
				screenExposure: 0.5,
				showShadow: false,
				deviceColor: color,
				deviceColors: {},
				deviceFinish: finish,
			},
		} as unknown as Mockup
		// Override de scale local (iMac réduit ici uniquement).
		const scaled = CL_SCALE_OVERRIDE[device.id]
			? {...device, default_scale: CL_SCALE_OVERRIDE[device.id]}
			: device
		return {mockup, device: scaled}
	}, [device, color, finish, followCursor, autoRotate, float, light, media])

	// Pose présentation : Colours / Finish / Light → vue 3/4 arrière
	// zoomée (les couleurs/finitions vivent sur la coque) ; Content et
	// menus fermés → de face.
	const pose = useMemo(
		() =>
			open === 'colors' || open === 'finish' || open === 'light'
				? {rotateY: 2.35, zoom: 1.22}
				: {rotateY: 0, zoom: 1},
		[open],
	)

	return (
		<section id="live" ref={viewRef as any} className="relative px-6 md:px-16 py-20 md:py-28 max-w-[1560px] mx-auto scroll-mt-20" aria-label="Product features explorer">
			<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 px-2 flex items-center gap-3">
				<span className="w-8 h-px bg-[#e8702a]" />
				The studio
			</div>
			<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] mb-10 px-2 m-0">
				<span className="text-white">Take a</span>{' '}
				<span className="text-white/45">closer look.</span>
			</h2>

			<div className="relative bg-[#0b0b0d] border border-white/[0.06] rounded-[2.2rem] overflow-hidden min-h-[620px] grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
				{/* Left: pills + per-feature simplified plugin UI */}
				<div className="relative z-10 flex flex-col items-start gap-3 p-8 sm:p-12 justify-center">
					<Pill active={open === 'colors'} label="Colours" onClick={() => setOpen((o) => (o === 'colors' ? null : 'colors'))} />
					{open === 'colors' && (
						<Card>
							<b className="text-white">Colours.</b> Repaint the whole device — Apple palette or any hex,
							the notch and screen bezel stay untouched.
							<div className="flex items-center gap-2.5 mt-4">
								{deviceFinishColors(deviceId).map((c) => (
									<button
										key={c}
										type="button"
										aria-label={`Color ${c}`}
										onClick={() => setColor(c)}
										className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
											color === c ? 'border-white scale-110' : 'border-white/20'
										}`}
										style={{backgroundColor: c}}
									/>
								))}
								{/* "Any hex" — vrai color picker natif */}
								<label
									aria-label="Custom color"
									className={`relative w-7 h-7 rounded-full border-2 cursor-pointer overflow-hidden transition-transform hover:scale-110 ${
										!deviceFinishColors(deviceId).includes(color) ? 'border-white scale-110' : 'border-white/20'
									}`}
									style={{
										background:
											'conic-gradient(from 0deg, #ff5f5f, #ffc14d, #7ee081, #57c8ff, #a97fff, #ff5f5f)',
									}}
								>
									<input
										type="color"
										value={color || defaultFinishColor(deviceId)}
										onChange={(e) => setColor(e.target.value)}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
								</label>
							</div>
						</Card>
					)}

					<Pill active={open === 'finish'} label="Textures & finish" onClick={() => setOpen((o) => (o === 'finish' ? null : 'finish'))} />
					{open === 'finish' && (
						<Card>
							<b className="text-white">Finish.</b> Matte, brushed metal or glossy — PBR materials react
							to the studio light in real time.
							<div className="flex flex-wrap gap-2 mt-4">
								{FINISHES.map((f) => (
									<button
										key={f.id}
										type="button"
										onClick={() => setFinish(f.id)}
										className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
											finish === f.id ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
										}`}
									>
										{f.label}
									</button>
								))}
							</div>
						</Card>
					)}

					<Pill active={open === 'animations'} label="Animations" onClick={() => setOpen((o) => (o === 'animations' ? null : 'animations'))} />
					{open === 'animations' && (
						<Card>
							<b className="text-white">Animations.</b> They replay exactly like this on your published
							Framer page — across the whole page, not just the frame.
							<div className="mt-3 divide-y divide-white/10">
								<Toggle on={followCursor} set={setFollowCursor} label="Follow cursor" />
								<Toggle on={autoRotate} set={setAutoRotate} label="Auto-rotate" />
								<Toggle on={float} set={setFloat} label="Float" />
							</div>
						</Card>
					)}

					<Pill active={open === 'light'} label="Studio light" onClick={() => setOpen((o) => (o === 'light' ? null : 'light'))} />
					{open === 'light' && (
						<Card>
							<b className="text-white">Light.</b> HDR studio environment with adjustable intensity —
							same lighting pipeline as the plugin.
							<div className="mt-4">
								<input
									type="range"
									min={0.1}
									max={1}
									step={0.01}
									value={light}
									onChange={(e) => setLight(Number(e.target.value))}
									className="w-full accent-[#e8702a]"
								/>
							</div>
						</Card>
					)}
				</div>

				{/* Right: live 3D — reacts to every control */}
				<div className="relative min-h-[420px] flex flex-col">
					<div
						className="relative flex-1 min-h-[380px] cursor-pointer"
						onDragOver={(e) => {
							e.preventDefault()
							setDragOver(true)
						}}
						onDragLeave={() => setDragOver(false)}
						onDrop={(e) => {
							e.preventDefault()
							setDragOver(false)
							handleFile(e.dataTransfer.files?.[0])
						}}
						onPointerDown={(e) => {
							pointerDownRef.current = {x: e.clientX, y: e.clientY}
						}}
						onPointerUp={(e) => {
							const d = pointerDownRef.current
							pointerDownRef.current = null
							if (!d) return
							// < 6px = clic (pas un grab-rotate) → ouvre le sélecteur.
							if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) fileRef.current?.click()
						}}
					>
						<div
							className="absolute inset-0"
							style={{opacity: modelReady ? 1 : 0, transition: 'opacity 0.55s ease'}}
						>
							<Canvas
								frameloop={inView ? 'always' : 'never'}
								camera={{position: [0, 0, 3.6], fov: 20, near: 0.1, far: 1000}}
								dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1}
								gl={{antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance'}}
								style={{background: 'transparent'}}
							>
								<Suspense fallback={null}>
									<MockupScene payload={payload} transparentBg pose={pose} inViewport={inView} />
								</Suspense>
							</Canvas>
						</div>

						{/* Overlay de drop */}
						<div
							className={`absolute inset-4 rounded-2xl border-2 border-dashed pointer-events-none transition-all duration-200 flex items-center justify-center ${
								dragOver ? 'border-[#e8702a] bg-[#e8702a]/10 opacity-100' : 'border-white/0 opacity-0'
							}`}
						>
							<p className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
								Drop it — your content goes on screen
							</p>
						</div>

						{/* Plume de chargement (au changement de device) */}
						<MascotLoading visible={!modelReady} />

						{/* Erreur upload (20 Mo max) */}
						{uploadError && (
							<div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-30 text-xs sm:text-sm text-white font-medium bg-[#c62828]/90 backdrop-blur border border-white/20 px-4 py-2.5 rounded-full whitespace-nowrap">
								{uploadError}
							</div>
						)}

						{/* Hint discret — tant qu'aucun média n'est chargé */}
						{!media && !dragOver && (
							<div className="absolute left-1/2 bottom-3 -translate-x-1/2 z-10 text-[11px] text-white/35 pointer-events-none whitespace-nowrap">
								Drop or tap to add a photo or video — 20 MB max
							</div>
						)}
					</div>

					<input
						ref={fileRef}
						type="file"
						accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
						className="hidden"
						onChange={(e) => handleFile(e.target.files?.[0])}
					/>
					{/* Device switch — même pill que le hero.
					    Mobile : statique, en dessous du modèle (centrée, scrollable).
					    Desktop : absolue en haut à droite du canvas 3D. */}
					<div className="lg:absolute lg:top-5 lg:right-5 lg:bottom-auto lg:left-auto z-10 flex justify-center px-3 py-3 lg:p-0">
						<div
							className="flex items-center gap-1 bg-white/[0.08] border border-white/[0.12] backdrop-blur rounded-full p-1 overflow-x-auto max-w-full"
							role="group"
							aria-label="Choose a device"
						>
							{CL_DEVICES.map((d) => (
								<button
									key={d.id}
									type="button"
									onClick={() => {
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
					</div>
				</div>
			</div>
		</section>
	)
}
