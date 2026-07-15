'use client'

import {Suspense, useCallback, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {Plus, Minus} from 'lucide-react'
import {MockupScene} from './mockup/MockupScene'
import type {Mockup} from '@/lib/mockup-types'
import {PLAYGROUND_DEVICES} from '@/lib/playground-devices'
import {useInView} from '@/lib/useInView'

/**
 * "Take a closer look" — section interactive à la Apple (iPhone 17 page):
 * pills de fonctionnalités à gauche ; chaque pill ouverte montre une
 * carte de description + l'UI SIMPLIFIÉE du plugin pour cette
 * fonctionnalité, et le mockup 3D à droite réagit en direct.
 */

const CL_DEVICES = PLAYGROUND_DEVICES

const COLORS = ['#FF9500', '#1F2A44', '#FFFFFF', '#FF2D55', '#34C759', '#000000']
const FINISHES = [
	{id: '', label: 'Factory'},
	{id: 'mat', label: 'Matte'},
	{id: 'metal', label: 'Brushed metal'},
	{id: 'glossy', label: 'Glossy'},
]

type FeatureId = 'colors' | 'finish' | 'animations' | 'content' | 'light'

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
	const [color, setColor] = useState('#FF9500')
	const [finish, setFinish] = useState('')
	const [followCursor, setFollowCursor] = useState(false)
	const [autoRotate, setAutoRotate] = useState(false)
	const [float, setFloat] = useState(true)
	const [light, setLight] = useState(0.65)
	const [exposure, setExposure] = useState(0.5)
	const [media, setMedia] = useState<{url: string; type: 'image' | 'video'} | null>(null)
	const fileRef = useRef<HTMLInputElement>(null)
	// Perf : la section est sous le fold — frameloop coupé hors viewport.
	const {ref: viewRef, inView} = useInView()

	const handleFile = useCallback((file: File | undefined | null) => {
		if (!file) return
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')
		if (!isImage && !isVideo) return
		if (file.size > 5 * 1024 * 1024) return
		setMedia({url: URL.createObjectURL(file), type: isImage ? 'image' : 'video'})
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
				screenExposure: exposure,
				showShadow: false,
				deviceColor: color,
				deviceColors: {},
				deviceFinish: finish,
			},
		} as unknown as Mockup
		return {mockup, device}
	}, [device, color, finish, followCursor, autoRotate, float, light, exposure, media])

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
		<section ref={viewRef as any} className="relative px-6 md:px-16 py-24 md:py-32 max-w-[1560px] mx-auto" aria-label="Product features explorer">
			<h2 className="text-4xl sm:text-6xl font-semibold tracking-tight mb-10 px-2">Take a closer look.</h2>

			<div className="relative bg-[#0b0b0d] border border-white/[0.06] rounded-[2.2rem] overflow-hidden min-h-[620px] grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
				{/* Left: pills + per-feature simplified plugin UI */}
				<div className="relative z-10 flex flex-col items-start gap-3 p-8 sm:p-12 justify-center">
					<Pill active={open === 'colors'} label="Colours" onClick={() => setOpen((o) => (o === 'colors' ? null : 'colors'))} />
					{open === 'colors' && (
						<Card>
							<b className="text-white">Colours.</b> Repaint the whole device — Apple palette or any hex,
							the notch and screen bezel stay untouched.
							<div className="flex items-center gap-2.5 mt-4">
								{COLORS.map((c) => (
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

					<Pill active={open === 'content'} label="Your content" onClick={() => setOpen((o) => (o === 'content' ? null : 'content'))} />
					{open === 'content' && (
						<Card>
							<b className="text-white">Photo & video.</b> Drop anything — it plays on the screen mesh,
							ratio preserved, exposure adjustable.
							<button
								type="button"
								onClick={() => fileRef.current?.click()}
								className="mt-4 w-full border border-dashed border-white/25 hover:border-white/60 rounded-xl py-3 text-xs text-white/70 hover:text-white transition-colors"
							>
								Click to load an image or video (5 MB max)
							</button>
							<div className="mt-4">
								<label className="text-xs text-white/55">Screen exposure</label>
								<input
									type="range"
									min={0}
									max={1}
									step={0.01}
									value={exposure}
									onChange={(e) => setExposure(Number(e.target.value))}
									className="w-full accent-[#e8702a]"
								/>
							</div>
							<input
								ref={fileRef}
								type="file"
								accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
								className="hidden"
								onChange={(e) => handleFile(e.target.files?.[0])}
							/>
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
				<div className="relative min-h-[420px]">
					{/* Device switch — test en temps réel iPhone / Watch */}
					<div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.12] backdrop-blur rounded-full p-1">
						{CL_DEVICES.map((d) => (
							<button
								key={d.id}
								type="button"
								onClick={() => setDeviceId(d.id)}
								aria-pressed={deviceId === d.id}
								className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
									deviceId === d.id ? 'bg-white text-black' : 'text-white/75 hover:text-white'
								}`}
							>
								{d.title}
							</button>
						))}
					</div>
					<Canvas
						frameloop={inView ? 'always' : 'never'}
						camera={{position: [0, 0, 3.6], fov: 20, near: 0.1, far: 1000}}
						dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1}
						gl={{antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance'}}
						style={{background: 'transparent'}}
					>
						<Suspense fallback={null}>
							<MockupScene payload={payload} transparentBg pose={pose} />
						</Suspense>
					</Canvas>
				</div>
			</div>
		</section>
	)
}
