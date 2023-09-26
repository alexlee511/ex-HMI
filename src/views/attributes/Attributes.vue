<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="load"> {{ $t("GENERAL.APPLY") }} </header-button>
        </template>
        <template v-slot:content>
            <div class="main background_01" :style='stylerSize(90,90,5,5)'>
            
                <div class="slaveC _48 font" :style='stylerSize(30,20,5,5)'> {{ $t("GENERAL.MODULE_SELECT")}} </div>
                <select class="slaveC selectMain _48" :style='stylerSize(40,10,45,5)' v-model="currentModule" @change="updateList"
                    :no-data-text="$t('GENERAL.NO_DATA')" :placeholder="$t('GENERAL.CHOOSE')">
                    <option class="selectItem _48" v-for="(module, module_index) in moduleList" :key="module_index"
                        :value="module" :label="changeModuleName(module)"></option>
                </select>
                
                <div class="slaveM background_01" :style='stylerSize(30,75,5,20)'>
                    <div class="slaveM " :style='stylerSize(100,20,0,0)'>
                        <img class='slaveC' :style='stylerSize(20,70,-3,15)' v-show='(hideOrderIcon && hideOrderIcon >= 2)' src="~assets/images/上一頁.png" @click="subOrderPage">
                        <div class='slaveC light_blue _48' :style='stylerSize(80,80,12,15)'> {{ $t("GENERAL.ATTRIBUTES_ORDER") }}  {{ orderStr }} </div>
                        <img class='slaveC' :style='stylerSize(20,70,83,15)' v-show='(hideOrderIcon && hideOrderIcon <= 2)' src="~assets/images/下一頁.png" @click="addOrderPage">
                    </div>
                    <div class="slaveC font _48" :style='stylerSize(30,15,0,20 + 15 * id)' v-for="(index , id) in orderNumber" :key="index">
                        {{ index.toString().length == 1 ? '0' + index : index }}
                    </div>
                    <draggable class="slaveC " :style='stylerSize(65,75,30,20)' group="attribute" v-model="currentList[orderPageNum]" @change="resetOrder">
                        <div class="slaveC draggablebutton _48" :style='stylerSize(100,15,0,20 * index)' v-for="(attr , index) in currentList[orderPageNum]" :key="attr.value">
                            {{ attr.name }}
                        </div>
                    </draggable>
                </div>
                <div class="slaveM background_01" :style='stylerSize(50,75,45,20)'>
                    <div class="slaveM " :style='stylerSize(100,20,0,0)'>
                        <img class='slaveC' :style='stylerSize(10,60,0,15)' v-show='(hideDisableIcon && hideDisableIcon >= 2)' src="~assets/images/上一頁.png" @click="subDisablePage">
                        <div class='slaveC red _48' :style='stylerSize(60,80,20,15)'> {{ $t("GENERAL.ATTRIBUTES_DISABLE") }} </div>
                        <img class='slaveC' :style='stylerSize(10,60,80,15)' v-show='(hideDisableIcon && hideDisableIcon <= 2)' src="~assets/images/下一頁.png" @click="addDisablePage">
                    </div>
                    <draggable class="slaveC draggableMain" :style='stylerSize(100,80,0,20)' group="attribute" v-model="disableList[disablePageNum]" @change="resetDisable">
                        <div class="slaveC draggablebutton _48" :style='stylerSize(48,15,1 + Math.floor(index/5) * 50 ,5 + 18 * (index%5))' v-for="(attr , index) in disableList[disablePageNum]" :key="attr.value">
                            {{ attr.name }}
                        </div>
                    </draggable>
                </div>
            </div>
        </template>
    </config-type-setting>
</template>

<script>
import draggable from "vuedraggable"
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"; 
import HeaderButton from '@/components/content/headerButton/HeaderButton.vue';
import { getAttributeOrder, setAttributeOrder } from "network/attribute"
import { typeToModule } from "common/constant/type"
import { getModuleAttr } from "common/constant/attribute"

