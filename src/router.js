import Vue from 'vue';
import Router from 'vue-router';
import login from './components/Auth/login.vue'
import dashview from './components/dashboard.vue'
import landing from './components/content/index.vue'

import recon from './components/inventory/inventory.vue'
import branches from './components/branches/create-branch.vue'
import users from './components/users/create-users.vue'
import inventory_import from './components/inventory/inventory-import.vue'
import inventory_info from './components/inventory/inventory-info.vue'
import inventory_recon from './components/inventory/inventory-recon.vue'
import settings from './components/inventory/settings.vue'
Vue.use(Router)
const routes = [
    {
        path: '/login',
        component: login,
        name: 'login',

    },
    {
        path: '/',
        components: {
            default: dashview,
        },
        children: [
            {
                path: '/inventory',
                component: recon,
            },
            {
                path: '/inventory/import',
                component: inventory_import,
            },
            {
                path: '/users',
                component: users,
            },
            {
                path: '/branches',
                component: branches,
            },
            {
                path: '/',
                component: recon,
            },
            {
                path: '/inventory/view/:branch/:asof',
                name: 'inventory_info',
                component: inventory_info,
            },
            {
                path: '/inventory/recon/:branch/:asof',
                name: 'inventory_recon',
                component: inventory_recon,
            },
            {
                path: '/settings',
                name: 'settings',
                component: settings,
            },
            
        ]
    },
] 
export default new Router({
   routes: routes
})