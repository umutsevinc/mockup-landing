'use client'

import {useEffect, useRef, useState} from 'react'
import {Play, Pause, Volume2, VolumeX, Maximize2} from 'lucide-react'

/**
 * Section tutorial de Merve, juste après le hero.
 * Pattern « VLC-lite » (choix 24/07) :
 *   - autoplay muted loop pour attirer l'œil au scroll
 *   - contrôles overlay custom (play/pause + seek + unmute + fullscreen)
 *     qui apparaissent au hover (desktop) ou sont toujours visibles (touch)
 *   - poster instantané (pas de flash noir)
 *
 * Le fichier `/videos/merve-tutorial.mp4` doit être déposé dans /public/videos/.
 * Tant qu'il n'existe pas, la tuile affiche un placeholder avec le nom du
 * fichier attendu — même pattern que <DemoVideo pending>.
 */
export default function MerveTutorial() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [playing, setPlaying] = useState(true)
	const [muted, setMuted] = useState(true)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const [missing, setMissing] = useState(false)
	// Merve tuto video hosted on R2 (memselon-mockup-media / marketing / videos)
	const VIDEO_URL = 'https://memselon-media.memselon.workers.dev/marketing/videos/MerveTuto1-1.mov'

	useEffect(() => {
		const v = videoRef.current
		if (!v) return
		const onTime = () => setProgress(v.currentTime)
		const onMeta = () => setDuration(v.duration || 0)
		v.addEventListener('timeupdate', onTime)
		v.addEventListener('loadedmetadata', onMeta)
		return () => {
			v.removeEventListener('timeupdate', onTime)
			v.removeEventListener('loadedmetadata', onMeta)
		}
	}, [])

	const togglePlay = () => {
		const v = videoRef.current
		if (!v) return
		if (v.paused) {
			v.play()
			setPlaying(true)
		} else {
			v.pause()
			setPlaying(false)
		}
	}

	const toggleMute = () => {
		const v = videoRef.current
		if (!v) return
		v.muted = !v.muted
		setMuted(v.muted)
	}

	const seek = (e: React.MouseEvent<HTMLDivElement>) => {
		const v = videoRef.current
		if (!v || !duration) return
		const rect = e.currentTarget.getBoundingClientRect()
		const pct = (e.clientX - rect.left) / rect.width
		v.currentTime = Math.max(0, Math.min(duration, pct * duration))
	}

	const goFullscreen = () => {
		const c = containerRef.current
		if (!c) return
		if (document.fullscreenElement) document.exitFullscreen()
		else c.requestFullscreen?.()
	}

	const fmt = (s: number) => {
		if (!isFinite(s)) return '0:00'
		const m = Math.floor(s / 60)
		const ss = Math.floor(s % 60)
		return `${m}:${ss.toString().padStart(2, '0')}`
	}

	const pct = duration > 0 ? (progress / duration) * 100 : 0

	return (
		<section
			className="relative bg-black border-t border-white/[0.07] px-6 md:px-16 py-20 md:py-28 overflow-hidden"
			aria-label="Video tutorial by Merve"
		>
			<div className="max-w-[1560px] mx-auto">
				{/* Header — kicker + titre à la Apple */}
				<div className="mb-10 md:mb-14 max-w-2xl">
					<div className="text-xs font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-4 flex items-center gap-3">
						<span className="w-8 h-px bg-[#e8702a]" />
						Watch first
					</div>
					<h2 className="text-3xl sm:text-[40px] font-normal tracking-[-0.025em] leading-[1.1] m-0">
						<span className="text-white">Two minutes,</span>{' '}
						<span className="text-white/45">and you get it.</span>
					</h2>
					<p className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed">
						A quick guided tour by{' '}
						<a
							href="https://x.com/meiiyve"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors"
						>
							May
						</a>
						: drop a shot, tweak the scene, ship it. That&apos;s the whole loop — the rest is
						discovering how far you can push it.
					</p>
				</div>

				{/* Video player VLC-lite */}
				<div
					ref={containerRef}
					className="group relative rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl shadow-black/40 aspect-video max-w-6xl mx-auto"
				>
					{missing ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
							<div className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/35">
								Video placeholder
							</div>
							<div className="text-sm font-mono text-[#e8702a]">/videos/merve-tutorial.mp4</div>
							<div className="text-[11px] text-white/30 leading-relaxed max-w-[320px]">
								Drop the tutorial file at this path and it will replace this placeholder on
								the next reload.
							</div>
						</div>
					) : (
						<video
							ref={videoRef}
							src={VIDEO_URL}
							autoPlay
							muted
							loop
							playsInline
							preload="metadata"
							onError={() => setMissing(true)}
							onClick={togglePlay}
							className="absolute inset-0 w-full h-full object-cover cursor-pointer"
						/>
					)}

					{/* Overlay controls — hover reveal on desktop, always visible on touch (pointer-coarse) */}
					{!missing && (
						<div
							className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent
									 opacity-0 group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100
									 transition-opacity duration-200"
						>
							{/* Seek bar */}
							<div
								onClick={seek}
								className="h-1.5 rounded-full bg-white/15 cursor-pointer relative mb-3 hover:h-2 transition-all"
							>
								<div
									className="h-full rounded-full bg-[#e8702a]"
									style={{width: `${pct}%`}}
								/>
							</div>

							{/* Controls row */}
							<div className="flex items-center gap-3 text-white">
								<button
									type="button"
									onClick={togglePlay}
									aria-label={playing ? 'Pause' : 'Play'}
									className="p-1.5 rounded hover:bg-white/10 transition-colors"
								>
									{playing ? <Pause size={18} /> : <Play size={18} />}
								</button>

								<button
									type="button"
									onClick={toggleMute}
									aria-label={muted ? 'Unmute' : 'Mute'}
									className="p-1.5 rounded hover:bg-white/10 transition-colors"
								>
									{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
								</button>

								<div className="text-xs tabular-nums font-mono text-white/80">
									{fmt(progress)} <span className="text-white/40">/ {fmt(duration)}</span>
								</div>

								<div className="flex-1" />

								{/* VLC-style traffic cone hint (petit clin d'œil) */}
								<div
									aria-hidden
									className="hidden md:flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-white/40"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-[#e8702a] animate-pulse" />
									Live tutorial
								</div>

								<button
									type="button"
									onClick={goFullscreen}
									aria-label="Fullscreen"
									className="p-1.5 rounded hover:bg-white/10 transition-colors"
								>
									<Maximize2 size={16} />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
