import Vue from 'vue'
import router from './router'
import axios from 'axios'
Vue.mixin({
    methods: {
        checkAuth() {
            const token = localStorage.getItem('user-token');
            axios.post('http://127.0.0.1:8000/api/login/auth', {
                ms: 'go',
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(() => {
                if (this.$route.name == 'login') {
                    router.push('/')
                }
            }).catch(error => {
                localStorage.removeItem('user-token')
                router.push('/login')
                console.log(error)
            })
        },
    }
})