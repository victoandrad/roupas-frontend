import http from './http'

export const installmentService = {
  getAll() {
    return http.get('/installment-payments')
  },
  getById(id) {
    return http.get(`/installment-payments/${id}`)
  },
  create(data) {
    return http.post('/installment-payments', data, { xmlRoot: 'installmentPayment' })
  },
  update(id, data) {
    return http.put(`/installment-payments/${id}`, data, { xmlRoot: 'installmentPayment' })
  },
  delete(id) {
    return http.delete(`/installment-payments/${id}`)
  },
}
