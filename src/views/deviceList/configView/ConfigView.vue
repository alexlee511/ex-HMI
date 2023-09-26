<template>
  <div class="main white_view" :style='stylerSize()'>
    <div class="title_item slaveM" :style='stylerSize(100,15,0,2)'>
      <div class="slaveC _36 " :style='stylerSize(10,40,1,0)'>{{ $t("GENERAL.MODBUS_SLAVE") }}</div>
      <div class="slaveC _36" :style='stylerSize(10,40,16,0)'>{{ $t("GENERAL.DEVICE_NAME") }}</div>
      <div class="slaveC _36" :style='stylerSize(10,40,38.5,0)'>{{ $t("GENERAL.DEVICE_TYPE") }}</div>
      <div class="slaveC _36" :style='stylerSize(10,40,62,0)'>{{ $t("GENERAL.DEVICE_ID") }}</div>

    </div>
    <div class="slaveM overFlowY " :style='stylerSize(100,85,0,15)'>
      <div class=" slaveM" v-for="(item, index) in allList" :key="index"  :style='stylerSize(100,35,0,20*index)' :class="{ change_item: item.isChangInfo, addInfo: item.isAddInfo }">
        <div class="slaveC _36 " :style='stylerSize(8,65,2,0)'>{{ item.slave_id }}</div>
        <div class="slaveC _36" :style='stylerSize(25,65,9.5,0)'>{{ item.devName }}</div>
        <div class="slaveC _36" :style='stylerSize(17,65,35,0)'>{{ getTypeByModule(item) }}</div>
        <div class="slaveC _36" :style='stylerSize(30,65,52,0)'>{{ item.dev_id }}</div>
        <img class="slaveC" :style='stylerSize(3.5,25,85,0)' src="~assets/images/modify.png" @click="goChange(item)"/>
        <img class="slaveC" :style='stylerSize(3.5,25,90,0)' src="~assets/images/remove.png"  @click="deleteDevice(item, index)"/>

      </div>
    </div>
  </div>
</template>

<script>
import { getConfigList, deleteConfigList, setConfigName, deleteConfigName, setMbusDevice } from "network/setConfig";
import { restart } from "network/gateway";
import { updateProfile } from "common/constant/profile";
import { updateGenplcSubInfo } from "common/constant/genplc";
import { mapState, mapGetters, mapActions } from "vuex";
import { deleteModuleAdvance } from "network/module"

import exceptionViewMixin from "./exceptionViewMixin";

export default {
  data() {
    return {};
  },
  mixins: [exceptionViewMixin],
  created() {
    if (!this.isGetInfo) {
      this.$store.dispatch("configInfo/getConfigList");
    }
    this.getModuleAdvance({ lang: this.back_lang });
    console.log("🤞🤞🤞🤞🤞🤞🤞🤞🤞🤞🤞")
    console.log(this.deletList)
    console.log(this.trueList)
    console.log(this.exceptionList)
    console.log(this.typeToModule)
    console.log(this.back_lang)
  },
  mounted() {
    this.$bus.$on("configApply", () => {
      this.onApplyClick();
    });
    this.$bus.$on("previousPage", () => {
      let changeState = false;
      if (this.deletList.length > 0) {
        changeState = true;
      }
      for (let item of this.trueList) {
        if (item.isChangInfo) {
          changeState = true;
        }
        if (item.isAddInfo) {
          changeState = true;
        }
      }
      //重置數據
      if (changeState) {
        this.$bus.$emit("getSomeModify", {
          modify: true,
          action: "configInfo/resetCartState",
        });
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("configApply");
    this.$bus.$off("previousPage");
  },
  computed: {
    ...mapState({
      isGetInfo: (state) => state.configInfo.isGetInfo,
      trueList: (state) => state.configInfo.trueList,
      nameList: (state) => state.configInfo.nameList,
      typeList: (state) => state.configInfo.typeList, //型號清單
      deletList: (state) => state.configInfo.deletList, //待刪除清單
      rtu: (state) => state.configInfo.rtu,
      exceptionList: (state) => state.configInfo.exceptionList,
      typeToModule: (state) => state.configInfo.typeToModule,
      back_lang: (state) => state.backData.back_lang,
    }),
    ...mapGetters("configInfo", [
      //清單合併
      "allList",
    ]),
  },
  methods: {
    ...mapActions("configInfo", ["getModuleAdvance", "updateDeviceAdvance"]),
    onApplyClick() {
      let changeState = false; //修改狀態 false為未修改
      let hasDeletedDevice = false;

      if (this.deletList.length > 0) {
        changeState = true; //如果有刪除的裝置，修改狀態
        hasDeletedDevice = true;
      }

      for (let item of this.trueList) {
        if (item.isChangInfo) changeState = true; //如果有修改的裝置，修改狀態
        if (item.isAddInfo) changeState = true; //如果有新增的裝置，修改狀態
      }

      if (changeState) {
        this.$store.commit("setLoadingState");

        if (hasDeletedDevice) {
          this.deleteDevices(this.deletList).then(() => {
            this.updateDevices().then(() => {
              this.onRestartCompleted();
            });
          });
        } else {
          this.updateDevices().then(() => {
            this.onRestartCompleted();
          });
        }
      } else {
        alert("No change");
      }
    },
    updateDevices() {
      let deviceList = [];
      for (let item of this.trueList) {
        if (item.isAddInfo || item.isChangInfo) {
          deviceList.push(item);
        }
      }

      if (deviceList.length == 0) {
        //重啟系統
        return restart();
      }

      //更新裝置名稱清單
      return setConfigName(deviceList)
        .then(async () => {
          for (let item of deviceList) {
            //更新裝置資訊
            await setMbusDevice(item);
            if (item.otherData) {
              let advanceType = item.otherData.type;
              let params = { dev_id: item.dev_id, data: item.otherData.data };

              if (advanceType == "advance") {
                this.updateDeviceAdvance(params);
              } else if (advanceType == "template") {
                //更新IO控制器樣版資料
                await updateGenplcSubInfo(params);
              }
            }
          }
        })
        .then(() => {
          //取得所有裝置資訊
          return updateProfile(undefined, undefined, this.getBackLang);
        })
        .then(() => {
          //重啟系統
          return restart();
        });
    },
    async deleteDevices(deviceList) {
      // 刪除設備的進階設定
      for(let dev of deviceList)
        await deleteModuleAdvance(dev.dev_id, 'all');
      let deviceIds = deviceList.map((item) => item.dev_id);
      //從裝置名稱清單刪除裝置
      return deleteConfigName(deviceIds).then(() => {
        //刪除裝置資訊
        return deleteConfigList(deviceIds);
      });
    },
    onRestartCompleted() {
      this.$store.commit("setLoadingState");
      this.$store.dispatch("configInfo/resetCartState");
      this.$store.dispatch("configInfo/getConfigList");
      this.getModuleAdvance({ lang: this.back_lang });
    },
    goChange(item) {
      this.$router.push({
        path: "/changeConfig/deviceList",
        query: {
          devId: item.dev_id,
        },
      });
    },
    returnType(item) {
      let name = null;
      for (let key in this.typeList) {
        if (key.substring(3) === item) {
          name = this.typeList[key];
          break;
        }
      }
      return name ? name : item;
    },
    deleteDevice(item, index) {
      this.$store.commit("configInfo/deleteTrueList", index);
    },
  },
};
</script>