'use client'

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
	process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slfsatozvrdsbozzqgcx.supabase.co'

const SUPABASE_ANON_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnNhdG96dnJkc2JvenpxZ2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjk5NzEsImV4cCI6MjA3NDgwNTk3MX0.ESYlRVDcZgZR-slcrwL8sAf3WyfFiCw5gQMItNFkVf8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
})
