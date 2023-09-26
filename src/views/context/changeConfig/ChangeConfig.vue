<template>
  <div class="main" :style='stylerSize()'>
    <div class="slaveM" :style='stylerSize(100,30,0,2)'>
      <span class="slaveC _36 text_item" :style='stylerSize(10,20,22,0)'>{{ $t("GENERAL.CONTEXT_NAME") }}:</span>
      <input class="slaveL _32 hmi_setting_content_input" :style='stylerSize(25,20,15,20)' v-model="currentName" />
    
      <button class="slaveC _32 hmi_setting_content_button" :style='stylerSize(15,20,60.5,10)' @click="checkContext">{{ $t("GENERAL.CHECK_CONTEXT") }}</button>

      <span class="slaveC _36 text_item" :style='stylerSize(10,20,22,48)'>{{ $t("GENERAL.DEVICE_KIND") }}:</span>
      <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(25,20,15,68)' v-model="currentType">
        <option v-for="(item, index) in typeList" :key="index" :value="item">
          {{ translation(typeTextChange(item.type)) }}
        </option>
      </select>
    
      <span class="slaveC _36 text_item" :style='stylerSize(10,20,63,48)'>{{ $t("GENERAL.DEVICE_NAME") }}:</span>
      <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(25,20,55.5,68)' v-model="currentDev">
        <option
          v-for="(item, index) in deviceInType"
          :key="index"
          :value="item"
        >
          {{ nameList[item.dev_id] || item.dev_id }}
        </option>
      </select>
    </div>
    <!-- <div class="control-title">控制型態:</div> -->
    <div class="slaveM overFlowY" :style='stylerSize(100,70,0,30)'>
      
      <span class="slaveC _36 item-title" :style='stylerSize(10,20,18,5)'>{{ $t("GENERAL.DEVICE_NAME") }}</span>
      <span class="slaveC _36 item-title" :style='stylerSize(10,20,55,5)'>{{ $t("GENERAL.CONTROL_STATUS") }}</span>
      <!--span>Object.keys(item.descriptionList).length*5</span-->
      <div
        v-for="(item, id) in subDeviceList"
        :key="id"
        class="slaveM "
        :style='stylerSize(100,20,0,20*id+15+item.last_desList_len*5)'
        
      >
        <span class="slaveC _32 title" :style='stylerSize(30,50,8,0)'>{{ item.name || item.id }}</span>

        <div class="slaveL" :style='stylerSize(50,50,40,90*index)' v-for="(des, index) in Object.keys(item.descriptionList)" :key="index" :value="des">
            <span class="slaveL _28 title" :style='stylerSize(20,100,30,0)'>{{des}}</span>
            
            <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(20,80,30,80)' v-model="subDeviceList[id].currentSelect[des]">
              <option v-for="(itey, indey) in item.descriptionList[des]" :key="indey" :value="itey.value">
                {{ itey.name }}
              </option>
            </select>
            <button class="slaveC _28 hmi_setting_content_button" :style='stylerSize(10,80,80,80)' @click="itemJoin(item,des,subDeviceList[id].currentSelect[des])">
              加入
            </button>
        </div>

        <!--select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(10,50,57.5,0)' v-model="subDeviceList[index].currentSelect">
          <option v-for="(itey, indey) in item.controlList" :key="indey" :value="itey.value">
            {{ itey.name }}
          </option>
        </select>

        <button class="slaveC _28 hmi_setting_content_button" :style='stylerSize(7,50,80,0)' @click="itemClick(item)">
          加入
        </button-->
      </div>
    </div>

    <config-store :isSelectArr.sync="isSelectArr" :nameList="nameList" @deleteItem="deleteItem" />
  </div>
</template>

