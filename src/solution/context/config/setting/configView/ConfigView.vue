<template>
    <div class="main white_view" :style='stylerSize()'>
        <div class="title_item slaveM" :style='stylerSize(100,10,0,2)'>
            <div class="slaveC _36" :style='stylerSize(10,100,10,0)'>{{ $t('GENERAL.CONTEXT_NAME') }}</div>
            <div class="slaveC _36" :style='stylerSize(10,100,45,0)'>{{ $t('GENERAL.CONTROL_DEVICE_LIST') }}</div>
        </div>
        <div class="slaveM overFlowY"   :style='stylerSize(100,85,0,15)'>
            <div class="slaveM"         :style='stylerwd(100,20,0,index)' v-for="(item, index) in configList" :key="index" :class="item.isModify && 'change_item'">
                <div class="slaveC _36" :style='stylerSize(30,100,0,0)'>{{ item.scene_name }}</div>
                <div class="slaveC _36 " :style='stylerSize(25,100,35,0)'>
                    <img class="slaveL" :style='stylerSize(15,40,0,0)' src="~assets/images/arrow_down_03.png" @click="showItemClick(index)"/> 
                    total: {{item.control_list.length}}
                    <transition name="dropdown" v-if="activeShow === index ">
                        <div class="slaveL _28 divfocus"    :style='stylerSize(150,95,0,50)' style="word-wrap:break-word; white-space: nowrap; overflow-x:auto;" >
                            <div v-for="(itemx, indey) in item.control_list" :key="indey" >
                                {{ nameList[itemx.dev_id] || itemx.dev_id }} {{itemx.description }} | {{ itemx.name }}
                            </div>
                        </div>
                    </transition>
                </div>
                <img class="slaveL" :style='stylerSize(5,50,75,0)' src="~assets/images/modify.png" @click="goChange(item)"/>
                <img class="slaveL" :style='stylerSize(5,50,84,0)' src="~assets/images/remove.png" @click="deleteDevice(item)"/>
            </div>
        </div>
    </div>
</template>

<script>
import { setSceneList, deleteSceneList } from "network/scence";
import {SceneList , getScene , show_config , true_config , add_config , Delsetting , del_config , restart} from "../../../data/ston/data.js"

export default {
    data() {
        return {
            activeShow: null,
            nameList: [],
            controlList: [],
            flag: -1,
            list_len: 0,
            temp_index: -1,
            temp_list: [],
            configList: [],
            action_list: [],
        }
    },
    //mixins: [],
    async created(){
        this.$store.state.loading = true;
        show_config.length = 0
        console.log("🥦🥦🥦🥦🥦🥦", true_config)
        await getScene()       //更新情境
        if(true_config.length == 0){
            this.configList = JSON.parse(JSON.stringify(SceneList))
            //console.log(SceneList)
        }
        else{
            this.configList = true_config
        }
        this.configList = this.updateIndex(this.configList)
        //console.log(this.configList)
        
        for(let i of this.configList){
            show_config.push(i)
        }
        this.$store.state.loading = false;
    },
    async mounted() {
        this.nameList = this.$store.state.deviceName;
        this.$bus.$on("previousPage", () => {
            console.log("離開")
            getScene()      //更新情境
            restart()       //清空暫存
            console.log(true_config)
            console.log(del_config)
        });
        //套用
        this.$bus.$on("configApply", async () => {
            this.$store.commit("setLoadingState");
            await this.save_list();
            this.$store.commit("setLoadingState");
            this.$router.back();
        })
    },
    async beforeDestroy() {
        let path = this.$route.path.split("/")
        console.log(path)

        this.$bus.$off('configApply')
        this.$bus.$off("previousPage")
    },
    computed: {
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                let top = 20*t + 15
                //console.log(this.flag,t)
                if(this.flag>-1 && t>this.flag){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+top+"%;"; 
                }
                else{
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
                }
                return tmp 
            }
        },
    },
    methods: {
        //修改
        goChange(item) {
            //console.log(item)
            let path = this.$route.path.replace(/configView/i, "ChangeConfig")

            if(true_config.length == 0){
                for(let i of this.configList){
                    true_config.push(i)
                }
            }
            //console.log(true_config)
            this.$router.push({
                path: path,
                query: {
                    sceneId: item.scene_id,
                    orderId: item.orderId,
                    change: true,
                },
            });
        },
        //刪除
        deleteDevice(item) {
            //console.log(this.configList)
            if(true_config.length == 0){
                for(let i of this.configList){
                    true_config.push(i)
                }
            }
            Delsetting(item)
            this.configList = this.updateIndex(true_config)
            //console.log(del_config)
        },
        //判斷下拉式列表是否展開
        showItemClick(index) {
            //console.log(index)
            this.list_len = this.configList[index].control_list.length
            if(index === this.activeShow){
                this.activeShow = null
                this.flag = -1
                this.temp_index = -1
            }else{
                this.activeShow = index
                this.flag = index
                this.temp_index = index
            }
            
        },
        updateIndex(list){
            for(let i in list){
                list[i]["orderId"] = i
            }
            return list
        },

        //將結果透過API套用
        async save_list(){

                if(del_config.length > 0) {
                    for(let item of del_config) {
                        let del_res = await deleteSceneList(item.scene_id)
                        //console.log(del_res)
                    }
                }
                console.log(true_config)
                for(let item of true_config) {
                    if(!item.isModify){   
                        continue
                    } 
                    let statement = "";
                    console.log(item)
                    add_config.push(item)
                    for(let itemx of item.control_list) {
                        statement = statement + `${itemx.dev_id}_${itemx.cmd}_${itemx.cav};`
                    }
                    const res = await setSceneList(
                        item.scene_name, 
                        statement.substr(0, statement.length - 1), 
                        item.scene_id,
                        item.message,
                        item.delay,
                        item.dependency,
                        item.dependency_delay_time,
                    )
                    //console.log(res)
                    delete item.isModify
                }
                console.log(true_config)
                if(true_config.length != 0) {
                    this.configList = JSON.parse(JSON.stringify(true_config))
                }
                
                //console.log(this.configList)
        },

    }
}
</script>
