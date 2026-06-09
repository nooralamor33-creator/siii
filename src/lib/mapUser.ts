import type { User as SBUser } from '@supabase/supabase-js'
import type { User } from '../types/auth'

export function mapUser(sbUser: SBUser): User {
  const meta = (sbUser.user_metadata ?? {}) as Record<string, unknown>
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    username: (meta['username'] as string | undefined) ?? sbUser.email?.split('@')[0] ?? '',
    fullName: (meta['full_name'] as string | undefined) ?? '',
    createdAt: sbUser.created_at,
    role: (meta['role'] as string | undefined) === 'admin' ? 'admin' : 'user',
  }
}
