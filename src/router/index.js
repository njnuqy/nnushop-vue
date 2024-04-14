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
        path:'/ChatRoom',
        name:'ChatRoom',
        component:chatRoom
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
        name:'BuyComponent',
        component:BuyComponent
    },
]

const router = new VueRouter({
    mode:"history",
    base:process.env.BASE_URL,
    routes:routes
})

export default router;