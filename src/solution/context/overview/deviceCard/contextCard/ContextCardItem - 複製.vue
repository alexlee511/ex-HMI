<template>
  <div class="content main" :Style="stylerSize()">
    <div class="yellow slaveC _48" :Style="stylerSize(100,20,0,0)">{{ itemInfo.scene_name }}</div>
    <div class="slaveM" :Style="stylerSize(100,30,0,20)">
        <div class="title slaveC _48" :Style="stylerSize()" v-if="clt.id==itemInfo.scene_id">
            {{clt.status}}
        </div>
        <div class="title slaveC _48" :Style="stylerSize()" v-else>未觸發</div>
    </div>
    <button class="context-button slaveC _24" :Style="stylerSize(30,20,35,50)" v-if="clt.id==itemInfo.scene_id">停止</button>
    <button class="context-button slaveC _24" :Style="stylerSize(30,20,35,50)" v-else>觸發</button>
        
    <button class="context-button slaveC _24" :Style="stylerSize(40,20,5,75)" >查看清單</button>
    <button class="context-button slaveC _24" :Style="stylerSize(40,20,55,75)">更多狀態</button>    
  <!--
    <div class="title">{{ itemInfo.scene_name }}</div>
    <button @click="dialogTableVisible = true" class="context-button">{{ $t("GENERAL.CHECK_LIST") }}</button>
    <button @click="start" class="context-button">{{ $t("GENERAL.TRIGGER") }}</button>
    <el-dialog custom-class="dialog-class" :visible.sync="dialogTableVisible" :append-to-body="true">
      <div
        class="list-group-item"
        v-for="(item, index) in itemInfo.control_list"
        :key="index"
      >
        <span class="select-item">
          <span>{{ nameList[item.dev_id] || item.dev_id }}</span>
          <span>{{item.description}} | {{item.name}}</span>
        </span>
      </div>
    </el-dialog>

    <el-dialog custom-class="dialog-class" :visible.sync="statusVisible" :append-to-body="true">
      <span class="select-item">
        <span >成功: {{ success_count }} 筆 | 失敗: {{fail_count}} 筆</span>
        <span >共 {{ temp_list.length }} 筆</span>
      </span>
      <div v-if="fail_count > 0">
        <div
          class="list-group-item"
          v-for="(item, index) in fail_status_list"
          :key="index"
        >
          <span class="select-item">
            <span>{{ nameList[item.dev_id] || item.dev_id }}</span>
            <span>{{item.description}} | {{item.name}} | 代碼:{{item.action_status}} | 狀態:{{statusList[item.action_status]}}</span>
          </span>
        </div>
        <div class="content">
          <button @click="failSend" class="context-button"> 再次傳送 </button>
        </div>
      </div>
    </el-dialog>
     -->
  </div>
</template>

<script>
import { controlScene, sceneProgress, resendControl } from "network/scence"

import DialogBox from "components/content/dialog/Dialog";
import { clt } from "solution/context/overview/deviceCard/contextCard/contextctl"

