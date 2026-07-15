/**
 * Memselon mascot — tiny pixel-art cat run cycle (2 frames), pure CSS
 * box-shadow pixels, zero assets. Gallops along the export progress
 * bar over a Chrome-dino-style parallax ground (2 layers scrolling at
 * different speeds). Adopted as the loading mascot across Memselon
 * tools.
 */

const PX = 3 // pixel size

// Pixel grids (x, y) — side view cat running to the right, 9 px wide.
const BODY: Array<[number, number]> = [
	// raised tail (curls up-left)
	[0, 0], [1, 1],
	// body
	[2, 1], [3, 1], [4, 1], [5, 1],
	[2, 2], [3, 2], [4, 2], [5, 2],
	// head + muzzle
	[6, 1], [7, 1], [8, 1],
	[6, 2], [7, 2],
	// ears
	[6, 0], [8, 0],
]
const LEGS_A: Array<[number, number]> = [
	// stride extended
	[2, 3], [5, 3], [1, 4], [6, 4],
]
const LEGS_B: Array<[number, number]> = [
	// gathered under the body
	[3, 3], [4, 3], [3, 4], [4, 4],
]
const EYE: Array<[number, number]> = [[7, 1]]

function shadows(px: Array<[number, number]>, color: string): string {
	return px.map(([x, y]) => `${x * PX}px ${y * PX}px 0 0 ${color}`).join(', ')
}

export function PixelCatRunner({progressPct, color = '#2b2b2b'}: {progressPct: number; color?: string}) {
	const clamped = Math.max(0, Math.min(100, progressPct))
	const CAT_W = 9 * PX
	const CAT_H = 5 * PX
	const STRIP_H = CAT_H + PX * 2 // cat + ground clearance
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
				@keyframes memselon-cat-gallop-a { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
				@keyframes memselon-cat-gallop-b { 0%, 49% { opacity: 0 } 50%, 100% { opacity: 1 } }
				@keyframes memselon-cat-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-${PX}px) } }
				@keyframes memselon-ground-fast { from { background-position: 0 0 } to { background-position: -${PX * 8}px 0 } }
				@keyframes memselon-ground-slow { from { background-position: 0 0 } to { background-position: -${PX * 16}px 0 } }
			`}</style>

			{/* Parallax layer 1 — far: sparse pebbles/clouds, slow scroll. */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: 0.25,
					backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${PX}px, transparent ${PX}px ${PX * 16}px)`,
					backgroundSize: `${PX * 16}px ${PX}px`,
					backgroundRepeat: 'repeat-x',
					backgroundPosition: `0 ${PX * 2}px`,
					animation: 'memselon-ground-slow 2.4s linear infinite',
				}}
			/>
			{/* Parallax layer 2 — ground line with dashes, fast scroll. */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: PX,
					opacity: 0.45,
					backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${PX * 3}px, transparent ${PX * 3}px ${PX * 8}px)`,
					backgroundSize: `${PX * 8}px ${PX}px`,
					backgroundRepeat: 'repeat-x',
					animation: 'memselon-ground-fast 0.9s linear infinite',
				}}
			/>

			{/* The cat — rides the progress %. */}
			<div
				style={{
					position: 'absolute',
					left: `calc(${clamped}% - ${CAT_W}px)`,
					bottom: PX,
					width: CAT_W,
					height: CAT_H,
					transition: 'left 0.25s ease',
					animation: 'memselon-cat-bob 0.36s steps(1) infinite',
				}}
			>
				<div style={{position: 'absolute', width: PX, height: PX, boxShadow: shadows(BODY, color)}} />
				<div style={{position: 'absolute', width: PX, height: PX, boxShadow: shadows(EYE, '#4285F4')}} />
				<div
					style={{
						position: 'absolute',
						width: PX,
						height: PX,
						boxShadow: shadows(LEGS_A, color),
						animation: 'memselon-cat-gallop-a 0.36s steps(1) infinite',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						width: PX,
						height: PX,
						boxShadow: shadows(LEGS_B, color),
						animation: 'memselon-cat-gallop-b 0.36s steps(1) infinite',
					}}
				/>
			</div>
		</div>
	)
}
