<template>
    <div>
        <config-type-setting>
            <template v-slot:button>
                <header-button @click.native="load">{{
                    $t("GENERAL.APPLY")
                }}</header-button>
            </template>
            <template v-slot:content>
                <div class="out-contents">
                    <div class="contents">
                        <div class="title-text">{{ $t("GENERAL.SCHEME_ORDER") }}</div>
                        <draggable
                            :list="list"
                            :disabled="!enabled"
                            class="list-group"
                            ghost-class="ghost"
                            @start="dragging = true"
                            @end="dragging = false"
                        >
                            <div
                                
                                v-for="element in list"
                                :key="element.solutionName"
                            >
                            <div class="list-group-item">
                                <div class="solution-content">
                                    {{ translation(element.solutionName) }}
                                </div>
                                <div class="button-content">
                                    <header-button @click.native="startUp(element)">{{
                                        $t("GENERAL.DISABLE")
                                    }}</header-button>
                                </div>
                                <div class="button-content">
                                    <header-button v-show='$store.state.overview.button[element.key].features.length>1' @click.native="opentabel(element)">
                                        <div v-if="on_click==element.key">{{$t("GENERAL.CONDENSATION")}}</div>
                                        <div v-else>{{$t("GENERAL.EXPAND")}}</div>
                                    </header-button>
                                </div>
                                </div>
                                <div v-if='on_click==element.key'>
                                    <div class="new-group"  v-for="(item, index) in features" :key='index'>
                                        <div class="new-group-item" > {{translation(item.name)}} </div>
                                        <header-button class="new-group-item" style='width: 30%;' 
                                            :key='subSolutionEnable[element.key][subSolutionEnable[element.key].indexOf(item.type)]' 
                                            @click.native="addsub(element.key,item)">
                                                {{name( element.key, item.type||item.name )}}
                                        </header-button>
                                    </div>
                                </div>
                            </div>
                            
                        </draggable>
                        <hr />
                        <div class="list-group bot-list">
                            <div
                                class="list-group-item"
                                v-for="(item, index) in solutionUnEnable"
                                :key="index"
                            >
                                <div class="solution-content">
                                    {{ translation(item.solutionName) }}
                                </div>
                                <div class="button-content">
                                    <header-button @click.native="turnOff(item)">
                                        {{ $t("GENERAL.ENABLE") }}
                                    </header-button>
                                </div>
                                <div class="button-content">
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="style-setting">
                            <div class="select-box">
                                <div class="title-text">
                                    {{ $t("GENERAL.CHANGE_BACKGROUND") }}
                                </div>
                                <div class="select-block">
                                    <background-select ref="backgroundSelect"></background-select>
                                </div>
                            </div>
                        </div>
                        <hr />

                        <!-- <set-icon title="homeIcon" ref="homeIcon">{{
                            $t("GENERAL.HOME_ICON_REPLACE")
                        }}</set-icon>

                        <hr />

                        <set-icon
                            img="img/logo_2.b4949dc1.png"
                            title="footerIcon"
                            ref="footerIcon"
                            >{{ $t("GENERAL.FOOTER_ICON_REPLACE") }}</set-icon
                        > -->

                        <hr />
                        <div class="style-setting">
                            <div class="select-box">
                                <div class="title-text">
                                    {{ $t("GENERAL.CN_COPYRIGHT_REPLACE") }}
                                </div>
                                <div class="select-block">
                                    <input class="title-text text-black" v-model="copyrightTW" />
                                </div>
                            </div>
                        </div>
                        <div class="style-setting">
                            <div class="select-box">
                                <div class="title-text">
                                    {{ $t("GENERAL.EN_COPYRIGHT_REPLACE") }}
                                </div>
                                <div class="select-block">
                                    <input class="title-text text-black" v-model="copyrightEN" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </config-type-setting>
    </div>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting";
import HeaderButton from "components/content/headerButton/HeaderButton";
import BackgroundSelect from "./childComps/BackgroundSelect";
//import SetIcon from "./childComps/SetIcon";

import draggable from "vuedraggable";

import { setBackData, setSubSolutionStatus } from "network/solution";

import { reset } from "@/router/index";
import { filterRouter, deepCopy } from "common/utile/utile";

