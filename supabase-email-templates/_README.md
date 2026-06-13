# Supabase email templates — Memselon Mockup

These HTML templates replace Supabase's default email designs with brand-aligned versions matching the landing page (dark theme, purple gradient, premium feel).

## How to install

1. Open https://supabase.com/dashboard/project/slfsatozvrdsbozzqgcx/auth/templates
2. For each template type below, paste the contents of the matching file into the "HTML body" editor.
3. Save.

| File | Template type in Supabase |
|---|---|
| `confirm-signup.html` | "Confirm signup" |
| `magic-link.html` | "Magic link" |
| `reset-password.html` | "Reset password" |
| `change-email.html` | "Change email address" |
| `invite-user.html` | "Invite user" |

## Variables

Supabase will substitute these at send time:

- `{{ .ConfirmationURL }}` — full URL the user clicks
- `{{ .Email }}` — recipient email
- `{{ .Token }}` — 6-digit OTP (for magic-link styles)
- `{{ .SiteURL }}` — your configured site URL

## Subject lines

In addition to the body, set these subject lines (in the same screen):

- Confirm signup: `Confirm your Memselon Mockup account`
- Magic link: `Your Memselon Mockup magic link`
- Reset password: `Reset your Memselon Mockup password`
- Change email: `Confirm your new email address`
- Invite user: `You're invited to Memselon Mockup`

## Testing

Use the "Send test email" button next to each template in the Supabase dashboard. Make sure your email reaches the inbox (not spam) — first send may trigger Gmail's "this is unusual" prompt.
