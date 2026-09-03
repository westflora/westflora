export const ADMIN_COOKIE = 'wf_admin'

export function getAdminToken() {
  return process.env.ADMIN_SESSION || `wf_${process.env.ADMIN_PASSWORD || 'westflora2026'}`
}

export function isValidAdminPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD || 'westflora2026')
}

export function isValidAdminToken(token?: string | null) {
  return Boolean(token) && token === getAdminToken()
}
