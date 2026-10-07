import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/login'},
    { path: '/login', component: () => import('../views/Login.vue') },
    { path: '/dashboard', component: () => import('../views/Dashboard.vue') },
    { path: '/students', component: () => import('../views/Students.vue') },
    { path: '/announcements', component: () => import('../views/Announcements.vue') }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})