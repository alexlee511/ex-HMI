<template>
    <div class="main" :Style="stylerwd()">
        <div class="slaveM" :Style="stylerwd('100','15','0' ,'0')">
            <div class="slaveC title_item _60" :Style="stylerwd('40','100','0' ,'0')"> {{ $t("GENERAL.DEVICE_NAME") }}</div>
            <div class="slaveC title_item _60" :Style="stylerwd('40','100','40' ,'0')">{{ $t("GENERAL.DEVICE_KIND") }}</div>
        </div>
        <div class="slaveM" :Style="stylerwd('100','85','0' ,'15')">
            <div class="slaveM" v-for="(item, index) in virtualList" :key="index" :Style="stylerwd('100','15','0' ,`${index}` , '1')">
            </div>
        </div>
    </div>
</template>

<script>
import { complexSet , complexDel } from "network/gateway";
import { updateProfile } from "common/constant/profile";
export default {
    data() {
        return {
            virtualList: [],
            configList: [],
        };
    },
    mixins: [],
    async created() {
        
    },
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                if(f=='0'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
                }else if(f=='1'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+ t * 15+"%;"; 
                }
                return tmp 
            }
        }
    },
     mounted() {
        this.$bus.$on("configApply", () => {
            this.add();
            
        });
        this.$bus.$on("previousPage", () => {
            restart();
            //重製
        });
    },
    beforeDestroy() {
        this.$bus.$off("configApply");
    },
    methods: {
        async add(){
            //套用
            this.$store.commit("setLoadingState");
            this.$store.commit("setLoadingState");
            await this.$store.dispatch("getSolutionData")
            
        },
    },
};
</script>

<style scoped>
@import "~assets/css/cardItem.css";
.title_item {
    color: #01ffff;
}
.text_item {
    color: #ffffff;
}
.change_item {
    color: #ffff33;
}
</style>