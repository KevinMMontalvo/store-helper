import axios from 'axios';

export default {
    namespaced: true,
    state: {
        productByStores: undefined,
        currentProduct: {}
    },
    mutations: {
        setProductByStores(state, data)
        {
            state.productByStores = data;
        },
    },
    getters: {
    },
    actions: {
        getProductByStores({commit, rootState}, productId)
        {
            commit('setProductByStores', undefined);
            axios.get(`productByStores/byProductId/${productId}`).then(function (response)
            {
                let productByStore = response.data;
                commit('setProductByStores', productByStore);
            }).catch(function (error)
            {
                commit('setProductByStores', []);
                rootState.message = {
                    visible: true,
                    text: 'Error al consultar las tiendas',
                    color: 'error'
                };
                console.error(error.response);
            });
        }
    }
};