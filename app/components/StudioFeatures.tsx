'use client'

import { RotateCw, Video, Smartphone, RefreshCw, Sun, Layers } from 'lucide-react'

/**
 * « Inside the studio » — les fonctionnalités récentes du plugin,
 * chacune illustrée par une vignette UI minimaliste recréée au pixel
 * depuis le vrai plugin (boutons 38px radius 10-12, bleu #0099ff,
 * panneaux sombres). Zéro screenshot : tout est HTML/CSS, net en
 * retina et thème-cohérent avec le reste de la landing.
 */

const BLUE = '#0A99FF'

/* ── petites briques UI « plugin » réutilisées par les vignettes ── */

function ToolButton({ active, children }: { active?: boolean; children: React.ReactNode }) {
	return (
		<div
			className="flex items-center justify-center rounded-[10px] border"
			style={{
				width: 34,
				height: 34,
				background: active ? BLUE : '#151517',
				borderColor: active ? BLUE : 'rgba(255,255,255,0.09)',
				color: active ? '#fff' : 'rgba(255,255,255,0.75)',
			}}
		>
			{children}
		</div>
	)
}

function PanelRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between text-[11px] py-[7px] px-3 border-b border-white/[0.06] last:border-0">
			<span className="text-white/55">{label}</span>
			{value}
		</div>
	)
}

function Switch({ on }: { on: boolean }) {
	return (
		<span
			className="inline-flex rounded-full p-[2px] transition-colors"
			style={{ width: 30, height: 17, background: on ? BLUE : 'rgba(255,255,255,0.16)' }}
		>
			<span
				className="rounded-full bg-white block"
				style={{ width: 13, height: 13, marginLeft: on ? 13 : 0 }}
			/>
		</span>
	)
}

function Slider({ pct }: { pct: number }) {
	return (
		<div className="relative h-[3px] rounded-full bg-white/12 w-full">
			<div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: BLUE }} />
			<div
				className="absolute top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-white shadow"
				style={{ left: `calc(${pct}% - 5px)` }}
			/>
		</div>
	)
}

/* ── vignettes ── */

function VignetteLandscape() {
	return (
		<div className="flex items-center justify-center gap-6 h-full">
			{/* phone paysage */}
			<div className="relative w-[130px] h-[64px] rounded-[14px] border-2 border-[#e8702a]/80 bg-gradient-to-br from-[#2a1a10] to-[#0d0d0f] shadow-[0_10px_30px_rgba(232,112,42,0.15)]">
				<div className="absolute inset-[5px] rounded-[9px] bg-gradient-to-br from-[#1c2f4a] to-[#0e1622] overflow-hidden">
					<div className="absolute inset-x-2 top-2 h-[6px] rounded bg-white/15" />
					<div className="absolute left-2 bottom-2 w-1/3 h-[5px] rounded bg-white/10" />
				</div>
				<div className="absolute left-1/2 -translate-x-1/2 top-[5px] w-[5px] h-[16px] rounded-full bg-black" />
			</div>
			{/* barre droite du plugin */}
			<div className="flex flex-col gap-2">
				<ToolButton><Layers size={15} strokeWidth={1.7} /></ToolButton>
				<ToolButton active><RotateCw size={15} strokeWidth={1.9} /></ToolButton>
				<ToolButton><Sun size={15} strokeWidth={1.7} /></ToolButton>
			</div>
		</div>
	)
}

