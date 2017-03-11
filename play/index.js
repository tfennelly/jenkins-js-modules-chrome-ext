import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';
import Page from './infra/Page.vue'

Vue.use(BootstrapVue);
Vue.component('Page', Page);

require('./panel.play');