<template>
  <swiper-slide class="main" :style='stylerSize()'>
    <div class="slaveL light_grey _24" :style='stylerSize(80,10,5,2)'>{{translation(itemInfo.name)}}</div>
      <card-font-div :cssClass="'slaveC text_center yellow'" :style='stylerSize(100,40,0,12)' :text="itemInfo.value" name="center"/>
    <div class="slaveR light_grey _24" :style='stylerSize(10,10,85,38)'>{{itemInfo.unit}}</div>
  </swiper-slide>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
};
</script>
