<template>
  <div class="toast" v-show="isShow">
    <div>網路連線異常</div>
  </div>
</template>

<script>
import store from "@/store"

export default {
  data() {
    return {
      // isShow: false,
      message: "",
    };
  },
  // methods: {
  //   show(message, duration=2000) {
  //     //給默認參數
  //     // duration = duration || 2000

  //     this.isShow = true;
  //     this.message = message;

  //     setTimeout(() => {
  //       this.isShow = false;
  //       this.message = "";
  //     }, duration);
  //   },
  // },
  computed: {
    isShow() {
      return store.state.Disconnected
    }
  },
  created() {
    // console.log(store)
  },
};
</script>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px 10px;
  z-index: 999;
}
</style>