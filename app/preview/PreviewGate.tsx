'use client'

import {useState} from 'react'

// Formulaire d'accès à la preview. La validation est SERVEUR
// (POST /preview/login compare à PREVIEW_PASSWORD) : le mot de passe
// n'existe nulle part dans ce bundle. En cas de succès, un cookie
// httpOnly est posé et on recharge — le serveur rend alors la landing.
export default function PreviewGate() {
	const [code, setCode] = useState('')
	const [shake, setShake] = useState(false)
	const [busy, setBusy] = useState(false)

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (busy) return
		setBusy(true)
		try {
			const res = await fetch('/preview/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({password: code}),
			})
			if (res.ok) {
				// Cookie posé → le serveur rendra HomePage au reload.
				window.location.reload()
				return
			}
		} catch {}
		setBusy(false)
		setCode('')
		setShake(true)
		setTimeout(() => setShake(false), 500)
	}

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6">
			<style
				dangerouslySetInnerHTML={{
					__html: `@keyframes pgShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`,
				}}
			/>
			<div className="flex items-center gap-3">
				<svg width="30" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" />
				</svg>
				<span className="text-2xl font-playfair">Mockiosa</span>
			</div>
			<form
				onSubmit={submit}
				className="flex items-center gap-3"
				style={shake ? {animation: 'pgShake 0.4s ease'} : undefined}
			>
				<input
					type="password"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="Access code"
					autoFocus
					disabled={busy}
					className="bg-white/[0.06] border border-white/15 rounded-full px-6 py-3.5 text-base outline-none focus:border-white/40 w-[220px] text-center tracking-widest placeholder:tracking-normal disabled:opacity-50"
				/>
				<button
					type="submit"
					disabled={busy}
					className="bg-white text-black font-semibold rounded-full px-6 py-3.5 text-sm hover:scale-[1.03] transition-transform disabled:opacity-60"
				>
					{busy ? '…' : 'Enter'}
				</button>
			</form>
			<p className="text-white/30 text-xs">Private preview — launching soon.</p>
		</div>
	)
}
