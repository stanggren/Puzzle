import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(Vuex)

Vue.config.productionTip = false

const moduleMenu = {
  state: {
    rows: 0,
    columns: 0,
    tiles: 0,
    tilesArray: [],
    winArray: []
  },
  mutations: {
    setMenuData (state, payload) {
      state.rows = payload.rows,
      state.columns = payload.columns,
      state.tiles = payload.tiles,
      state.tilesArray = payload.tilesArray,
      state.winArray = payload.winArray
    },

  }
}

const modulePuzzle = {
  state: {
    tilesArray: [],
    solved: false,
    moves: 0
  },
  mutations: {
    updateBoard (state, payload) {
      state.tilesArray = payload.tilesArray,
      state.moves = payload.moves
    },
    puzzleSolved (state, payload) {
      state.solved = payload.solved
    } 
  }
}

const store = new Vuex.Store({
  modules: {
    menu: moduleMenu,
    puzzle: modulePuzzle
  }
})

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
