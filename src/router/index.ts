import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiresGuru?: boolean
    requiresSiswa?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true, title: 'SIGMA - Login' },
    },
    {
      path: '/',
      component: () => import('@/views/DashboardView.vue'), // ← Layout wrapper
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardHome.vue'), // ← Halaman dashboard
          meta: { title: 'SIGMA - Dashboard' },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/users/UserCRUD.vue'),
          meta: { requiresGuru: true, title: 'SIGMA - Manajemen User' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Pengaturan Sistem' },
        },
        {
          path: 'kelas',
          name: 'kelas',
          component: () => import('@/views/kelas/KelasCRUD.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Data Kelas' },
        },
        {
          path: 'mapel',
          name: 'mapel',
          component: () => import('@/views/mapel/MapelCRUD.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Mata Pelajaran' },
        },
        {
          path: 'siswa',
          name: 'siswa',
          component: () => import('@/views/siswa/SiswaCRUD.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Data Siswa' },
        },
        {
          path: 'gtk',
          name: 'gtk',
          component: () => import('@/views/gtk/GtkCRUD.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Data GTK' },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue'),
          meta: { requiresAuth: true, title: 'SIGMA - Profil Saya' },
        },
        {
          path: 'cetak-kartu',
          name: 'cetak-kartu',
          component: () => import('@/views/cetakkartu/CetakKartuView.vue'),
          meta: { requiresAuth: true, requiresGuru: true, title: 'SIGMA - Cetak Kartu Siswa' },
        },
      ],
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.title) document.title = to.meta.title

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    return { name: 'dashboard' }
  }
  if (to.meta.requiresGuru && !authStore.isGuru) {
    return { name: 'dashboard' }
  }
  return true
})

export default router
