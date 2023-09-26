<template>
  <swiper-slide class="main" :style='stylerSize()'>
    <div class="slaveL light_grey" :style='stylerSize(80,10,5,2)'>
      <slot name="top">{{translation(itemInfo.name)}}</slot>
    </div>
    <div class="slaveC yellow" :style='stylerSize(100,40,0,12)' name="textfill">
      <card-font-div :text="itemInfo.value" name="center"/>
    </div>
    <div class="slaveR light_grey" :style='stylerSize(10,10,85,38)'>
      <slot name="bottom">{{itemInfo.unit}}</slot>
    </div>
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
  },
  created(){
    console.log(this.itemInfo)
  },
  methods: {
  }
};
</script>
