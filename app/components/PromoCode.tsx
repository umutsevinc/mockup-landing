'use client'

import {useState} from 'react'
import {Check, Copy} from 'lucide-react'

// Code promo cliquable : copie dans le presse-papier + 🎉 confetti au clic.
// Réutilisé dans la bannière offre de lancement (LandingSections).
export default function PromoCode({code}: {code: string}) {
	const [copied, setCopied] = useState(false)

	const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 1800)
		} catch {}
		// 🎉 Confetti aux couleurs de la marque, tiré depuis le bouton.
		try {
			const confetti = (await import('canvas-confetti')).default
			confetti({
				particleCount: 90,
				spread: 72,
				startVelocity: 38,
				ticks: 200,
				origin: {
					x: (rect.left + rect.width / 2) / window.innerWidth,
					y: (rect.top + rect.height / 2) / window.innerHeight,
				},
				colors: ['#e8702a', '#f8965a', '#ffffff', '#cd5814'],
				zIndex: 9999,
			})
		} catch {}
	}

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={`Copy code ${code}`}
			title="Click to copy"
			className="group inline-flex items-center gap-1.5 rounded border border-[#e8702a]/30 bg-[#e8702a]/15 px-2 py-0.5 font-mono font-semibold text-[#e8702a] transition-colors hover:bg-[#e8702a]/25 cursor-pointer"
		>
			{code}
			{copied ? (
				<Check size={12} className="text-[#e8702a]" />
			) : (
				<Copy size={12} className="opacity-60 transition-opacity group-hover:opacity-100" />
			)}
		</button>
	)
}
