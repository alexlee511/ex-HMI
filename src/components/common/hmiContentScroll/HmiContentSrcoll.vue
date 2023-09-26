<template>
  <div class="outer-scroll_view">
    <div class="inner-scroll_view">
      <div class="scroll_view">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.scroll_view,
.outer-scroll_view {
  width: 90vw;
  height: 70vh;
  margin: auto;
}

.outer-scroll_view {
  position: relative;
  overflow: hidden;
}

.inner-scroll_view {
  position: absolute;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>