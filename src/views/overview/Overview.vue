<template>
    <div>
        <overview-typesetting>
            <!-- 方案 -->
            <template v-slot:menu-item>
                <menu-select
                    v-for="(item, index) in program"
                    :key="index"
                    :path="item.path"
                    :item="item"
                >
                    <template v-slot:select>{{ translation(item.name) }}</template>
                    <template v-slot:option>
                        <menu-select-item
                            v-for="(item, indey) in item.features"
                            :key="indey"
                            :path="item.path"
                        >
                            <template v-slot:item-name>{{ translation(item.name) }}</template>
                        </menu-select-item>
                    </template>
                </menu-select>
            </template>
            <!-- 設定中間顯示區域 -->
            <template v-slot:content>
                <router-view></router-view>
            </template>
        </overview-typesetting>
        <config-menu></config-menu>
        <dialog-box>
            <about-dialog></about-dialog>
        </dialog-box>
        <password-lock></password-lock>
    </div>
</template>

<script>
import OverviewTypesetting from "layout/overviewTypesetting/OverviewTypesetting";
import ConfigMenu from "layout/configMenu/ConfigMenu";
import DialogBox from "components/content/dialog/Dialog";

import AboutDialog from "./childCpn/AboutDialog";
import PasswordLock from "./childCpn/PasswordLock";
import { getOrderData } from "network/adv";
import { MenuSelect, MenuSelectItem } from "components/content/menuSelect";

export default {
    components: {
        OverviewTypesetting,
        MenuSelect,
        MenuSelectItem,
        ConfigMenu,
        DialogBox,
        AboutDialog,
        PasswordLock
    },
    data() {
        return {
            program: [],
            default: [],
        };
    },
    async created() {
        console.log("🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️")
        console.log(this.solutionEnable)
        console.log(this.$store.pr)
        console.log(this.$store.state.overview.button)
        let tmp_button = JSON.parse(JSON.stringify(this.$store.state.overview.button));
        let card_order = []
        let sub = []
        let index = -1
        let sub_index = -1
        let temp = 0
        let data_list = []
        let temp_list = []
        let res = await getOrderData()
        
        if(res["status"] == "ok")
            data_list = res["data_list"]
        
        for (let item of this.solutionEnable) {
            if(tmp_button[item] == undefined)  continue;

            if( tmp_button[item].show != undefined )
                if(!await tmp_button[item].show()) continue;

            //added 2022/08/08
            let sol = tmp_button[item].id
            if( this.subSolutionEnable && this.subSolutionEnable[sol]) {

                this.program.push({})
                for(let key of Object.keys(tmp_button[item])){
                    if(key=="features") continue;
                    this.program[this.program.length-1][key] = tmp_button[item][key]
                }
                
                this.program[this.program.length-1].features = []
                for(let subsol_enable of this.subSolutionEnable[sol]){
                    for( let subsol of tmp_button[item].features){
                        if(subsol.type == subsol_enable || subsol.name == subsol_enable){
                            this.program[this.program.length-1].features.push(subsol)
                        }
                    }
                }
            }else{
                this.program.push(tmp_button[item])
            }
            
            index = -1
            sub_index = -1
            card_order = []
            
            sub_index = this.$store.state.overview.button[item]["features"].findIndex(e => e.type == "Advanced")
            if(sub_index != -1){
                sub = this.$store.state.overview.button[item]["features"][sub_index]["sub"]
                if(data_list == undefined) data_list = sub;
                
                
                if(data_list.length == 0){
                    for(let i of sub){
                        card_order.push(i)
                    }
                    this.$store.state.overview.button[item]["features"][sub_index]["order"] = card_order
                }
                else{ 
                    index = data_list.findIndex(e => e.solution_name == item)
                    if(index != -1){
                            
                        data_list[index]["order_list"] = data_list[index]["order_list"].sort(function (a, b){
                                return a.order > b.order ? 1 : -1
                        })

                        temp = 0
                        for(let i of data_list[index]["order_list"]){
                                card_order.push(i["analysis_name"])
                        }
                                            
                        this.$store.state.overview.button[item]["features"][sub_index]["order"] = card_order
                    }else{ //HandleException
                        this.$store.state.overview.button[item]["features"][sub_index]["order"] = sub;
                    }
                }
            }
        }
    },
    async mounted() {
        this.$bus.$emit("overbutton", this.program.length)
    },
    computed: {
        solutionEnable() {
            return this.$store.state.backData.solutionEnable;
        },
        subSolutionEnable() {
            return this.$store.state.backData.subSolutionEnable;
        }
    },
    methods: {
        translation(value) {
            return this.$t(`${value}`);
        },
    },
};
</script>

<style>
</style>