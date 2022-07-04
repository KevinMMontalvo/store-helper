import axios from 'axios';

export default {
    namespaced: true,
    state: {
        coupons: undefined,
        currentCoupon: {}
    },
    mutations: {
        setCoupons(state, data)
        {
            state.coupons = data;
        },
        setCurrentCoupon(state, data)
        {
            state.currentCoupon = data;
        }
    },
    getters: {},
    actions: {
        getCoupons({commit, rootState})
        {
            commit('setCoupons', undefined);
            axios.get('coupons').then(function (response)
            {
                let coupons = response.data;
                commit('setCoupons', coupons);
            }).catch(function (error)
            {
                commit('setCoupons', []);
                rootState.message = {
                    visible: true,
                    text: 'Error al consultar los cupones',
                    color: 'error'
                };
                console.error(error.response);
            });
        },
        getCouponsByProductIdAndStoreId({commit, rootState}, params)
        {
            commit('setCoupons', undefined);

            console.log(params);
            axios.get('coupons/searchByProductIdAndStoreId', {params}).then(function (response)
            {
                let coupons = response.data;
                commit('setCoupons', coupons);
            }).catch(function (error)
            {
                commit('setCoupons', []);
                rootState.message = {
                    visible: true,
                    text: 'Error al consultar los cupones',
                    color: 'error'
                };
                console.error(error.response);
            });
        }
    }
};