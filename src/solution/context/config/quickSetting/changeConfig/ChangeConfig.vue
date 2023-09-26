<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="nextPage"> {{ $t("GENERAL.NEXT_STEP") }} </header-button><!--@click.native="load"-->
        </template>
        <template v-slot:content>
            <div class="main" :style='stylerSize()'>
                <span class="slaveC _60 title_item" :style='stylerSize(100,8,0,3)'>{{ $t("GENERAL.CHOOSE_DEVICE_TYPE") }}</span>
                <span class="slaveL _36 title_item" :style='stylerSize(15,8,15,20)'>{{ $t("GENERAL.DEVICE_KIND") }}:</span>
                <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(30,8,15,29)' v-model="currentType">
                    <option v-for="(item) in typeList" :key="item.type" :value="item.type">
                        {{ translation(typeTextChange(item.type)) }}
                    </option>
                </select>
                <span class="slaveL _36 title_item" :style='stylerSize(15,7,15,43)'>{{ $t("GENERAL.CONTROL_STATUS") }}</span>

                <div v-for="(item, id) in description_list" :key="id" class="slaveL " :style='stylerSize(15,25,20*id+15,55)'>
                    <input class="" type="radio" name="type" :value="item.description" id="radioId" @input="showCommandValue(item)" v-model="cur_description" />
                    <label class="slaveC title _32" for="radioId">{{ item.description }}</label>
                    
                    <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(90,25,0,50)' v-if="item.isShow" v-model="cur_model">
                        <option v-for="(itey) in item.value_list" :key="itey.value" :value="itey.value">{{ itey.name }}</option>
                    </select>
                </div>
            </div>
        </template>
    </config-type-setting>
</template>  

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"
import Draggable from "vuedraggable";
import { typeToKind } from "common/constant/type"
import { true_config , sendCurrentConfig , temp_type , resetTempType } from "../ston/data.js";

