<template>
  <div class="main" :style='stylerSize()'>
    <div class="slaveC _28 title" :style='stylerSize(100,20,0,15)'>{{ itemInfo.scene_name }}</div>
    <button class="slaveC _28 contextButton" :style='stylerSize(45,15,28,53)' @click="dialogTableVisible = true">{{ $t("GENERAL.CHECK_LIST") }}</button>
    <button class="slaveC _28 contextButton" :style='stylerSize(25,15,38,78)' @click="start">{{ $t("GENERAL.TRIGGER") }}</button>
    
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
        <span >{{$t("GENERAL.SUCCESS_TITLE")}}： {{ success_count }} {{$t("GENERAL.COUNT")}} | {{$t("GENERAL.FAIL_TITLE")}}： {{fail_count}} {{$t("GENERAL.COUNT")}}</span>
        <span >{{$t("GENERAL.TOTAL")}} {{ sum }} {{$t("GENERAL.COUNT")}}</span>
        <span >耗時 {{ waste_time }} 秒</span>
      </span>
      <div class="content" v-if="fail_count > 0">
        <button @click="start" class="context-button"> {{$t("GENERAL.SEND_AGAIN")}} </button>
      </div>
      <div v-if="fail_count > 0">
        <div
          class="list-group-item"
          v-for="(item, index) in fail_status_list"
          :key="index"
        >
          <span class="select-item">
            <span>{{ nameList[item.dev_id] || item.dev_id }}</span>
            <span>{{item.description}} | {{item.name}} | 狀態：{{statusList[item.action_status]}}</span>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { controlScene, sceneProgress, resendControl } from "network/scence"
import { sleep } from 'common/constant/ist'

import DialogBox from "components/content/dialog/Dialog";

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
      total: 0,
      waste_time: 0,
      sum: 0,
    }
  },
  async created(){
      //console.log(this.itemInfo)
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
    async start() {
      this.statusVisible = false
      this.index = 0
      this.total = 0
      this.fail_status_list.length = 0
      let pro_res;
      this.success_count = 0
      this.fail_count = 0
      this.temp_list = JSON.parse(JSON.stringify(this.itemInfo.control_list))

      let start = 0
      let end = 0
      start = new Date().getTime()

      this.$store.commit("setLoadingState")
      let res = await controlScene(this.itemInfo.scene_id);
      //console.log(res)
      this.total = Number(res["data"]["all_count"])//this.itemInfo.control_list.length
      this.$store.commit("setLoadingState")
      
      if(res["state"] == "fail"){
          this.$message({
            message: res["msg"],
            type: 'warning'
          });
          return
      }
      
      if(res.status === "ok"){
          
          this.$store.commit("setLoadingProgress");
          this.$store.commit("setTotalLoading", this.total)
          if(res["data"]["action_status"] == "success"){
              this.$store.commit("setLoadingMessage", res["data"]["message"])
          }
          else{
             this.$notify({
                  type: 'warning',
                  title:'',
                  message: this.$t("GENERAL.CONTROL_WARNING")     //資料傳送失敗
              })
              this.$store.commit("setLoadingProgress");
              return
          }
          do{
              pro_res = await sceneProgress(this.itemInfo.scene_id)
              //console.log("詢問",pro_res)
              if(pro_res.status == "fail"){
                  this.$store.commit("setLoadingProgress");
                  return
              }

              this.$store.commit("addCompleteLoading", (Number(pro_res["data"]["now_count"]) - this.index))
              
              this.index = Number(pro_res["data"]["now_count"])
              if(pro_res["data"]["finish"] != "yes"){
                  await sleep(5000);
              }

          }while(pro_res["data"]["finish"] == "no")//pro_res["data"]["now_count"] < Number(res["data"]["all_count"])

  
          let status_index = pro_res["data"]["progress_list"].findIndex(e => e.scene_id == this.itemInfo.scene_id)
              
          for(let i = 0; i< pro_res["data"]["progress_list"][status_index]["status_list"].length; i++){
              this.temp_list[i]["action_status"] = pro_res["data"]["progress_list"][status_index]["status_list"][i]["action_status"]
              if(pro_res["data"]["progress_list"][status_index]["status_list"][i]["action_status"] == "0"){
                  this.success_count += 1
              }
              else{
                  this.fail_status_list.push(this.temp_list[i])
                  this.fail_count += 1
              }
          }
          
          this.sum = pro_res["data"]["progress_list"][status_index]["status_list"].length
          this.$store.commit("setLoadingProgress");
          end = new Date().getTime()
          this.waste_time = (end - start) / 1000
      }
      else{
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
  background-color: rgba(65, 101, 138, 0.8);/*rgba(10, 38, 81, 0.8)*/
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
.title {
  font-size: 2.5vw;
  color: yellow;
}
.context-button {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 2vw;
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