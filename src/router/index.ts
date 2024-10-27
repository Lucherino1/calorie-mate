import { createRouter, createWebHistory } from 'vue-router'
import { renewSession, routeGuard, sessionGuard } from './route-guard'
import { routes } from './routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(renewSession)
router.beforeEach(sessionGuard)
router.beforeEach(routeGuard)
