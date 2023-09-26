<template>
  <swiper-slide class="main" :style='stylerSize()'>

    <div class="slaveL light_grey" :style='stylerSize(50,10,5,2)'>
      <slot name="top">{{translation(itemInfo.name)}}</slot>
    </div>

    <div
      class="slaveC _70 yellow" :style='stylerSize(100,40,0,12)'
      name="textfill"
    >
      <slot :style="(itemInfo.attr == '602405' || itemInfo.attr == '602402' || itemInfo.attr == '103800')
        && 'font-size: 2.5vw;'" name="center">
        {{itemInfo.value}}
      </slot>
    </div>

    <div class="slaveR light_grey" :style='stylerSize(18,10,78,38)'>
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
  methods: {
  }
};
</script>