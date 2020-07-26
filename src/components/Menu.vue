<template>
  <div>
    <h1>Puzzle</h1>
    <div class="input">
      <p>Choose amount of columns:</p>
      <input v-model="columns" type="number" value="4" min="3" max="5" onKeyDown="return false"/>
    </div>
    <div class="input">
      <p>Choose amount of rows:</p>
      <input v-model="rows" type="number" value="4" min="3" max="5" onKeyDown="return false"/>
    </div>
    <div class="input">
      <p id="amountTiles">Amount of tiles: {{tiles}}</p>
      <button v-on:click="sendTilesData">Create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data: function() {
    return {
      columns: 5,
      rows: 3
    };
  },
  mounted() {
    this.sendTilesData();
  },
  computed: {
    tiles: function() {
      return this.columns * this.rows;
    }
  },
  methods: {
    sendTilesData: function() {
      var tiles = this.columns * this.rows;
      var tilesArray = [];
      var winArray = [];

      for (var i = 1; i <= tiles - 1; i++) {
        tilesArray.push(i);
        winArray.push(i);
      }

      for (let k = tilesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (k + 1));
        [tilesArray[k], tilesArray[j]] = [tilesArray[j], tilesArray[k]];
      }

      tilesArray.push("EMP");
      winArray.push("EMP");

      this.$store.commit({
        type: "setMenuData",
        columns: this.columns,
        rows: this.rows,
        tiles: tiles,
        tilesArray: tilesArray,
        winArray: winArray
      });

      this.$store.commit({
        type: "updateBoard",
        tilesArray: tilesArray
      });
    }
  }
};
</script>

<style scoped>
@media (max-width: 350px) {
  .container,
  .input {
    width: 300px !important;
  }
}

@media (max-width: 500px) {
  h1 {
    margin-top: 50px !important;
  }
}

* {
  font-weight: 600;
  color: #2c2d2f;
}
h1 {
  font-size: 3em;
  margin-top: 100px;
  margin-bottom: 40px;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 350px;
  margin-bottom: 20px;
}

.input p {
  margin-top: 5px;
}

#amountTiles {
  margin-top: 8px;
}

input {
  width: 2.2em;
  height: 30px;
  border-radius: 4px;
  border: 2px solid #2c2d2f;
  background-color: #fbfbfb;
  font-size: 1em;
}

button {
  height: 40px;
  border-radius: 4px;
  border: 2px solid #2c2d2f;
  background-color: #fbfbfb;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.9em;
}

button:hover {
  cursor: pointer;
  color: #fbfbfb;
  background-color: #2c2d2f;
}
</style>