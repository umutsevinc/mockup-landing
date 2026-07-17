'use client'

import { useEffect, useState } from 'react'
import HomePage from '../page'

// Gate d'accès à la preview de la landing (lock pré-lancement).
// Volontairement côté client : le but est d'écarter les curieux tombés
// sur l'URL, pas de protéger un secret. Le code est mémorisé en
// localStorage pour ne pas le retaper.
const PREVIEW_CODE = 'MOCKUP3D'
const LS_KEY = 'fm3d-preview-ok'

export default function PreviewGate() {
	const [unlocked, setUnlocked] = useState(false)
	const [ready, setReady] = useState(false)
	const [code, setCode] = useState('')
	const [shake, setShake] = useState(false)

	useEffect(() => {
		try {
			if (window.localStorage.getItem(LS_KEY) === '1') setUnlocked(true)
		} catch {}
		setReady(true)
	}, [])

	if (!ready) return <div className="min-h-screen bg-black" />
	if (unlocked) return <HomePage />

	const submit = (e: React.FormEvent) => {
		e.preventDefault()
		if (code.trim().toUpperCase() === PREVIEW_CODE) {
			try {
				window.localStorage.setItem(LS_KEY, '1')
			} catch {}
			setUnlocked(true)
		} else {
			setShake(true)
			setTimeout(() => setShake(false), 500)
		}
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
				style={shake ? { animation: 'pgShake 0.4s ease' } : undefined}
			>
				<input
					type="password"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="Access code"
					autoFocus
					className="bg-white/[0.06] border border-white/15 rounded-full px-6 py-3.5 text-base outline-none focus:border-white/40 w-[220px] text-center tracking-widest placeholder:tracking-normal"
				/>
				<button
					type="submit"
					className="bg-white text-black font-semibold rounded-full px-6 py-3.5 text-sm hover:scale-[1.03] transition-transform"
				>
					Enter
				</button>
			</form>
			<p className="text-white/30 text-xs">Private preview — launching soon.</p>
		</div>
	)
}
