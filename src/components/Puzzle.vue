<template>
  <div class="container">
    <ul id="list" :style="gridStyle">
      <li
        v-on:click="getPosition"
        v-bind:key="tile"
        v-for="(tile) in this.$store.state.puzzle.tilesArray"
        class="tile"
        :id="tile"
      >
        <p>{{tile}}</p>
      </li>
    </ul>
    <div id="button-container" class="button-container">
      <button v-on:click="shuffleEffect">Shuffle</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data: function() {
    return {
      tilesArray: this.$store.state.puzzle.tilesArray,
      moves: 0
    };
  },
  computed: {
    gridStyle() {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${this.$store.state.menu.columns}, minmax(60px, 1fr))`,
        gridTemplateRows: `repeat(${this.$store.state.menu.rows}, minmax(70px, 1fr))`
      };
    }
  },
  methods: {
    checkTileConnection: function(clickedTile, EmptyTile) {
      var checkClickedTileIndex;
      var checkEmptyTileIndex;

      var n = this.$store.state.menu.rows,
        len = this.$store.state.puzzle.tilesArray.length,
        out = [],
        i = 0,
        size;

      if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
          out.push(this.$store.state.puzzle.tilesArray.slice(i, (i += size)));
        }
      }

      for (var j = 0; j < out.length; j++) {
        var arr = out[j];
        const cTile = element => element == clickedTile;
        const cTileIndex = arr.findIndex(cTile);
        const eTile = element => element == EmptyTile;
        const eTileIndex = arr.findIndex(eTile);

        if (cTileIndex == out[j].length - 1) {
          checkClickedTileIndex = true;
        }
        if (eTileIndex == 0) {
          checkEmptyTileIndex = true;
        }
      }

      if (checkClickedTileIndex == true && checkEmptyTileIndex == true) {
        return true;
      }
    },
    getPosition: async function(tile) {
      const clickedTile = element => element == tile.target.textContent;
      const ct = this.$store.state.puzzle.tilesArray.findIndex(clickedTile);
      const emptyTile = element => element == "EMP";
      const et = this.$store.state.puzzle.tilesArray.findIndex(emptyTile);
      var t;

      if (tile.target.tagName == "P") {
        t = tile.target.parentNode;
      } else if (tile.target.tagName == "LI") {
        t = tile.target;
      }

      var rightCheck = this.checkTileConnection(tile.target.textContent, "EMP");
      var leftCheck = this.checkTileConnection("EMP", tile.target.textContent);

      if (
        this.$store.state.puzzle.tilesArray[
          Number(ct) + Number(this.$store.state.menu.columns)
        ] == "EMP"
      ) {
        t.className = "up";
        await this.sleep(400);
        this.changePosition(ct, et, t);
      } else if (
        this.$store.state.puzzle.tilesArray[Number(ct) + 1] == "EMP" &&
        !rightCheck
      ) {
        t.className = "right";
        await this.sleep(400);
        this.changePosition(ct, et, t);
      } else if (
        this.$store.state.puzzle.tilesArray[
          Number(ct) - Number(this.$store.state.menu.columns)
        ] == "EMP"
      ) {
        t.className = "down";
        await this.sleep(400);
        this.changePosition(ct, et, t);
      } else if (
        this.$store.state.puzzle.tilesArray[Number(ct) - 1] == "EMP" &&
        !leftCheck
      ) {
        t.className = "left";
        await this.sleep(400);
        this.changePosition(ct, et, t);
      }
    },
    changePosition: function(clickedTileIndex, emptyTileIndex, tile) {
      var board = this.$store.state.puzzle.tilesArray;

      board.splice(emptyTileIndex, 1, board[clickedTileIndex]);
      board.splice(clickedTileIndex, 1, "EMP");

      this.moves++;
      this.$store.commit({
        type: "updateBoard",
        tilesArray: board,
        moves: this.moves
      });
      tile.classList.remove = "right";
      tile.classList.remove = "left";
      tile.classList.remove = "up";
      tile.classList.remove = "down";
      tile.className = "tile";

      if (
        JSON.stringify(this.$store.state.menu.winArray) ==
        JSON.stringify(this.$store.state.puzzle.tilesArray)
      ) {
        this.$store.commit({
          type: "puzzleSolved",
          solved: true
        });
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    shuffleEffect: async function() {
      var button = document.getElementById("button-container");
      button.className = "progress-anim";
      for (var s = 0; s < 15; s++) {
        var ms = 100;
        var tiles =
          this.$store.state.menu.columns * this.$store.state.menu.rows;
        var tilesArray = [];

        for (var i = 1; i <= tiles - 1; i++) {
          tilesArray.push(i);
        }

        for (let k = tilesArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (k + 1));
          [tilesArray[k], tilesArray[j]] = [tilesArray[j], tilesArray[k]];
        }

        tilesArray.push("EMP");

        this.$store.commit({
          type: "updateBoard",
          tilesArray: tilesArray
        });

        var _ms = (ms += s * 30);
        await this.sleep(_ms);
      }
      button.classList.remove("progress-anim");
      button.className = "button-container";
    }
  }
};
</script>

<style scoped>
@media (max-width: 350px) {
  ul {
    border: 0px !important;
  }
  ul p {
    margin-left: 2px;
  }

  .left {
    animation: leftAnimPhone 0.45s !important;
  }
  .right {
    animation: rightAnimPhone 0.45s !important;
  }
}
@keyframes rightAnimPhone {
  from {
    transform: translate(0px);
  }
  to {
    transform: translate(65px);
  }
}

@keyframes leftAnimPhone {
  from {
    transform: translate(0px);
  }
  to {
    transform: translate(-65px);
  }
}

.container {
  display: grid;
  justify-content: left;
  background-color: #fbfbfb;
}

ul {
  border: 4px solid #ffcb4d;
  padding: 4px;
  grid-gap: 4px;
  border-radius: 10px;
}

.tile {
  list-style: none;
  background-color: #ffcb4d;
  border: 2px solid #ffcb4d;
  border-radius: 10px;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

li p {
  color: #2c2d2f;
  font-size: 1.5em;
  padding: 10px 10px 10px 6.5px;
  margin-top: 5px;
  animation-name: opacityAnim;
  animation-duration: 0.6s;
  opacity: 1;
  cursor: pointer;
  font-weight: 600;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

li:hover {
  cursor: pointer;
}

#EMP p,
#EMP {
  background-color: #fbfbfb;
  color: #fbfbfb;
  border-color: #fbfbfb;
  pointer-events: none;
}

#EMP:hover p {
  cursor: default;
}
#EMP:hover {
  cursor: default;
}

p:hover {
  animation-name: opacityAnim;
  animation-duration: 0.5s;
  opacity: 1;
  cursor: pointer;
}

.button-container {
  margin-top: 20px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  animation-iteration-count: 1;
  background-image: linear-gradient(180deg, transparent 10%, #ffcb4d 0);
  background-repeat: no-repeat;
  background-size: 100% 90%;
}

.progress-anim {
  margin-top: 20px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  animation-iteration-count: 1;
  background-image: linear-gradient(180deg, transparent 10%, #ffcb4d 0);
  background-repeat: no-repeat;
  background-size: 100% 90%;
  animation: progressAnim 4.6s;
}

button {
  height: 2em;
  width: 6em;
  font-size: 1.5em;
  font-weight: 600;
  border-radius: 4px;
  border: 2px solid #ffcb4d;
  background-color: #fbfbfb;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
}

button:hover {
  background-color: #ffcb4d;
}

@keyframes progressEnd {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}

@keyframes progressAnim {
  0% {
    background-size: 100% 90%;
  }
  50% {
    background-size: 0% 90%;
  }
  100% {
    background-size: 100% 90%;
  }
}

.left {
  pointer-events: none;
  list-style: none;
  background-color: #ffcb4d;
  border: 2px solid #ffcb4d;
  border-radius: 10px;

  animation: leftAnim 0.45s;
}
.right {
  pointer-events: none;
  list-style: none;
  background-color: #ffcb4d;
  border: 2px solid #ffcb4d;
  border-radius: 10px;

  animation: rightAnim 0.45s;
}
.up {
  pointer-events: none;
  list-style: none;
  background-color: #ffcb4d;
  border: 2px solid #ffcb4d;
  border-radius: 10px;

  animation: upAnim 0.45s;
}
.down {
  pointer-events: none;
  list-style: none;
  background-color: #ffcb4d;
  border: 2px solid #ffcb4d;
  border-radius: 10px;

  animation: downAnim 0.45s;
}

@keyframes rightAnim {
  from {
    transform: translate(0px);
  }
  to {
    transform: translate(73px);
  }
}

@keyframes leftAnim {
  from {
    transform: translate(0px);
  }
  to {
    transform: translate(-73px);
  }
}

@keyframes upAnim {
  from {
    transform: translate(0px, 0px);
  }
  to {
    transform: translate(0px, 73px);
  }
}

@keyframes downAnim {
  from {
    transform: translate(0px, 0px);
  }
  to {
    transform: translate(0px, -73px);
  }
}
</style>