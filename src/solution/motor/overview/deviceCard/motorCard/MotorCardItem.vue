<template>
    <swiper-slide style="height: 100%">
        <Power  v-if="itemInfo.page_type=='power'" :item-info="itemInfo"></Power>
        <Sensor v-if="itemInfo.page_type=='scence'" :item-info="itemInfo"></Sensor>
    </swiper-slide>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import Power from "./item/Power";
import Sensor from "./item/Sensor";
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
        Power,
        Sensor
    },
    created() {
        //console.log("🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕🦕")
        //console.log(this.itemInfo)
            
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