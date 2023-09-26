<template>
    <div class = 'main'  Style="width: 100%; height: 100%; left: 0%; top: 0%;">
        <img class="slaveC c3 _60"      Style="width: 100%   ; height: 15%  ; left: 0% ; top: 5%  ; " src="~assets/images/motor_info.png" alt="" /> 
        <div class="slaveL title _24"   Style="width: 100%     ; height: 5%  ; left: 5%   ; top: 20%  ; " ref = "titleName">-</div>
        <div class="slaveL"          Style="width: 90%     ; height: 17%  ; left: 5%   ; top: 25%  ; " >
            <div class="slaveL unit _24"          Style="width: 100%     ; height: 20%  ; left: 0%   ; top: 0%  ; "   ref = "T_NAME" >-</div>
            <div class="slaveC text _60"          Style="width: 100%     ; height: 5%   ; left: 0%   ; top: 20%  ; "  ref = "T_VALUE">-</div>
            <div class="slaveR unit _24"          Style="width: 20%     ; height: 20%   ; left: 70%   ; top: 80%  ; " ref = "T_UNIT" >-</div>
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
        itemInfo: function () {
            this.$refs["titleName"].innerHTML = this.itemInfo.deviceName
            if(this.itemInfo.ist.status == "fail")return;
            for(let item of this.itemInfo.ist.data ){
                switch(item.attr){
                    case "400100":
                        this.$refs["T_NAME"].innerHTML  = item.name
                        this.$refs["T_VALUE"].innerHTML = item.value
                        this.$refs["T_UNIT"].innerHTML  = item.unit
                        break;
                }
            }
        }
        
    },
};
</script>

<style scoped>

</style>