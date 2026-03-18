import http from './http'

export const userService = {
  getAll() {
    return http.get('/api/user/all')
  },
  getById(id) {
    return http.get(`/api/user/${id}`)
  },
  create(data) {
    return http.post('/api/user/create', data, { xmlRoot: 'User' })
  },
  update(id, data) {
    return http.put(`/api/user/update/${id}`, data, { xmlRoot: 'User' })
  },
  delete(id) {
    return http.delete(`/api/user/delete/${id}`)
  },
}
