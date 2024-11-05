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
import NotFound from '@/components/ComNotFound.vue'; // For handling 404


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
        name:"Đăng nhập",
        component:Login
    },
    {
        path:"/register",
        name:"Đăng ký",
        component:Register
    },
    {
        path:"/forgot",
        name:"Quên mật khẩu",
        component:Forgot
    },
    {
        path:"/logout",
        name:"Đăng xuất",
        component:Logout
    },
    {
        path:"/about",
        name:"Giới thiệu",
        component:GioiThieu
    },
    {
        path:"/contact",
        name:"Liên hệ",
        component:LienHe
    },
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail
    },
    {
        path:"/cart",
        name:"ComCart",
        component:ComCart
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]
// tạo đối tượng router
const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router