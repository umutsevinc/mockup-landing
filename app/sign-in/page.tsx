'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthInput, AuthButton, AuthError } from '@/app/components/AuthCard'

export default function SignInPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		if (!email.includes('@')) {
			setError('Please enter a valid email.')
			return
		}
		if (password.length < 6) {
			setError('Password is too short.')
			return
		}
		setLoading(true)
		const { error: err } = await supabase.auth.signInWithPassword({ email, password })
		setLoading(false)
		if (err) {
			setError(err.message)
			return
		}
		router.push('/')
		router.refresh()
	}

	return (
		<AuthCard
			title="Sign in"
			subtitle="Welcome back. Enter your details to continue."
			footer={
				<>
					<Link href="/sign-up" style={{ fontSize: 13, color: '#e8702a', textDecoration: 'none' }}>
						No account? Create one
					</Link>
					<br />
					<Link
						href="/reset-password"
						style={{ fontSize: 12, color: '#48484A', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}
					>
						Forgot password?
					</Link>
				</>
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
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
					disabled={loading}
				/>
				<AuthError>{error}</AuthError>
				<AuthButton type="submit" disabled={loading}>
					{loading ? 'Signing in…' : 'Sign in'}
				</AuthButton>
			</form>
		</AuthCard>
	)
}
