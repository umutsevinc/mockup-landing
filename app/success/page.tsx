'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'
import {AuthCard} from '@/app/components/AuthCard'

/**
 * Success page — landing après sign-up ET sign-in.
 * Remplace le redirect direct vers `/` (qui pointe pré-launch vers
 * `/waitlist`) : au lieu de balancer les nouveaux users sur la
 * waitlist, on leur dit "va dans Framer" avec un CTA clair.
 *
 * URLs qui arrivent ici :
 *  - `/success` : après sign-in réussi
 *  - `/success?confirmed=1` : après clic sur le lien de confirmation
 *    email (Supabase redirect_to, whitelisté dans URL Configuration)
 *
 * Auth guard : si l'user n'a pas de session (ex. lien de confirmation
 * expiré), on redirige vers `/sign-in` pour éviter d'afficher un
 * message de succès à quelqu'un qui n'est pas connecté.
 */

export default function SuccessPage() {
	const [checked, setChecked] = useState(false)
	const [authed, setAuthed] = useState(false)

	useEffect(() => {
		let mounted = true
		supabase.auth.getSession().then(({data}) => {
			if (!mounted) return
			setAuthed(Boolean(data.session))
			setChecked(true)
		})
		return () => {
			mounted = false
		}
	}, [])

	// Pas connecté (session expirée par ex) → rebascule sur sign-in.
	useEffect(() => {
		if (checked && !authed && typeof window !== 'undefined') {
			window.location.href = '/sign-in'
		}
	}, [checked, authed])

	if (!checked) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<AuthCard
			title="You're all set."
			subtitle="Your Mockiosa account is ready. Head back to Framer, open the plugin and sign in with the same email — your session will follow you there."
		>
			<div className="flex flex-col gap-3">
				<a
					href="https://framer.com/projects/"
					target="_blank"
					rel="noopener noreferrer"
					className="cta-skeu text-white text-sm font-semibold px-6 py-3 rounded-full text-center transition-all hover:scale-[1.02]"
				>
					Open Mockiosa in Framer →
				</a>
				<Link
					href="/#pricing"
					className="text-white/60 hover:text-white text-sm font-medium text-center py-2 underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
				>
					See pricing plans
				</Link>
			</div>

			{/* Tips en dessous — anti-friction pour les premiers users */}
			<div className="mt-8 pt-6 border-t border-white/[0.08]">
				<p className="text-[11px] uppercase tracking-[0.14em] text-white/35 mb-3">
					Getting started
				</p>
				<ul className="text-[13px] text-white/60 leading-relaxed space-y-2">
					<li>1. Open any Framer project</li>
					<li>2. Insert → Plugins → search "Mockiosa"</li>
					<li>3. Sign in with the same email you just used</li>
				</ul>
			</div>
		</AuthCard>
	)
}
