'use client'

/**
 * /render-studio — internal tool to capture device stills + short
 * animation clips for the public landing tiles. NOT linked from the
 * nav. Open in a browser, pick a device (or "All"), and the page
 * downloads PNGs / WebM files you can drop into /public/renders/ and
 * /public/clips/ respectively.
 *
 * Renders each GLB centered in a neutral environment so the assets
 * look uniform across the lineup. MediaRecorder is used for the
 * animation clips (Follow Cursor / Auto Rotate / Float / Scroll move),
 * each running for a fixed duration before stopping.
 */

import {Suspense, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Environment, OrbitControls, useGLTF, Stage} from '@react-three/drei'
import * as THREE from 'three'

type Device = {
	id: string
	label: string
	glb: string
	/** Fudge factor to scale the model toward a fixed visual size. */
	scale?: number
}

const DEVICES: Device[] = [
	{id: 'iphone17pro', label: 'iPhone 17 Pro', glb: '/3d/iphone17pro.glb', scale: 1.0},
	{id: 'iphone16e', label: 'iPhone 16e', glb: '/3d/iphone16e.glb', scale: 1.0},
	{id: 'iphoneAir', label: 'iPhone Air', glb: '/3d/iphoneAir.glb', scale: 1.0},
	{id: 'ipad', label: 'iPad', glb: '/3d/ipad.glb', scale: 0.9},
	{id: 'macbookPro', label: 'MacBook Pro 16"', glb: '/3d/macbookPro.glb', scale: 0.85},
	{id: 'imac', label: 'iMac', glb: '/3d/imac.glb', scale: 0.7},
	{id: 'appleProDisplay', label: 'Apple Pro Display XDR', glb: '/3d/appleProDisplay.glb', scale: 0.75},
	{id: 'appleWatchUltra', label: 'Apple Watch Ultra', glb: '/3d/appleWatchUltra.glb', scale: 1.4},
	{id: 'samsung-s25', label: 'Samsung Galaxy S25', glb: '/3d/samsung-s25.glb', scale: 1.0},
	{id: 'macintosh1984', label: 'Macintosh 1984', glb: '/3d/macintosh1984.glb', scale: 0.95},
]

type Animation = 'followCursor' | 'autoRotate' | 'float' | 'scrollMove'
const ANIMATIONS: {key: Animation; label: string; duration: number}[] = [
	{key: 'followCursor', label: 'Follow cursor', duration: 6},
	{key: 'autoRotate', label: 'Auto rotate', duration: 6},
	{key: 'float', label: 'Float', duration: 6},
	{key: 'scrollMove', label: 'Scroll move', duration: 6},
]

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	a.remove()
	setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function CenteredModel({glb, scale = 1}: {glb: string; scale?: number}) {
	const gltf = useGLTF(glb) as any
	const group = useRef<THREE.Group>(null)

	const cloned = useMemo(() => {
		const c = gltf.scene.clone(true)
		// Center on origin + uniform target size.
		const box = new THREE.Box3().setFromObject(c)
		const center = new THREE.Vector3()
		const size = new THREE.Vector3()
		box.getCenter(center)
		box.getSize(size)
		c.position.sub(center)
		const maxDim = Math.max(size.x, size.y, size.z) || 1
		const fit = 2.4 / maxDim
		c.scale.multiplyScalar(fit * scale)
		return c
	}, [gltf, scale])

	return (
		<group ref={group}>
			<primitive object={cloned} />
		</group>
	)
}

function CursorRig({active}: {active: boolean}) {
	const {camera, pointer} = useThree()
	useFrame((_, dt) => {
		if (!active) return
		const target = new THREE.Vector3(pointer.x * 1.8, pointer.y * 0.9, 4)
		camera.position.x += (target.x - camera.position.x) * Math.min(1, dt * 4)
		camera.position.y += (target.y - camera.position.y) * Math.min(1, dt * 4)
		camera.lookAt(0, 0, 0)
	})
	return null
}

function AutoRotate({active}: {active: boolean}) {
	const {camera} = useThree()
	const t = useRef(0)
	useFrame((_, dt) => {
		if (!active) return
		t.current += dt * 0.7
		const r = 4
		camera.position.x = Math.sin(t.current) * r
		camera.position.z = Math.cos(t.current) * r
		camera.lookAt(0, 0, 0)
	})
	return null
}

