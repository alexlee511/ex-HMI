<template>
  <div class="content__devcard" :style="isAttrStatus ? 'opacity: 0.4' : ''">
    <div class="content__devcard__view">
      <div class="devcard__devattr__carousel">
        <div class="font_01">
            <slot>{{ translation(itemInfo.Type) }}</slot>
        </div>
        <div class="font_04" >
            <div style="width:50%">
                <slot>{{ $t('VEN.STATE') }}{{ itemInfo.unit }}</slot>
            </div>
            <div style="width:50%">
                <slot>{{ $t('VEN.TIME') }}(分)</slot>
            </div>
        </div>
        <div class="font_05" >
            <div class="font_down">
                <slot>{{ translation(itemInfo.status) }}</slot>
            </div>
            <div class="font_down" >
                <slot>{{ translation(itemInfo.time) }}</slot>
            </div>
        </div>
        <div class="font_04" style="height:20%" >
            <div style="width:20%">
                    <img
                        class="devcard__toolicon"
                        src="~assets/images/chart.png"
                        @click="infoClick"
                    />
            </div>
            <div class="font_02" >
                <slot>{{ translation(itemInfo.planId) }}</slot>
            </div>
        </div>
        <div class="font_03" >
                <slot>{{ itemInfo.st }}</slot>
        </div>
        

      </div>
    </div>
  </div>
</template>

<script>
//import CardItem from "./VenCardItem";


import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";


export default {
  props: {
    itemInfo: {
      type: Object,
      default: {},
    },
  },
  components: {
    //CardItem,
    Swiper,
    SwiperSlide,
  },
  mixins: [],
  data() {
    return {
      swiperOption: {
        spaceBetween: 5,
        loop: true,
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
    translation(value) {
      return this.$t(`${value}`)
    },
    infoClick() {
      let deviceType = this.$route.path.split("/");
      this.$router.push({
        path: "/" + deviceType[2] + "/venInfo/deviceDetailed",
        query: { devId: this.itemInfo.venId },
      });
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper;
    },
  },
  watch: {},
};
</script>
<style scoped>
.font_01{
    width:100%;
    height: 28%;
    font-size:6.5vmin;
    text-align:center;
}
.font_02{
    font-size: 3vmin;
    width:80%;
    height:100%;
    line-height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    

}
.font_03{
    height: 20%;
    font-size: 3.2vmin;
    color : #eff624;
}
.font_04{
    width:100%;
    height: 5%;
    font-size:2.5vmin;
    display:flex;
    text-align:center
}
.font_05{
    width:100%;
    height: 30%;
    font-size: 8vmin;
    display:flex;
    text-align:center
}
.font_06{
    width:100%;
    height: 30%;
    font-size: 2vmin;
    display:flex;
    text-align:center
}
.font_down{
    width:50%;
    color : #eff624;
}
.unit{
    width:3%;
    font-size: 2vmin;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    display: flex;
}
</style>
