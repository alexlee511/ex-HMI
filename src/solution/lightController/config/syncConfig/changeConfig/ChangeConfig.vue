<template>
  <div class="DEVICELIST_CONTENT">
    <div class="devicelist_view__title_item" style="color: #ffff33">
      <div style="width: 12vw" class="item_center">
        {{ $t("GENERAL.MODBUS_SLAVE") }}: 1
      </div>
      <div style="width: 48vw">{{ $t("GENERAL.DEVICE_NAME") }}: {{ nameList[devId] || devId }}</div>
      <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_KIND") }}</div> -->
      <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_TYPE") }}</div> -->
      <div style="width: 28vw">Control: {{ davData.quantity }}</div>
    </div>
    <div class="devicelist_view__title_item">
      <div style="width: 8vw" class="item_center">
        {{ $t("GENERAL.DEV_NO") }}
      </div>
      <div style="width: 18vw">{{ $t("GENERAL.DEVICE_TYPE") }}</div>
      <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_KIND") }}</div> -->
      <div style="width: 38vw">{{ $t("GENERAL.DEVICE_NAME") }}</div>
      <div style="width: 28vw">{{ $t("GENERAL.DEVICE_ID") }}</div>
    </div>
    <div class="outer-scroll_view">
      <div class="inner-scroll_view">
        <div class="scroll_view">
          <div
            class="devicelist_view__content_item"
            v-for="(item, index) in subList"
            :key="item.id"
          >
            <div style="width: 8vw" class="item_center">
              {{ index + 1 }}
            </div>
            <div style="width: 18vw">{{ item.description }}</div>
            <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_KIND") }}</div> -->
            <div style="width: 38vw">
              <input style="width: 80%" maxlength="20" v-model="subList[index].name" :placeholder="item.id" />
            </div>
            <div class="button-block">
              <select v-model="subList[index].currentSelect">
                <option :value="itemx.value" v-for="itemx in item.controlList" :key="itemx.value">
                  {{itemx.name}}
                </option>
              </select>
              <button @click="testClick(item)" class="filter__picker_item">TEST</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSubdevice,
  getControlInfo,
  getControlAttr
} from "network/scence"
import {
  controlDevice
} from "network/control"
import { setNameData } from "network/setConfig"

import { mapGetters } from "vuex"


export default {
  data() {
    return {
      devId: this.$route.query.devId,
      davData: {},
      subList: [],
      nameList: [],
      devName: "",
      moduleName: "",
      val: 0,
    };
  },
  async mounted() {
    
    this.nameList = this.$store.state.deviceName;
    // let subList;
    const res = await getSubdevice(this.devId)
    // //console.log(res)
    const {module_list} = res
    this.davData = module_list[0].subdev_list[0]
    this.moduleName = module_list[0].module_name
    let subList = module_list[0].subdev_list[0].subid_list.map(item => {
      const obj = {}
      obj.id = item;
      obj.name = this.nameList[item]
      return obj
    })
    await getControlInfo(this.devId).then(res => {
        if(res.module_list.length==0){
            return {}
        }
      const connectList =  res.module_list[0].device_list
      subList = subList.map((item, index) => {
        const obj = {...item}
        obj.channel = connectList[index].channel
        obj.controlType = connectList[index].control_type
        obj.targetId = connectList[index].target_id
        return obj
      })
    })
    
    await getControlAttr(this.moduleName, this.getBackLang).then(res => {
      //console.log(res)
      const controlList = res.module_list[0].ctl_attr_list
      subList = subList.map((item, index) => {
        const obj = {...item}
        const newControl = controlList.find(itemx => {
          return itemx.control_type == item.controlType
        })
        obj.description = newControl?.description
        obj.controlList = newControl?.value_list
        obj.attrId = newControl?.attrId
        obj.writeCmd = newControl?.writeCmd
        obj.currentSelect = newControl?.value_list[0].value
        return obj
      })
    })
    // //console.log(subList)
    this.subList = subList
    // this.$bus.$on("previousPage", () => {
    //   this.$bus.$emit("getSomeModify", { modify: true });
    // });
    this.$bus.$on("configLoad", async () => {
      for(let item of this.subList) {
        this.nameList[item.id] =  item.name
      }
      await setNameData(this.nameList)
      this.$router.back()
    })
  },
  beforeDestroy() {
    this.$bus.$off("configLoad");
  },
  methods: {
    async testClick(item) {
      //console.log(item)
      this.$store.commit("setLoadingState");
      const cav = `${item.channel}_${item.attrId}_${item.currentSelect}`
      await controlDevice(item.targetId, item.writeCmd, cav , item.attrId)
      this.$store.commit("setLoadingState");
    },
  },
  computed: {
    ...mapGetters(["getBackLang"]),
  }
};
</script>

<style scoped>
.DEVICELIST_CONTENT {
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-weight: bold;
  width: 100vw;
}

.devicelist_view__title_item {
  display: flex;
  width: 100vw;
  height: 15vh;
  align-items: center;
  justify-content: center;
  color: #01ffff;
  font-size: 2.5vw;
}

.devicelist_view__title_item div {
  text-align: center;
}

.devicelist_view__content_item {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 13vh;
  align-items: center;
  font-size: 2vw;
}
.devicelist_view__content_item div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 15px;
  text-align: center;
}

.scroll_view,
.outer-scroll_view {
  width: 100vw;
  height: 60vh;
}

/* .outer-scroll_view {
  position: relative;
  overflow: hidden;
}

.inner-scroll_view {
  position: absolute;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
} */

.item_center {
  justify-content: center;
  display: flex;
}

.item__toolicon {
  width: 5vw;
}

.row-no-padding {
  margin-left: 0vw;
}

.row-no-padding > [class*="col-"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.changeInfo {
  color: #ffff33;
}
.addInfo {
  color: #ffff33b4;
}
input {
  background-color: #9bebff;
  color: #000000;
  font-weight: bold;
  border-radius: 2px;
  border-width: 0px;
  height: 5vh;
}

.filter__picker_item {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  margin-right: 5px;
  font-size: 2vmin;
  height: 5vh;
  min-width: 6vh;
}
.button-block {
  padding-left: 15px;
  width: 28vw;
  display: flex;
  justify-content: center;
}
.button-block select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  height: 5vh;
  width: 50%;
  font-size: 1.5vw;
  margin-right: 5px;
}
</style>