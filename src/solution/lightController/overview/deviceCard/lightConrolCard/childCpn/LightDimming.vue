<template>
  <div class="content" ref="card">
    
    
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
        <div ref="rotate"><img name="light_arrow" src="~assets/images/light_value_arrow.png" /></div>
    </div>
    
    <div
      style="
        position: absolute;
        left: 25%;
        top: 83%;
        transform: translate(-75%, -15%);
        color: white;
        user-select: none;
      "
    >
      <img src="~assets/images/di_status_off.png" style="zoom: 0.35" />
    </div>
    <div
      style="
        position: absolute;
        left: 75%;
        top: 83%;
        transform: translate(-25%, -15%);
        color: white;
        user-select: none;
      "
    >
      <img src="~assets/images/di_status_on.png" style="zoom: 0.3" />
    </div>
    <div
      class="svg"
      ref="svg"
      @mousedown="start($event)"
      @mousemove="move($event)"
      @mouseup="end($event)"
      @mouseleave="leave"
      @touchstart="start($event)"
      @touchmove="move($event)"
      @touchend="end($event)"
      @touchcancel="leave"
    >
      <aperture :lightValue="lightValue" :arr="$refs" />
    </div>
    <div class="bont" style="left: 25%;top: 29%;right: 25%;bottom: 15%;"><img src="~assets/images/light_status_bg.png" @click = "test__"/></div>
    <div v-if="lightValue> 0" class="bont" style="left: 35%;top: 35%;right: 35%;bottom: 23%;"><img src="~assets/images/light_status_on.png" @click = "test__"/></div>
    <div v-if="lightValue==0" class="bont" style="left: 35%;top: 35%;right: 35%;bottom: 23%;"><img src="~assets/images/light_status_off.png" @click = "test__"/></div>
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
      <div id="percent_value" style="font-size: 25px" @click = "test__">
        {{ control.value_list[lightValue] && control.value_list[lightValue].name }}
      </div>
    </div>
  </div>
