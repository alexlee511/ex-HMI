<template>
    <div>
        <config-type-setting>
            <template v-slot:button>
                <header-button @click.native="load">{{ $t('GENERAL.APPLY') }}</header-button>
            </template>
            <template v-slot:content>
                <div class="main" :style='stylerSize()'>
                    <div class="slaveL _36 title_item" :style='stylerSize(15,5,13,5)'>{{ $t('GENERAL.SOLUTION_NAME') }}</div>

                    <div class="slaveM" :style='stylerSize(100,20,0,15)'>
    
                        <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(15,35,13,5)' v-model="solutionKey" @change="keyChange()">
                            <option
                                class=""
                                v-for="(value, name) in solution"
                                :key="name"
                                :value="name"
                            >
                                {{ translation(value.solutionName) }}
                            </option>
                        </select>

                        <header-button class="slaveC" :style='stylerSize(0,0,63.5,0)' @click.native="sortall">{{$t('GENERAL.SORT')}}</header-button>
                        <header-button class="slaveC" :style='stylerSize(0,0,77,0)' @click.native="All">{{ $t(allfont) }}</header-button>

                    </div>
                    <div class="slaveM " :style='stylerSize(100,70,0,30)'>
                        <draggable
                            v-model="displayList"
                            :disabled="!enabled"
                            class="slaveC draggableMain_V2"
                            :style='stylerSize(75,100,13.5,0)'
                            ghost-class="ghost"
                            @start="dragging = true"
                            @end="dragging = false"
                            @change="handleDragList"
                            :scroll-sensitivity="80"
                            :force-fallback="true"
                        >
                            <div
                                class="slaveC _32 "
                                v-for="(item, index) in displayList"
                                :key="index"
                                :style='stylerSize(90,20,3,1+index*25)'
                            >
                                <div class="slaveC draggablebutton" :style='stylerSize(100,75,0,0)'  v-if="update">
                                    <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-if="item.check">☑ {{ item.deviceName }}</span>
                                    <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-else>☐ {{ item.deviceName }}</span>
                                    <button class="slaveC buttonMain" :style='stylerSize(15,80,80,10)' @click="_on(index)">{{  $t('GENERAL.UP_DATA') }}</button>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </template>
        </config-type-setting>
    </div>
</template>


<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting";
import HeaderButton from "components/content/headerButton/HeaderButton";

import draggable from "vuedraggable";

import { setBackData } from "network/solution";
import { mapGetters, mapState } from "vuex";