import { mapGetters } from "vuex";
//SetIcon,
export default {
    components: {
        ConfigTypeSetting,
        HeaderButton,
        draggable,
        BackgroundSelect,
        
    },
    data() {
        return {
            enabled: true,
            dragging: false,
            goBack: false,
            list: [],
            features : [],
            on_click : '',
            oldSelectSol: [],
            oldSelectSub: {},
            copyrightTW: "",
            copyrightEN: "",
        };
    },
    async created() {
        this.copyrightTW = this.$store.state.backData.copyrightTW;
        this.copyrightEN = this.$store.state.backData.copyrightEN;
        await this.$store.dispatch("getSolutionData")
        for (let item of this.solutionEnable) {
            for (let key in this.oldlist) {
                if (item === key ) {
                    this.list.push(this.oldlist[key]);
                }
            }
        }
        this.oldSelectSol = JSON.parse(JSON.stringify(this.solutionEnable))
        this.oldSelectSub = JSON.parse(JSON.stringify(this.subSolutionEnable))
    },
    mounted() {this.$bus.$on("previousPage", async ()=>{
            //不套用新資料
            this.goBack = true;
        });
    },
    beforeDestroy() {
        this.$bus.$off("previousPage");

        if(this.goBack){
            this.solutionEnable = this.oldSelectSol
            this.subSolutionEnable = this.oldSelectSub
        }
    },
    computed: {
        ...mapGetters(["getTrueRoutes"]),
        oldlist() {
            let tmp  =JSON.parse(JSON.stringify(this.$store.state.solutionData)) ;
            let oldlist = {}
            for(let key in tmp) {
                if(tmp[key].solutionType == undefined || tmp[key].solutionType == '0' ){
                    tmp[key].key = key;
                    oldlist[key] = tmp[key];
                }
            }
            return oldlist;
        },
        solutionEnable: {
            set(value){
                this.$store.state.backData.solutionEnable = value;
            },
            get(){
                return this.$store.state.backData.solutionEnable;
            }
        },
        subSolutionEnable: {
            set(value){
                this.$store.state.backData.subSolutionEnable = value
            },
            get(){
                return this.$store.state.backData.subSolutionEnable;
            }
        },
        newlist() {
            return this.list.map((item) => item.key);
        },
        solutionUnEnable() {
            //通過啟用的方案和安裝的方案進行對比
            let newArr = [];
            // let install = this.$store.state.backData.solutionInstall;
            //如果type == 0 || 
            let install = [];
            for (let key in this.$store.state.route.routeList) {
                if(this.oldlist[key]== undefined){
                    continue
                }
                install.push(key);
            }
            
            const arr = install.filter((item) => {
                return this.newlist.indexOf(item) === -1;
            });
            for (let item of arr) {
                for (let key in this.oldlist) {
                    if (item === key) {
                        newArr.push(this.oldlist[key]);
                    }
                }
            }
            return newArr;
        },
        returnInfo() {
            let arr = [];
            for (let item of this.list) {
                arr.push(item.key);
            }
            return arr;
        },
    },
    methods: {
        opentabel(solution){
            if(this.on_click == solution.key){
                this.on_click = ''
                this.features = []
            }else{
                this.on_click = solution.key
                let features = this.$store.state.overview.button[solution.key].features
                this.features = features;
            }
        },
        translation(value) {
            return this.$t(`${value}`);
        },
        name( key, type ) {
            if(this.subSolutionEnable[key].indexOf(type) == -1){
                return this.$t("GENERAL.ENABLE");
            }else{
                return this.$t("GENERAL.DISABLE");
            }
        },
        async load() {
            this.$store.dispatch("resetRoute", this.returnInfo).then(() => {
                //重寫版權標示
                this.$store.state.backData.copyrightTW = this.copyrightTW;
                this.$store.state.backData.copyrightEN = this.copyrightEN;
                //將背景覆蓋
                this.$refs.backgroundSelect.changeBack();
                //重置路由
                reset();
                //深拷貝以及路由格式化
                this.$router.addRoutes(filterRouter(deepCopy(this.getTrueRoutes)));
                this.$router.replace("/home/" + this.returnInfo[0]);

                this.$nextTick(() => {
                    //回傳後端
                    setBackData(this.$store.state.backData).then((res) => {
                        //返回首頁
                        this.$router.replace("/home/" + this.returnInfo[0]);
                    });
                });
            });
            
            let disableSub = {}
            let button = this.$store.state.overview.button
            for(let sol of Object.keys(button)){
                let isEnable = this.solutionEnable.findIndex(sol_enable => sol_enable === sol)
                if(button[sol].features.length === 1 || isEnable === -1) continue;

                //若不變則不需再重新設置
                let isChange = false;
                if(this.subSolutionEnable[sol].length === this.oldSelectSub[sol].length){
                    for(let selected_sub of this.subSolutionEnable[sol]){
                        let findSame = this.oldSelectSub[sol].findIndex(subsol => subsol === selected_sub)
                        if(findSame === -1){
                            isChange = true
                            break;
                        }
                    }
                }else isChange = true; 
                if(!isChange) continue;

                disableSub[sol] = []
                //取得要被停用的設備
                for(let feature of button[sol].features){
                    isEnable = this.subSolutionEnable[sol].findIndex(subsol => {
                        return subsol === feature.type || subsol === feature.name
                    })
                    if(isEnable === -1) {
                        disableSub[sol].push( feature.type || feature.name)
                    }
                }
            }
            //set sub solution status
            for(let sol of Object.keys(disableSub)){
                await setSubSolutionStatus( sol, disableSub[sol].toString()) //disable target
            }
        },
        startUp(item) {
            if(this.list.length>1){
                this.list.splice(this.list.indexOf(item), 1);
            }else{
                alert("請啟用至少一個方案");
            }
        },
        turnOff(item) {
            this.list.push(item);
        },
        async addsub(solution , sub){
            let tmp = this.subSolutionEnable[solution]
            //let dea = this.deactivateSub[solution]
            let target = sub.type || sub.name
            if(tmp.indexOf(target) == -1 ){ //&& dea.indexOf(target) != -1
                this.subSolutionEnable[solution].push(target)
                //this.deactivateSub[solution].splice(dea.indexOf(target), 1)
            }else{
                this.subSolutionEnable[solution].splice(tmp.indexOf(target) , 1)
                //this.deactivateSub[solution].push(target)
            }
            //*****如果不刷新，畫面不會有反應
            this.on_click = ''
            this.on_click = solution

            //if(dea.length==this.subSolutionLength[solution]){
            if(tmp.length==0){
                alert("請啟用至少一個子方案");
                this.addsub( solution, sub) //recover last step
            }
        },
    },
    watch: {},
};
</script>

