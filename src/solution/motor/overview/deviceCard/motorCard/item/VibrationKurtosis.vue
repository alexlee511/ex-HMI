<template>
    <div class = 'main'  Style="width: 100%; height: 100%; left: 0%; top: 0%;">
        <div class="slaveL title _24"  Style="width: 100%     ; height: 5%  ; left: 5%   ; top: 3%  ; " ref = "titleName">-</div>
        <div class="slaveL" Style="width: 90%     ; height: 22%  ; left: 5%   ; top: 7%  ; " >
            <div class="slaveL unit _24"      ref = "X_NAME"     Style="width: 100%  ; height: 5%    ; left: 0%   ; top: 0%  ; "   >-</div>
            <img class="slaveC c3 _60"                           Style="width: 60%  ; height: 70%   ; left: 20%   ; top: 25%  ; " src="~assets/images/kurt_dashboard.png" alt="" /> 
            <img class="slaveC  "        ref = "X_pointer"  Style="transform-origin:50% 88%; width: 7%  ; height: 70%   ; left: 46.5%   ; top: 25%  ; " src="~assets/images/kurt_dashboard_pointer.png" /> 
            <div class="slaveC unit  text_Ku" ref = "X_VALUE"    Style="width: 20% ; height: 15%; left: 40%   ; top: 98%  ; "  >-</div>
        </div>
        <div class="slaveL" Style="width: 90%     ; height: 22%  ; left: 5%   ; top: 35%  ; " >
            <div class="slaveL unit _24"      ref = "Y_NAME"     Style="width: 100%  ; height: 5%    ; left: 0%   ; top: 0%  ; "   >-</div>
            <img class="slaveC c3 _60"                           Style="width: 60%  ; height: 70%   ; left: 20%   ; top: 25%  ; " src="~assets/images/kurt_dashboard.png" alt="" /> 
            <img class="slaveC  "        ref = "Y_pointer"  Style="transform-origin:50% 88%; width: 7%  ; height: 70%   ; left: 46.5%   ; top: 25%  ; " src="~assets/images/kurt_dashboard_pointer.png"  /> 
            <div class="slaveC unit  text_Ku" ref = "Y_VALUE"    Style="width: 20% ; height: 15%; left: 40%   ; top: 98%  ; "  >-</div>
        </div>
        <div class="slaveL"  Style="width: 90%     ; height: 22%  ; left: 5%   ; top: 63%  ; " >
            <div class="slaveL unit _24"      ref = "Z_NAME"     Style="width: 100%  ; height: 5%    ; left: 0%   ; top: 0%  ; "   >-</div>
            <img class="slaveC c3 _60"                           Style="width: 60%  ; height: 70%   ; left: 20%   ; top: 25%  ; " src="~assets/images/kurt_dashboard.png" alt="" /> 
            <img class="slaveC  "        ref = "Z_pointer"  Style="transform-origin:50% 88%; width: 7%  ; height: 70%   ; left: 46.5%   ; top: 25%  ; " src="~assets/images/kurt_dashboard_pointer.png" /> 
            <div class="slaveC unit  text_Ku" ref = "Z_VALUE"    Style="width: 20% ; height: 15%; left: 40%   ; top: 98%  ; "  >-</div>
        </div>
    </div>  
</template>
<script>
import "swiper/css/swiper.css";
export default {
    data() {
        return {
            count:20
        }
    },
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
        async gogopower(val , add , tag , flag = 0 , end){
                val += add
                if(this.$refs.[tag] == undefined)return
                this.$refs.[tag].style.transform = `rotate(${val}deg)`
                flag ++;
                if(flag == end){
                    return
                }
                setTimeout(()=>{this.gogopower(val , add , tag , flag , end)},5 );
        },
        run(start , end , tag){
            if(start == NaN){
                this.$refs.[tag].style.transform = `rotate(${end}deg)`
                return
            }else if(start == end){
                this.$refs.[tag].style.transform = `rotate(${end}deg)`
                return
            }
            let add = ( end - start) / this.count
            this.gogopower(start ,add , tag , 0 , this.count)
            
        }
    },
    watch: {
        itemInfo: function () {
            let tmp = 0 ;
            let start ;
            // -90 = 0 , 90 = 8 
            // n - 4  * 22.5 
            
            this.$refs["titleName"].innerHTML = this.itemInfo.deviceName
            if(this.itemInfo.ist.status == "fail")return;

            for(let item of this.itemInfo.ist.data ){
                switch(item.attr){
                    case "405801":
                        start = (this.$refs["X_VALUE"].innerHTML - 4) * 22.5
                        this.$refs["X_NAME"].innerHTML  = item.name
                        this.$refs["X_VALUE"].innerHTML = item.value
                        tmp = (item.value - 4) * 22.5
                        if(tmp > 90) tmp = 90;
                        this.run(start , tmp , 'X_pointer')
                        // = `rotate(${tmp}deg)`
                        break;
                    case "405802":
                        start = (this.$refs["Y_VALUE"].innerHTML - 4) * 22.5
                        this.$refs["Y_NAME"].innerHTML  = item.name
                        this.$refs["Y_VALUE"].innerHTML = item.value
                        tmp = (item.value - 4) * 22.5
                        if(tmp > 90) tmp = 90;
                        this.run(start , tmp , 'Y_pointer')
                        break;
                    case "405803":
                        start = (this.$refs["Z_VALUE"].innerHTML - 4) * 22.5
                        this.$refs["Z_NAME"].innerHTML  = item.name
                        this.$refs["Z_VALUE"].innerHTML = item.value
                        tmp = (item.value - 4) * 22.5
                        if(tmp > 90) tmp = 90;
                        this.run(start , tmp , 'Z_pointer')
                        break;
                }
            }
        }
        
    },
};
</script>

<style scoped>
.text_Ku{
    border-style: solid;
    border-width: 1.5px;
    border-radius: 5px;
    width: 3vw;
    height: 2vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-color: #00cccc;
    color: #ffff33;
}

</style>