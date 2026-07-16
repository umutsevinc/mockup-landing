/**
 * Mockiosa mascot — the brand feather flying in levitation along the
 * progress bar (Wingardium Leviosa). Replaces the pixel cat runner,
 * same API (progressPct, color). Two parallax "air stream" layers keep
 * the sense of motion while the feather itself floats (bob + sway).
 */

const FW = 22 // feather size
const STRIP_H = 30

export function FeatherRunner({progressPct, color = '#2b2b2b'}: {progressPct: number; color?: string}) {
	const clamped = Math.max(0, Math.min(100, progressPct))
	return (
		<div
			aria-hidden
			style={{
				position: 'relative',
				height: STRIP_H,
				width: '100%',
				overflow: 'hidden',
			}}
		>
			<style>{`
				@keyframes mockiosa-feather-float { 0%, 100% { transform: translateY(0) rotate(-6deg) } 50% { transform: translateY(-5px) rotate(8deg) } }
				@keyframes mockiosa-air-fast { from { background-position: 0 0 } to { background-position: -48px 0 } }
				@keyframes mockiosa-air-slow { from { background-position: 0 0 } to { background-position: -64px 0 } }
			`}</style>

			{/* Air stream — far layer: sparse dashes, slow drift. */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: 0.18,
					backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 10px, transparent 10px 64px)`,
					backgroundSize: '64px 2px',
					backgroundRepeat: 'repeat-x',
					backgroundPosition: '0 8px',
					animation: 'mockiosa-air-slow 2.2s linear infinite',
				}}
			/>
			{/* Air stream — near layer: denser dashes, fast drift. */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 4,
					height: 2,
					opacity: 0.3,
					backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 14px, transparent 14px 48px)`,
					backgroundSize: '48px 2px',
					backgroundRepeat: 'repeat-x',
					animation: 'mockiosa-air-fast 0.8s linear infinite',
				}}
			/>

			{/* The feather — rides the progress %, levitating. */}
			<div
				style={{
					position: 'absolute',
					left: `calc(${clamped}% - ${FW}px)`,
					bottom: 2,
					width: FW,
					height: FW,
					transition: 'left 0.25s ease',
					animation: 'mockiosa-feather-float 1.6s ease-in-out infinite',
				}}
			>
				<svg
					width={FW}
					height={FW}
					viewBox="0 0 24 24"
					fill="none"
					stroke={color}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
					<path d="M16 8 2 22" />
					<path d="M17.5 15H9" />
				</svg>
			</div>
		</div>
	)
}
