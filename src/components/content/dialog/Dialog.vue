<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose"
    :modal="false"
    custom-class="dialog-box"
  >
  <slot></slot>
  </el-dialog>
</template>

<script>
import { Dialog as ElDialog } from "element-ui";

export default {
  components: {
    ElDialog,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  mounted() {
    this.$bus.$on("dialogClick", () => {
      this.dialogVisible = true;
    });
  },
  beforeDestroy() {
    this.$bus.$off("dialogClick");
  },
  methods: {
    handleClose(done) {
      done();
    },
  },
};
</script>

<style>
.dialog-box {
  font-weight: bold;
  background-color: rgba(10, 38, 81, 0.8);
  width: 100%;
  border-style: solid;
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
}
.el-dialog__body {
  color: white;
  padding: 0px 30px 20px;
  font-size: 3.2vmin;
  font-weight: bold;
}
</style>
