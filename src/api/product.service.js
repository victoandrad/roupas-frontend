import http from './http'

export const productService = {
  getAll() {
    return http.get('/api/product/all')
  },
  getById(id) {
    return http.get(`/api/product/${id}`)
  },
  create(data) {
    return http.post('/api/product/create', data, { xmlRoot: 'product' })
  },
  update(id, data) {
    return http.put(`/api/product/update/${id}`, data, { xmlRoot: 'product' })
  },
  delete(id) {
    return http.delete(`/api/product/delete/${id}`)
  },
}
