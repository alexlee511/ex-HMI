<template>
    <div class="main" :Style="stylerwd()">

        <div class="slaveC waterRate_Card" :Style="stylerwd('90','20','5','5')"> 
            <div class="slaveC title _40" :Style="stylerwd('20','70','15','30')">{{ $t("GENERAL.BASIC_PRICE")}}</div>
            <div><input class="slaveC text_item _40 tableborder disappearBar" :Style="stylerwd('30','60','33.3','20')" v-model="basicPrice" type="number" required/></div>
            <div class="slaveC title _40" :Style="stylerwd('20','70','60','30')">{{ $t("GENERAL.WATER_DOLLARS")}}</div>
        </div>
        <div class="slaveC waterRate_Card" :Style="stylerwd('90',(waterPriceList.length+1)*15,'5','30')"> 
            <div class="slaveC waterRate_Card" :Style="stylerwd('100',100/(waterPriceList.length+1),'0','0')">
                <div class="slaveC borderR" :Style="stylerwd('20','100','0','0')">
                <div class="slaveC title _40 text_center" :Style="stylerwd('100','100','0','0')">{{ $t("GENERAL.CLASS_MIN")}}</div>   
                </div>
                <div class="slaveC borderR" :Style="stylerwd('20','100','20','0')">
                <div class="slaveC title _40 text_center" :Style="stylerwd('100','100','0','0')">{{ $t("GENERAL.CLASS_MAX")}}</div>
                </div>
                <div class="slaveC borderR" :Style="stylerwd('20','100','40','0')">
                <div class="slaveC title _40 text_center" :Style="stylerwd('100','100','0','0')">{{ $t("GENERAL.PRICE_UNIT")}}</div>
                </div>
                <div class="slaveC borderR" :Style="stylerwd('20','100','60','0')">
                <div class="slaveC title _40 text_center" :Style="stylerwd('100','100','0','0')">{{ $t("GENERAL.PRICE_DIFF")}}</div>
                </div>
                <div class="slaveC" :Style="stylerwd('20','100','80','0')">
                <div class="slaveC title _40 text_center" :Style="stylerwd('100','100','0','0')">{{ $t("GENERAL.FUNCTION")}}</div>
                </div>
            </div>
            
            <div class="slaveC waterRate_Card" :Style="stylerwd('100',(100/(waterPriceList.length+1)),'0',(100/(waterPriceList.length+1))+i*(100/(waterPriceList.length+1)))" v-for="(row, i) in waterPriceList" :key="row.id">
            
                <div class="slaveR text_item _40 tableborderRB tableborderL" :Style="stylerwd('20','100','0','0')">
                <input class="slaveR text_item _40 tableborder disappearBar" :Style="stylerwd('80','80','10','10')" v-model="row.classMin" type="number" />
                </div>
                <div class="slaveR text_item _40 tableborderRB" :Style="stylerwd('20','100','20','0')">
                <input class="slaveR text_item _40 tableborder disappearBar" :Style="stylerwd('80','80','10','10')" v-model="row.classMax" type="number" />
                </div>
                <div class="slaveR text_item _40 tableborderRB" :Style="stylerwd('20','100','40','0')">
                <input class="slaveR text_item _40 tableborder disappearBar" :Style="stylerwd('80','80','10','10')" v-model="row.priceUnit" type="number" />
                </div>
                <div class="slaveR text_item _40 tableborderRB" :Style="stylerwd('20','100','60','0')">
                <input class="slaveR text_item _40 tableborder disappearBar" :Style="stylerwd('80','80','10','10')" v-model="row.priceDiff" type="number" />
                </div>
                <div class="slaveC" :Style="stylerwd('20','100','80','0')">
                <button type="submit" class="slaveC tableborderRB" :Style="stylerwd('100','100','0','0')" v-if="i+1 == waterPriceList.length" @click="rowAdd"><img src="../../../../assets/images/add.png"></button>
                <button type="submit" class="slaveC tableborderRB" :Style="stylerwd('100','100','0','0')" v-else @click="rowDel(row, i)"><img src="../../../../assets/images/minus.png"></button>
                </div>

            </div>
        </div>
        <div class="slaveC waterRate_Card" :Style="stylerwd('90','20','5', 35+ (waterPriceList.length+1)*15 )"> 
            <div class="slaveC title _40" :Style="stylerwd('20','70','15','30')">{{ $t("GENERAL.OTHER_PRICE")}}</div>
            <div><input class="slaveC text_item _40 tableborder disappearBar" :Style="stylerwd('30','60','33.3','20')" v-model="otherPrice" type="number" /></div>
            <div class="slaveC title _40" :Style="stylerwd('20','70','60','30')">{{ $t("GENERAL.WATER_DEGREE")}}</div>
        </div>
      
 
    </div>
</template>

<script>

