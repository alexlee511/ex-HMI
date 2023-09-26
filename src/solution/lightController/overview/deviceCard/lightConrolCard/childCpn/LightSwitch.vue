<template>
  <div class="content" ref="card" @click="itemClick">
    <div
      style="
        position: absolute;
        left: 50%;
        top: 58%;
        transform: translate(-50%, -50%) scale(1.1);
        color: white;
        user-select: none;
      "
    >
      <img src="~assets/images/light_status_bg.png" />
    </div>
    <div
      style="
        position: absolute;
        left: 50%;
        top: 58%;
        transform: translate(-50%, -50%);
        color: white;
        user-select: none;
      "
    >
      <img name="light_status" src="~assets/images/light_status_on.png" />
    </div>
    <div
      style="
        position: absolute;
        left: 50%;
        top: 58%;
        transform: translate(-50%, 40%);
        color: white;
        user-select: none;
      "
    >
      <div id="percent_value" style="font-size: 25px">
        {{lightSwitch == "1"? "ON": "OFF"}}
      </div>
    </div>
  </div>
</template>

<script>
import { controlDevice } from "network/control"
import { mapState } from "vuex"

export default {
  props: {
    control: {
      type: Object,
      default() {
        return {}
      }
    },
    itemInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      lightSwitch: "0",
    };
  },
  computed: {
    ...mapState({
      deviceControlList: (state) => state.deviceCommand.deviceControlList
    })
    // lightValue: {
    //   get() {
    //     return this.data.length && this.data.find(item => item.id == '101000').value
    //   },
    // }
  },
  methods: {
    async itemClick() {
      // 發射事件 暫停計時器
      this.$emit("changeValue")
      let target_id = Object.values(this.deviceControlList[this.itemInfo.deviceId])[0].target_id;
      this.$store.commit("setLoadingState");
      if(this.lightSwitch == "1") {
        const res = await controlDevice(target_id, this.control.writeCmd, this.getCAV("0") , this.getCAV("0") .split('_')[1])
        this.$store.commit("setLoadingState");
        //console.log(res)
        // if(res.status == "fail") return alert('fail')
        this.lightSwitch = "0"
        //console.log('關')
      } else {
        const res = await controlDevice(target_id, this.control.writeCmd, this.getCAV("1") , this.getCAV("1") .split('_')[1])
        this.$store.commit("setLoadingState");
        //console.log(res)
        // if(res.status == "fail") return alert('fail')
        this.lightSwitch = "1"
        //console.log('開')
      }
    },
    getCAV(params) {
      const { value } = this.control.value_list.find(item => item.value == params)
      const cav = `${this.control.channel}_${this.control.attrId}_${value}`
      return cav
    }
  },
  watch: {
    data: {
      handler: function() {
        this.lightSwitch = this.data.length && this.data.find(item => item.id == '101000')?.value
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.content {
  font-size: 30px;
  font-weight: bold;
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  height: 100%;
}
.svg {
  width: 100%;
  height: 100%;
  position: relative;
  top: 13px;
}
</style>