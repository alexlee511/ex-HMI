<template>
  <div>
    <div class="header">
      <device-info-header>
        <slot name="header-button"></slot>
      </device-info-header>
    </div>
    <div class="content">
      <div style="display: flex;flex-direction: row;">
        <div style='width: 2vw;'/>
        <device-info-side v-if="full==false">
          <slot name="info-item"></slot>
        </device-info-side>
        <slot name="info-side"></slot>
        <div id="DEVICEINFO_CONTENT" class="DEVICEINFO_CONTENT" :Style='fullsy()'>
          <slot name="content"></slot>
        </div>
      </div>
    </div>
    <div class="footer">
    <device-info-footer></device-info-footer>
    </div>
  </div>
</template>

<script>
import DeviceInfoHeader from "./childComps/DeviceInfoHeader";
import DeviceInfoFooter from "./childComps/DeviceInfoFooter";
import DeviceInfoSide from "./childComps/DeviceInfoSide";

export default {
    props: {
        full: {
            type: Boolean,
            default: false,
        },  
    },
    data() {
		return {
		};
	},
    computed:{
        fullsy: function(){
            return function(){
                
                if(this.full){
                    return "width: 96vw;"
                }else{
                    return "width: 78vw;"
                }
            }
        },
    },
    components: {
        DeviceInfoHeader,
        DeviceInfoFooter,
        DeviceInfoSide,
    },
};
</script>

<style scoped>
.header {
  position: absolute;
  width: 100vw;
  height: 10vh;
}

.content {
  position: absolute;
  margin-top: 10vh;
  width: 100vw;
  height: 80vh;
}

.footer {
  position: absolute;
  margin-top: 90vh;
  width: 100vw;
  height: 10vh;
}
.DEVICEINFO_CONTENT {
  display: flex;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  height: 78vh;
  background: linear-gradient(rgba(33, 96, 184, 0.5), rgba(1, 255, 255, 0.5));
  border-radius: 10px;
  border-width: 1.5px;
  border-style: solid;
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
  border-left-style: none;
  border-right-style: none;
}
</style>