export default {
    components: {
        ConfigTypeSetting,
        HeaderButton,
        draggable,
    },
    data(){
        return{
            currentModule: "",
            currentList: [[]], //當前編輯中
            moduleList: [],
            editedList: {}, //需更新到後端的順序
            disableList: [],
            attrList: {}, //原順序
            orderStr: "1 - 5",
            orderPageNum: 0,
            disablePageNum: 0,
        }
    },
    async created(){
        await this.getData();
        this.currentModule = this.moduleList[0];
        console.log(this.currentModule)
        console.log(this.moduleList)
        console.log(this.attrList)
        this.updateList();
    },
    computed: {
        hideOrderIcon(){
            if(this.currentList[this.orderPageNum]){
                let left = (this.orderPageNum > 0) && (this.currentList[0].length > 0);
                let right = (this.currentList[this.orderPageNum + 1]) ||
                    (this.currentList[this.orderPageNum].length == 5);
                if(left && right) return 2;
                else if(left) return 3;
                else if(right) return 1;
                else return false;
            }
        },
        hideDisableIcon(){
            if(this.disableList[this.disablePageNum]){
                let left = (this.disablePageNum > 0) && (this.disableList[0].length > 0);
                let right = (this.disableList[this.disablePageNum + 1]) ||
                    (this.disableList[this.disablePageNum].length == 10);
                if(left && right) return 2;
                else if(left) return 3;
                else if(right) return 1;
                else return false;
            }
        },
        orderNumber(){
            if(this.currentList[this.orderPageNum])
                return Array.from(Array(this.currentList[this.orderPageNum].length).keys()).map(x => x + 5 * this.orderPageNum + 1);
            else return 0;
        },
    },
    watch:{
        currentModule(){
            this.currentList = this.editedList[this.currentModule] || this.currentList;
            // console.log("currentModule: " + this.currentModule)
            // console.log("editedList now: ", this.editedList[this.currentModule])
            // console.log("currentList: " , this.currentList)
        }
    },
    methods: {
        changeModuleName(value){
            return typeToModule[value] || value;
        },
        resetOrder(){
            let allItemArr = [];
            for(let arr of this.currentList)
                allItemArr = allItemArr.concat(arr);
            
            this.currentList = [];
            if(allItemArr.length > 5){
                let index = 0;
                let newArr = [];
                while(index < allItemArr.length)
                    newArr.push(allItemArr.slice(index, index += 5));
                this.currentList = newArr;
            }
            else this.currentList.push(allItemArr);

            if(!this.currentList[this.orderPageNum])
                this.orderPageNum -= 1;
            
            this.hideOrderIcon;
            this.hideDisableIcon;
            
            //update currentList to editList
            this.editedList[this.currentModule] = this.currentList;
        },
        resetDisable(){
            let allItemArr = [];
            for(let arr of this.disableList)
                allItemArr = allItemArr.concat(arr);
            
            this.disableList = [];
            if(allItemArr.length > 10){
                let index = 0;
                let newArr = [];
                while(index < allItemArr.length)
                    newArr.push(allItemArr.slice(index, index += 10));
                this.disableList = newArr;
            }
            else this.disableList.push(allItemArr);
            
            if(!this.disableList[this.disablePageNum])
                this.disablePageNum -= 1;

            this.hideOrderIcon;
            this.hideDisableIcon;

            //update currentList to editList
            this.editedList[this.currentModule] = this.currentList;
        },
        updateList(){
            if(this.currentModule){
                this.orderStr = '1 - 5';
                this.orderPageNum = 0;
                this.disablePageNum = 0;
                this.currentList = [];
                this.disableList = [];
                
                let orderList = [] ;
                if( this.editedList[this.currentModule]){
                    for(let i of this.editedList[this.currentModule]){
                        orderList = orderList.concat(i)
                    }
                }else{
                    orderList = this.attrList[this.currentModule]
                }
                console.log("orderList:", orderList)
                
                if(orderList.length > 5){
                    let index = 0;
                    let newArr = [];
                    let tempList = JSON.parse(JSON.stringify(orderList));
                    while(index < tempList.length)
                        newArr.push(tempList.slice(index, index += 5));
                    this.currentList = newArr;
                }
                else{
                    this.currentList[0] = JSON.parse(JSON.stringify(orderList));
                    if(this.currentList[0].length)
                        this.orderStr = `1 - ${this.currentList[0].length}`;
                    else
                        this.orderStr = "";
                }
                if(!this.currentList.length) this.currentList.push([]);
                
                let tempList = [];
                for(let attr of getModuleAttr(this.currentModule)){
                    let tempItem = orderList.find(item => {
                        // console.log(item)
                        return attr.value == item.value;
                    });
                    if(!tempItem) tempList.push(attr);
                }
                let index = 0;
                let newArr = [];
                while(index < tempList.length)
                    newArr.push(tempList.slice(index, index += 10));
                if(!newArr.length) newArr.push([]);
                this.disableList = newArr;
                this.hideOrderIcon;
            }
        },
        addOrderPage(){
            if(this.hideOrderIcon && this.hideOrderIcon <= 2){
                if(!this.currentList[this.orderPageNum + 1])
                    this.currentList.push([]);
                this.orderPageNum += 1;
                this.orderStr = `${this.orderPageNum * 5 + 1} - ${this.orderPageNum * 5 + 5}`
            }
        },
        addDisablePage(){
            if(this.hideDisableIcon && this.hideDisableIcon <= 2){
                if(!this.disableList[this.disablePageNum + 1])
                    this.disableList.push([]);
                this.disablePageNum += 1;
            }
        },
        subOrderPage(){
            if(this.hideOrderIcon && this.hideOrderIcon >= 2){
                if(this.currentList[this.orderPageNum].length == 0)
                    this.currentList.pop();
                this.orderPageNum -= 1;
                this.orderStr = `${this.orderPageNum * 5 + 1} - ${this.orderPageNum * 5 + 5}`
            }
        },
        subDisablePage(){
            if(this.hideDisableIcon && this.hideDisableIcon >= 2){
                if(this.disableList[this.disablePageNum].length == 0)
                    this.disableList.pop();
                this.disablePageNum -= 1;
            }
        },
        async getData(){
            const res = await getAttributeOrder();
            const filter_list = ["GENPLC"]
            console.log(res)
            if(res.status === 'ok'){
                let attr_list = JSON.parse(JSON.stringify(getModuleAttr()));
                console.log(attr_list)
                for(let module of Object.keys(attr_list)){
                    let m = module.split('-')[1];
                    if(filter_list.includes(m)){
                        continue;
                    }

                    let data = undefined
                    for(let i in res.module_list){
                        if(module == res.module_list[i].module_name){
                            data = res.module_list.splice(i, 1)[0]
                            break
                        }
                    }

                    //初始化要顯示的屬性列表與模組
                    // if(this.attrList[module] == undefined)
                    this.moduleList.push(module);
                    this.attrList[module] = []

                    if(data != undefined){
                        console.log(data)
                        for(let j of data.hide_attr){
                            for(let i in attr_list[module]){
                                if(attr_list[module][i].value == j){
                                    attr_list[module].splice(i, 1)
                                }
                            }
                        }
                        //這邊依照屬性順序獲取相應屬性資料
                        for(let j of data.attr){
                            let index = attr_list[module].findIndex( e => { return e.attr === j});
                            if( index !== -1){
                                this.attrList[module].push( attr_list[module][index]);
                            }
                        }
                    }else{
                        //如果後端沒有傳回來，則要輸出默認選項
                        this.attrList[module] = attr_list[module]
                    }
                }
                    /*
                    let newArr = [];
                    let moduleName = module.module_name;
                    
                        continue;
                    this.moduleList.push(moduleName);
                    for(let attr of module.attr){
                        let tmp = getModuleAttr(moduleName).find(item => {
                            return attr === item.value;
                        })
                        if(tmp != undefined)
                            newArr.push(tmp);
                    }
                    this.attrList[moduleName] = newArr;
                }

                for(let module of Object.keys(getModuleAttr())){
                    if(!this.moduleList.find((item) => item === module)){
                        this.moduleList.push(module);
                        this.attrList[module] = getModuleAttr(module);
                    }
                }
                */
            }
            else{
                this.moduleList = [];
                this.attrList = getModuleAttr();
                for(let module of Object.keys(this.attrList)){
                    let m = module.split('-')[1];
                    if(filter_list.includes(m)){
                        continue;
                    }
                    this.moduleList.push(m);
                }
            }
        },
        async load(){
            this.$store.state.loading = true;
            console.log(this.editedList)
            for(let m of Object.keys(this.editedList)){
                if(this.editedList[m].length == 0){
                    this.$notify({
                        type: 'warning',
                        title: this.$t("GENERAL.DATA_MISSING"),
                        message: this.$t("GENERAL.DATA_MISSING_ATTRIBUTE_DISPLAY"),
                    });
                    return;
                }

                this.currentModule = m;
                this.updateList();

                let attr_cnt = 0;
                let attr_str = [];
                this.disableList.forEach(arr => {
                    attr_cnt += arr.length;
                    attr_str.push(arr.map(item => item.value).join(","));
                });
                attr_str = attr_str.join(',');
                await setAttributeOrder(m, attr_cnt, attr_str , 'hide').then((res) => {
                    //console.log(res);
                });
                
                attr_cnt = 0;
                attr_str = [];
                this.currentList.forEach(arr => {
                    attr_cnt += arr.length;
                    attr_str.push(arr.map(item => item.value).join(","));
                });
                attr_str = attr_str.join(',');
                if(!attr_str.length){
                    attr_str = []
                }
                
                await setAttributeOrder(m, attr_cnt, attr_str , 'sort').then((res) => {
                    //console.log(res);
                });
            }
            this.$store.state.loading = false;
            // location.reload();
        }
    }
}
</script>