<template>
    <div class = 'main'  Style="width: 100%; height: 100%; left: 0%; top: 0%;">
        <img class="slaveC c3 _60"      Style="width: 100%   ; height: 15%  ; left: 0% ; top: 5%  ; " src="~assets/images/motor_info.png" alt="" /> 
        <div class="slaveL title _24"   Style="width: 100%     ; height: 5%  ; left: 5%   ; top: 20%  ; " ref = "titleName">-</div>
        <div class="slaveL"          Style="width: 90%     ; height: 17%  ; left: 5%   ; top: 25%  ; " >
            <div class="slaveL unit _24"          Style="width: 100%     ; height: 20%  ; left: 0%   ; top: 0%  ; "   ref = "X_NAME" >-</div>
            <div class="slaveC text _60"          Style="width: 100%     ; height: 5%   ; left: 0%   ; top: 20%  ; "  ref = "X_VALUE">-</div>
            <div class="slaveR unit _24"          Style="width: 20%     ; height: 20%   ; left: 70%   ; top: 80%  ; " ref = "X_UNIT" >-</div>
        </div>
        <div class="slaveL"          Style="width: 90%     ; height: 17%  ; left: 5%   ; top: 42%  ; " >
            <div class="slaveL unit _24"          Style="width: 100%     ; height: 20%  ; left: 0%   ; top: 0%  ; "  ref = "Y_NAME" >-</div>
            <div class="slaveC text _60"          Style="width: 100%     ; height: 5%   ; left: 0%   ; top: 20%  ; " ref = "Y_VALUE">-</div>
            <div class="slaveR unit _24"          Style="width: 20%     ; height: 20%   ; left: 70%   ; top: 80%  ; "ref = "Y_UNIT" >-</div>
        </div>
        <div class="slaveL"          Style="width: 90%     ; height: 17%  ; left: 5%   ; top: 59%  ; " >
            <div class="slaveL unit _24"          Style="width: 100%     ; height: 20%  ; left: 0%   ; top: 0%  ; "   ref = "Z_NAME" >-</div>
            <div class="slaveC text _60"          Style="width: 100%     ; height: 5%   ; left: 0%   ; top: 20%  ; "  ref = "Z_VALUE">-</div>
            <div class="slaveR unit _24"          Style="width: 20%     ; height: 20%   ; left: 70%   ; top: 80%  ; " ref = "Z_UNIT" >-</div>
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
                    case "800501":
                        this.$refs["X_NAME"].innerHTML  = item.name
                        this.$refs["X_VALUE"].innerHTML = item.value
                        this.$refs["X_UNIT"].innerHTML  = item.unit
                        break;
                    case "800502":
                        this.$refs["Y_NAME"].innerHTML  = item.name
                        this.$refs["Y_VALUE"].innerHTML = item.value
                        this.$refs["Y_UNIT"].innerHTML  = item.unit
                        break;
                    case "800503":
                        this.$refs["Z_NAME"].innerHTML  = item.name
                        this.$refs["Z_VALUE"].innerHTML = item.value
                        this.$refs["Z_UNIT"].innerHTML  = item.unit
                        break;
                }
            }
        }
        
    },
};
</script>

<style scoped>

</style>