</template>
<script>
import { controlDevice } from "network/control"
import Aperture from "./aperture/Aperture";

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
  components: {
    Aperture,
  },
  data() {
    return {
      lightSwitch: "0",
      lightValue: 0,
      state: 0,
      avg : 27 ,
      last : 0
    };
  },
  created() {
    const lightValue = this.data.length && this.data.find(item => item.id == '100800')?.value
    for(let i=0; i <= this.control.value_list.length; i++) {
      if(Number(lightValue) <= Number(this.control.value_list[i].value)) {
        this.lightValue = i
        return
      }
    }
    // //console.log(a)
  },
  computed: {
    ...mapState({
      deviceControlList: (state) => state.deviceCommand.deviceControlList
    })
  },
  methods: {
    start(e) {
      this.state = 1;
      this.last = this.lightValue;
      this.move(e);
    },
    test__(){
        //console.log(this.flag)
        //有燈變成第一個 ，無燈變成最後一個
        this.last = this.lightValue;
        let tmp = this.lightValue;
        if(this.lightValue > 0){
            this.lightValue = 0 ;
            let deg = this.lightValue * 27;
            //this.$refs.rotate.style.transform = `rotate(${deg}deg)`
            //this.gogopower(this.lightValue , -1 , 0)
            this.changeValue(0)
        }else{
            //this.gogopower(this.lightValue , 1 , 10)
            this.lightValue = 10 ;
            let deg = this.lightValue * 27;
            //this.$refs.rotate.style.transform = `rotate(${deg}deg)`
            this.changeValue(10)
        }
    },
    async gogopower(tmp , move , end){
        tmp = tmp + move ;
        
        
        if(tmp == end){
            return
        }
        setTimeout(()=>{this.gogopower(tmp , move , end)},50);
    },
    move(e) {
      if (this.state != 1) return;
      var circle = this.$refs.svg;
      // 計算圓心距離瀏覽器距離
      var centerX =
        circle.getBoundingClientRect().left + circle.offsetWidth / 2;
      var centerY =
        circle.getBoundingClientRect().top + circle.offsetHeight / 2;

      // 觸控點距離瀏覽器距離
      var getX = e.clientX || e.touches[0].pageX;
      var getY = e.clientY || e.touches[0].pageY;

      // 計算觸控點距離圓心的兩條值角邊距離
      let x = getX - centerX;
      let y = getY - centerY;

      // 計算角度
      let nowReg = Math.atan2(y, x) * (180 / Math.PI) + 180;

      // 判斷各角度區域 總共有 0~10 11級 | 對應 0 ~ 100% | 310度~ 230度 總共 270度 一個區域 27 度  最大360度
      switch (true) {
        case nowReg >= this.handelAngle(270) &&
          nowReg < this.handelAngle(310 + 27): // 0%
          this.lightValue = 0;
          // //console.log(this.lightValue);
          break;
        case (nowReg >= this.handelAngle(310 + 27) && nowReg <= 360) ||
          nowReg < this.handelAngle(310 + 27 * 2):
          this.lightValue = 1;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 2) &&
          nowReg < this.handelAngle(310 + 27 * 3):
          this.lightValue = 2;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 3) &&
          nowReg < this.handelAngle(310 + 27 * 4):
          this.lightValue = 3;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 4) &&
          nowReg < this.handelAngle(310 + 27 * 5):
          this.lightValue = 4;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 5) &&
          nowReg < this.handelAngle(310 + 27 * 6):
          this.lightValue = 5;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 6) &&
          nowReg < this.handelAngle(310 + 27 * 7):
          this.lightValue = 6;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 7) &&
          nowReg < this.handelAngle(310 + 27 * 8):
          this.lightValue = 7;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 8) &&
          nowReg < this.handelAngle(310 + 27 * 9):
          this.lightValue = 8;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 9) &&
          nowReg < this.handelAngle(310 + 27 * 10):
          this.lightValue = 9;
          // //console.log(this.lightValue);
          break;
        case nowReg >= this.handelAngle(310 + 27 * 10) && nowReg < 270:
          this.lightValue = 10;
          // //console.log(this.lightValue);
          break;
      }
      //let deg = this.lightValue * 27
      //this.$refs.rotate.style.transform = `rotate(${deg}deg)`
    },
    end(e) {
      if(this.state == 1) {
        //console.log("啟動函數end")
        this.changeValue(this.lightValue)
      }
      this.state = 0;
    },
    leave() {
      if(this.state == 1) {
        //console.log("啟動函數leave")
        this.changeValue(this.lightValue)
      }
      this.state = 0;
    },
    async changeValue(Value) {
        this.$emit("changeValue")
        this.$store.commit("setLoadingState");
        let target_id = Object.values(this.deviceControlList[this.itemInfo.deviceId])[0].target_id;
        const res = await controlDevice(target_id, this.control.writeCmd, this.getCAV(Value) , this.getCAV(Value).split('_')[1])
        //console.log(res)
        this.$store.commit("setLoadingState");
        if(res.status == "fail") {
            this.lightValue = this.last;
            let deg = this.lightValue * this.avg ;
            this.$refs.rotate.style.transform = `rotate(${deg}deg)` ;
            return this.$notify({
			type: 'error',
			title: this.$t("GENERAL.CONTROL_FAIL"),
			message: res.err.msg,
            })
        
        }
    },
    getCAV(params) {
      const cav = `${this.control.channel}_${this.control.attrId}_${this.control.value_list[params].value}`
      return cav
    },
    handelAngle(value) {
      // 給予初始值
      let newValue = value;
      function getValue(value) {
        if (value - 360 > 0) {
          // 判斷減去360是否為負
          value = value - 360;
          getValue(value);
        } else {
          newValue = value;
        }
      }
      getValue(newValue);
      return newValue;
    },
  },
  watch: {
    data: {
      handler: function() {
        if(this.state ==1 )return;
        const lightValue = this.data.length && this.data.find(item => item.id == '100800')?.value
        for(let i=0; i <= this.control.value_list.length; i++) {
          if(Number(lightValue) <= Number(this.control.value_list[i].value)) {
            this.lightValue = i
            let deg = i * this.avg ;
            //this.$refs.rotate.style.transform = `rotate(${deg}deg)` ;
            return
          }
        }
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
.bont{
    position: absolute;
    color: white;
    user-select: none;
    overflow: hidden;
    display: flex;
    justify-content: center; 
    align-items: center; 
}
</style>