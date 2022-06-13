import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from "@/views/Login";
import Customer from "@/views/Customer";
import Barcode from "@/views/Barcode";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/main',
        name: 'Main',
        component: Home
    },
    {
        path: '/customer',
        name: 'Customer',
        component: Customer
    },
    {
        path: '/barcode',
        name: 'Barcode',
        component: Barcode
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

export default router;
