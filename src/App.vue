<template>
  <div id="app">
    <Menu />
    <Puzzle ref="puzzle_ref" />
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h1>Congratz!</h1>
        <h2>It took you {{moves}} turns to solve the puzzle.</h2>
        <button id="btn" @click="reset()">Play again</button>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "./components/Menu.vue";
import Puzzle from "./components/Puzzle.vue";

export default {
  name: "App",
  components: {
    Menu,
    Puzzle
  },
  data() {
    return {};
  },
  computed: {
    showModal() {
      return this.$store.state.puzzle.solved;
    },
    moves() {
      return this.$store.state.puzzle.moves;
    }
  },
  methods: {
    reset: function() {
      this.$store.commit({
        type: "puzzleSolved",
        solved: false
      });
      this.$refs.puzzle_ref.shuffleEffect();
    }
  }
};
</script>

<style>
* {
  margin: 0px;
}
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
  background-color: #fbfbfb;
  text-transform: uppercase;
}

#btn {
  height: 40px;
  border-radius: 4px;
  border: 2px solid #2c2d2f;
  background-color: #fbfbfb;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.9em;
  margin-top: 40px;
}
#btn:hover {
  cursor: pointer;
  color: #fbfbfb;
  background-color: #2c2d2f;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 98;
  opacity: 1;
  width: 100vw;
  height: 100vh;
  background-color: #ffdf94;
  opacity: 0.95;
  animation: modalAnim 1s;
}

@keyframes modalAnim {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.95;
  }
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>
