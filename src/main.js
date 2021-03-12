import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
// import VueMindmap from 'vue-mindmap'
import Mindmap from './components/vue-mindmap/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import './components/vue-mindmap/vue-mindmap.css'
import "./assets/style/global.css";

// Vue.use(VueMindmap)
Vue.use(Mindmap);
Vue.use(ElementUI);

Vue.prototype.$ajax = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
