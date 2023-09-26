<template>
  <div>
    <div
      id="header_nav_meter"
      class="navbar__item"
      @click="itemClick"
      ref="menu"
      :class="isActive ? 'active-style' : ''"
    >
      <div>
        <slot name="select"></slot>
      </div>
    </div>
    <div ref="option" :style="optionDisplay" class="outhidden">
      <slot name="option"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuSelect",
  props: {
    path: {
      type: String,
      default: null,
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    activeColor: {
      type: String,
      default: "yellow",
    },
  },
  data() {
    return {
      optionstyle: false,
      currentData: null,
      canClick: true,
    };
  },
  created() {
    // console.log(this.path)
  },
  mounted() {
    // 監聽如果出現mousemove事件就停止itemClick 先不要
    // this.$bus.$on('mousemove', (e) => {
    //   this.canClick = e
    // })
  },
  methods: {},
  computed: {
    isActive() {
      if (this.path) {
        return this.$route.matched[1].path.indexOf(this.path) !== -1;
      }
    },

    // 動態改變顏色
    activeStyle() {
      if (this.isActive) {
        return { color: this.activeColor };
      } else {
        return {};
      }
    },
    optionDisplay() {
      // return { display: "none" };
      if (this.optionstyle === false) {
        return { display: "none" };
      } else {
        return { display: "block" };
      }
    },
  },
  methods: {
    itemClick(e) {
      if (!this.canClick) {
        this.canClick = true;
        return;
      }
      console.log("---😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀---")
      console.log(this.item)
      if(this.item.features.length === 1) {
        this.$router.replace(this.item.features[0].path)
        return
      }

      if (this.optionstyle === false) {
        this.optionstyle = true;
      } else {
        this.optionstyle = false;
      }

      document.onmouseup = (e) => {
        if (this.$refs.menu) {
          var e = e || window.event;
          var target = e.target || e.srcElement;
          var _tar = this.$refs.menu; //獲取目標元素
          if (!(target == _tar) && !_tar.contains(target)) {
            //目標元素之外
            this.optionstyle = false;
          }
        }
      };
    },
  },
};
</script>

<style scoped>
.navbar__item {
  position: relative;
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  width: 15vw;
  height: 6vh;
  font-size: 3.2vmin;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  margin: 0vh 1vw;
}
.active-style {
  color: yellow;
  border-style: solid;
  border-width: 1.5px;
  border-image: linear-gradient(to left, #2160b8, #01ffff, #2160b8);
  border-image-slice: 1;
}
</style>