<style scoped>
.new-group{
    /* border: 1px solid #ffffff; */
    height: 60px;
    display: flex;
    justify-content: flex-end;;
    align-items: center;
}
.new-group-item{
    /* border: 1px solid #ffffff; */
    color: #ffffff;
    background-color: #8eb1be86;
    margin-bottom: 5px;
    font-size: 2vw;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60%;
}




.contents {
    height: 100%;
    overflow: auto;
    width: 85%;
    margin: auto;
}
.contents::-webkit-scrollbar {
    width: 10px;
}

.contents::-webkit-scrollbar-thumb {
    background-color: #4285f4 !important;
    border-radius: 10px !important;
}
.contents::-webkit-scrollbar-track {
    background: #f5f5f5 !important;
    border-radius: 10px !important;
}
.title-text {
    font-size: 2.5vw;
    margin-bottom: 15px;
    color: #01ffff;
    font-size: 2.5vw;
}
.buttons {
    margin-top: 35px;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
.list-group-item {
    /* border: 1px solid #ffffff; */
    background-color: #8eb1be86;
    margin-bottom: 5px;
    height: 80px;
    color: #ffffff;
    display: flex;
    border-radius: 5px;
}


.bot-list {
    margin-top: 15px;
}
.solution-content {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5vw;
}
.button-content {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5vw;
}
.select-box {
    display: flex;
}
.select-block {
    width: 60%;
    margin-left: auto;
}
.style-setting {
    margin-bottom: 15px;
}
.text-black {
    color: black;
    width: 100%;
}
hr {
    border: 0;
    height: 2px;
    background-image: linear-gradient(
        to right,
        rgba(0.5, 35, 100, 185),
        #05ffff,
        rgba(0.5, 35, 100, 185)
    );
    width: 100%;
}
input {
    background-color: #9bebff;
    color: #000000;
    font-weight: bold;
    border-radius: 2px;
    border-width: 0px;
}
</style>