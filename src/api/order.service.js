import http from './http'

export const orderService = {
  getAll() {
    return http.get('/api/order/all')
  },
  getById(id) {
    return http.get(`/api/order/${id}`)
  },
  create(data) {
    return http.post('/api/order/create', data, { xmlRoot: 'order' })
  },
  update(id, data) {
    return http.put(`/api/order/update/${id}`, data, { xmlRoot: 'order' })
  },
  delete(id) {
    return http.delete(`/api/order/delete/${id}`)
  },
}
