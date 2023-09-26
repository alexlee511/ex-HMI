<template>
    <div class="main" :style="stylerwd()">
        <div class="slaveL background_01" :style="stylerwd('90','90','5','5')"> 
             <div class="slaveC" :Style="stylerwd('90','15','5','5')">
                <div class="slaveC title _60" :style="stylerwd('35','100','0','20')">{{ $t("GENERAL.SOLUTION_SELECT") }}</div>
                <select class="slaveL title _60 selectMain" :style="stylerwd('55','70','37','20')" v-model="selectData">
                    <option class='selectItem' v-for="(solu, i) in soluSelectList" :key="solu.i" :value="solu.i">{{ $t(solu.soluitem) }}</option>
                </select>
             </div>
             <div class="slaveL" :style="stylerwd('45','75','5','18')">
                <div class="slaveC light_blue _60" :style="stylerwd('100','20','0','5')">{{ $t("GENERAL.ENABLE") }}</div>
                <draggable class="slaveC _60 draggableMain" :style="stylerwd('95','80','2.5','20')" :list="temp_enableList[selectData]" group="analysisSetting" @change="forcechange">
                    <div class="slaveC _60 draggablebutton" :style="stylerwd('80','20','10',5 + 25 * i)" v-for="(element, i) in temp_enableList[selectData]" >
                            {{ $t("GENERAL."+element.anaitem)  }}                     
                    </div>
                </draggable>
             </div>

             <div class="slaveL" :style="stylerwd('45','75','50','18')">
                <div class="slaveC red _60" :style="stylerwd('100','20','0','5')">{{ $t("GENERAL.DISABLE") }}</div>              
                <draggable class="slaveL draggableMain" :style="stylerwd('95','80','2.5','20')" :list="temp_disableList[selectData]" group="analysisSetting" @change="forcechange">
                     <div class="slaveC _60 draggablebutton" :style="stylerwd('80','20','10',5 + 25 * i)" v-for="(element, i) in temp_disableList[selectData]"  >
                             {{ $t("GENERAL."+element.anaitem) }}       
                     </div>
                 </draggable>       
             </div>
               
        </div>
    </div>

</template>

<script>
import draggable from "vuedraggable"

import { complexSet , complexDel } from "network/gateway";

import { setAnaSettingord } from "network/solution";

export default {
    components: {
        draggable,
    },
    data() {
        return {
            selectData: "energy",
            totalList:{},
            soluSelectList:[],     
            i: 0,
            temp_enableList: {},
            temp_disableList: {},
        };
    },
    
    mixins: [],
    async created() {
        let check = 0
        //console.log(this.$store.state.backData.solutionEnable)
        for(let key of Object.keys(this.$store.state.overview.button)){
            for(let features of this.$store.state.overview.button[key].features){
                console.log(key)
                //判斷是不是分析
                if(features.type != "Advanced"){
                    continue
                }
                //判斷有沒有sub
                if(features.sub == undefined){
                    continue
                }
                //判斷該方案有沒有啟用
                if(this.$store.state.backData.solutionEnable.indexOf(key) == -1){
                    continue
                }
                this.soluSelectList.push( {
                    soluitem:this.$store.state.overview.button[key].name,
                    i: key,
                })
                //分成啟用與不啟用兩個List
                this.totalList[key] = {
                    enablelist  : [
                    ],
                    disablelist : [
                    ]
                }
                let enable_flag = 0
                let disable_flag = 0
                this.temp_enableList[key] = []
                this.temp_disableList[key] = []
                for(let i of features.order){
                    this.temp_enableList[key].push({
                        i : enable_flag,
                        anaitem : i
                    })
                    this.totalList[key].enablelist.push({
                        i : enable_flag,
                        anaitem : i,
                    })
                    enable_flag ++ 
                }

                for(let i of features.sub){
                    for(let j of features.order){
                        if(i == j){
                            check += 1
                        }
                    }
                    if(check == 0){
                        this.temp_disableList[key].push({
                            i : disable_flag,
                            anaitem : i,
                        })
                        this.totalList[key].disablelist.push({
                            i : disable_flag,
                            anaitem : i,
                        })
                        disable_flag ++
                    }
                    check = 0
                }
            }
            
        }
        
        //console.log(this.soluSelectList)
        //console.log(this.totalList)
        //this.temp_enableList = this.totalList
        
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
        },

    },
     mounted() {
        this.$bus.$on("configApply", async() => {
            this.$store.commit("setLoadingState");
            await this.add();
            this.$store.commit("setLoadingState");
            
        });
        this.$bus.$on("previousPage", () => {
            //restart();
            
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
            //this.$store.state.overview.button[item]["features"][sub_index]["order"]
            let success_check = 0
            for( let solution_name of Object.keys( this.temp_enableList )){
                let count = this.temp_enableList[solution_name].length
                if(count == 0){
                    this.$notify({
                        type: 'info',
                        title: this.$t("GENERAL.NOTICE"),
                        message: this.$t("GENERAL.ERROR_MSG_021")
                    });
                    return
                }
                let enabletypelist = []
                for(let enabledict of this.temp_enableList[solution_name]){
                    //console.log(enabledict)
                    enabletypelist.push(enabledict.anaitem)
                }
                //console.log(enabletypelist);
                let item_list = enabletypelist.join(',');
                let res = await setAnaSettingord(solution_name, count, item_list);
                //console.log(res);

                for(let features of this.$store.state.overview.button[solution_name]["features"]){
                    if(features.type == "Advanced"){
                        features.order = enabletypelist
                    }
                }
                if(res["status"] == "ok"){
                    success_check += 1
                }
                
            }
            if(success_check != 0){
                this.$notify({
                    type: '',
                    title: this.$t("GENERAL.SUCCESS_TITLE"),
                    message: this.$t("GENERAL.DATA_SET_SUCCESS")
                });
            }
        },

        forcechange(){
            let tmp = this.selectData
            this.selectData = ""
            this.selectData = tmp
        },
    },
};
</script>