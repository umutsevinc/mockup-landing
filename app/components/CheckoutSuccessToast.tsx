'use client'

import {useEffect, useState} from 'react'

/**
 * Checkout success toast — écoute `?checkout=success&plan=xxx` dans
 * l'URL (retour Stripe → landing). Affiche une confettis-style
 * notification en bas au centre pendant 5s puis auto-dismiss, et
 * nettoie l'URL (history.replaceState) pour éviter que le toast
 * réapparaisse au reload.
 *
 * Ce composant vit côté landing en filet de sécurité : si un lien
 * Stripe pointe vers `/` au lieu de `/success`, l'utilisateur voit
 * quand même la confirmation. Pas d'appel réseau, pas de dépendance.
 */

const PLAN_LABEL: Record<string, string> = {
	ground: 'Ground',
	float: 'Float',
	orbit: 'Orbit',
}

export default function CheckoutSuccessToast() {
	const [plan, setPlan] = useState<string | null>(null)

	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search)
			if (params.get('checkout') !== 'success') return
			const rawPlan = (params.get('plan') || '').toLowerCase()
			const label = PLAN_LABEL[rawPlan] || 'your plan'
			setPlan(label)
			// Nettoie l'URL (garde le pathname + hash), sans reload.
			params.delete('checkout')
			params.delete('plan')
			const qs = params.toString()
			const clean =
				window.location.pathname + (qs ? `?${qs}` : '') + (window.location.hash || '')
			window.history.replaceState({}, '', clean)
			const t = setTimeout(() => setPlan(null), 5000)
			return () => clearTimeout(t)
		} catch {
			/* SSR safety net — toast est un no-op côté serveur */
		}
	}, [])

	if (!plan) return null
	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed left-1/2 bottom-8 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-full bg-black/90 border border-[#e8702a]/50 backdrop-blur shadow-xl text-white text-sm font-medium"
		>
			<span aria-hidden="true">🎉</span>
			<span>
				You&apos;re on <strong className="text-[#e8702a]">{plan}</strong>! Head to Framer to start creating.
			</span>
		</div>
	)
}
