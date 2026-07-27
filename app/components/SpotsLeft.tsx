'use client'

import {useEffect, useState} from 'react'

// Compteur live des places de l'offre de lancement. Fetch /api/spots
// (qui lit le code promo Stripe) et affiche les places restantes.
// `pill` = badge autonome (hero) · `text` = juste « X of 50 spots left ».
export default function SpotsLeft({variant = 'pill'}: {variant?: 'pill' | 'text'}) {
	// Défaut 50/50 (SSR = client, pas de mismatch) → l'offre est TOUJOURS
	// visible ; le fetch met à jour le vrai nombre restant ensuite.
	const [remaining, setRemaining] = useState(50)
	const [total, setTotal] = useState(50)

	useEffect(() => {
		let on = true
		fetch('/api/spots')
			.then((r) => r.json())
			.then((d) => {
				if (!on) return
				if (typeof d.remaining === 'number') setRemaining(d.remaining)
				if (typeof d.total === 'number') setTotal(d.total)
			})
			.catch(() => {})
		return () => {
			on = false
		}
	}, [])

	if (variant === 'text') {
		return (
			<>
				{remaining} of {total} spots left
			</>
		)
	}

	return (
		<a
			href="#pricing"
			className="inline-flex items-center gap-2 rounded-full border border-[#e8702a]/45 bg-[#e8702a]/10 px-4 py-2 text-sm font-medium text-white hover:bg-[#e8702a]/[0.16] transition-colors"
		>
			<span className="w-2 h-2 rounded-full bg-[#e8702a] animate-pulse" />
			<span className="font-semibold">Launch: 30% off your first 3 months</span>
			<span className="text-white/55">· {remaining} of {total} spots left</span>
		</a>
	)
}