function VignetteVideoComponent() {
	return (
		<div className="w-full max-w-[240px] mx-auto rounded-xl border border-white/[0.08] bg-[#101012] overflow-hidden text-left">
			<div className="px-3 py-2 text-[10px] font-semibold tracking-wide text-white/40 border-b border-white/[0.06]">
				Framer3DMockup — Video
			</div>
			<PanelRow label="Static scene" value={<span className="flex items-center gap-1.5"><Switch on /> <span className="text-white/30 text-[9px]">locked</span></span>} />
			<PanelRow
				label="Resolution"
				value={
					<span className="flex gap-1">
						{['720p', '1080p', '4K'].map((r) => (
							<span
								key={r}
								className="px-1.5 py-[2px] rounded-md text-[9px] font-semibold"
								style={r === '4K' ? { background: BLUE, color: '#fff' } : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
							>
								{r}
							</span>
						))}
					</span>
				}
			/>
			<PanelRow label="Weight on your site" value={<span className="text-white/85 font-semibold">~2 KB</span>} />
		</div>
	)
}

function VignetteLibraries() {
	return (
		<div className="flex flex-col gap-2.5 w-full max-w-[250px] mx-auto">
			{[
				{ name: 'My 3D Mockups', count: '12 scenes', pct: 18 },
				{ name: 'My Video Mockups', count: '5 scenes', pct: 7 },
			].map((l) => (
				<div key={l.name} className="rounded-xl border border-white/[0.08] bg-[#101012] px-3.5 py-3">
					<div className="flex items-center justify-between text-[11px] mb-2">
						<span className="text-white/90 font-semibold">{l.name}</span>
						<span className="text-white/35">{l.count}</span>
					</div>
					<div className="h-[4px] rounded-full bg-white/[0.08]">
						<div className="h-full rounded-full" style={{ width: `${l.pct}%`, background: BLUE }} />
					</div>
				</div>
			))}
			<div className="text-center text-[10px] text-white/35">Storage used: 2.1 GB / 25 GB</div>
		</div>
	)
}

function VignetteMobilePerf() {
	return (
		<div className="w-full max-w-[240px] mx-auto rounded-xl border border-white/[0.08] bg-[#101012] overflow-hidden text-left">
			<PanelRow label="Mobile perf" value={<Switch on />} />
			<div className="px-3 py-3 flex items-center justify-center gap-3 text-[11px]">
				<span className="text-white/40 line-through">DPR 3</span>
				<span className="text-white/30">→</span>
				<span className="font-bold" style={{ color: BLUE }}>DPR 1.5</span>
				<span className="text-white/20">·</span>
				<span className="text-white/40 line-through">2048px</span>
				<span className="text-white/30">→</span>
				<span className="font-bold" style={{ color: BLUE }}>1024px</span>
			</div>
			<div className="px-3 pb-3 text-center text-[10px] text-white/35">4× fewer pixels rendered on phones</div>
		</div>
	)
}

function VignettePose() {
	return (
		<div className="flex items-center justify-center gap-5 h-full">
			{/* phone en ¾ (skew CSS) */}
			<div
				className="relative w-[58px] h-[112px] rounded-[13px] border-2 border-[#e8702a]/70 bg-gradient-to-br from-[#3a2213] to-[#0d0d0f]"
				style={{ transform: 'perspective(300px) rotateY(38deg)' }}
			>
				<div className="absolute top-2.5 left-2.5 w-[22px] h-[22px] rounded-[7px] bg-[#151517] border border-white/10" />
			</div>
			{/* panneau Light */}
			<div className="w-[128px] rounded-xl border border-white/[0.08] bg-[#101012] p-3">
				<div className="text-[10px] font-bold text-white mb-2.5">Light</div>
				<div className="space-y-3">
					<div><div className="text-[9px] text-white/45 mb-1.5">Intensity</div><Slider pct={72} /></div>
					<div><div className="text-[9px] text-white/45 mb-1.5">Position</div><Slider pct={45} /></div>
				</div>
			</div>
		</div>
	)
}

function VignetteRefresh() {
	return (
		<div className="w-full max-w-[240px] mx-auto rounded-xl border border-white/[0.08] bg-[#101012] overflow-hidden text-left">
			<div className="px-3 py-2 text-[10px] font-semibold tracking-wide text-white/40 border-b border-white/[0.06] flex items-center gap-1.5">
				<RefreshCw size={10} /> Framer properties
			</div>
			<PanelRow label="Refresh" value={<Switch on />} />
			<div className="px-3 pb-3 pt-1 text-[10px] text-white/35 leading-relaxed">
				Flip it → the published scene reloads with your latest edits. No re-insert.
			</div>
		</div>
	)
}

/* ── section ── */

const FEATURES = [
	{
		icon: RotateCw,
		title: 'Landscape, one tap',
		body: 'Rotate any phone to landscape from the toolbar. Your screenshot or video is pre-rotated — never stretched — and the orientation is saved and replayed on your published site.',
		Vignette: VignetteLandscape,
	},
	{
		icon: Video,
		title: 'Video scenes that stay sharp',
		body: 'Export video drops a frozen 3D component instead of a heavy file: pin-sharp at any size, 720p to 4K render quality, and only the source clip is stored — the scene itself weighs ~2 KB.',
		Vignette: VignetteVideoComponent,
	},
	{
		icon: Layers,
		title: 'Two libraries, one storage',
		body: '3D scenes and video scenes live in separate libraries with edit, re-insert and delete. Deleting a scene frees the real bytes — up to 25 GB of cloud storage on Studio.',
		Vignette: VignetteLibraries,
	},
	{
		icon: Smartphone,
		title: 'Mobile perf switch',
		body: 'One toggle compresses the published scene on touch devices only: render resolution capped at DPR 1.5 and screen textures halved. Desktop visitors keep the full quality.',
		Vignette: VignetteMobilePerf,
	},
	{
		icon: Sun,
		title: 'Presentation pose',
		body: 'Open Light or Texture and the device glides to a fixed three-quarter view — animations pause while you tune, then everything resumes exactly where you left it.',
		Vignette: VignettePose,
	},
	{
		icon: RefreshCw,
		title: 'Refresh from Framer',
		body: 'Edited a saved scene in the plugin? Flip the Refresh control on the component in Framer and the live scene reloads instantly. Never rebuild, never re-paste.',
		Vignette: VignetteRefresh,
	},
]

export default function StudioFeatures() {
	return (
		<section className="relative bg-[#0a0a0a] px-6 md:px-16 py-32 md:py-40 border-t border-white/[0.07]">
			<div className="max-w-[1560px] mx-auto">
				<div data-reveal className="reveal-up mb-16 max-w-3xl">
					<div className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-[#e8702a] mb-6 flex items-center gap-3">
						<span className="w-8 h-px bg-[#e8702a]" />
						Inside the studio
					</div>
					<h2 className="text-4xl sm:text-6xl md:text-7xl leading-[0.98] tracking-tight">
						<span className="font-playfair italic font-normal">Every detail</span>{' '}
						<span className="text-white/70">works for you.</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{FEATURES.map(({ icon: Icon, title, body, Vignette }) => (
						<div
							key={title}
							data-reveal
							className="reveal-up rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 flex flex-col gap-6 hover:border-white/[0.15] transition-colors"
						>
							<div className="h-[150px] flex items-center justify-center rounded-2xl bg-black/40 border border-white/[0.05] px-4">
								<Vignette />
							</div>
							<div>
								<div className="flex items-center gap-2.5 mb-2.5">
									<Icon size={15} strokeWidth={1.7} className="text-[#e8702a]" />
									<h3 className="text-base font-semibold text-white">{title}</h3>
								</div>
								<p className="text-sm text-white/55 leading-relaxed">{body}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
