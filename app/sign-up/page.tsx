'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AuthCard, AuthInput, AuthButton, AuthError } from '@/app/components/AuthCard'

export default function SignUpPage() {
	const router = useRouter()
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
		const { data, error: err } = await supabase.auth.signUp({
			email,
			password,
			options: {
				// Après clic sur le lien de confirmation email : la page
				// /success accueille avec « return to Framer » (au lieu
				// d'un sign-in vide qui perdrait l'user).
				emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/success` : undefined,
			},
		})
		setLoading(false)
		if (err) {
			// Erreurs Supabase les plus fréquentes traduites :
			//  - "Password should be at least X characters" → validé côté client
			//  - "Password has been leaked" → Pwned Password Protection activée
			//  - "User already registered" → collision email
			if (/leaked|pwned|compromised/i.test(err.message)) {
				setError('This password appears in known breach lists. Please choose another.')
			} else if (/already registered/i.test(err.message)) {
				setError('An account already exists with this email — try signing in.')
			} else {
				setError(err.message)
			}
			return
		}
		// Comportement Supabase selon la config projet :
		//  - Confirm email ON  → data.session === null → afficher "Check your inbox"
		//  - Confirm email OFF → data.session !== null → user déjà loggué → /success
		if (data.session) {
			router.push('/success')
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
					<Link href="/sign-in" style={{ fontSize: 13, color: '#e8702a', textDecoration: 'none' }}>
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
			subtitle="Plans from $9.99/mo — cancel anytime."
			footer={
				<Link href="/sign-in" style={{ fontSize: 13, color: '#e8702a', textDecoration: 'none' }}>
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
					<Link href="/terms" style={{ color: '#e8702a' }}>
						Terms
					</Link>{' '}
					and{' '}
					<Link href="/privacy" style={{ color: '#e8702a' }}>
						Privacy Policy
					</Link>
					.
				</p>
			</form>
		</AuthCard>
	)
}
