'use client'

import {Suspense, useCallback, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {MockupScene} from './mockup/MockupScene'
import type {Mockup} from '@/lib/mockup-types'
import {PLAYGROUND_DEVICES, defaultFinishColor, deviceFinishColors} from '@/lib/playground-devices'
import {useInView} from '@/lib/useInView'

/**
 * Viewer 3D des pages SEO /mockups/[slug] — le device en vrai 3D,
 * orbit au drag, swatches de finitions officielles, drop de contenu
 * (le filigrane plumes s'imprime automatiquement sur les médias
 * droppés — gating blob: dans MockupScene). Frameloop coupé hors
 * viewport, comme CloserLook.
 */
export default function DeviceMockupViewer({deviceId}: {deviceId: string}) {
	const device = PLAYGROUND_DEVICES.find((d) => d.id === deviceId) ?? PLAYGROUND_DEVICES[0]
	const [color, setColor] = useState(defaultFinishColor(device.id))
	const [media, setMedia] = useState<{url: string; type: 'image' | 'video'} | null>(null)
	const fileRef = useRef<HTMLInputElement>(null)
	const {ref: viewRef, inView} = useInView('400px')

	const handleFile = useCallback((file: File | undefined | null) => {
		if (!file) return
		const isImage = file.type.startsWith('image/')
		const isVideo = file.type.startsWith('video/')
		if (!isImage && !isVideo) return
		if (file.size > 20 * 1024 * 1024) return
		setMedia({url: URL.createObjectURL(file), type: isImage ? 'image' : 'video'})
	}, [])

	const payload = useMemo(() => {
		const mockup = {
			id: `seo-${device.id}`,
			device_id: device.id,
			name: device.title,
			media_type: media?.type ?? 'none',
			screen_image_url: media?.type === 'image' ? media.url : null,
			screen_video_url: media?.type === 'video' ? media.url : null,
			environment_id: 'studio',
			light_intensity: 0.22,
			camera_position: 'free',
			is_locked: false,
			animations: {
				followCursor: false,
				grabMove: true,
				autoRotate: false,
				loopAnimation: true,
				loopAnimationSensitivity: 0.05,
				scrollZoom: false,
				imageZoom: 1,
				screenExposure: 0.5,
				showShadow: false,
				deviceColor: color,
				deviceColors: {},
				deviceFinish: '',
			},
		} as unknown as Mockup
		return {mockup, device}
	}, [device, color, media])

	return (
		<div
			ref={viewRef as any}
			className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.07]"
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault()
				handleFile(e.dataTransfer.files?.[0])
			}}
		>
			<div className="h-[420px] md:h-[540px] cursor-grab active:cursor-grabbing">
				<Canvas
					dpr={[1, 1.75]}
					frameloop={inView ? 'always' : 'never'}
					camera={{position: [0, 0, 5], fov: 40}}
					gl={{antialias: true, alpha: true}}
				>
					<Suspense fallback={null}>
						<MockupScene payload={payload} transparentBg inViewport={inView} />
					</Suspense>
				</Canvas>
			</div>

			{/* Barre de contrôle : swatches + drop */}
			<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 flex-wrap pointer-events-none">
				<div className="flex items-center gap-2 pointer-events-auto">
					{deviceFinishColors(device.id).map((c) => (
						<button
							key={c}
							type="button"
							aria-label={`Finish ${c}`}
							onClick={() => setColor(c)}
							className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
								color === c ? 'border-white' : 'border-white/25'
							}`}
							style={{background: c}}
						/>
					))}
				</div>
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					className="pointer-events-auto text-[13px] text-white/80 bg-black/50 hover:bg-black/70 border border-white/15 backdrop-blur px-4 py-2 rounded-full transition-colors"
				>
					{media ? 'Replace content' : 'Drop your screenshot — or click here'}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*,video/*"
					className="hidden"
					onChange={(e) => handleFile(e.target.files?.[0])}
				/>
			</div>
		</div>
	)
}
