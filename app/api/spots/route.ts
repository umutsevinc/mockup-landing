// Compteur live des places de l'offre de lancement — lit directement le
// code promo Stripe (times_redeemed / max_redemptions) et renvoie le
// nombre de places restantes. Mis en cache 60 s pour ne pas marteler
// Stripe. Nécessite STRIPE_SECRET_KEY côté serveur ; sans clé, on
// dégrade proprement sur le total (aucune place consommée affichée).

const PROMO_ID = process.env.STRIPE_PROMO_ID || 'promo_1TxkDh083OcIodiDohbt3bII'
const FALLBACK_TOTAL = 50

export async function GET() {
	const key = process.env.STRIPE_SECRET_KEY
	// CORS ouvert : le plugin Framer (autre origine : framer.com / localhost)
	// consomme ce même compteur pour afficher l'offre de lancement dans le
	// profil. Endpoint public en lecture seule (aucune donnée sensible).
	const headers = {
		'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
		'Access-Control-Allow-Origin': '*',
	}

	if (!key) {
		return Response.json({remaining: FALLBACK_TOTAL, total: FALLBACK_TOTAL, live: false}, {headers})
	}
	try {
		const res = await fetch(`https://api.stripe.com/v1/promotion_codes/${PROMO_ID}`, {
			headers: {Authorization: `Bearer ${key}`},
			// Cache la réponse Stripe 60 s côté serveur Next.
			next: {revalidate: 60},
		})
		if (!res.ok) throw new Error(`stripe ${res.status}`)
		const d = await res.json()
		const total = typeof d.max_redemptions === 'number' ? d.max_redemptions : FALLBACK_TOTAL
		const used = typeof d.times_redeemed === 'number' ? d.times_redeemed : 0
		const remaining = Math.max(0, total - used)
		return Response.json({remaining, total, live: true}, {headers})
	} catch {
		return Response.json({remaining: FALLBACK_TOTAL, total: FALLBACK_TOTAL, live: false}, {headers})
	}
}
