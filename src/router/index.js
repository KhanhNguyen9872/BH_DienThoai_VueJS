import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue'
import About from '@/components/ComAbout.vue'
import Contact from '@/components/ComContact.vue'
import ProductDetail from '@/components/ComProductDetail.vue'
import ComCart from '@/components/ComCart.vue'
import Login from '@/components/ComLogin.vue'
import Register from '@/components/ComRegister.vue'
import Forgot from '@/components/ComForgot.vue'
import Logout from '@/components/ComLogout.vue'
import NotFound from '@/components/ComNotFound.vue'; 
import ComProfile from "@/components/ComProfile.vue";
import ComAddAddress from "@/components/ComAddAddress.vue";
import ComEditAddress from "../components/ComEditAddress.vue";
import ComOrder from "@/components/ComOrder.vue";
import ComPayment from "@/components/ComPayment.vue";
import ComSimulatePayment from "@/components/ComSimulatePayment.vue";
import ComLoading from "@/components/ComLoading.vue";
const routes=[
    {
        path:"/",
        name:"Home",
        component:Home,
        meta: { title: 'Trang chủ' },
    },
    {
        path:"/login",
        name:"Login",
        component:Login,
        meta: { title: 'Đăng nhập' },
    },
    {
        path:"/register",
        name:"Register",
        component:Register,
        meta: { title: 'Đăng ký' },
    },
    {
        path:"/forgot",
        name:"Forgot",
        component:Forgot,
        meta: { title: 'Quên mật khẩu' },
    },
    {
        path:"/logout",
        name:"Logout",
        component:Logout,
        meta: { title: 'Đăng xuất' },
    },
    {
        path:"/about",
        name:"About",
        component:About,
        meta: { title: 'Giới thiệu' },
    },
    {
        path:"/contact",
        name:"Contact",
        component:Contact,
        meta: { title: 'Liên hệ' },
    },
    {
        path:"/product",
        name:"ProductDetailHome",
        component:ProductDetail,
        meta: { title: 'Thông tin sản phẩm', redirect: "/" },
    },
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail,
        meta: { title: 'Thông tin sản phẩm' },
    },
    {
        path:"/cart",
        name:"Cart",
        component:ComCart,
        meta: { title: 'Giỏ hàng' },
    },
    {
        path:"/payment",
        name:"Payment",
        component:ComPayment,
        meta: { title: 'Thanh toán' },
    },
    {
        path:"/order",
        name:"Order",
        component:ComOrder,
        meta: { title: 'Đơn hàng' },
    },
    {
        path:"/profile",
        name:"Profile",
        component:ComProfile,
        meta: { title: 'Hồ sơ' },
    },
    {
        path:"/profile/address",
        name:"AddAddressHome",
        component:ComAddAddress,
        meta: { title: 'Thêm địa chỉ', redirect: '/profile' },
    },
    {
        path:"/profile/address/new",
        name:"AddAddress",
        component:ComAddAddress,
        meta: { title: 'Thêm địa chỉ' },
    },
    {
        path:"/profile/address/edit",
        name:"EditAddress",
        component:ComEditAddress,
        meta: { title: 'Sửa địa chỉ' },
    },
    {
        path:"/bank/payment",
        name:"SimulatePayment",
        component:ComSimulatePayment,
        meta: { title: 'Ngân hàng SuperBank' },
    },
    {
        path:"/loading",
        name:"Loading",
        component:ComLoading,
        meta: { title: 'Loading' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { title: 'Không tìm thấy trang' },
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    let title = to.meta.title || 'Trang'; 
    document.title = title + " | KhanhStore";

    // redirect if present
    let redirect = to.meta.redirect;
    if (redirect != undefined && redirect.length > 0) {
        router.push(redirect);
    }
    next();
});
export default router