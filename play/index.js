import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';
import Page from './infra/Page.vue'
import Info from '../src/components/Info.vue';

Vue.use(BootstrapVue);
Vue.component('Page', Page);
Vue.component('Info', Info);

require('./panel.play');