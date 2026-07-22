'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {X} from 'lucide-react'

// Bannière de lancement Product Hunt (launch day) : barre pleine largeur
// en bas, aux couleurs PH, avec un gros badge « Featured on Product Hunt »
// bien visible. Affichée sur la waitlist et la landing (preview).
// À retirer une fois le lancement passé.
const PH_URL = 'https://www.producthunt.com/products/mockiosa?launch=mockiosa'
const LS_KEY = 'mockiosa-ph-launch-dismissed-v2'

// ── Badge officiel avec compteur d'upvotes LIVE ──────────────────────
// Renseigne le post_id numérique de ton lancement (copie-le depuis le
// snippet d'embed « Featured on Product Hunt » sur ta page PH) pour
// afficher le badge officiel avec le compteur en direct. Tant que c'est
// null, on affiche une réplique CSS du badge (sans compteur).
const PH_POST_ID: string | null = null

function PhBadge() {
	if (PH_POST_ID) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${PH_POST_ID}&theme=light`}
				alt="Mockiosa — real-time 3D device mockups in Framer | Product Hunt"
				width={250}
				height={54}
				className="h-[54px] w-[250px]"
			/>
		)
	}
	// Réplique du badge officiel (recognizable) — pas de faux compteur.
	return (
		<span className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2 shadow-sm">
			<span className="w-8 h-8 rounded-full bg-[#ff6154] text-white flex items-center justify-center font-black text-lg leading-none">
				P
			</span>
			<span className="flex flex-col leading-tight text-left">
				<span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/45">
					Featured on
				</span>
				<span className="text-[15px] font-bold text-[#21201f] leading-none">Product Hunt</span>
			</span>
			<span className="ml-1 flex flex-col items-center text-[#21201f] leading-none">
				<span className="text-[11px]">▲</span>
				<span className="text-[13px] font-bold">Vote</span>
			</span>
		</span>
	)
}

export default function ProductHuntBanner() {
	const [show, setShow] = useState(false)

	useEffect(() => {
		try {
			if (window.localStorage.getItem(LS_KEY) !== '1') setShow(true)
		} catch {
			setShow(true)
		}
	}, [])

	const dismiss = () => {
		setShow(false)
		try {
			window.localStorage.setItem(LS_KEY, '1')
		} catch {}
	}

	return (
		<AnimatePresence>
			{show && (
				<motion.aside
					initial={{opacity: 0, y: 60}}
					animate={{opacity: 1, y: 0}}
					exit={{opacity: 0, y: 60}}
					transition={{type: 'spring', stiffness: 260, damping: 28}}
					className="fixed z-[120] bottom-0 inset-x-0 bg-[#ff6154] text-white shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
					role="complementary"
					aria-label="Mockiosa is live on Product Hunt"
				>
					<div className="relative max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-5 sm:px-16 py-3.5 pr-12">
						<p className="text-center sm:text-left text-[15px] sm:text-base font-semibold leading-snug">
							We&apos;re live on Product Hunt today 🚀{' '}
							<span className="font-normal text-white/90">
								— an upvote or a comment would mean the world to us 🙌
							</span>
						</p>
						<a
							href={PH_URL}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => {
								try {
									;(window as any).gtag?.('event', 'ph_launch_click')
								} catch {}
							}}
							className="shrink-0 transition-transform hover:scale-[1.04]"
							aria-label="Support Mockiosa on Product Hunt"
						>
							<PhBadge />
						</a>
						<button
							type="button"
							onClick={dismiss}
							aria-label="Dismiss"
							className="absolute top-2.5 right-3 sm:top-1/2 sm:-translate-y-1/2 text-white/70 hover:text-white transition-colors"
						>
							<X size={18} />
						</button>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