export default {
    components: {
        ConfigTypeSetting,
        HeaderButton,
        draggable,
    },
    data() {
        return {
            displayList: [],
            solutionKey: null,
            solutionDeviceIndex: 0,
            beAbleList: [],
            update: true,
            sortFlag : 1,
            enabled: true,
            dragging: false,
            solution : {},
            allfont:'GENERAL.CHOOSE_ALL',
            choose :'GENERAL.CHOOSE_ALL',
            cancel :'GENERAL.CANCEL_ALL'
        };
    },
    created() {
        this.beAbleList = {...this.$store.state.backData.selectDevice};
        this.solutionKey = this.$store.state.backData.solutionEnable[0]
        for(let key of this.$store.state.backData.solutionEnable){
            let check = 0
            console.log(key)
            if(this.$store.state.connection.connection[key].solutionType != "0" && this.$store.state.connection.connection[key].solutionType != undefined ){
                continue
            }
            for(let i of this.solutionData[key]["card"]){
                if(i["device"].length != 0){
                    check += 1
                }
            }
            if(check > 0){
                this.solution[key] = this.solutionData[key]
            }
        }
    },
    mounted() {
    },
    methods: {
        //置頂
        _on(index){
            //console.log(index)
            this.displayList.splice(0, 0, this.displayList.splice(index, 1)[0] );
            this.handleDragList();
            
        },
        translation(value) {
            return this.$t(`${value}`)
        },
        keyChange() {
            
            this.allfont = this.choose;
            this.solutionDeviceIndex = 0;
        },
        //勾選
        checkClick(item) {  
            item.check = !item.check;
            this.handleDragList();
        },
        handleExceptionId(item) {
            // if (item.setting) {
            //     //例外
            //     return item.deviceId + "|" + item.setting.devNo
            // }
            return item.deviceId
        },
        handleDragList() { //在切換的時候將裝置的選擇映射進入緩存
            let index = 1;
            let newObj = {};
            this.displayList.forEach(item => {
                if(!(item.cardId in newObj))
                    newObj[item.cardId] = [];
                let trueId = this.handleExceptionId(item)
                if(item.check === true){
                    newObj[item.cardId].push({
                        dev_id: trueId,
                        order: index++,
                    });
                }
            })

            for(const cardId of Object.keys(newObj))
                this.beAbleList[this.solutionKey][cardId] = newObj[cardId];

            console.log(this.beAbleList)
        },
        load() {
            //將勾選清單上傳至VUEX
            this.$store.commit("changeSchemeList", this.beAbleList);

            //寫入後端設定
            setBackData(this.$store.state.backData).then((res) => {
                //返回上一頁
                this.$router.back();
            });
        },
        sortall() {
            if(this.sortFlag == 1){
                this.displayList = this.displayList.sort(function (a, b) {
                    return a.deviceName.localeCompare(b.deviceName, "zh-hant");
                });
            }else{
                this.displayList = this.displayList.sort(function (a, b) {
                    return b.deviceName.localeCompare(a.deviceName, "zh-hant");
                });
            }
            
            this.sortFlag *= -1;
            this.$forceUpdate()
            this.handleDragList()
        },
        All() {
            if(this.allfont == this.choose){
                for(let item of this.displayList) {
                    item.check = true;
                }
                this.allfont = this.cancel ;
            }else{
                for(let item of this.displayList) {
                    item.check = false;
                }
                this.allfont = this.choose ;
            }

            this.handleDragList()
        }
    },
    computed: {
        ...mapState({
            connection: (state) => state.connection.connection,
            solutionData: (state) => state.solutionData,
        }),
        getSelectVariety() {
            return (this.solutionKey && this.solutionData[this.solutionKey].card);
        },
        handleExceptionList() {
            let result = [];
            for(let card of this.getSelectVariety){
                const isCheckedArr = this.beAbleList[this.solutionKey][card.cardId].map((item) => item.dev_id);
                const cardType = card.cardType;

                result = result.concat(card.device.map((item) => {
                    const obj = { ...item };
                    if (isCheckedArr.indexOf(item.deviceId) !== -1) {
                        obj.check = true;
                        return obj;
                    }
                    obj.check = false;
                    return obj;
                }));
            }

            return result;
        },
    },
    watch: {
        getSelectVariety: function () {
            let isCheckedArr = [];
            for(const cardType of this.getSelectVariety)
                isCheckedArr = isCheckedArr.concat(this.beAbleList[this.solutionKey][cardType.cardId]);
            isCheckedArr.sort((a, b) => {
                return a.order - b.order;
            });
            isCheckedArr = isCheckedArr.map(item => item.dev_id);
            
            const idList = this.handleExceptionList.map(item => {
                return this.handleExceptionId(item)
            })
            // 處理排序
            let sortArr = []
            isCheckedArr.forEach(item => {
                if(idList.indexOf(item) != -1) { //在勾選清單中存在的
                    const index = idList.indexOf(item)
                    sortArr.push(this.handleExceptionList[index])
                }
            })
            this.handleExceptionList.forEach(item => {
                const trueId = this.handleExceptionId(item)
                // //console.log(trueId)
                if(isCheckedArr.indexOf(trueId) === -1) {
                    sortArr.push(item)
                }
            })
            this.displayList = sortArr
        },
    },
};
</script>

<style scoped>
.title-block {
  display: flex;
  width: 80vw;
  height: 8vh;
  align-items: center;
  color: #01ffff;
  font-size: 2.5vw;
  margin: 0 auto;
  font-weight: bold;
}
.title-text {
  width: 25%;
  text-align: center;
}
.select-block {
  display: flex;
  width: 80vw;
  height: 13vh  ;
  align-items: center;
  font-size: 2vw;
  margin: 0 auto;
  font-weight: bold;
}
.select-content {
  width: 25%;
  text-align: center;
}
.select-tools {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  width: 70%;
}
.check-block {
  margin: auto;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 13vh - 8vh);
  overflow: auto;
}
/* .check-block::-webkit-scrollbar {
  width: 0 !important;
} */
.text-block {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* text-align: center; */
}
.check-item {
  width: 95%;
  height: 13vh;
  font-size: 2vw;
  color: #ffffff;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(89, 106, 202, 0.8), rgba(33, 96, 184, 0.8));
  margin: auto;
  margin-bottom: 25px;
}
.list-group {
  width: 100%;
  height: 60%;
}
.check-block::-webkit-scrollbar {
  width: 30px;
}
.check-block::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 10px;
}
.check-block::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}
</style>
<style>
.select-tools .header-button {
    width: 20vw;
}
</style>