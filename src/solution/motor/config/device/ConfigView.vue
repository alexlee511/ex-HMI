<template>
    <div class="main" :Style="stylerwd()">
        <div class="slaveM" :Style="stylerwd('100','15','0' ,'0')">
            <div class="slaveC title_item _60" :Style="stylerwd('40','100','0' ,'0')"> {{ $t("GENERAL.DEVICE_NAME") }}</div>
            <div class="slaveC title_item _60" :Style="stylerwd('40','100','40' ,'0')">{{ $t("GENERAL.DEVICE_KIND") }}</div>
        </div>
        <div class="slaveM" :Style="stylerwd('100','85','0' ,'15')">
            <div class="slaveM" v-for="(item, index) in virtualList" :key="index" :Style="stylerwd('100','15','0' ,`${index}` , '1')">
                    <div class="slaveC  _48" :Style="stylerwd('40','100','0' ,'0' )" :class="classwd(item)">{{ configList[item].deviceName }}</div>
                    <div class="slaveC  _48" :Style="stylerwd('40','100','40','0' )" :class="classwd(item)">{{ configList[item].complex.length }}</div>
                    <img class="slaveC     " :Style="stylerwd('5' ,'80' ,'80','10')" src="~assets/images/modify.png" @click="goChange(item)"     />
                    <img class="slaveC     " :Style="stylerwd('5' ,'80' ,'90','10')" src="~assets/images/remove.png" @click="deleteDevice(item)" />
            </div>
        </div>
    </div>
</template>

<script>
import { show_config , change_config , true_config  , Delsetting , restart , del_config , add_config} from "../../data/ston/data";
import { complexSet , complexDel } from "network/gateway";
import { updateProfile } from "common/constant/profile";
import { updateAttr } from "common/constant/attribute";
import { setNameData } from "network/setConfig";

export default {
    data() {
        return {
            virtualList: [],
            configList: [],
        };
    },
    mixins: [],
    async created() {
        //馬達設定屬性表刷新
        updateAttr(this.$store.state.backData.back_lang)
        this.virtualList = show_config
        this.configList = true_config
        
    },
    computed:{
        classwd: function(){
            return function(item){
                if( change_config.indexOf(item.deviceId) !== -1){
                    return 'change_item' ;
                }else{
                    return 'text_item' ;
                }
            }
        },
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
        this.$bus.$off("previousPage");
    },
    methods: {
        async add(){
            //套用
            this.$store.commit("setLoadingState");
            let dellist = []
            for(let item of del_config){
                if(item.length >= 20){
                    dellist.push(item);
                }
            }
            let plan_name = 'motor';
            if( dellist.length!= 0){
                await complexDel(dellist.join(','))
            }
            let nameObj = {}
            for(let item of add_config){
                let data = true_config[item];
                let page_name = {}
                for(let devlist of data.complex){
                    if(page_name[devlist.page_type] == undefined){
                        page_name[devlist.page_type] = [];
                    }
                    page_name[devlist.page_type].push(devlist.deviceId)
                }
                for(let tmp of Object.keys(page_name)){
                    page_name[tmp] = page_name[tmp].join(',')
                }
                if(item.length >= 20){
                    await complexSet(plan_name , ['vibration','power','scence'].join(',') , page_name , data.deviceName , item)
                }else{
                    await complexSet(plan_name , ['vibration','power','scence'].join(',') , page_name , data.deviceName)
                }
            
                nameObj[data.deviceId] = data.deviceName;
            }
            setNameData(nameObj);
            await updateProfile()
            this.$store.commit("setLoadingState");
            await this.$store.dispatch("getSolutionData")
            
        },
        deleteDevice(item) {
            Delsetting(item)
            //刪除
        },
        goChange(item) {
            let path = this.$route.path.replace(/configView/i, "ChangeConfig")
            // //console.log(path)
            this.$router.push({
                path: path,
                query: {
                    devId: item,
                },
            });
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