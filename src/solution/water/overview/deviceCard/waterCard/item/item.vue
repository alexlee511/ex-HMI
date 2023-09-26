<template>
    <div class = 'main' :style='stylerSize()'>
        <div class="slaveL light_grey" :style='stylerSize(50,10,5,2)' >{{itemInfo.name}}</div>
        <div class="slaveC _70 yellow" :style='stylerSize(100,40,0,13)'>{{itemInfo.value}}</div>
        <div class="slaveR light_grey" :style='stylerSize(15,10,80,39)'>{{itemInfo.unit}}</div>
    </div>  
</template>
<script>
import "swiper/css/swiper.css";
export default {
    props: {
        itemInfo: {
            type: Object,
            default: {}
        }
    },
    components: {
    },
    created() {  
    },
    methods: {
    },
    watch: {
    },
};
</script>
