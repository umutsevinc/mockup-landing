'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {X} from 'lucide-react'

// Bannière de lancement Product Hunt (embed launch day). Carte fixe en
// bas à droite, dismissible (mémorisé par appareil), CTA vers la page
// PH. Affichée sur la waitlist et la landing (preview). À retirer une
// fois le lancement passé.
const PH_URL = 'https://www.producthunt.com/products/mockiosa?launch=mockiosa'
const LS_KEY = 'mockiosa-ph-launch-dismissed'

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
					initial={{opacity: 0, y: 24, scale: 0.98}}
					animate={{opacity: 1, y: 0, scale: 1}}
					exit={{opacity: 0, y: 24, scale: 0.98}}
					transition={{type: 'spring', stiffness: 320, damping: 30}}
					className="fixed z-[120] bottom-4 inset-x-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[360px] rounded-2xl border border-[#e8702a]/40 bg-[#141414]/95 backdrop-blur-md shadow-2xl p-5"
					role="complementary"
					aria-label="Mockiosa is live on Product Hunt"
				>
					<button
						type="button"
						onClick={dismiss}
						aria-label="Dismiss"
						className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
					>
						<X size={16} />
					</button>
					<div className="flex items-center gap-2 text-[#e8702a] text-[11px] font-semibold tracking-[0.14em] uppercase mb-2.5">
						<span className="w-6 h-px bg-[#e8702a]" />
						Live now 🚀
					</div>
					<p className="text-white text-[15px] font-semibold leading-snug mb-1.5">
						We&apos;re live on Product Hunt today
					</p>
					<p className="text-white/65 text-[13px] leading-relaxed mb-4 pr-2">
						Mockiosa: real-time 3D device mockups, right inside Framer. An upvote or a comment would
						mean the world to us right now 🙌
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
						className="cta-skeu flex items-center justify-center gap-2 w-full text-white text-sm font-medium px-5 py-3 rounded-full transition-all hover:scale-[1.02]"
					>
						Support us on Product Hunt →
					</a>
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
