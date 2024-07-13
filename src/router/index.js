import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue' 
import Register from '@/views/Register.vue'
import openStore from '@/views/openStore.vue'
import myStore from '@/views/myStore.vue'
import addItem from '@/views/addItem.vue'
import itemDetail from '@/views/itemDetail.vue'
import chatRoom from '@/views/chatRoom.vue'
import modifyItem from '../views/modifyItem.vue'
import myShoppingCart from '../views/myShoppingCart.vue'
import BuyComponent from '../views/BuyComponent.vue'
import manage from '../views/manage.vue'
import userinfo from '../components/userinfo.vue'
import manageGoods from '../components/manageGoods.vue'
import payOrder from '../views/payOrder.vue'
import orderDetail from '../views/orderDetail.vue'
import comment from '../views/commentOrder.vue'
Vue.use(VueRouter)

const routes = [
    {
        path:'/index',
        name:'index',
        component:Index
    },
    {
        path:'/login',
        name:'login',
        component:Login
    },
    {
        path:'/register',
        name:'register',
        component:Register
    },
    {
        path:'/openStore',
        name:'openStore',
        component:openStore
    },
    {
        path:'/myStore',
        name:'myStore',
        component:myStore
    },
    {
        path:'/addItem',
        name:'addItem',
        component:addItem
    },
    {
        path:'/itemDetail',
        name:'itemDetail',
        component:itemDetail
    },
    {
        path:'/modifyItem',
        name:'modifyItem',
        component:modifyItem
    },
    {
        path:'/myShoppingCart',
        name:'myShoppingCart',
        component:myShoppingCart
    },
    {
        path:'/buy',
        name:'buy',
        component:BuyComponent
    },
    {
        path:'/payOrder',
        name:'payOrder',
        component:payOrder
    },
    {
        path:'/orderDetail',
        name:'orderDetail',
        component:orderDetail
    },
    {
        path:'/comment',
        name:'comment',
        component:comment
    },
    {
        path:'/manage',
        name:'manage',
        component:manage,
        children:[
            {
                path:'userinfo',
                name:'userinfo',
                component:userinfo
            },
            {
                path:'/ChatRoom',
                name:'ChatRoom',
                component:chatRoom
            },
            {
                path:'/manageGoods',
                name:'manageGoods',
                component:manageGoods
            },
        ]
    },
]

const router = new VueRouter({
    mode:"history",
    base:process.env.BASE_URL,
    routes:routes
})

export default router;