<template>
  <div>
    <div class="header">
      <config-header>
        <template v-slot:title>
          <slot name="title"></slot>
        </template>
        <template v-slot:button>
          <slot name="button"></slot>
        </template>
      </config-header>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="footer">
      <config-footer></config-footer>
    </div>
  </div>
</template>

<script>
import ConfigHeader from "./childComps/ConfigHeader";
import ConfigFooter from "./childComps/ConfigFooter";

export default {
  components: {
    ConfigHeader,
    ConfigFooter,
  },
};
</script>

<style scoped>
.header {
  position: absolute;
  width: 100vw;
  height: 10vh;
  border-width: 0px 0px 1.5px 0px;
  border-style: solid;
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0.5),
    rgba(1, 255, 255, 0.5),
    rgba(33, 96, 184, 0.5)
  );
  border-image-slice: 1;
}
.content {
  position: absolute;
  margin-top: 10vh;
  width: 100vw;
  height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.content::-webkit-scrollbar {
  width: 10px;
}
.content::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 10px;
}
.content::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 10px;
}
.footer {
  position: absolute;
  margin-top: 90vh;
  width: 100vw;
  height: 10vh;
}
</style>