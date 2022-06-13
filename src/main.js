import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios";
import es from 'vuetify/es5/locale/es';
import VueZxingScanner from "vue-zxing-scanner";
let VueCookies = require('vue-cookies');
Vue.config.productionTip = false

vuetify.framework.lang.current = "es";

vuetify.framework.lang.locales = {es};
axios.defaults.baseURL = 'https://localhost:7059/api/';

//axios.defaults.baseURL = 'https://autorepuestos-api.herokuapp.com/';
Vue.use(VueCookies);
Vue.use(VueZxingScanner);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
