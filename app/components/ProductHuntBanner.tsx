'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {X} from 'lucide-react'

// Bannière de lancement Product Hunt (launch day) : barre pleine largeur
// en bas, aux couleurs PH. Le badge officiel est monté dans la nav
// (PhNavBadge) — ici on garde juste la CTA texte + close, mais TOUT le
// contenu est cliquable (demande 22/07).
const PH_URL = 'https://www.producthunt.com/products/mockiosa?launch=mockiosa'
const LS_KEY = 'mockiosa-ph-launch-dismissed-v2'

export default function ProductHuntBanner() {
	const [show, setShow] = useState(false)

	useEffect(() => {
		try {
			if (window.localStorage.getItem(LS_KEY) !== '1') setShow(true)
		} catch {
			setShow(true)
		}
	}, [])

	const dismiss = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		e?.preventDefault()
		setShow(false)
		try {
			window.localStorage.setItem(LS_KEY, '1')
		} catch {}
	}

	const track = () => {
		try {
			;(window as any).gtag?.('event', 'ph_launch_click')
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
					{/* La bannière ENTIÈRE est un lien : un clic n'importe où
					    ouvre PH (sauf le bouton close). */}
					<a
						href={PH_URL}
						target="_blank"
						rel="noopener noreferrer"
						onClick={track}
						className="block"
					>
						<div className="relative max-w-[1560px] mx-auto flex items-center justify-center gap-3 sm:gap-6 px-5 sm:px-16 py-3.5 pr-12 hover:brightness-105 transition">
							<p className="text-center sm:text-left text-[15px] sm:text-base font-semibold leading-snug">
								We&apos;re live on Product Hunt today 🚀{' '}
								<span className="font-normal text-white/90">
									— an upvote or a comment would mean the world to us 🙌
								</span>
							</p>
						</div>
					</a>
					<button
						type="button"
						onClick={dismiss}
						aria-label="Dismiss"
						className="absolute top-1/2 -translate-y-1/2 right-3 text-white/70 hover:text-white transition-colors"
					>
						<X size={18} />
					</button>
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
