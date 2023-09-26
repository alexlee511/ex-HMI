<template>
  <div style="position: absolute">
    <!-- 透過Ajax放入item -->
    <conf-menu ref="Menu">
      <conf-menu-item v-for="item in totalSetting" :key="item.index">
        <template v-slot:button>{{ translation(item.name) }}</template>
        <template v-slot:buttonbar>
          <conf-menu-bar
            v-for="item in item.bar"
            :key="item.index"
            :path="item.path"
            @click.native="showNumLock(item.path)"
          >
            {{ translation(item.name) }}
          </conf-menu-bar>
        </template>
      </conf-menu-item>
      <!-- 變更傳入的值 -->
      <conf-menu-item v-for="item in menu" :key="item.index">
        <template v-slot:button>{{ translation(item.name) }}</template>
        <template v-slot:buttonbar>
          <conf-menu-bar
            v-for="item in item.bar"
            :key="item.index"
            :path="item.path"
          >
            {{ translation(item.name) }}
          </conf-menu-bar>
        </template>
      </conf-menu-item>

      <conf-menu-item @click.native="aboutClick">
        <template v-slot:button>{{ $t('GENERAL.ABOUT') }}</template>
      </conf-menu-item>
    </conf-menu>
  </div>
</template>

<script>
import {
  ConfMenu,
  ConfMenuItem,
  ConfMenuBar,
} from "components/common/confMenu";

import modules from "./getItem"


export default {
  components: {
    ConfMenu,
    ConfMenuItem,
    ConfMenuBar,
  },
  data() {
    return {
      totalSetting: [
        {
            name: this.$t('GENERAL.CORE_SETTINGS'),
            bar: [
                {
                    name: this.$t('GENERAL.PROGRAM_MANAGEMENT'),
                    path: "/programManagement"
                },
                {
                    name: this.$t('GENERAL.SYSTEM_SETTING'),
                    path: "/gateway"
                },
                {
                    name: this.$t('GENERAL.NAME_SYNC'),
                    path: "/namesync"
                },
            ]
        },
        {
            name: this.$t('GENERAL.DEVICE_SETTING'),
            bar: [
                {
                    name: this.$t('GENERAL.NEW_DEVICE'),
                    path: "/configView/deviceList"
                },
                {
                    name: this.$t('GENERAL.DEVICE_SELECT'),
                    path: "/devicePick"
                },
                {
                    name: this.$t("GENERAL.ATTRIBUTE_SETTING"),
                    path: "/attributes"
                },
                {
                    name: this.$t("GENERAL.DEVICE_ADVANCED_SETTING"),
                    path: "/deviceAdvanceSetting"
                },
                {
                    name: this.$t("GENERAL.CHANNELNAME_SETTING"),
                    path: "/channelName"
                },
            ]
        },
        {
            name: this.$t('GENERAL.ADVANCED_FEATURES'),
            bar: [
                {
                    name: this.$t('GENERAL.RULE_SETTING'),
                    path: "/configView/ruleList"
                },
                {
                    name: this.$t('GENERAL.SCHEDULE_SETTING'),
                    path: "/configView/scheduleList"
                },
                /*{
                    name: this.$t('GENERAL.CONTEXT_SETTING'),
                    path: "/configView/context"
                },*/
                {
                    name: this.$t('GENERAL.ANALYSIS_SETTING'),
                    path: "/configView/analysisSetting"
                },
            ]
        }
      ],
      menu: [],
    };
  },
  created() {
    for (let item of this.solutionEnable) {
      for (let key in modules) {
        if (item === key) {
          if(Object.keys(modules[key]).length !== 0) {
            this.menu.push(modules[key]);
          }
        }
      }
    }
  },
  computed: {
    solutionEnable() {
      return this.$store.state.backData.solutionEnable;
    },
  },
  methods: {
    translation(value) {
      return this.$t(`${value}`);
    },
    aboutClick() {
      this.$bus.$emit('dialogClick')
    },
    showNumLock(get_path) {
      //呼叫showNumLock打開密碼框
      this.$bus.$emit('showNumLock', get_path);
    }
  },
};
</script>

<style scoped>
</style>