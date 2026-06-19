import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/auth.store'

export const clearAuthSession = () => {
  Cookies.remove('token')
  useAuthStore.getState().clearUser()
}