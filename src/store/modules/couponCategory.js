import axios from 'axios';

export default {
    namespaced: true,
    state: {
        couponCategories: undefined,
        currentCouponCategory: {}
    },
    mutations: {
        setCouponCategories(state, data)
        {
            state.couponCategories = data;
        },
        setCurrentCouponCategory(state, data)
        {
            state.currentCouponCategory = data;
        }
    },
    getters: {
    },
    actions: {
        getCouponCategories({commit, rootState})
        {
            commit('setCouponCategories', undefined);
            axios.get('couponCategories').then(function (response)
            {
                let couponCategories = response.data;
                commit('setCouponCategories', couponCategories);
            }).catch(function (error)
            {
                commit('setCouponCategories', []);
                rootState.message = {
                    visible: true,
                    text: 'Error al consultar las categorías',
                    color: 'error'
                };
                console.error(error.response);
            });
        }
    }
};