function Float({active}: {active: boolean}) {
	const {camera} = useThree()
	useFrame((state) => {
		if (!active) return
		camera.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.18
		camera.lookAt(0, 0, 0)
	})
	return null
}

function ScrollMove({active}: {active: boolean}) {
	const {camera} = useThree()
	const t = useRef(0)
	useFrame((_, dt) => {
		if (!active) return
		t.current += dt * 0.5
		const x = Math.sin(t.current) * 1.8
		camera.position.x = x
		camera.position.z = 4
		camera.lookAt(0, 0, 0)
	})
	return null
}

function StudioCanvas({
	device,
	activeAnim,
	onReady,
}: {
	device: Device
	activeAnim: Animation | null
	onReady: (canvas: HTMLCanvasElement) => void
}) {
	return (
		<Canvas
			gl={{preserveDrawingBuffer: true, antialias: true, alpha: true}}
			camera={{position: [0, 0, 4], fov: 35}}
			onCreated={({gl}) => onReady(gl.domElement)}
			dpr={[1, 2]}
			style={{width: '100%', height: '100%', background: 'transparent'}}
		>
			<Suspense fallback={null}>
				<Stage environment="studio" intensity={0.55} adjustCamera={false} shadows={false}>
					<CenteredModel glb={device.glb} scale={device.scale} />
				</Stage>
			</Suspense>
			<CursorRig active={activeAnim === 'followCursor'} />
			<AutoRotate active={activeAnim === 'autoRotate'} />
			<Float active={activeAnim === 'float'} />
			<ScrollMove active={activeAnim === 'scrollMove'} />
			<OrbitControls makeDefault enableDamping enablePan={false} />
		</Canvas>
	)
}

