import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/products' },
        // Products
        { path: 'products', name: 'products', component: () => import('@/views/products/ProductListView.vue') },
        { path: 'products/new', name: 'product-create', component: () => import('@/views/products/ProductFormView.vue') },
        { path: 'products/:id/edit', name: 'product-edit', component: () => import('@/views/products/ProductFormView.vue') },
        // Orders
        { path: 'orders', name: 'orders', component: () => import('@/views/orders/OrderListView.vue') },
        { path: 'orders/new', name: 'order-create', component: () => import('@/views/orders/OrderFormView.vue') },
        { path: 'orders/:id', name: 'order-detail', component: () => import('@/views/orders/OrderDetailView.vue') },
        { path: 'orders/:id/edit', name: 'order-edit', component: () => import('@/views/orders/OrderFormView.vue') },
        // Inventory
        { path: 'inventory', name: 'inventory', component: () => import('@/views/inventory/InventoryListView.vue') },
        { path: 'inventory/new', name: 'inventory-create', component: () => import('@/views/inventory/InventoryFormView.vue') },
        { path: 'inventory/:id/edit', name: 'inventory-edit', component: () => import('@/views/inventory/InventoryFormView.vue') },
        // Installments
        { path: 'installments', name: 'installments', component: () => import('@/views/installments/InstallmentListView.vue') },
        { path: 'installments/new', name: 'installment-create', component: () => import('@/views/installments/InstallmentFormView.vue') },
        { path: 'installments/:id/edit', name: 'installment-edit', component: () => import('@/views/installments/InstallmentFormView.vue') },
        // Users
        { path: 'users', name: 'users', component: () => import('@/views/users/UserListView.vue') },
        { path: 'users/new', name: 'user-create', component: () => import('@/views/users/UserFormView.vue') },
        { path: 'users/:id/edit', name: 'user-edit', component: () => import('@/views/users/UserFormView.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.matched.some((r) => r.meta.requiresAuth) && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'products' }
  }
})

export default router