export default {
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    DialogBox
  },
  data() {
    return {
      status: true,
      nameList: [],
      dialogTableVisible: false,
      trigger: false,
      statusVisible: false,
      temp_list: [],
      fail_status_list: [],
      fail_index_list: [],
      index: 0,
      statusList: {},
      success_count: 0,
      fail_count: 0,
      clt:{},
    }
  },
  async created(){
    this.clt = clt
    //console.log("😊😊😊😊😊1111111111111111111111111111111111111111111111111111111")
    //console.log(this.itemInfo)
    //console.log(this.clt.id)
    
  },
  async mounted() {
    this.nameList = this.$store.state.deviceName;
    this.statusList = {
      0: this.$t("GENERAL.CONTROL_ERROR_0"), 
      1: this.$t("GENERAL.CONTROL_ERROR_1"), 
      2: this.$t("GENERAL.CONTROL_ERROR_2"), 
      3: this.$t("GENERAL.CONTROL_ERROR_3"), 
      4: this.$t("GENERAL.CONTROL_ERROR_4"), 
      5: this.$t("GENERAL.CONTROL_ERROR_5"), 
      6: this.$t("GENERAL.CONTROL_ERROR_6"), 
      7: this.$t("GENERAL.CONTROL_ERROR_7") 
    }
    
  },
  methods: {
    async sceneProgress(){

        let pro_res = await sceneProgress(this.itemInfo.scene_id)
        //console.log("詢問",pro_res)

        if(this.trigger == true){
            //console.log("結束")
            this.trigger = false
            this.index = 0
        }
        else{
            if(pro_res["status"] == "ok"){
                this.$store.commit("addCompleteLoading", (pro_res["data"]["count"] - this.index))
                for(let i = this.index; i< pro_res["data"]["count"]; i++){
                    
                    this.temp_list[i]["action_status"] = pro_res["data"]["progress_list"][i]["action_status"]
                    if(pro_res["data"]["progress_list"][i]["action_status"] == "0"){
                        this.success_count += 1
                    }
                    else{
                        this.fail_status_list.push(this.temp_list[i])
                        this.fail_index_list.push(Number(pro_res["data"]["progress_list"][i]["index"]))
                        this.fail_count += 1
                        
                    }
                }
                this.index = pro_res["data"]["count"]
            }
            setTimeout(this.sceneProgress, 1500);
        }
        
    },
    
    async start() {
      //console.log(this.itemInfo.control_list)
      this.success_count = 0
      this.fail_count = 0
      this.temp_list = JSON.parse(JSON.stringify(this.itemInfo.control_list))
      //console.log(this.temp_list)
      setTimeout(this.sceneProgress, 1500);
      this.$store.commit("setLoadingProgress");
      this.$store.commit("setTotalLoading", this.itemInfo.control_list.length)
      
      let res = await controlScene(this.itemInfo.scene_id,this.itemInfo.control_list.length);
      //console.log(res)
      this.$store.commit("setLoadingProgress");
      if(res.status === "ok") {
        this.trigger = true
        for(let i =this.index; i < res["data"]["count"]; i++){
            this.temp_list[i]["action_status"] = res["data"]["progress_list"][i]["action_status"]
            if(res["data"]["progress_list"][i]["action_status"] == "0"){
                this.success_count += 1
            }
            else{ 
                this.fail_status_list.push(this.temp_list[i])
                this.fail_index_list.push(Number(res["data"]["progress_list"][i]["index"]))
                this.fail_count += 1
            }
        }
        this.$message({
          message: '成功',
          type: 'success'
        });
      } else {
        this.trigger = true
        this.$message({
          message: '失敗',
          type: 'warning'
        });
        return
      }
      //console.log("全結束")
      //console.log(this.fail_status_list)
      //console.log(this.fail_index_list)
      this.statusVisible = true
    },

    async failSend(){
        this.statusVisible = false
        //console.log(this.itemInfo.scene_id)
        //console.log(this.fail_index_list)
        this.fail_status_list.length = 0
        
        this.success_count = 0
        this.fail_count = 0
        //this.temp_list = JSON.parse(JSON.stringify(this.itemInfo.control_list))
        ////console.log(this.temp_list)
        setTimeout(this.sceneProgress, 1500);
        this.$store.commit("setLoadingProgress");
        this.$store.commit("setTotalLoading", this.itemInfo.control_list.length)
        let res = await resendControl(this.itemInfo.scene_id, this.fail_index_list.join(","))
        this.$store.commit("setLoadingProgress");
        this.fail_index_list.length = 0
        this.temp_list.length = 0
        //console.log(res)
        if(res["status"] == "ok"){
            this.trigger = true
            //console.log(this.index)
            for(let i =this.index; i < res["data"]["count"]; i++){
                //this.temp_list[i]["action_status"] = res["data"]["progress_list"][i]["action_status"]
                this.temp_list.push(res["data"]["progress_list"])
                if(res["data"]["progress_list"][i]["action_status"] == "0"){
                    this.success_count += 1
                }
                else{ 
                    this.fail_status_list.push(this.itemInfo.control_list[i])
                    this.fail_index_list.push(Number(res["data"]["progress_list"][i]["index"]))
                    this.fail_count += 1
                }
            }
            this.$message({
              message: '成功',
              type: 'success'
            });
        }
        else{
            this.trigger = true
            this.$message({
              message: '失敗',
              type: 'warning'
            });
            return
        }

        this.statusVisible = true
    },
  }
};
</script>

<style>
.dialog-class {
  font-weight: bold;
  background-color: rgba(10, 38, 81, 0.8);
  border-style: solid;
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
}
</style>

<style scoped>
.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.context-button {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  padding: 5px 20px;
  /* height: 20%;
  width: 30%; */
}

.select-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.select-item span {
  text-align: center;
}
</style>