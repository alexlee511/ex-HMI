<template>
  <swiper-slide style="height: 100%">
    <div class="incardflex">
      <div class="incardporp devcard__devattrname">
        <slot name="top">{{ translation(itemInfo.name) }}</slot>
      </div>
      <div name="textfill" class="devcard_attrval_textfill">
        <div
          id="500900"
          class="incardporp devcard__devattrvalue"
          style="white-space: nowrap; font-size:4vw;"
        >
        <slot name="center">{{itemInfo.value}}</slot>
        </div>
      </div>
      <div class="cardprop devcard__devattrunit">
        <slot name="bottom">{{ itemInfo.unit }}</slot>
      </div>
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
  created() {
  },
  methods: {
  }
};
</script>

<style scoped>
.incardflex {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 90%;
  margin: auto;
  margin-top: 5px;
}
.incardprop {
  flex: 1;
}
.devcard___devtype_icon_view {
  position: absolute;
  bottom: 2vh;
  left: 3vw;
  opacity: 0.8;
}

.devcard___devtype_icon {
  height: 5vh;
}

.devcard__irc__basic_view {
  height: 6vh;
  width: 90%;
  display: flex;
  z-index: 1;
}

.devcard__irc__temp_view {
  height: 6vh;
  width: 8vw;
  background-color: #494949;
  border-radius: 1vh;
  margin: 0vw 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
}

.irc_temp_control_icon {
  height: 4vh;
}

.devcard__irc__modebar {
  display: flex;
  width: 90%;
  height: 6vh;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.devcard__irc__modebar__icon {
  width: 5.5vh;
}

.devcard_attrval_textfill {
  height: 10vh;
  width: 20vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.devcard__devattrvalue {
  color: #ffff33;
  display: flex;
  align-items: center;
}
.devcard__devattrname {
  width: 90%;
  height: 2.5vh;
  text-align: left;
  color: #c9c9c9;
  font-size: 2vh;
}
.devcard__devattrunit {
  /* width: 90%; */
  height: 2.5vh;
  text-align: right;
  color: #c9c9c9;
  font-size: 2vh;
}
</style>