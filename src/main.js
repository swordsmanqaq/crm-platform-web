import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
//import NProgress from 'nprogress'

//import 'nprogress/nprogress.css'
// import Mock from './mock'
// Mock.bootstrap();

//导入axios
import axios from "axios";
//导入JsonExcel
import JsonExcel from "vue-json-excel";
Vue.component('downloadExcel', JsonExcel)

//axios.defaults.baseURL = '/api'  // http://localhost:8082/api
// axios.defaults.baseURL = 'http://localhost:8081'
axios.defaults.baseURL = 'http://47.120.8.237:8081'
Vue.prototype.$http = axios


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//     //NProgress.start();
//     if (to.path == '/login') {
//         localStorage.removeItem('token');
//     }
//     let user = JSON.parse(localStorage.getItem('loginUser'));
//     if (!user && to.path != '/login') {
//         alert("请登录后再次访问!")
//         next({path: '/login'})
//     } else {
//         next()
//     }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

//axios请求拦截器:添加请求拦截器，在请求头中加token
//前端调用后端接口,是过axios发起请求的,在axios调用后端接口之前,都会先经过axios的前置拦截器
axios.interceptors.request.use(
    config => {
        // 获取token
        let token = localStorage.getItem("token");

        // 有值就放到请求头中
        if (token) {
            config.headers.token = token;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })
// 响应拦截器:后端响应结果给前端时,都要先经过响应拦截器
axios.interceptors.response.use(function (response) {
    //对返回的数据进行操作
    let result = response.data;  //后端拦截器返回的数据
    if (!result.success && result.message == "NoLogin") { //条件成立说明没有登录，需要拦截
        router.push({path: '/login'});  // 跳转回登陆页面
        return ElementUI.Message.error("请登录后访问");
        // return response;
    } else if (!result.success && result.message == "NoPermission"){
        router.push({path: '/403'});  // 跳转403页面

    } else {
        // 如果已经登录过，就继续执行
        return response;
    }
}, function (err) {
    return Promise.reject(err)
})


new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