<!--template>
  <div class="content-block">
    <div class="select-block">
      <div class="top-select">
        <span>{{ $t("GENERAL.CONTEXT_NAME") }}:</span>
        <input v-model="currentName" />
      </div>
      <div class="top-select">
        <button @click="checkContext">{{ $t("GENERAL.CHECK_CONTEXT") }}</button>
      </div>
    </div>
    <div class="select-block">
      <div class="top-select">
        <span>{{ $t("GENERAL.DEVICE_KIND") }}:</span>
        <select v-model="currentType">
          <option v-for="(item, index) in typeList" :key="index" :value="item">
            {{ translation(typeTextChange(item.type)) }}
          </option>
        </select>
      </div>
      <div class="top-select">
        <span>{{ $t("GENERAL.DEVICE_NAME") }}:</span>
        <select v-model="currentDev">
          <option
            v-for="(item, index) in deviceInType"
            :key="index"
            :value="item"
          >
            {{ nameList[item.dev_id] || item.dev_id }}
          </option>
        </select>
      </div>
    </div>
    <!-- <div class="control-title">控制型態:</div> ->
    <div class="control-content">
      <div class="control-item item-title">
        <span>{{ $t("GENERAL.DEVICE_NAME") }}</span>
        <span>{{ $t("GENERAL.CONTROL_STATUS") }}</span>
        <span></span>
      </div>
      <div
        v-for="(item, index) in subDeviceList"
        :key="index"
        class="control-item"
      >
        <!-- <span>{{ item }}</span> ->
        <span>{{ item.name || item.id }}</span>
        <!--div v-for="(des, index) in Object.keys(item.descriptionList)" :key="index" :value="des">
          <div class="top-select">  
            <span style="width:50%;">{{des}}</span>
            
            <select>
              <option v-for="(itey, indey) in item.descriptionList[des]" :key="indey" :value="itey.value">
                {{ itey.name }}
              </option>
            </select>
          </div>
        </div->
        <span>
          <select v-model="subDeviceList[index].currentSelect">
            <option v-for="(itey, indey) in item.controlList" :key="indey" :value="itey.value">
              {{ itey.name }}
            </option>
          </select>
        </span>
        <span>
          <button class="add-buttom" @click="itemClick(item)">
            加入
          </button>
        </span>
      </div>
    </div>
    <config-store :isSelectArr.sync="isSelectArr" :nameList="nameList" @deleteItem="deleteItem" />
  </div>
</template-->

<script>
import ConfigStore from "./childComps/ConfigStore";
import { getControlInfo, getSubdevice, getControlAttr } from "network/scence";
import { getDeviceInfo } from "network/solution";
import { typeToKind } from "common/constant/type"
import { true_config , show_config , Setsetting , Addsetting } from "../store/data";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { createNamespacedHelpers } from 'vuex'

const { mapState: mapContextState, mapActions: mapContextAction, mapMutations: mapContextMutation } = createNamespacedHelpers('context')

