import type { User, CodeType } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', { mobile, password })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}

export const sengMobileCode = (mobile: string, type: CodeType) => {
  return request('/code', 'GET', { mobile, type })
}