export default {

    components: {
        Draggable,
        ConfigTypeSetting,
        HeaderButton,
    },
    data() {
        return {
            isChange: this.$route.query.isChange,   //判斷是否為編輯
            orderId: this.$route.query.orderId,
            typeList: [],
            description_list:[],
            nameList: {},
            currentType: "",
            cur_index: 0,
            cur_description: "",
            cur_model: "",
            cur_model_name: "",
            currentName: "",
            hasChange: false,
        };
    },
    async created() {
        //console.log(true_config)
        console.log(this.$store.state.deviceCommand.deviceAttrList)
        console.log(this.$store.state.deviceCommand.deviceControlList)
        //console.log(this.$store.state.deviceCommand.controlClassList)
        let order = 0
        //將可選模組類別與控制狀態整理為typeList
        for(let i of Object.keys(this.$store.state.deviceCommand.controlClassList)){
            let index = this.typeList.findIndex(e => e.type == i.substr(0,2))
            if(index != -1){
                for(let j of Object.keys(this.$store.state.deviceCommand.controlClassList[i])){
                    if(this.$store.state.deviceCommand.controlClassList[i][j].value_list.length == 0){
                        continue
                    }
                    let des_index = this.typeList[index]["description_list"].findIndex(e => e.description == this.$store.state.deviceCommand.controlClassList[i][j].description)
                    if(des_index == -1){
                        this.typeList[index]["description_list"].push({
                            "writeCmd": this.$store.state.deviceCommand.controlClassList[i][j].writeCmd,
                            "attrId": this.$store.state.deviceCommand.controlClassList[i][j].attrId,
                            "description": this.$store.state.deviceCommand.controlClassList[i][j].description,
                            "value_list": this.$store.state.deviceCommand.controlClassList[i][j].value_list
                        })
                    }
                    else{
                        continue
                    }
                } 
            }
            else{
                console.log(i)
                for(let j of Object.keys(this.$store.state.deviceCommand.controlClassList[i])){
                    if(this.$store.state.deviceCommand.controlClassList[i][j].value_list.length == 0){
                        continue
                    }
                    if(j == "0"){
                        this.typeList.push({
                            "type": i.substr(0,2),
                            "description_list": [],
                        })
                    }
                    this.typeList[order]["description_list"].push({
                        "writeCmd": this.$store.state.deviceCommand.controlClassList[i][j].writeCmd,
                        "attrId": this.$store.state.deviceCommand.controlClassList[i][j].attrId,
                        "description": this.$store.state.deviceCommand.controlClassList[i][j].description,
                        "value_list": this.$store.state.deviceCommand.controlClassList[i][j].value_list
                    }) 
                }
                order += 1
            }
        }

        if(this.isChange == "true"){
            this.hasChange = true
        }

        if(Object.keys(temp_type).length != 0){
            this.isChange = temp_type.isChange
        }
        
        //若為編輯修改則保留之前的設定
        if(this.isChange == "true"){
            console.log(true_config[this.orderId])
            this.currentType = true_config[this.orderId].type
            this.cur_description = true_config[this.orderId].description
            this.cur_model = true_config[this.orderId].model
            let index = this.typeList.findIndex(e => e.type == this.currentType)
            console.log(index)
            if(index != -1) {
                let des_index = this.typeList[index].description_list.findIndex(e => e.description == this.cur_description)
                console.log(des_index)
                this.typeList[index].description_list[des_index].isShow = true
            }
        }
        else{      //新增
            if(Object.keys(temp_type).length == 0){        //判斷是否有保留的設定
                this.currentType = this.typeList[0].type;
                this.cur_index = 0
                this.cur_description = this.typeList[0].description_list[0].description
                this.cur_model = this.typeList[0].description_list[0].value_list[0].value
                this.typeList[0].description_list[0].isShow = true
            }
            else{
                this.currentType = temp_type.type;
                this.cur_description = temp_type.description
                this.cur_model = temp_type.model
                let index = this.typeList.findIndex(e => e.type == this.currentType)
                if(index != -1) {
                    let des_index = this.typeList[index].description_list.findIndex(e => e.description == this.cur_description)
                    this.typeList[index].description_list[des_index].isShow = true
                }
            }
            
        }
    },

    mounted() {
        this.$bus.$on("previousPage", () => {
            resetTempType()
        });
    },
    beforeDestroy() {
        this.$bus.$off("previousPage");
        //this.$bus.$off("configLoad")

    },
    computed: {

    },
    methods: {
        //依所點擊的radio判斷顯示所屬的select框
        showCommandValue(item){
            for(let i of this.description_list){
                if(i.description == item.description){
                    continue
                }
                i.isShow = false
            }
            item.isShow = true
            console.log(this.description_list)
            this.cur_model = item.value_list[0].value
            if(this.isChange == "true"){
                this.isChange == "false"
            }
        },
        
        typeTextChange(value){
            return typeToKind(value);
        },

        //下一步並透過data.js存取設定資料
        nextPage(){
            let path = this.$route.path.replace(/changeConfig/i, "OtherConfig")
            console.log(this.cur_description)
            if(this.cur_model.length == 0 || this.cur_description.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
            }

            let des_index = this.typeList[this.cur_index].description_list.findIndex(e => e.description == this.cur_description)
            let val_index = this.typeList[this.cur_index].description_list[des_index].value_list.findIndex(e => e.value == this.cur_model)
            this.cur_model_name = this.typeList[this.cur_index].description_list[des_index].value_list[val_index].name

            let item = {
                orderId: this.orderId,
                attrId: this.typeList[this.cur_index].description_list[des_index].attrId,
                writeCmd: this.typeList[this.cur_index].description_list[des_index].writeCmd,
                type: this.currentType,
                description: this.cur_description,
                model: this.cur_model,
                model_name: this.cur_model_name,
                isChange: this.hasChange,
            }
            sendCurrentConfig(item)
            this.$router.push({
                path: path,
            });
        },
    },
    watch: {
        //以所選的設備類別更改下方顯示的選項
        currentType: async function () {
            console.log(this.currentType)
            let index = this.typeList.findIndex(e => e.type == this.currentType)
            if(index != -1) {
                this.description_list = this.typeList[index].description_list
                if(Object.keys(temp_type).length == 0){
                    if(this.isChange == "true"){
                        this.isChange = "false"
                    }
                    else{
                        this.cur_description = this.typeList[index].description_list[0].description
                        this.cur_model = this.typeList[index].description_list[0].value_list[0].value
                        for(let i in this.typeList[index].description_list){
                            if(i == 0){
                                this.typeList[index].description_list[i].isShow = true
                            }
                            else{
                                this.typeList[index].description_list[i].isShow = false
                            }
                        }
                    }
                }
                else{
                    if(this.currentType != temp_type.type){
                        if(this.isChange == "true"){
                            this.isChange = "false"
                        }
                        else{
                            resetTempType()
                            console.log("清空")
                            this.cur_description = this.typeList[index].description_list[0].description
                            this.cur_model = this.typeList[index].description_list[0].value_list[0].value
                            for(let i in this.typeList[index].description_list){
                                if(i == 0){
                                    this.typeList[index].description_list[i].isShow = true
                                }
                                else{
                                    this.typeList[index].description_list[i].isShow = false
                                }
                            }
                        
                        }
                    
                    }
                }
                //console.log(this.description_list)
                this.cur_index = index
            }
        },
    },
};
</script>

<style scoped>

input[type="radio"] {
    width: 4vmin;
    height: 4vmin;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
</style>