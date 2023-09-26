<template>
  <component :is="getOtherConfig"></component>
</template>

<script>
import OtherConfigTemplate from "./childCpn/OtherConfigTemplate.vue";
import OtherConfigAdvance from "./childCpn/OtherConfigAdvance.vue";

import otherConfigStoreMixin from "../mixin/otherConigStoreMixin";
import { mapState } from "vuex";

export default {
  components: {
    OtherConfigTemplate,
    OtherConfigAdvance,
  },
  mixins: [otherConfigStoreMixin],
  data() {
    return {
      module: this.$route.query.module,
    };
  },
  computed: {
    ...mapState({
      isIOController: (state) => state.otherConfigModule.configData.isIOController,
    }),
    getOtherConfig() {
      if (this.isIOController) {
        return "OtherConfigTemplate";
      } else {
        return "OtherConfigAdvance";
      }
    },
  },
};
</script>

<style>
@import "~assets/css/otherConfig.css";
</style>