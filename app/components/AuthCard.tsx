'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'

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
		<div
			style={{
				minHeight: '100vh',
				background: 'var(--bg-primary, #050509)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 24,
			}}
		>
			<div
				style={{
					width: '100%',
					maxWidth: 420,
					background: 'var(--bg-card, #0F0F14)',
					border: '1px solid rgba(255,255,255,0.06)',
					borderRadius: 20,
					padding: 32,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
					<Image src="/logo/white.png" alt="Memselon Mockup" width={24} height={24} style={{ borderRadius: 6 }} />
					<span style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F7' }}>Memselon Mockup</span>
				</div>
				<div style={{ fontSize: 20, fontWeight: 600, color: '#F5F5F7', marginBottom: subtitle ? 6 : 24 }}>
					{title}
				</div>
				{subtitle ? (
					<p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 24, lineHeight: 1.5 }}>{subtitle}</p>
				) : null}
				{children}
				{footer ? <div style={{ marginTop: 20, textAlign: 'center' }}>{footer}</div> : null}
			</div>
		</div>
	)
}

const inputStyle: React.CSSProperties = {
	width: '100%',
	padding: '10px 12px',
	borderRadius: 10,
	border: '1px solid rgba(255,255,255,0.1)',
	background: 'rgba(255,255,255,0.04)',
	color: '#F5F5F7',
	fontSize: 14,
	outline: 'none',
	boxSizing: 'border-box',
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
	const { label, ...inputProps } = props
	return (
		<div style={{ marginBottom: 14 }}>
			{label ? (
				<label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#8E8E93', marginBottom: 6 }}>
					{label}
				</label>
			) : null}
			<input {...inputProps} style={{ ...inputStyle, ...(inputProps.style || {}) }} />
		</div>
	)
}

export function AuthButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const disabled = !!props.disabled
	return (
		<button
			{...props}
			style={{
				width: '100%',
				padding: '12px',
				borderRadius: 10,
				border: 'none',
				background: 'linear-gradient(135deg, #7F77DD, #534AB7)',
				color: '#fff',
				fontSize: 14,
				fontWeight: 600,
				cursor: disabled ? 'not-allowed' : 'pointer',
				opacity: disabled ? 0.6 : 1,
				...(props.style || {}),
			}}
		/>
	)
}

export function AuthError({ children }: { children: ReactNode }) {
	if (!children) return null
	return (
		<div
			style={{
				background: 'rgba(239,68,68,0.1)',
				border: '1px solid rgba(239,68,68,0.2)',
				color: '#ef4444',
				padding: '8px 12px',
				borderRadius: 8,
				fontSize: 12,
				marginBottom: 14,
			}}
		>
			{children}
		</div>
	)
}
