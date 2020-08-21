import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import menu from './modules/menu'
import orgTree from './modules/orgTree'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    menu,
    orgTree
  },
  getters
})

export default store