import { complexSet , complexDel } from "network/gateway";
import { setWaterPriceData,  getWaterPriceData} from "network/adv";
export default {
    data() {
        return {
            basicPrice: "",
            otherPrice: "",
            waterPriceList:
            [
                /*{
                    id: "",
                    classMin: "",
                    classMax: "",
                    priceUnit: "",
                    priceDiff: "", 
                },*/
            ],
            dataNum: 0,
          
        };
    },
    
    mixins: [],
    async created() {
        let price_list = []

        let get_res = await getWaterPriceData()
        if(get_res["status"] == "ok"){
            //console.log(get_res)
            for(let i of get_res["price_list"]){
                price_list.push(i)
            }  
        }
        

        //console.log(price_list)
        for(let i of price_list){
            //console.log(i)
            this.basicPrice = i["basic_price"]
            this.otherPrice = i["other_price"]
            for(let j of i["water_price"]){
                this.waterPriceList.push({
                    id: j["order"],
                    classMin: j["min"],
                    classMax: j["max"],
                    priceUnit: j["price"],
                    priceDiff: j["agio"], 
                });
                this.dataNum = Number(j["order"])
            }
        }
        //console.log(this.dataNum)

        /*
        this.waterPriceList.push({
                id: this.dataNum++,
                classMin: "",
                classMax: "",
                priceUnit: "",
                priceDiff: "", 
            });
        */
        
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
            //restart();
            //重製
        });
    },
    beforeDestroy() {
        this.$bus.$off("configApply");
    },
    methods: {
        async add(){
            //套用
            //this.$store.commit("setLoadingState");
           // this.$store.commit("setLoadingState");
           // await this.$store.dispatch("getSolutionData");
            ////console.log(this.basicPrice);
            ////console.log(this.waterPriceList);
            ////console.log(this.otherPrice);

            let water_price = ""
            let waterPrice_list = []

            for(let i of this.waterPriceList){
                if(i.classMin == '' || i.priceUnit =='' || i.priceDiff == ''){
                    this.$notify({
                        type: 'info',
                        title: this.$t("GENERAL.WARNING_TITLE"),
                        message: this.$t("GENERAL.ERROR_MSG_013")
                    });
                    return
                }
                //console.log(i.classMax)
                //console.log(typeof(i.classMax))
                //console.log(i.classMax.length)
                if(i.classMax.length != 0){
                    if(Number(i.classMax) < 1){
                        this.$notify({
                            type: 'info',
                            title: this.$t("GENERAL.WARNING_TITLE"),
                            message: this.$t("GENERAL.ERROR_MSG_019")
                        });
                        return
                    }
                    if(Number(i.classMin) > Number(i.classMax)){
                        this.$notify({
                            type: 'info',
                            title: this.$t("GENERAL.WARNING_TITLE"),
                            message: this.$t("GENERAL.ERROR_MSG_013")
                        });
                        return
                    }
                }

                if(Number(i.classMin) < 1 || Number(i.priceUnit) < 1){
                    this.$notify({
                        type: 'info',
                        title: this.$t("GENERAL.WARNING_TITLE"),
                        message: this.$t("GENERAL.ERROR_MSG_019")
                    });
                    return
                }
                
                

                if(Number(i.priceUnit) > 1000000){
                    this.$notify({
                        type: 'info',
                        title: this.$t("GENERAL.WARNING_TITLE"),
                        message: this.$t("GENERAL.ERROR_MSG_020")
                    });
                    return
                }
            }

            if(this.basicPrice == ''){
                this.$notify({
                    type: 'info',
                    title: this.$t("GENERAL.WARNING_TITLE"),
                    message: this.$t("GENERAL.ERROR_MSG_017")
                });
                return
            }

            if(this.otherPrice == ''){
                this.$notify({
                    type: 'info',
                    title: this.$t("GENERAL.WARNING_TITLE"),
                    message: this.$t("GENERAL.ERROR_MSG_018")
                });
                return
            }

            

            this.$store.commit("setLoadingState");
            //console.log(this.waterPriceList)

            for(let i in this.waterPriceList){
                water_price = i + ":" + this.waterPriceList[i]["classMin"] + ":" + this.waterPriceList[i]["classMax"] + ":" + this.waterPriceList[i]["priceUnit"] + ":" + this.waterPriceList[i]["priceDiff"]
                waterPrice_list.push(water_price)
            }
            //console.log(waterPrice_list)
            let set_res = await setWaterPriceData(this.basicPrice, this.otherPrice, waterPrice_list.join(","))
            if(set_res["status"] == "ok"){
                //console.log(set_res)
                //DATA_SEND_SUCCESS
                this.$notify({
                    type: '',
                    title: this.$t("GENERAL.SUCCESS_TITLE"),
                    message: this.$t("GENERAL.DATA_SEND_SUCCESS")
                });
            }
            else{
                this.$notify({
                    type: 'error',
                    title: this.$t("GENERAL.WARNING_TITLE"),
                    message: this.$t("GENERAL.ERROR_MSG_016")
                });
                
            }

            this.$store.commit("setLoadingState");

        },
        rowAdd(row){
            this.dataNum+=1
            this.waterPriceList.push({
                id: this.dataNum,
                classMin: "",
                classMax: "",
                priceUnit: "",
                priceDiff: "", 
            });
        },
        rowDel(row, i){
            this.waterPriceList.splice(i, 1);
            //console.log(this.waterPriceList)

        }
    },
};
</script>

<style scoped>
@import "~assets/css/cardItem.css";

.main{
    overflow: auto;
}




</style>