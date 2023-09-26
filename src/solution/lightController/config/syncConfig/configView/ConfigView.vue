<template>
  <div class="DEVICELIST_CONTENT">
    <div class="devicelist_view__title_item">
      <div style="width: 8vw" class="item_center">
        {{ $t("GENERAL.CONNECT_STATE") }}
      </div>
      <div style="width: 12vw">{{ $t("GENERAL.MODBUS_SLAVE") }}</div>
      <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_KIND") }}</div> -->
      <div style="width: 28vw">{{ $t("GENERAL.DEVICE_ID") }}</div>
      <div style="width: 35vw">{{ $t("GENERAL.DEVICE_SETTING_CONTROL") }}</div>
      <div style="width: 6vw">
        <!--修改-->
      </div>
      <div style="width: 6vw">
        <!--刪除-->
      </div>
    </div>
    <div class="outer-scroll_view">
      <div class="inner-scroll_view">
        <div class="scroll_view">
          <div class="devicelist_view__content_item" v-for="(item, index) of list" :key="index">
            <div style="width: 8vw" class="item_center">
              <!-- {{ item.img }} -->
              <img v-if="item.img == 'green'" class="item__toolicon" src="~assets/images/guard_lamp.png" @load="loadImage" />
              <img v-if="item.img == 'red'" class="item__toolicon" src="~assets/images/guard_lamp_r.png" @load="loadImage" />
            </div>
            <div style="width: 12vw">{{ getSlave(item) }}</div>
            <!-- <div style="width: 18vw">{{ $t("GENERAL.DEVICE_KIND") }}</div> -->
            <div style="width: 28vw">{{ nameList[item.deviceid] || item.deviceid }}</div>
            <div style="width: 35vw">
              <img
                src="~assets/images/arrow_down_03.png"
                style="width: 3vw"
                @click="showItemClick(index)"
              />
              {{ $t('GENERAL.SUB_DEVICE') }} {{ item.quantity }}
              <div class="item-select" :style="activeShow == index && 'max-height: 500px'">
                <div v-for="(itemx, indey) in item.subid_list" :key="indey" style="margin-bottom: 12px">
                  {{ nameList[itemx] || itemx }}
                </div>
              </div>
            </div>
            <div style="width: 6vw; padding-right: 0px" @click="clickSync">
              <img class="item__toolicon" src="~assets/images/sync.png" />
            </div>
            <div style="width: 6vw; padding-right: 0px" @click="goChange(item)">
              <img class="item__toolicon" src="~assets/images/modify.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSubdevice
} from "network/scence"
import {
  getDeviceData,
  getDeviceInfo
} from "network/solution"
import {updateProfile , getDevList } from "common/constant/profile"
export default {
  data() {
    return {
      list: [],
      nameList: [],
      devList: [],
      activeShow: null,
      image: 0,
      lamp: require("@/assets/images/guard_lamp.png"),
      redLamp: require("@/assets/images/guard_lamp_r.png"),
      async: false,
    }
  },
  async mounted() {
    this.nameList = this.$store.state.deviceName;
    const { device } = await getDeviceInfo()
    this.devList = device
    this.getSubDevice()
  },
  beforeDestroy() {
  },
  methods: {
    loadImage() {
      // this.image = this.image + 1
      // //console.log(this.image)
      // if(this.image == this.list.length && this.async == true) {
      //   this.$nextTick(() => {
      //     alert("同步成功")
      //   })
      // }
    },
    goChange(item) {
      let path = this.$route.path.replace(/configView/i, "changeConfig");
      this.$router.push({
        path: path,
        query: {
          devId: item.deviceid,
        },
      });
    },
    getSlave(item) {
      // //console.log(this.devList)
      const dev = this.devList.find(itemx => {
        return itemx.dev_id == item.deviceid
      })
      return dev.slave_id
    },
    showItemClick(index) {
      this.activeShow = index
    },
    async getSubDevice() {
       await updateProfile() 
       const res = await getDevList('L5-BSRS001')
       //console.log(res)
       const newList = []
       for(let item of res){
           let tmp = {}
           tmp.deviceid     =  item.dev_id
           tmp.quantity     =  item.sub_list.length
           tmp.subid_list   =  []
           for(let sub of item.sub_list){
               tmp.subid_list.push(sub.sub_id)
           }
           tmp.img          = null 
           newList.push(tmp)
       }
       this.list = newList
      const getList = async() => {
        for(let item of this.list) {
          await getDeviceData(item.subid_list[0]).then(res => {
            
            if(res.connect_status == 1) {
              item.img = "green";
            } else {
              item.img = "red";
            }
          })
        }
      } 
      
      await getList()
      
    },
    async clickSync(item) {
      // this.image = 0
      // this.async = true
      await this.getSubDevice(item.deviceid)
      
      setTimeout(() => {
        alert("success")
      }, 100)
    }
  },
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
  color: #01ffff;
  font-size: 2.5vw;
}

.devicelist_view__title_item div {
  text-align: center;
}

.devicelist_view__content_item {
  display: flex;
  width: 100vw;
  align-items: self-end;
  font-size: 2vw;
}
.devicelist_view__content_item div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.item-select {
  margin-bottom: 12px; 
  max-height: 0; 
  transition: all 0.5s;
}

.scroll_view,
.outer-scroll_view {
  width: 100vw;
  height: 60vh;
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
</style>