<template>
  <div class="DEVICELIST_CONTENT">
    <div class="devicelist_view__title_item slaveM" :style='stylerSize(100,15,0,2)'>
      <div class="slaveL _36" :style='stylerSize(10,8,14.5,0)'>{{ $t('GENERAL.CONTEXT_NAME') }}</div>
      <div class="slaveL _36" :style='stylerSize(10,8,45,0)'>{{ $t('GENERAL.CONTROL_DEVICE_LIST') }}</div>
    </div>
    <div class="slaveM overFlowY"  :style='stylerSize(100,85,0,15)'>
      <div class="devicelist_view__content_item slaveM" 
          v-for="(item, index) in configList" 
          :key="index"
          :class="item.isModify && 'changeInfo'"
          :style='stylerwd(100,30,0,index)'
      >
        <div class="slaveC _36" :style='stylerSize(20,100,10,0)'>{{ item.scene_name }}</div>
        <div class="slaveC _36 " :style='stylerSize(30,100,36,0)'>
          <div class="slaveL">  
            <img
              :style='stylerSize(20,45,0,0)'
              src="~assets/images/arrow_down_03.png"
              @click="showItemClick(index)"
            /> 
              total: {{item.control_list.length}}
          </div>
          <transition name="dropdown" v-if="activeShow === index && list_len < 6">  
            <div class="slaveC _28 " style=" overflow-y:hidden;" :style='stylerSize(85,100,7,30)' >
              <div style="word-wrap:break-word" v-for="(itemx, indey) in item.control_list" :key="indey" >
                {{ nameList[itemx.dev_id] || itemx.dev_id }} {{itemx.description }} {{ itemx.name }}
              </div>
            </div>
          </transition>

          <transition name="dropdown" v-if="activeShow === index && list_len >= 6">

            <div class="slaveM _28 divfocus" style="word-wrap:break-word; overflow-x:auto;" :style='stylerSize(85,95,8,30)' >
              <div v-for="(itemx, indey) in item.control_list" :key="indey" >
                {{ nameList[itemx.dev_id] || itemx.dev_id }} {{itemx.description }} {{ itemx.name }}
              </div>
            </div>
   
          </transition>
          
        </div>
        <div class="slaveC" :style='stylerSize(7,50,68,0)'>
          <div class="slaveL">
            <img :style='stylerSize(83,0,0,0)' src="~assets/images/modify.png" @click="goChange(item)"/>
          </div>
        </div>
        <div class="slaveC" :style='stylerSize(7,50,74,0)'>
          <div class="slaveL">
            <img :style='stylerSize(82,0,0,0)' src="~assets/images/remove.png" @click="deleteDevice(item)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceInfo } from "network/solution";
import {
  getSceneList,
  getControlAttr,
  setSceneList,
  deleteSceneList
} from "network/scence"
import { createNamespacedHelpers } from 'vuex'
import { appendSetDelete } from "common/mixin/appendSetDelete"
import { show_config , true_config , add_config , Delsetting , del_config , order_config} from "../store/data";

