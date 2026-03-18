import http from './http'

export const inventoryService = {
  getAll() {
    return http.get('/api/inventory-movements/all')
  },
  getById(id) {
    return http.get(`/api/inventory-movements/${id}`)
  },
  getByProduct(productId) {
    return http.get(`/api/inventory-movements/product/${productId}`)
  },
  getByType(type) {
    return http.get(`/api/inventory-movements/type/${type}`)
  },
  create(data) {
    return http.post('/api/inventory-movements/create', data, { xmlRoot: 'inventoryMovement' })
  },
  update(id, data) {
    return http.put(`/api/inventory-movements/update/${id}`, data, { xmlRoot: 'inventoryMovement' })
  },
  delete(id) {
    return http.delete(`/api/inventory-movements/delete/${id}`)
  },
}
