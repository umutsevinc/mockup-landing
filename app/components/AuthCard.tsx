'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Auth layout « SaaS login » : formulaire à gauche, démo vidéo du
 * plugin à droite (cachée < lg). Header/footer minimaux intégrés,
 * styles alignés sur le site (noir, inputs white/6, CTA blanc,
 * accent orange). Même API AuthCard/AuthInput/AuthButton/AuthError
 * qu'avant — les pages sign-in / sign-up / reset ne changent pas.
 */

export function AuthCard({
	title,
	subtitle,
	children,
	footer,
}: {
	title: string
	subtitle?: string
	children: ReactNode
	footer?: ReactNode
}) {
	return (
		<div className="min-h-screen bg-black text-white flex flex-col tracking-[-0.02em]">
			{/* ── header ── (fix 26/07 : back button déplacé sous le form
			    pour laisser le logo respirer et se rapprocher des CTA) */}
			<nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-5">
				<Link href="/" className="flex items-center gap-2.5">
					{/* eslint-disable-next-line @next/next/no-img-element */}
		<img src="/feather-pen-white.svg?v=7" alt="Mockiosa" width="22" height="24" aria-hidden="true" />
					{/* Logo — TOUJOURS font-playfair (poids 650), jamais une autre graisse. */}
					<span className="text-lg font-playfair">Mockiosa</span>
				</Link>
			</nav>

			{/* ── split : form / vidéo ── */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
				{/* form */}
				<div className="flex flex-col justify-center px-6 sm:px-12 pt-24 pb-10">
					<div className="w-full max-w-[400px] mx-auto">
						<Link
							href="/"
							className="inline-flex items-center text-xs text-white/40 hover:text-white/70 transition-colors mb-6"
						>
							← Back to site
						</Link>
						<h1 className="text-[28px] sm:text-[32px] font-normal tracking-[-0.02em] leading-[1.1] mb-2">{title}</h1>
						{subtitle ? (
							<p className="text-[15px] text-white/50 mb-8 leading-relaxed">{subtitle}</p>
						) : (
							<div className="mb-8" />
						)}
						{children}
						{footer ? <div className="mt-6 text-center">{footer}</div> : null}
					</div>

					{/* footer */}
					<div className="w-full max-w-[400px] mx-auto mt-14 flex items-center gap-4 text-xs text-white/30">
						<span>© 2026 Memselon</span>
						<span className="flex-1" />
						<Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
						<Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
					</div>
				</div>

				{/* vidéo démo du plugin */}
				<div className="hidden lg:block p-4 pl-0">
					<div className="relative h-full min-h-[calc(100vh-2rem)] rounded-3xl overflow-hidden border border-white/[0.08]">
						<video
							src="/auth-demo.mp4"
							poster="/auth-demo-poster.jpg"
							autoPlay
							muted
							loop
							playsInline
							className="absolute inset-0 w-full h-full object-cover"
						/>
						<div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
							<p className="text-lg font-semibold">Real 3D. Real-time. In Framer.</p>
							<p className="text-sm text-white/60 mt-1">
								Drop a screenshot, tune the studio, ship a live 3D device on your site.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
	const { label, type, ...inputProps } = props
	// Password reveal (fix 26/07) : quand type="password", on affiche un
	// petit bouton eye / eye-off à droite pour toggle password ↔ text.
	// Comportement standard, aucun impact sur les autres types.
	const isPassword = type === 'password'
	const [revealed, setRevealed] = useState(false)
	const effectiveType = isPassword ? (revealed ? 'text' : 'password') : type
	return (
		<div className="mb-4">
			{label ? (
				<label className="block text-[13px] font-medium text-white/55 mb-2">{label}</label>
			) : null}
			<div className="relative">
				<input
					{...inputProps}
					type={effectiveType}
					className={`w-full px-4 ${isPassword ? 'pr-11' : ''} py-3.5 rounded-[14px] bg-white/[0.06] border border-white/15 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-white/40 transition-colors`}
					style={inputProps.style}
				/>
				{isPassword ? (
					<button
						type="button"
						onClick={() => setRevealed((v) => !v)}
						tabIndex={-1}
						aria-label={revealed ? 'Hide password' : 'Show password'}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1"
					>
						{revealed ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				) : null}
			</div>
		</div>
	)
}

export function AuthButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const disabled = !!props.disabled
	return (
		<button
			{...props}
			className="w-full py-3.5 rounded-[14px] bg-white text-black text-[15px] font-semibold transition-all hover:scale-[1.01] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
			style={props.style}
		/>
	)
}

export function AuthError({ children }: { children: ReactNode }) {
	if (!children) return null
	return (
		<div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
			{children}
		</div>
	)
}

// Bandeau info (accent orange marque) — distinct de l'erreur rouge.
// Utilisé p.ex. sur /sign-in quand on redirige un compte déjà existant.
export function AuthNotice({ children }: { children: ReactNode }) {
	if (!children) return null
	return (
		<div className="mb-4 px-4 py-2.5 rounded-xl bg-[#e8702a]/10 border border-[#e8702a]/25 text-[#f0a06a] text-[13px] leading-relaxed">
			{children}
		</div>
	)
}
