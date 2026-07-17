'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Report a bug — formulaire public du plugin : description + contexte +
 * screenshot (bucket privé bug-screenshots), insert dans bug_reports.
 * Le screenshot est ce qui nous permet de VOIR ce qui se passe chez
 * l'utilisateur — on pousse fort pour l'avoir, sans le rendre requis.
 */
export default function ReportBugPage() {
	const [email, setEmail] = useState('')
	const [description, setDescription] = useState('')
	const [context, setContext] = useState('Plugin panel (in Framer)')
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
	const [errorMsg, setErrorMsg] = useState('')
	const fileRef = useRef<HTMLInputElement>(null)

	const pickFile = (f: File | undefined | null) => {
		if (!f) return
		if (!f.type.startsWith('image/')) return
		if (f.size > 8 * 1024 * 1024) {
			setErrorMsg('Screenshot too large (8 MB max).')
			return
		}
		setErrorMsg('')
		setFile(f)
		setPreview(URL.createObjectURL(f))
	}

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (description.trim().length < 10) {
			setErrorMsg('Please describe the bug in a few words (10 characters minimum).')
			return
		}
		setState('sending')
		setErrorMsg('')
		try {
			let screenshotPath: string | null = null
			if (file) {
				const ext = (file.name.split('.').pop() || 'png').toLowerCase()
				screenshotPath = `reports/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
				const { error: upErr } = await supabase.storage
					.from('bug-screenshots')
					.upload(screenshotPath, file, { contentType: file.type })
				if (upErr) {
					// Le report part quand même, juste sans image.
					console.warn('screenshot upload failed', upErr)
					screenshotPath = null
				}
			}
			const { error } = await supabase.from('bug_reports').insert({
				email: email.trim() || null,
				description: description.trim(),
				context,
				user_agent: navigator.userAgent,
				screenshot_path: screenshotPath,
			})
			if (error) throw error
			setState('done')
		} catch (err) {
			console.error(err)
			setState('error')
			setErrorMsg('Something went wrong — email us at hi@memselon.com and we’ll fix it.')
		}
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] text-white">
			<nav className="flex items-center justify-between px-6 md:px-16 py-5 max-w-[1100px] mx-auto">
				<Link href="/" className="flex items-center gap-2">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
					<span className="font-playfair text-lg">Mockiosa</span>
				</Link>
			</nav>

			<main className="max-w-[560px] mx-auto px-6 pt-16 pb-32">
				{state === 'done' ? (
					<div className="text-center pt-16">
						<div className="text-4xl mb-4">🪶</div>
						<h1 className="text-[28px] font-normal tracking-[-0.01em] m-0 mb-3">Got it — thank you.</h1>
						<p className="text-base text-white/50 leading-relaxed m-0 mb-8">
							Your report {file ? 'and screenshot are' : 'is'} in our queue. If you left an email,
							we’ll reply when it’s fixed — usually fast, check the{' '}
							<Link href="/changelog" className="text-white/80 underline underline-offset-4">changelog</Link>.
						</p>
						<Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">← Back to Mockiosa</Link>
					</div>
				) : (
					<>
						<header className="mb-10">
							<h1 className="text-[34px] sm:text-5xl font-normal tracking-[-0.01em] leading-[1.1] m-0">
								<span className="text-white">Report a bug.</span>
								<br />
								<span className="text-white/45">Screenshot = fixed faster.</span>
							</h1>
							<p className="mt-4 text-base text-white/50 leading-relaxed m-0">
								Tell us what broke in the plugin. A screenshot (or a screen recording frame) lets us
								see exactly what you see — it usually cuts the fix time in half.
							</p>
						</header>

						<form onSubmit={submit} className="flex flex-col gap-5">
							<label className="flex flex-col gap-2">
								<span className="text-[13px] text-white/60">What happened? *</span>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
									minLength={10}
									rows={5}
									placeholder="What did you do, what did you expect, what happened instead…"
									className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#e8702a]/60 resize-y"
								/>
							</label>

							<label className="flex flex-col gap-2">
								<span className="text-[13px] text-white/60">Where did it happen?</span>
								<select
									value={context}
									onChange={(e) => setContext(e.target.value)}
									className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-[#e8702a]/60 appearance-none"
								>
									<option>Plugin panel (in Framer)</option>
									<option>Live 3D embed (published site)</option>
									<option>Export (PNG / video)</option>
									<option>Billing / account</option>
									<option>This website</option>
									<option>Other</option>
								</select>
							</label>

							{/* Screenshot — drop zone + preview */}
							<div
								onDragOver={(e) => e.preventDefault()}
								onDrop={(e) => {
									e.preventDefault()
									pickFile(e.dataTransfer.files?.[0])
								}}
								onClick={() => fileRef.current?.click()}
								className="cursor-pointer rounded-xl border border-dashed border-white/[0.15] hover:border-[#e8702a]/50 bg-white/[0.02] transition-colors p-5 flex items-center gap-4"
							>
								{preview ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={preview} alt="Screenshot preview" className="w-24 h-16 object-cover rounded-lg border border-white/[0.1]" />
								) : (
									<div className="w-24 h-16 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 text-xl">📸</div>
								)}
								<div>
									<div className="text-[14px] text-white/80">{file ? file.name : 'Drop a screenshot — or click to choose'}</div>
									<div className="text-[12px] text-white/35 mt-0.5">PNG, JPG, WebP, GIF · 8 MB max · optional but golden</div>
								</div>
								<input
									ref={fileRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => pickFile(e.target.files?.[0])}
								/>
							</div>

							<label className="flex flex-col gap-2">
								<span className="text-[13px] text-white/60">Email (optional — to hear back when it’s fixed)</span>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@studio.com"
									className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#e8702a]/60"
								/>
							</label>

							{errorMsg ? <p className="text-sm text-[#ff6b6b] m-0">{errorMsg}</p> : null}

							<button
								type="submit"
								disabled={state === 'sending'}
								className="cta-skeu text-white text-sm font-medium px-7 py-3.5 rounded-full transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 self-start"
							>
								{state === 'sending' ? 'Sending…' : 'Send the report'}
							</button>
						</form>
					</>
				)}
			</main>
		</div>
	)
}
