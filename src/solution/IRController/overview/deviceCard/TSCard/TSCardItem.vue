<template>
  <swiper-slide class="main" :style='stylerSize()'>
    <div class="slaveL light_grey" :style='stylerSize(40,10,5,2)'>
      <slot name="top">{{ translation(itemInfo.name) }}</slot>
    </div>
    <div class="slaveC _70 yellow" :style='stylerSize(100,40,0,12)' name="textfill">
      <slot id="500900" style="white-space: nowrap; " name="center">{{itemInfo.value}}</slot>
    </div>
    <div class="slaveR light_grey" :style='stylerSize(10,10,85,38)'>
      <slot name="bottom">{{ itemInfo.unit }}</slot>
    </div>
  </swiper-slide>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  props: {
    itemInfo: {
      type: Object,
      default: {}
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
    };
  },
  created() {
      
  },
  mounted() {
  },
  methods: {
  },
};
</script>
