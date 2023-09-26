<template>
  <dialog-box>
    <draggable
      :list="isSelectArr"
      class="list-group"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
    >
      <div
        class="list-group-item"
        v-for="(item, index) in isSelectArr"
        :key="index"
      >
        <span class="select-item">
          <span>{{ nameList[item.dev_id] || item.dev_id }}</span>
          <span>{{item.description}} | {{item.name}}</span>
          <!-- <span></span>   -->
        </span>
        <button class="filter__picker_item" @click="deleteItme(index)">
          {{ $t("GENERAL.DELETE_CONFIG") }}
        </button>
      </div>
    </draggable>
  </dialog-box>
</template>

<script>
import Draggable from "vuedraggable";
import DialogBox from "components/content/dialog/Dialog";

export default {
  props: {
    isSelectArr: {
      type: Array,
      default() {
        return [];
      },
    },
    nameList: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    DialogBox,
    Draggable,
  },
  methods: {
    deleteItme(index) {
      // console.log("delete");
      this.$emit("deleteItem", index)
    },
  },
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  margin-top: 30px;
}
.list-group-item {
  /* border: 1px solid #ffffff; */
  background-color: #8eb1bee0;
  margin-bottom: 5px;
  height: 80px;
  color: #ffffff;
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: space-around;
}

.list-group-item span {
  width: 70%;
}

.filter__picker_item {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  height: 3vw;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  margin: 0vh 1vw;
  font-size: 1.5vw;
}
.select-item {
  display: flex;
  flex-direction: column;
}
.select-item span {
  text-align: center;
}
</style>