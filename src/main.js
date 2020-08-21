// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang'

import ElementUI from 'element-ui'
import 'font-awesome/css/font-awesome.min.css'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@/assets/css/element-variables.scss'
import '@/assets/css/base.css'
import '@/assets/css/element-cover.less'
import '@/assets/css/style.css'
import '@/assets/css/common.less'

import api from '@/api/api.js'
Vue.prototype.$api = api

import utils from '@/utils'
Vue.prototype.$utils = utils

import SearchTree from "./components/SearchTree/index";
Vue.use(SearchTree);


import 'echarts/map/js/world.js'
import 'echarts/map/js/china.js'
import 'echarts/extension-src/bmap/bmap.js'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 控制点击特定区域外的操作
Vue.directive('clickoutside', {
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e)
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler
        document.addEventListener('click', documentHandler)
    },
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
    }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
})
