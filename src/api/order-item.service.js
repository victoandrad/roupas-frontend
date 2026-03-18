import http from './http'

export const orderItemService = {
  getAll() {
    return http.get('/api/orderitem/all')
  },
  getByOrder(orderId) {
    return http.get('/api/orderitem/by-order', { params: { orderId } })
  },
  getById(id) {
    return http.get(`/api/orderitem/${id}`)
  },
  create(data) {
    return http.post('/api/orderitem/create', data, { xmlRoot: 'OrderItem' })
  },
  update(id, data) {
    return http.put(`/api/orderitem/update/${id}`, data, { xmlRoot: 'OrderItem' })
  },
  delete(id) {
    return http.delete(`/api/orderitem/delete/${id}`)
  },
}
