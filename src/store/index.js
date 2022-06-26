import Vue from 'vue';
import Vuex from 'vuex';
import stores from "@/store/modules/stores";
import products from "@/store/modules/products";
import productByStores from "@/store/modules/productByStores";
import couponCategory from "@/store/modules/couponCategory";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        message: {
            visible: false,
            text: '',
            color: 'primary'
        }
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        stores,
        products,
        productByStores,
        couponCategory
    }
});
