import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';
import Page from './infra/Page.vue'
import Info from '../src/components/Info.vue';
import BundleLink from '../src/components/BundleLink.vue';

Vue.use(BootstrapVue);
Vue.component('Page', Page);
Vue.component('Info', Info);
Vue.component('BundleLink', BundleLink);

require('./panel.play');