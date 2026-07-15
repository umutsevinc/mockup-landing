'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthInput, AuthButton, AuthError } from '@/app/components/AuthCard'

/**
 * Dual-mode page:
 *   1. No recovery session → ask for email, send recovery link.
 *   2. Recovery session present (Supabase set it via detectSessionInUrl
 *      when the user clicks the email link) → ask for new password.
 *
 * Wrapped in Suspense because useSearchParams forces dynamic rendering
 * in Next 16 — without the boundary, the build fails to prerender.
 */
export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<AuthCard title="Loading…">{null}</AuthCard>}>
			<ResetPasswordInner />
		</Suspense>
	)
}

function ResetPasswordInner() {
	const router = useRouter()
	const params = useSearchParams()
	const [mode, setMode] = useState<'request' | 'reset'>('request')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [sent, setSent] = useState(false)
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		// Two possible signals that we're in "reset" mode:
		//   - hash like #type=recovery (older Supabase)
		//   - query like ?type=recovery (newer)
		//   - an existing PASSWORD_RECOVERY auth event was emitted
		const hash = typeof window !== 'undefined' ? window.location.hash : ''
		if (hash.includes('type=recovery') || params.get('type') === 'recovery') {
			setMode('reset')
		}
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === 'PASSWORD_RECOVERY') setMode('reset')
		})
		return () => sub.subscription.unsubscribe()
	}, [params])

	async function sendLink(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		if (!email.includes('@')) {
			setError('Please enter a valid email.')
			return
		}
		setLoading(true)
		const redirectTo =
			typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
		const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
		setLoading(false)
		if (err) {
			setError(err.message)
			return
		}
		setSent(true)
	}

	async function applyPassword(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		if (password.length < 8) {
			setError('Password must be at least 8 characters.')
			return
		}
		if (password !== confirm) {
			setError('Passwords do not match.')
			return
		}
		setLoading(true)
		const { error: err } = await supabase.auth.updateUser({ password })
		setLoading(false)
		if (err) {
			setError(err.message)
			return
		}
		setDone(true)
		setTimeout(() => router.push('/sign-in?reset=1'), 1500)
	}

	if (mode === 'reset') {
		if (done) {
			return (
				<AuthCard title="Password updated" subtitle="Redirecting you to sign in…">
					<div style={{ fontSize: 13, color: '#8E8E93' }}>You can now sign in with your new password.</div>
				</AuthCard>
			)
		}
		return (
			<AuthCard title="Set a new password" subtitle="Enter your new password below.">
				<form onSubmit={applyPassword} noValidate>
					<AuthInput
						label="New password"
						type="password"
						autoComplete="new-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="At least 8 characters"
						required
						disabled={loading}
					/>
					<AuthInput
						label="Confirm password"
						type="password"
						autoComplete="new-password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder="••••••••"
						required
						disabled={loading}
					/>
					<AuthError>{error}</AuthError>
					<AuthButton type="submit" disabled={loading}>
						{loading ? 'Updating…' : 'Update password'}
					</AuthButton>
				</form>
			</AuthCard>
		)
	}

	if (sent) {
		return (
			<AuthCard
				title="Check your email"
				subtitle={`We sent a reset link to ${email}. Click it to choose a new password.`}
				footer={
					<Link href="/sign-in" style={{ fontSize: 13, color: '#e8702a', textDecoration: 'none' }}>
						Back to sign in
					</Link>
				}
			>
				<div style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6 }}>
					Didn&apos;t get the email? Check spam, or try again in a minute.
				</div>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			title="Reset password"
			subtitle="Enter your email and we'll send you a reset link."
			footer={
				<Link href="/sign-in" style={{ fontSize: 13, color: '#e8702a', textDecoration: 'none' }}>
					Back to sign in
				</Link>
			}
		>
			<form onSubmit={sendLink} noValidate>
				<AuthInput
					label="Email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					required
					disabled={loading}
				/>
				<AuthError>{error}</AuthError>
				<AuthButton type="submit" disabled={loading}>
					{loading ? 'Sending…' : 'Send reset link'}
				</AuthButton>
			</form>
		</AuthCard>
	)
}
