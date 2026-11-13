import { supabase } from '@/integrations/supabase/client'

const API_BASE = (import.meta.env.VITE_KHETMITRA_API_URL || '').replace(/\/$/, '')

export async function backendPost<T>(path: string, body: unknown = {}): Promise<T> {
  if (!API_BASE) throw new Error('Backend URL is missing. Set VITE_KHETMITRA_API_URL in the frontend environment and rebuild.')
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  let token = data.session?.access_token
  if (!token) throw new Error('Please sign in to use crop advice and fertilizer planning.')
  if (token.split('.').length !== 3 || Array.from(token).some((char) => char.codePointAt(0)! > 255)) {
    throw new Error('Your saved sign-in session is invalid. Sign out, clear this site’s stored data, then sign in again.')
  }
  const send = async (accessToken: string) => {
    try {
      return await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      })
    } catch {
      throw new Error('Could not reach the backend. Check that the Render service is live and ALLOWED_ORIGIN includes this Vercel site. For a preview deployment, use its exact origin or test on the production URL.')
    }
  }
  let response = await send(token)
  // Refresh once in case the persisted access token expired while the app was idle.
  if (response.status === 401) {
    const refreshed = await supabase.auth.refreshSession()
    if (!refreshed.error && refreshed.data.session?.access_token) {
      token = refreshed.data.session.access_token
      response = await send(token)
    }
  }
  const result = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(result.error || `Backend request failed (${response.status}).`)
  return result
}