const { mapState: mapContextState, mapActions: mapContextAction, mapMutations: mapConetextMutation } = createNamespacedHelpers('context')

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
  //mixins: [appendSetDelete],
  async created(){
      console.log(show_config)
      console.log(this.configList)
      //this.configList = []
      show_config.length = 0
      console.log(true_config)
      this.action_list = await this.getList()
      console.log(this.list)
      if(true_config.length == 0){
          /*const { device: devList } = await getDeviceInfo()
          console.log(devList)
          const res = await getSceneList()
          console.log(res)
          const sceneList = res.scene_profile
          const { module_list: controlType } = await getControlAttr(null, "zh-tw")//await getControlAttr(null, "zh-tw")
        
          console.log(controlType)
          console.log(sceneList)
          for(let scene of sceneList) {
            // console.log(scene)
            // console.log(controlType)
            for(let item of scene.control_list) {
              // console.log(item)
              const { cmd, cav } = item
              const [ command, attr, value ] = cav.split("_")
              // console.log(command, attr, value)
              const devId = item.dev_id.split("|")[0]

              for(let i of devList){
                if(i["dev_id"] === devId){
                    var dev = i
                }
              }
              // const dev = devList.find(x => { 
              //   return x.dev_id === devId
              // })
              //console.log(dev)
              if(!dev) continue
              const module = dev?.dev_id.substr(2, 2) + "-" + dev?.name
              // console.log(controlType)
              for(let i of controlType){
                  if(i["module_name"] === module){
                      var { ctl_attr_list: ctrList } = i
                  }
              }
              //const { ctl_attr_list: ctrList } = controlType.find(x => x.module_name === module)
              for(let i of ctrList){
                  if(i["writeCmd"] === cmd && i["attrId"] === attr){
                      var ctl_info = i
                  }
              }
              //const ctl_info = ctrList.find(x => x.writeCmd === cmd && x.attrId === attr);
              //console.log(ctl_info)
              if(ctl_info){
                  const { value_list: valueList, description, range } = ctl_info;
                  if(ctl_info.control_type != 3){
                    
                      // console.log(valueList)
                      item.description = description
                      for(let i of valueList){
                          if(i["value"] === value){
                              var { name } = i
                          }
                      }
                      //const { name } = valueList.find(x => x.value === value)
                      item.name = name
                  }
                  else{
                      item.description = description
                      item.name = value
                  }
                
              }
            }
          }
          console.log(sceneList)*/
          //this.configList = JSON.parse(JSON.stringify(sceneList))
          this.configList = JSON.parse(JSON.stringify(this.list))
          /*for(let i of sceneList){
              order_config.push(i)
          }*/
      }
      else{
          for(let i of true_config){
              this.configList = true_config
              //order_config.push(i)
          }
      }
      
      this.configList = this.updateIndex(this.configList)
      /*for(let i of this.configList){
          order_config.push(i)
      }*/
      console.log(true_config)
      console.log(this.configList)
      
      for(let i of this.configList){
          console.log(i)
          show_config.push(i)
      }
  },
  async mounted() {
    let i = 1
    this.nameList = this.$store.state.deviceName;
    //console.log(this.list)
    // this.$bus.$on("previousPage", () => {
    //   console.log("離開")
    // });
    // await getControlAttr().then(res => {
    //   console.log(res)
    // })

    //this.getList()
    
    this.$bus.$on("configApply", async () => {
      this.$store.commit("setLoadingState");
      console.log("第"+i+"次", "存前")
      this.save_list();
      setTimeout(() => {
        this.$store.commit("setLoadingState");
        //this.getList("re")
      }, 2000);
      console.log("第"+i+"次", "存後")
      this.get_list()
      console.log("第"+i+"次", "更新")
    })
  },
  beforeDestroy() {
    let path = this.$route.path.split("/")
    if(path[path.length - 1] !== "context") {
      //this.resetList()
    }
    this.$bus.$off('configApply')
  },
  computed: {
    ...mapContextState([
      "list"
    ]),
    lol() {
      return "---"
    },
    stylerwd: function(){
        return function(w='100',h='100',k='0',t='0',f='0'){
            let tmp = ""
            let len = this.list_len
            let top = 0
            if(len > 5){
                top = 20*t + 20
            }
            else{
                top = 20*t+4.5*len
            }
            
            //console.log(this.flag,t,this.temp_index)
            if(this.flag==-1){
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
            }
            else if(this.flag>-1 && t>this.flag){
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+top+"%;"; 
            }
            else{
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
            }

            /*if(t == this.temp_index){
                tmp = "width: "+w+"%;height:"+(h+(len*3))+"%;left:"+k+"%;top:"+(20*t)+"%;";
            }*/
            return tmp 
        }
    },
    /*stylerImg: function(){
        return function(w='100',h='100',k='0',t='0',f='0'){
            let tmp = ""
            console.log("圖片",t,this.temp_index)
            if(this.flag==-1){
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+0+"%;";
            }
            else if(this.flag>-1 && t>this.flag){
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+0+"%;"; 
            }
            else if(t == this.temp_index){
                console.log(this.list_len)
                tmp = "width: "+w+"%;height:"+((h/this.list_len)+4.5)+"%;left:"+k+"%;top:"+0+"%;";
            }
            else{
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+0+"%;";
            }
            return tmp 
        }
    },*/
  },
  methods: {
    ...mapConetextMutation([
      "resetList",
      "deleteListDev"
    ]),
    ...mapContextAction([
      "getList",
      "saveList",
    ]),
    async get_list(){
        /*const { device: devList } = await getDeviceInfo()
        console.log(devList)
        const res = await getSceneList()
        console.log(res)
        const sceneList = res.scene_profile
        const { module_list: controlType } = await getControlAttr(null, "zh-tw")//await getControlAttr(null, "zh-tw")
      
        console.log(controlType)
        console.log(sceneList)
        for(let scene of sceneList) {
          // console.log(scene)
          // console.log(controlType)
          for(let item of scene.control_list) {
            // console.log(item)
            const { cmd, cav } = item
            const [ command, attr, value ] = cav.split("_")
            // console.log(command, attr, value)
            const devId = item.dev_id.split("|")[0]

            for(let i of devList){
              if(i["dev_id"] === devId){
                  var dev = i
              }
            }
            // const dev = devList.find(x => { 
            //   return x.dev_id === devId
            // })
            //console.log(dev)
            if(!dev) continue
            const module = dev?.dev_id.substr(2, 2) + "-" + dev?.name
            console.log("😊😊😊😊😊😊😊😊😊😊")
            console.log(controlType)
            console.log(module)
            for(let i of controlType){
                if(i["module_name"] === module){
                    var { ctl_attr_list: ctrList } = i
                }
            }
            //const { ctl_attr_list: ctrList } = controlType.find(x => x.module_name === module)
            for(let i of ctrList){
                if(i["writeCmd"] === cmd && i["attrId"] === attr){
                    var ctl_info = i
                }
            }
            //const ctl_info = ctrList.find(x => x.writeCmd === cmd && x.attrId === attr);
            //console.log(ctl_info)
            if(ctl_info){
                const { value_list: valueList, description, range } = ctl_info;
                if(ctl_info.control_type != 3){
                  
                    // console.log(valueList)
                    item.description = description
                    for(let i of valueList){
                        if(i["value"] === value){
                            var { name } = i
                        }
                    }
                    //const { name } = valueList.find(x => x.value === value)
                    item.name = name
                }
                else{
                    item.description = description
                    item.name = value
                }
              
            }
          }
        }
        console.log(sceneList)*/
        this.configList = JSON.parse(JSON.stringify(this.list))

        for(let i of this.configList){
            console.log(i)
            show_config.push(i)
        }
    },

    goChange(item) {
      console.log(item)
      console.log(this.list)
      let path = this.$route.path.replace(/configView/i, "ChangeConfig")
      console.log(path)
      
      if(true_config.length == 0){
          for(let i of this.configList){
              console.log(i)
              true_config.push(i)
          }
      }
      console.log(true_config)
      this.$router.push({
        path: path,
        query: {
          sceneId: item.scene_id,
          orderId: item.orderId,
          change: true,
        },
      });
    },
    deleteDevice(item) {
      console.log(this.configList)
      //console.log(index)
      if(true_config.length == 0){
          for(let i of this.configList){
              console.log(i)
              true_config.push(i)
          }
      }
      Delsetting(item)
      //this.deleteListDev(index)
      this.configList = this.updateIndex(true_config)
      console.log("後",true_config)
      console.log(del_config)
      //this.configList = true_config
    },
    showItemClick(index) {
      console.log(index)
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
    async save_list(){

        if(del_config.length > 0) {
            for(let item of del_config) {
                let del_res = await deleteSceneList(item.scene_id)
                console.log(del_res)
            }
        }

        for(let item of true_config) {
            // console.log(item)
            let i = 0
            if(!item.isModify){
                
                continue
            } 
            let statement = "";
            add_config.push(item)
            for(let itemx of item.control_list) {
              statement = statement + `${itemx.dev_id}_${itemx.cmd}_${itemx.cav};`
            }
            // console.log(statement.substr(0, statement.length - 1))
            // console.log(statement)
            // console.log(item.scene_name, statement, item.scene_id)
            const res = await setSceneList(item.scene_name, statement.substr(0, statement.length - 1), item.scene_id)
            console.log(res)
            delete item.isModify
        }
        this.configList = true_config
        console.log(add_config)
        console.log(this.configList)
    },

    getCurrentLan(state, getters, rootState, rootGetters) {
      return rootGetters.getBackLang
    }
  }
}
</script>
