<template>
  <ul>
    <li class="slaveM" :style='stylerSize(100,15,0,0)'>
      <div class="slaveC _40" :style='stylerSize(8,8,15,6)'>#</div>
      <div class="slaveC _40" :style='stylerSize(15,8,35,6)'>{{ $t("GENERAL.ADVANCED_LOAD_ID") }}</div>
      <div class="slaveC _40" :style='stylerSize(15,8,55,6)'>{{ $t("GENERAL.ADVANCED_IO_TYPE") }}</div>
      <div class="slaveC _40" :style='stylerSize(15,8,75,6)'>{{ $t("GENERAL.ADVANCED_ENABLED") }}</div>
    </li>
    <li class="slaveM overFlowY" v-for="(item, index) in subList" :key="index" :style='stylerSize(100,20,0,10*index+15)'>
      <div class="slaveC _40" :style='stylerSize(8,8,15,0)'>{{ index + 1 }}</div>
      <div class="slaveC _40" :style='stylerSize(8,8,38,0)'>{{ item.subId }}</div>
      <div class="slaveC _40" :style='stylerSize(8,8,58,0)'>{{ item.ioType }}</div>
      <input class="slaveC _40" :style='stylerSize(8,20,79,8)' type="checkbox" name="" id="" v-model="item.status" @change="checked" />
    </li>
  </ul>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import otherConfigStoreMixin from "../../mixin/otherConigStoreMixin";
import { getGenplcSubInfo } from "common/constant/genplc";

export default {
  mixins: [otherConfigStoreMixin],
  data() {
    return {
      module: this.$route.query.module,
      subList: [],
      isModified: false,
    };
  },
  created() {
    this.subList = this.deviceInfo.ioControllerSubList.map((item) => {
      item.status = false;
      return item;
    });

    if (this.otherInfo) {
      this.isModified = this.otherInfo.data.isModified;
      this.subList = this.otherInfo.data.subList;
    } else {
      getGenplcSubInfo(this.deviceInfo.deviceID).then((response) => {
        if (response.code == 0) {
          if (this.otherInfo && this.otherInfo.data.isModified) {
            this.subList = this.otherInfo.data.subList;
          } else {
            this.subList = response.data.sub_list;
          }
        }
      });
    }
  },
  mounted() {
    this.$bus.$on("previousPage", () => {
      this.handleOtherData({ type: "template", data: this.$data });
    });
  },
  beforeDestroy() {
    this.$bus.$off("previousPage");
  },
  computed: {
    ...mapState({
      deviceInfo: (state) => state.otherConfigModule.configData,
      otherInfo: (state) => state.otherConfigModule.otherData,
    }),
  },
  methods: {
    ...mapMutations({
      handleOtherData: "otherConfigModule/handleOtherData",
    }),
    checked() {
      this.isModified = true;
    },
  },
};
</script>

<style scoped src="../../../../assets/css/otherConfigTemplate.css" />