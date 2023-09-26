<template>
  <div class="content__devcard">
    <div class="content__devcard__view">
      <span class="devcard__devname">
      </span>
      <div class="devcard__devattr__carousel">
        <div class="swiper" style="height: 50%"></div>
        <swiper
          class="swiper swiper-no-swiping"
          style="height: 100%; position: absolute"
          :options="swiperOption"
          ref="mySwiper">
          <slot name="card">
            <card-item :item-info="itemInfo"></card-item>
          </slot>
        </swiper>
        <span class="devcard__devslaveid--right">
          {{ time }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CardItem from "./ContextCardItem"

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    CardItem,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOption: {
        spaceBetween: 5,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          // circular: true,
          bulletClass: "my-bullet",
          bulletActiveClass: "my-bullet-active",
        },
      },
      data: {},
      time: null,
      isAttrStatus: false,
    };
  },
  async created() {
  },
  methods: {
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper;
    },
  },
  watch: {},
};
</script>