export default {
  components: {
    ConfigStore,
  },
  data() {
    return {
      sceneId: this.$route.query.sceneId,
      orderId: this.$route.query.orderId,
      isChange: this.$route.query.change,
      list: [],
      isSelectArr: [],
      typeList: [],
      nameList: {},
      temp_sceneId: 0,
      currentType: "",
      currentDev: "",
      currentName: "",
      temp_orderConfig: [],

      subDeviceList: [], //控制清單
    };
  },
  async created() {
    console.log(this.currentList)
    console.log(this.$store.state.deviceCommand)
    console.log(true_config)
    if(this.sceneId) {
      //true_config
      /*this.getList().then(() => {
        const scene = this.currentList[this.sceneId]
        console.log(scene)
        this.currentName = scene?.scene_name
        this.isSelectArr = scene?.control_list
      })*/
    }
    for(let id of Object.keys(true_config)){
        if(id == this.orderId){
            console.log(true_config[id].scene_name)
            this.currentName = true_config[id].scene_name;
            this.isSelectArr = true_config[id].control_list;
            break;
        }
    }
    console.log(this.currentList)
    let typeArr = [];
    /*await getControlInfo().then(res => {
      // console.log(res)
      if(res.status !== "ok") return
      // 將相同type的合併
      console.log(res)
      const arr = res.module_list
      console.log(arr)
      typeArr = arr.map(item => item.module_name.substr(0, 2)).filter((item, index, arr) => arr.indexOf(item) === index)
    })*/
    for(let i of Object.keys(this.$store.state.deviceCommand.controlClassList)){
        typeArr.push(i.slice(0,2))
    }
    typeArr = typeArr.filter((item, index, arr) => arr.indexOf(item) === index)
    console.log(typeArr)
    this.nameList = this.$store.state.deviceName;

    getDeviceInfo().then((res) => {
      // console.log(res)
      if (res.status !== "ok") return;
      // 將相同type的合併
      console.log(res)
      const arr = res.device;
      const newArr = [];
      for (let item of typeArr) {
        const obj = {};
        const list = arr.filter((x) => x.dev_id.substr(2, 2) === item);
        obj.type = item;
        obj.list = list;
        newArr.push(obj);
      }
      console.log(newArr)
      // console.log(newArr);
      this.typeList = newArr;
      console.log(this.typeList)
      this.currentType = this.typeList[0];
      this.currentDev = this.currentType.list[0];
    });
    console.log(true_config)

    //取得現在選擇的
    /*for(let devid of Object.keys(true_config)){
        if(devid == this.deviceId){
            // for(let devarray of true_config[devid].value){
            //     this.devicelist[devarray.deviceId] = devarray.page_type;
            // }
            console.log(true_config[devid].deviceName)
            this.currentName = true_config[devid].deviceName;
            this.value = true_config[devid].value;
            break;
        }
    }*/
    
  },

  mounted() {
    this.$bus.$on("configLoad", () => {
      // 確認有沒有更改
      if(!this.checkEmpty) return alert("data missing")
      let empty_flag = false
      let emp_id = -1
      console.log(true_config)
      console.log(this.sceneId)
      if(this.sceneId == undefined){
          console.log(show_config)
          this.temp_orderConfig = JSON.parse(JSON.stringify(show_config))
          this.temp_orderConfig = this.temp_orderConfig.sort(function (a, b) {
              return Number(a.scene_id) < Number(b.scene_id) ? 1 : -1;
          });
          console.log(this.temp_orderConfig)
          for(let i = this.temp_orderConfig.length-1; i >= 0; i--) {
              if(i == 0){
                  break
              }
              if((Number(this.temp_orderConfig[i].scene_id)+1) != Number(this.temp_orderConfig[i-1].scene_id)){
                  empty_flag = true
                  emp_id = Number(this.temp_orderConfig[i].scene_id)+1
                  break
              }
              else{
                  continue
              }
          }
          if(empty_flag == true){
              console.log(emp_id)
              this.sceneId = emp_id
          }
          else{ 
              this.sceneId = (Number(this.temp_orderConfig[0].scene_id) + 1)
          }
          
      }
      console.log(this.isSelectArr)
      let item = {
        control_count: this.isSelectArr.length,
        control_list: this.isSelectArr,
        scene_id: this.sceneId,
        orderId: this.orderId,
        scene_name: this.currentName,
        isModify: true
      }
      console.log(typeof(this.isChange))
      if(this.isChange == "true") {
          console.log("編輯")
          Setsetting(this.orderId, item)
      }
      else{
          Addsetting(item);
      }
      
      console.log("更新後",this.sceneId)
      //this.modifyList(item)
      console.log("暫存")
      this.$router.back()
    })
    this.$bus.$on("previousPage", () => {
    });
  },
  beforeDestroy() {
    this.$bus.$off("previousPage");
    this.$bus.$off("configLoad")
    let path = this.$route.path.split("/")
    if(path[path.length - 1] !== "context") {
      this.resetList()
    }
  },
  computed: {
    ...mapGetters(["getType", "getBackLang"]),
    ...mapContextState({
      currentList: state => state.list
    }),
    deviceInType() {
      return this.currentType.list;
    },
    // subDeviceInType() {
    //   return this.currentDev.subid_list
    // }
    checkEmpty() {
      if(this.isSelectArr.length === 0 || !this.currentName) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapContextMutation([
      "modifyList",
      "resetList"
    ]),
    ...mapContextAction([
      "getList",
    ]),
    /*itemClick(item) {
      console.log(item)
      const currentItem = item.controlList.find(x => x.value === item.currentSelect)
      console.log(currentItem)
      const obj = {
        cav: `${item.channel}_${currentItem.attrId}_${currentItem.value}`,
        cmd: currentItem.writeCmd,
        description: currentItem.description,
        dev_id: item.targetId,
        name: currentItem.name
      }
      this.isSelectArr.push(obj)
      alert("success");
    },*/
    itemJoin(item, des, value) {
      console.log(item, des, value)
      let currentItem = item["descriptionList"][des].findIndex(e => e.value == value)
      //console.log(currentItem)
      const obj = {
        cav: `${item.channel}_${item["descriptionList"][des][currentItem].attrId}_${item["descriptionList"][des][currentItem].value}`,
        cmd: item["descriptionList"][des][currentItem].writeCmd,
        description: item["descriptionList"][des][currentItem].description,
        dev_id: item.targetId,
        name: item["descriptionList"][des][currentItem].name
      }
      this.isSelectArr.push(obj)
      alert("success");
    },
    checkContext() {
      this.$bus.$emit("dialogClick");
    },
    deleteItem(index) {
      this.isSelectArr.splice(index, 1)
    },
    typeTextChange(value){
      return typeToKind(value);
    }
  },
  watch: {
    currentType: async function () {
        this.subDeviceList = []
        console.log(this.currentDev)
        console.log(this.currentType)
        this.currentDev = this.currentType.list[0];
    },

    currentDev: async function () { // 獲取可控制清單
      console.log(this.currentDev);
      this.subDeviceList = []
      /*console.log(this.subDeviceList)*/
      const moduleName =
        this.currentDev.dev_id.substr(2, 2) + "-" + this.currentDev.name;


      /*const res = await getSubdevice(this.currentDev.dev_id);
      console.log(res)
      const { module_list } = res;
      console.log(module_list)*/

      let subList = []; // 全部轉為清單
      /*if(module_list.length === 0) { 
        subList = [{
          id: this.currentDev.dev_id,
          name: this.nameList[this.currentDev.dev_id]
        }]
      } else {
        subList = module_list[0].subdev_list[0].subid_list.map((item) => {
          const obj = {};
          obj.id = item;
          obj.name = this.nameList[item];
          return obj;
        });
      }*/

      let infoList = []
      let attrList = []

      for(let i of this.$store.state.deviceCommand.commandDeviceList[this.currentDev.dev_id.substr(2, 2)]){
          //console.log(i["dev_id"].slice(0,20))
          if(i["dev_id"].slice(0,20) == this.currentDev.dev_id){
              subList.push({id: i["dev_id"], name: this.nameList[i["dev_id"]]})
              infoList.push({dev_id: i["dev_id"], channel: i["ctl_info"][0]["channel"], control_type: i["ctl_info"][0]["control_type"], target_id: i["ctl_info"][0]["target_id"]})
          }
          
      }
      //console.log(subList)
      //const { module_list: [{device_list: infoList}] } = await getControlInfo(this.currentDev.dev_id)
      //console.log(infoList)
      //console.log(this.$store.state.deviceCommand.deviceControlList)
      
      //const { module_list: [{ctl_attr_list: attrList}] } = await getControlAttr(moduleName, this.getBackLang)
      for(let i of subList){
          i.controlList = []
          
          console.log(this.$store.state.deviceCommand.deviceControlList[i.id])
          for(let j of Object.keys(this.$store.state.deviceCommand.deviceControlList[i.id])){
              console.log(j)
              let index = infoList.findIndex(e => e.dev_id == i.id)
              i.control_type = infoList[index].control_type
              i.targetId = infoList[index].target_id
              i.currentSelect = {}
              i.channel = this.$store.state.deviceCommand.deviceControlList[i.id][j].channel
              for(let k of this.$store.state.deviceCommand.deviceControlList[i.id][j].value_list){
                  i.controlList.push({
                      name: k.name,
                      value: k.value, 
                      description: this.$store.state.deviceCommand.deviceControlList[i.id][j].description, 
                      attrId: this.$store.state.deviceCommand.deviceControlList[i.id][j].attrId, 
                      writeCmd: this.$store.state.deviceCommand.deviceControlList[i.id][j].writeCmd
                  })
              }
          }
      }
      
      /*console.log(attrList)
      for(let item of subList) {
        console.log(item)
        // console.log(subList)
        item.currentSelect = "0"
        item.controlList = []
        for(let itemx of infoList) {
          if(item.id === itemx.dev_id) {
            item.channel = itemx.channel;
            item.controlType = itemx.control_type;
            item.targetId = itemx.target_id;
            
            for(let itemy of attrList) {
              if(item.controlType >= 2) {
                break
              }
              if(item.controlType === itemy.control_type) {

                const controlList = itemy.value_list.map(x => {
                  const obj = {...x}
                  obj.description = itemy?.description;
                  // obj.controlList = itemy?.value_list;
                  obj.attrId = itemy?.attrId;
                  obj.writeCmd = itemy?.writeCmd;
                  return obj
                })

                item.controlList.push(...controlList);
              }
            }
          }
        }
      }*/

      // await getControlInfo(this.currentDev.dev_id).then((res) => {
      //   console.log(res)
      //   const connectList = res.module_list[0].device_list;
      //   subList = subList.map((item, index) => {
      //     const obj = { ...item };
      //     obj.channel = connectList[index].channel;
      //     obj.controlType = connectList[index].control_type;
      //     obj.targetId = connectList[index].target_id;
      //     return obj;
      //   });
      // });

      // await getControlAttr(moduleName, this.getBackLang).then((res) => {
      //   console.log(res);
      //   const controlList = res.module_list[0].ctl_attr_list;
      //   subList = subList.map((item, index) => {
      //     const obj = { ...item };
      //     const newControl = controlList.find((itemx) => {
      //       return itemx.control_type === item.controlType;
      //     });
      //     obj.description = newControl?.description;
      //     obj.controlList = newControl?.value_list;
      //     obj.attrId = newControl?.attrId;
      //     obj.writeCmd = newControl?.writeCmd;
      //     obj.currentSelect = newControl?.value_list[0].value;
      //     return obj;
      //   });
      // });
      console.log(subList); 
      
      for(let i of subList){
          if(i["controlList"].length != 0){
              this.subDeviceList.push(i)
          }
          let des_check = []
          i.descriptionList = {}
          for(let j of i["controlList"]){
              let index = des_check.findIndex(e => e == j.description)
              if(index == -1){
                  des_check.push(j.description)
                  i.currentSelect[j.description] = "0"
                  i.descriptionList[j.description] = []
                  i.descriptionList[j.description].push({
                      name: j.name,
                      value: j.value, 
                      description: j.description, 
                      attrId: j.attrId, 
                      writeCmd: j.writeCmd
                  })
              }
              else{
                  i.descriptionList[j.description].push({
                      name: j.name,
                      value: j.value, 
                      description: j.description, 
                      attrId: j.attrId, 
                      writeCmd: j.writeCmd
                  })
              }
          }
      }
      
      console.log(this.subDeviceList)
      for(let i in this.subDeviceList){
          /*consoleif(i == this.subDeviceList.length){
              break
          }*/
          
          if(i == 0){
              this.subDeviceList[i]["last_desList_len"] = 1
              continue
          }
          this.subDeviceList[i]["last_desList_len"] = Object.keys(this.subDeviceList[Number(i)-1]["descriptionList"]).length

      }
    },
  },
};
</script>

<style scoped>
.content-block {
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.select-block {
  display: flex;
}
.top-select {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.top-select span {
  font-size: 2.5vw;
  color: #ffffff;
  font-weight: bold;
  margin-right: 5px;
}
.top-select button {
  height: 6vh;
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  margin: 0vh 1vw;
  font-size: 1.5vw;
}
.top-select select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  height: 3vw;
  width: 25vw;
  font-size: 1.5vw;
}
.top-select input {
  background-color: #9bebff;
  color: #000000;
  font-weight: bold;
  border-radius: 2px;
  border-width: 0px;
  height: 3vw;
  font-size: 2vw;
  width: 25vw;
}
.control-title {
  height: 8vw;
  font-size: 2.5vw;
  color: #ffffff;
  font-weight: bold;
  line-height: 5vw;
  padding-left: 5vw;
}
.control-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
}
.control-content::-webkit-scrollbar {
  width: 10px;
}
.control-content::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 10px;
}
.control-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}
.control-item {
  width: 100%;
  height: 8vw;
  font-size: 2vw;
  color: #ffffff;
  display: flex;
  align-items: center;
}
.options-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.options-content span {
  font-size: 2.5vw;
  color: #ffffff;
  font-weight: bold;
  margin-right: 5px;
}
.options-content button {
  height: 6vh;
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  margin: 0vh 1vw;
  font-size: 1.5vw;
}
.top-select select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  height: 3vw;
  width: 25vw;
  font-size: 1.5vw;
}

.item-title {
  font-weight: bold;
  color: rgb(255, 255, 51);
}
.control-item span {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.control-item span select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  height: 3vw;
  width: 60%;
  font-size: 1.5vw;
}
.control-item span:nth-child(1) {
  width: 50%;
  /* width: 10%; */
}
.control-item span:nth-child(2) {
  width: 35%;
  /* width: 10%; */
}
.control-item span:nth-child(3) {
  width: 25%;
  /* width: 10%; */
}
input[type="radio"] {
  width: 4vmin;
  height: 4vmin;
}
input[type="checkbox"] {
  width: 4vmin;
  height: 4vmin;
}

.add-buttom {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  height: 3vw;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  margin: 0vh 1vw;
  font-size: 1.5vw;
}
</style>