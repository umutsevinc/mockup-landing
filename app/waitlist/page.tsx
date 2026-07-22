'use client'

import {useState} from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {ArrowRight, Check} from 'lucide-react'
import {supabase} from '@/lib/supabase'
import ProductHuntBanner from '../components/ProductHuntBanner'

const HeroPlayground = dynamic(() => import('../components/HeroPlayground'), {
	ssr: false,
	loading: () => <div className="w-full h-full" aria-hidden="true" />,
})

/**
 * Waiting list — hero seule + capture email géante. Partageable
 * directement (réponses Twitter, DM) : mockiosa.memselon.com/waitlist
 */
export default function WaitlistPage() {
	const [email, setEmail] = useState('')
	const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

	const join = async (e: React.FormEvent) => {
		e.preventDefault()
		const value = email.trim().toLowerCase()
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
			setState('error')
			return
		}
		setState('sending')
		const {error} = await supabase.from('waitlist').insert({email: value, source: 'waitlist-page'})
		// 23505 = doublon : l'email est déjà inscrit, c'est un succès UX.
		if (error && !`${error.code}`.includes('23505')) {
			setState('error')
			return
		}
		setState('done')
		// Événement GA4 : conversion waitlist.
		try {
			;(window as any).gtag?.('event', 'waitlist_join', {source: 'waitlist-page'})
		} catch {}
		// 🎉 Confettis — double canon latéral + burst central.
		try {
			const confetti = (await import('canvas-confetti')).default
			const opts = {particleCount: 90, spread: 70, ticks: 220, zIndex: 999}
			confetti({...opts, origin: {x: 0.2, y: 0.75}, angle: 60})
			confetti({...opts, origin: {x: 0.8, y: 0.75}, angle: 120})
			setTimeout(() => confetti({particleCount: 140, spread: 100, origin: {x: 0.5, y: 0.6}, zIndex: 999}), 250)
		} catch {}
	}

	return (
		<div className="min-h-screen bg-black text-white tracking-[-0.02em]">
			{/* Nav minimale */}
			<nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 max-sm:bg-gradient-to-b max-sm:from-black max-sm:via-black/80 max-sm:to-transparent max-sm:pb-24 pointer-events-none [&>*]:pointer-events-auto">
				<Link href="/" className="flex items-center gap-2">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
					</svg>
					<span className="text-white text-2xl font-playfair italic">Mockiosa</span>
				</Link>
			</nav>

			<section className="relative w-full overflow-hidden" style={{minHeight: '100dvh'}} aria-label="Join the waiting list">
				<div className="relative z-10 max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 lg:gap-0 items-center px-6 md:px-16 pt-28 lg:pt-20 pb-8 min-h-[100dvh]">
					{/* Gauche : pitch + GROS input email */}
					<div className="flex flex-col items-start gap-7 max-w-xl">
						<h1 className="leading-[0.98]">
							<span className="block font-semibold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.045em]">
								Real 3D mockups,
							</span>
							<span className="block font-semibold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.045em] text-white/60">
								live in Framer.
							</span>
						</h1>
						<p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-md">
							Drop a screenshot or a video on a real 3D Apple device, orbit it, recolor it, and
							publish it live on your Framer site. Launching soon — be first in.
						</p>

						{state === 'done' ? (
							<div className="flex items-center gap-3 bg-[#1c1c1e] border border-white/[0.1] rounded-2xl px-6 py-5 text-lg">
								<span className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center">
									<Check size={18} strokeWidth={3} />
								</span>
								You&apos;re on the list — we&apos;ll email you at launch.
							</div>
						) : (
							<form onSubmit={join} className="w-full max-w-lg">
								<div className="flex items-stretch gap-2 bg-[#1c1c1e] border border-white/[0.12] rounded-2xl p-2 focus-within:border-[#e8702a] transition-colors">
									<input
										type="email"
										required
										value={email}
										onChange={(e) => {
											setEmail(e.target.value)
											if (state === 'error') setState('idle')
										}}
										placeholder="you@studio.com"
										aria-label="Email address"
										className="flex-1 min-w-0 bg-transparent outline-none text-xl sm:text-2xl px-4 py-4 placeholder:text-white/30"
									/>
									<button
										type="submit"
										disabled={state === 'sending'}
										className="cta-skeu text-white text-base sm:text-lg font-semibold px-6 sm:px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
									>
										{state === 'sending' ? 'Joining…' : 'Notify me'}
										<ArrowRight size={18} />
									</button>
								</div>
								{state === 'error' && (
									<p className="mt-3 text-sm text-[#ff6b6b]">
										That email doesn&apos;t look right — try again.
									</p>
								)}
								<p className="mt-3 text-xs text-white/40">
									No spam. One email when it ships, maybe one before.
								</p>
							</form>
						)}
					</div>

					{/* Droite : le playground 3D (la démo vaut mille mots) */}
					<div className="relative h-[52vh] sm:h-[60vh] lg:h-[78vh]">
						<HeroPlayground />
					</div>
				</div>
			</section>

			{/* Lancement Product Hunt — carte dismissible en bas à droite */}
			<ProductHuntBanner />
		</div>
	)
}
