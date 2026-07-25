/**
 * Mockiosa mascot — la plume de la marque en lévitation (Wingardium
 * Leviosa), SEULE : pas de barre de progression, pas de traînées d'air.
 * Bob vertical doux + balancement, ombre portée qui respire en dessous.
 */

export function FeatherFloat({size = 34, color = '#ffffff'}: {size?: number; color?: string}) {
	return (
		<div
			aria-hidden
			style={{
				position: 'relative',
				width: size,
				height: size + 18,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<style>{`
				@keyframes mockiosa-feather-levitate {
					0%, 100% { transform: translateY(0) rotate(-7deg) }
					50% { transform: translateY(-8px) rotate(7deg) }
				}
				@keyframes mockiosa-feather-shadow {
					0%, 100% { transform: scaleX(1); opacity: 0.28 }
					50% { transform: scaleX(0.55); opacity: 0.12 }
				}
			`}</style>

			<div style={{width: size, height: size, animation: 'mockiosa-feather-levitate 1.8s ease-in-out infinite'}}>
				{/* Nouveau feather-pen : couleur pilotée via CSS mask
				    (l'<img> ne peut pas être tinté, mask oui). */}
				<div
					style={{
						width: size,
						height: size,
						background: color,
						WebkitMask: 'url(/feather-pen.svg) center/contain no-repeat',
						mask: 'url(/feather-pen.svg) center/contain no-repeat',
					}}
				/>
			</div>

			{/* Ombre au sol — se contracte quand la plume monte. */}
			<div
				style={{
					marginTop: 8,
					width: size * 0.7,
					height: 4,
					borderRadius: '50%',
					background: color,
					filter: 'blur(2px)',
					animation: 'mockiosa-feather-shadow 1.8s ease-in-out infinite',
				}}
			/>
		</div>
	)
}
