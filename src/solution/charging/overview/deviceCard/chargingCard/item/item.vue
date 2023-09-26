<template>
    <div class = 'main'  Style="width: 100%; height: 100%; left: 0%; top: 0%;">
        <div class="slaveL"          Style="width: 90%     ; height: 80%  ; left: 5%   ; top: 0%  ; " >
            <div class="slaveL unit _24"          Style="width: 100%     ; height: 20%  ; left: 0%   ; top: 0%  ;  "   >{{itemInfo.name}}</div>
            <div class="slaveC text _60"          Style="width: 100%     ; height: 5%   ; left: 0%   ; top: 20%  ; font-size: 4vw;"  >{{abs(itemInfo.value)}}</div>
            <div class="slaveR unit _24"          Style="width: 20%     ; height: 20%   ; left: 70%   ; top: 80%  ; " >{{itemInfo.unit}}</div>
        </div>
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

<style scoped>

</style>