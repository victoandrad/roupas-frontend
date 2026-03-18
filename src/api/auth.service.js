import http from './http'

export const authService = {
  login(email, password) {
    return http.post('/auth/login', { email, password }, { xmlRoot: 'authRequest' })
  },
}
