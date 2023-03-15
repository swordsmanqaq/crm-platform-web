import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
//==================导入.vue文件=======================
import Department from "./views/org/Department";
import Employee from "./views/org/Employee";
import Permission from "./views/auth/Permission";
import Role from "./views/auth/Role";
import Menus from "./views/auth/Menus";
import NotPermission from './views/403.vue'
import Config from "./views/sys/Config";
import Dictionary from "./views/sys/Dictionary";
import DictionaryItem from "./views/sys/DictionaryItem";

import ProductType from "./views/prod/ProductType";
import Product from "./views/prod/Product";

import Activity from "./views/mkt/Activity";
import ActivityRemark from "./views/mkt/ActivityRemark";
import Business from "./views/mkt/Business";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true,
        children: [
            {path: '/403',component: NotPermission}
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        leaf: true,
        children: [
            { path: '/echarts', component: echarts, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/department', component: Department, name: '部门管理' },
            { path: '/employee', component: Employee, name: '员工管理' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '权限管理',
        iconCls: 'el-icon-message',
        children: [
            { path: '/permission', component: Permission, name: '权限管理' },
            { path: '/role', component: Role, name: '角色管理' },
            { path: '/menu', component: Menus, name: '菜单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-message',
        children: [
            { path: '/config', component: Config, name: '系统配置' },
            { path: '/dictionary', component: Dictionary, name: '数据字典' },
            { path: '/dictionaryitem', component: DictionaryItem, name: '数据字典明细' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '产品模块',
        iconCls: 'el-icon-message',
        children: [
            { path: '/product', component: Product, name: '产品' },
            { path: '/productType', component: ProductType, name: '产品类型' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '营销模块',
        iconCls: 'el-icon-message',
        children: [
            { path: '/activity', component: Activity, name: '活动' },
            { path: '/activityRemark', component: ActivityRemark, name: '活动记录' },
            { path: '/business', component: Business, name: '商机' }
        ]
    },

    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;