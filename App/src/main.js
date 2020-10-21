import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.filter('capitalize', val => val.replace(/^[A-z]|\s+[A-z]/gi, c => c.toUpperCase()));

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
})
