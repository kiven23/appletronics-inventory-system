import Vue from 'vue';
import Router from 'vue-router';
import login from './components/Auth/login.vue'
import dashview from './components/dashboard.vue'
 

 
import branches from './components/branches/create-branch.vue'
import settings from './components/messagecast/settings.vue'
import marketing from './components/messagecast/marketing.vue'
import branch from './components/messagecast/branch.vue'
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
                path: '/messagecast/marketing/index',
                component: marketing,
            },
            {
                path: '/messagecast/branch/index',
                component: branch,
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