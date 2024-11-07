import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue'
import GioiThieu from '@/components/ComGioiTh.vue'
import LienHe from '@/components/ComLienHe.vue'
import ProductDetail from '@/components/ComProductDetail.vue'
import ComCart from '@/components/ComCart.vue'
import Login from '@/components/ComLogin.vue'
import Register from '@/components/ComRegister.vue'
import Forgot from '@/components/ComForgot.vue'
import Logout from '@/components/ComLogout.vue'
import NotFound from '@/components/ComNotFound.vue'; 
import ComProfile from "@/components/ComProfile.vue";

// tạo mảng chứa những đường link
const routes=[
    // đối tượng trang chủ
    {
        path:"/",
        name:"Home",
        component:Home
    },
    {
        path:"/login",
        name:"Login",
        component:Login
    },
    {
        path:"/register",
        name:"Register",
        component:Register
    },
    {
        path:"/forgot",
        name:"Forgot",
        component:Forgot
    },
    {
        path:"/logout",
        name:"Logout",
        component:Logout
    },
    {
        path:"/about",
        name:"About",
        component:GioiThieu
    },
    {
        path:"/contact",
        name:"Contact",
        component:LienHe
    },
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail
    },
    {
        path:"/cart",
        name:"Cart",
        component:ComCart
    },
    {
        path:"/profile",
        name:"Profile",
        component:ComProfile
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]
// tạo đối tượng router
const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router