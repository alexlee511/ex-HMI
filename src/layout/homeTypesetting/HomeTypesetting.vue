<template>
  <div class="MAINMETER">
    <div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
    <home-aside></home-aside>
    <home-footer></home-footer>
  </div>
</template>

<script>
import HomeAside from "./childComps/HomeAside";
import HomeFooter from "./childComps/HomeFooter";

export default {
  components: {
    HomeAside,
    HomeFooter,
  },
};
</script>

<style>
.MAINMETER {
  color: #ffffff;
  font-weight: bold;
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0px;
  height: 100%;
  width: 100%;
  z-index: 0;
  overflow: hidden;
}
</style>