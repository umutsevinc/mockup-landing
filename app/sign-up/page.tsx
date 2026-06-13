'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthInput, AuthButton, AuthError } from '@/app/components/AuthCard'

export default function SignUpPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [sent, setSent] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		if (!email.includes('@')) {
			setError('Please enter a valid email.')
			return
		}
		if (password.length < 8) {
			setError('Password must be at least 8 characters.')
			return
		}
		if (password !== confirm) {
			setError('Passwords do not match.')
			return
		}
		setLoading(true)
		const { error: err } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/sign-in?confirmed=1` : undefined,
			},
		})
		setLoading(false)
		if (err) {
			setError(err.message)
			return
		}
		setSent(true)
	}

	if (sent) {
		return (
			<AuthCard
				title="Check your email"
				subtitle={`We sent a confirmation link to ${email}. Click it to activate your account.`}
				footer={
					<Link href="/sign-in" style={{ fontSize: 13, color: '#7F77DD', textDecoration: 'none' }}>
						Back to sign in
					</Link>
				}
			>
				<div style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6 }}>
					Didn&apos;t get the email? Check spam, or try a different address.
				</div>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			title="Create your account"
			subtitle="Get started with 2 free credits / month."
			footer={
				<Link href="/sign-in" style={{ fontSize: 13, color: '#7F77DD', textDecoration: 'none' }}>
					Already have an account? Sign in
				</Link>
			}
		>
			<form onSubmit={onSubmit} noValidate>
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
				<AuthInput
					label="Password"
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
					{loading ? 'Creating…' : 'Create account'}
				</AuthButton>
				<p
					style={{
						fontSize: 11,
						color: '#48484A',
						marginTop: 14,
						textAlign: 'center',
						lineHeight: 1.5,
					}}
				>
					By creating an account you agree to our{' '}
					<Link href="/terms" style={{ color: '#7F77DD' }}>
						Terms
					</Link>{' '}
					and{' '}
					<Link href="/privacy" style={{ color: '#7F77DD' }}>
						Privacy Policy
					</Link>
					.
				</p>
			</form>
		</AuthCard>
	)
}
