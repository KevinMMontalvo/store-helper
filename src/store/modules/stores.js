import axios from 'axios';

export default {
    namespaced: true,
    state: {
        stores: undefined,
        currentStore: {}
    },
    mutations: {
        setStores(state, data)
        {
            state.stores = data;
        },
        setCurrentStore(state, data)
        {
            state.currentStore = data;
        }
    },
    getters: {
    },
    actions: {
        getStores({commit, rootState})
        {
            commit('setStores', undefined);
            axios.get('stores').then(function (response)
            {
                let stores = response.data;
                commit('setStores', stores);
            }).catch(function (error)
            {
                commit('setStores', []);
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