export default function RenderStudioPage() {
	const [deviceIdx, setDeviceIdx] = useState(0)
	const [activeAnim, setActiveAnim] = useState<Animation | null>(null)
	const [status, setStatus] = useState<string>('Idle.')
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const device = DEVICES[deviceIdx]

	const captureStill = async (d: Device): Promise<Blob | null> => {
		const canvas = canvasRef.current
		if (!canvas) return null
		// Two-step: poke the renderer once so the drawing buffer is fresh.
		await new Promise((r) => requestAnimationFrame(r))
		await new Promise((r) => requestAnimationFrame(r))
		return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
	}

	const onCaptureCurrentPNG = async () => {
		setStatus(`Capturing ${device.label}…`)
		const blob = await captureStill(device)
		if (blob) {
			downloadBlob(blob, `${device.id}.png`)
			setStatus(`Downloaded ${device.id}.png`)
		} else {
			setStatus('Capture failed — renderer not ready.')
		}
	}

	const onCaptureAllPNGs = async () => {
		for (let i = 0; i < DEVICES.length; i++) {
			setDeviceIdx(i)
			setStatus(`Loading ${DEVICES[i].label}…`)
			// Wait long enough for the GLB to load + render a fresh frame.
			await new Promise((r) => setTimeout(r, 1500))
			const blob = await captureStill(DEVICES[i])
			if (blob) {
				downloadBlob(blob, `${DEVICES[i].id}.png`)
				setStatus(`Downloaded ${DEVICES[i].id}.png (${i + 1}/${DEVICES.length})`)
			}
			await new Promise((r) => setTimeout(r, 400))
		}
		setStatus(`All ${DEVICES.length} stills captured.`)
	}

	const recordAnimation = async (anim: Animation) => {
		const canvas = canvasRef.current
		if (!canvas) {
			setStatus('Canvas not ready.')
			return
		}
		const stream = (canvas as any).captureStream(30) as MediaStream
		let mime = 'video/webm;codecs=vp9'
		if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm;codecs=vp8'
		if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm'
		const rec = new MediaRecorder(stream, {mimeType: mime, videoBitsPerSecond: 4_000_000})
		const chunks: Blob[] = []
		rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data)
		const done = new Promise<void>((resolve) => (rec.onstop = () => resolve()))
		setActiveAnim(anim)
		setStatus(`Recording ${anim}…`)
		rec.start()
		const duration = ANIMATIONS.find((a) => a.key === anim)?.duration ?? 5
		await new Promise((r) => setTimeout(r, duration * 1000))
		rec.stop()
		await done
		setActiveAnim(null)
		const blob = new Blob(chunks, {type: 'video/webm'})
		downloadBlob(blob, `${anim}.webm`)
		setStatus(`Downloaded ${anim}.webm (${(blob.size / 1024 / 1024).toFixed(1)} MB).`)
	}

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '320px 1fr',
				height: '100vh',
				background: '#0a0a0a',
				color: '#e6e6e6',
				fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
				fontSize: 13,
			}}
		>
			<aside
				style={{
					padding: 20,
					borderRight: '1px solid rgba(255,255,255,0.08)',
					overflowY: 'auto',
				}}
			>
				<h1 style={{fontSize: 16, margin: '0 0 4px', letterSpacing: -0.2}}>Render Studio</h1>
				<p style={{margin: '0 0 18px', opacity: 0.6, lineHeight: 1.5}}>
					Internal tool. Captures device stills + 6-second animation clips for the
					landing tiles. Files download to your browser's default download folder —
					drop the PNGs into <code>public/renders/</code> and the WebM clips into
					<code> public/clips/</code>.
				</p>

				<section style={{marginBottom: 18}}>
					<h2 style={{fontSize: 11, opacity: 0.55, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5}}>
						Device
					</h2>
					<select
						value={deviceIdx}
						onChange={(e) => setDeviceIdx(Number(e.target.value))}
						style={{
							width: '100%',
							padding: '8px 10px',
							background: '#141414',
							color: '#e6e6e6',
							border: '1px solid rgba(255,255,255,0.1)',
							borderRadius: 6,
							fontSize: 13,
						}}
					>
						{DEVICES.map((d, i) => (
							<option key={d.id} value={i}>
								{d.label}
							</option>
						))}
					</select>
				</section>

				<section style={{marginBottom: 18}}>
					<h2 style={{fontSize: 11, opacity: 0.55, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5}}>
						Stills (PNG)
					</h2>
					<button onClick={onCaptureCurrentPNG} style={btnStyle()}>
						Capture current device
					</button>
					<button onClick={onCaptureAllPNGs} style={btnStyle({primary: true, mt: 8})}>
						Capture all {DEVICES.length} devices
					</button>
				</section>

				<section style={{marginBottom: 18}}>
					<h2 style={{fontSize: 11, opacity: 0.55, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5}}>
						Animations (WebM, 6 s)
					</h2>
					{ANIMATIONS.map((a) => (
						<button
							key={a.key}
							onClick={() => recordAnimation(a.key)}
							style={btnStyle({mt: 6, active: activeAnim === a.key})}
						>
							{activeAnim === a.key ? '● Recording ' : 'Record '}
							{a.label}
						</button>
					))}
				</section>

				<div
					style={{
						padding: '10px 12px',
						background: '#141414',
						border: '1px solid rgba(255,255,255,0.08)',
						borderRadius: 6,
						fontSize: 12,
						opacity: 0.85,
						lineHeight: 1.5,
					}}
				>
					<strong style={{opacity: 0.9}}>Status:</strong> {status}
				</div>
			</aside>
			<main style={{position: 'relative'}}>
				<StudioCanvas
					device={device}
					activeAnim={activeAnim}
					onReady={(c) => {
						canvasRef.current = c
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: 16,
						bottom: 16,
						padding: '6px 10px',
						background: 'rgba(0,0,0,0.5)',
						border: '1px solid rgba(255,255,255,0.08)',
						borderRadius: 6,
						fontSize: 11,
						opacity: 0.6,
					}}
				>
					Currently: {device.label}
				</div>
			</main>
		</div>
	)
}

function btnStyle(opts?: {primary?: boolean; mt?: number; active?: boolean}): React.CSSProperties {
	return {
		display: 'block',
		width: '100%',
		marginTop: opts?.mt ?? 0,
		padding: '9px 12px',
		background: opts?.active ? '#dc2626' : opts?.primary ? '#e8702a' : '#141414',
		color: opts?.primary || opts?.active ? '#fff' : '#e6e6e6',
		border: opts?.primary || opts?.active ? 'none' : '1px solid rgba(255,255,255,0.1)',
		borderRadius: 6,
		fontSize: 13,
		fontWeight: opts?.primary ? 600 : 400,
		cursor: 'pointer',
		textAlign: 'left',
	}
}

// Preload all GLBs once so the iteration "Capture all" is fast.
DEVICES.forEach((d) => useGLTF.preload(d.glb))
