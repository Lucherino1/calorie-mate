import { createRouter, createWebHistory } from 'vue-router'
import { initializeSession, routeGuard, sessionAccessGuard } from './route-guard'
import { routes } from './routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(initializeSession)
router.beforeEach(sessionAccessGuard)
router.beforeEach(routeGuard)
