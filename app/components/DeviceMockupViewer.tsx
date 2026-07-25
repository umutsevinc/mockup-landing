'use client'

import {useEffect, useRef, useState} from 'react'
import {useInView} from '@/lib/useInView'

/**
 * Viewer léger des pages SEO /mockups/[slug] — remplace le Canvas 3D
 * par une vidéo pré-rendue R2 (autoplay muted loop). Zéro WebGL sur les
 * pages SEO = LCP top, moteurs de recherche happy, mobile fluide.
 * Le vrai playground 3D interactif reste sur la home hero + /studio.
 */

const R2 = 'https://memselon-media.memselon.workers.dev/marketing/videos'

// Map deviceId (playground) → vidéo R2 pré-rendue.
// iMac fallback FullDevice (pas de clip iMac isolé encore).
const DEVICE_VIDEO_URL: Record<string, string> = {
	iphone17pro: `${R2}/Iphone17.mp4`,
	iphoneAir: `${R2}/IphoneAir.mp4`,
	ipadPro: `${R2}/Ipad.mp4`,
	appleWatchUltra: `${R2}/AppleWatch.mp4`,
	macbookPro: `${R2}/Macbook.mp4`,
	appleProDisplayXDR: `${R2}/AppleDisplay.mp4`,
	imac: `${R2}/FullDevice.mp4`,
}

export default function DeviceMockupViewer({deviceId}: {deviceId: string}) {
	const src = DEVICE_VIDEO_URL[deviceId] || `${R2}/FullDevice.mp4`
	const {ref: viewRef, inView} = useInView('400px')
	const videoRef = useRef<HTMLVideoElement>(null)
	const [loaded, setLoaded] = useState(false)

	// Perf : lazy-mount la balise <video> uniquement quand elle approche
	// du viewport (300-400px de marge). Économise la bande passante des
	// visiteurs qui scrollent vite.
	useEffect(() => {
		const v = videoRef.current
		if (!v || !inView) return
		v.play().catch(() => undefined)
	}, [inView])

	return (
		<div
			ref={viewRef}
			className="relative h-[420px] md:h-[540px] rounded-3xl overflow-hidden bg-black border border-white/[0.07]"
		>
			{inView && (
				<video
					ref={videoRef}
					src={src}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					onLoadedData={() => setLoaded(true)}
					className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
					style={{opacity: loaded ? 1 : 0}}
					aria-label="3D device mockup video"
				/>
			)}
		</div>
	)
}
