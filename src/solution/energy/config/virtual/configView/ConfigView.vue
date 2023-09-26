<template>
  <div class="main white_view" :Style="stylerSize()">
    <div
      id="general_devicelist_title"
      class="title_item slaveM"
      :style='stylerSize(100,15,0,3)'
    >
      <div class="slaveC _40" :style='stylerSize(15,75,3,0)'>{{ $t("GENERAL.DEVICE_NAME") }}</div>
      <div class="slaveC _40" :style='stylerSize(10,75,37,0)'>{{ $t("GENERAL.DEVICE_ID") }}</div>
      <div class="slaveC _40" :style='stylerSize(15,75,60,0)'>{{ $t("GENERAL.SOURCE_METER_NAME") }}</div>
      <div class="slaveC _40" :style='stylerSize(15,75,75,0)' v-if="PV0616Set.HV">PV錶</div>

    </div>
    <div class="slaveM overFlowY" :style='stylerSize(100,85,0,15)'>
      <div class="slaveM title" v-for="(virtualMeter, index) in front_virtualMeter_array" :key="index +'-'+virtualMeter.front_deviceID"
        :style='stylerwd(100,25,0,index)' :class="config_virtualMeter[virtualMeter.front_deviceID] !== undefined ? 'yellow' : ''"
      >
        <div class="slaveC _36" :style='stylerSize(30,30,0,0)'>{{ getDeviceName(virtualMeter.front_deviceID) }}</div>
        <div class="slaveC _36" :style='stylerSize(30,30,31,0)'>{{ virtualMeter.front_deviceID }}</div>
        <div class="slaveM _36" :style='stylerSize(22,30,58,0)'>

          <img @click="showCommandInfo(virtualMeter.front_deviceID, index)" class="slaveC" :style='stylerSize(12,85,25,0)' src="~assets/images/arrow_down_03.png" />
          <div class="slaveC" :style='stylerSize(25,100,40,0)'>total:{{Object.keys(virtualMeterList[virtualMeter.front_deviceID]).length}} </div>

          <transition name="dropdown" v-if="Object.keys(virtualMeterList[virtualMeter.front_deviceID]).length < 6">
              <div v-if="currentCommandIndex == index" class="slaveC _28" :style='stylerSize(100,65,0,100)' style="white-space: normal;  word-break: break-all;">
                  <div v-for="(info, info_index) in virtualMeterList[virtualMeter.front_deviceID]" :key="info_index">
                      {{ getDeviceName(info) }}
                  </div>
              </div>
          </transition>

          <transition name="dropdown" v-if="currentCommandIndex == index && Object.keys(virtualMeterList[virtualMeter.front_deviceID]).length >= 6">
              <div class="slaveC _28 overFlowY" :style='stylerSize(100,380,0,100)' style="white-space: normal;  word-break: break-all;">
                  <div v-for="(info, info_index) in virtualMeterList[virtualMeter.front_deviceID]" :key="info_index">
                      {{ getDeviceName(info) }}
                  </div>
              </div>
          </transition>
        </div>
        
        <input class="slaveC" :style='stylerSize(2,37,81,1)' v-show="PV0616Set.HV" type="checkbox" v-model="PV0616Set.have_setting[virtualMeter.front_deviceID]" />
        <img class="slaveC" :style='stylerSize(4,37,88,0)' src="~assets/images/modify.png" @click="goChange(virtualMeter.front_deviceID)"/>
        <img class="slaveC" :style='stylerSize(4,37,94,0)' src="~assets/images/remove.png" @click="deleteVirtualMeter(virtualMeter, index)"/>

      </div>
    </div>
  </div>
</template>

<script>
import { DeviceName, updateProfile } from "common/constant/profile"
import configStoreMixin from "solution/energy/utils/configStoreMixin";
import dropDownSelect from "components/common/selectsingle/dropDownSelect";
import { restart , formulaGet , formulaSet , deviceformulaGet , deviceformulaSet , deviceformulaDel } from "network/gateway";

export default {
  mixins: [configStoreMixin],
  components: {
      dropDownSelect,
  },
  data() {
    return {
        currentCommandIndex: null,
        flag: -1,
        infoListLen: 0,
        //2023 06 16 因為台北奇怪的PV要求 所以要加入該功能 詳細可以看此單子 ： https://redmine.insynerger.com/issues/15366
        PV0616Set : {
            type : "10" , 
            module : "VIRTUALMETER",
            op     : "*-1",
            op_count : 1,
            fID      : 0,
            attr     : 5,
            HV       : false,
            // devid : {}
            have_setting : {}
        },
        virtualMeterList: {},
        config_virtualMeter: {},
        front_virtualMeter_array: [],
    };
  },
  mounted() {
    this.$bus.$on("configApply", async () => {
      this.$store.state.loading = true;
      await this.$store.dispatch("virtual/saveConfig");
      //20230616 PV要求
      await this.addPV()
      this.$router.back();
      await updateProfile();
      await restart();
      this.$store.state.loading = false;
    });

    this.$bus.$on("previousPage", () => {});
  },
  beforeDestroy() {
    this.$bus.$off("configApply");
    this.$bus.$off("previousPage");
  },
  computed:{
    stylerwd: function(){
        return function(w='100',h='100',k='0',t='0',f='0'){
            let tmp = ""
            let len = this.infoListLen
            let top = 0
            if(len > 5){
                top = 20*t + 20
            }
            else{
                top = 20*t+4.5*len
            }
            
            if(this.flag==-1){
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
            }
            else if(this.flag>-1 && t>this.flag){
                tmp = "width: "+w+"%;height:"+(h)+"%;left:"+k+"%;top:"+top+"%;"; 
            }
            else{
                tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
            }
            return tmp 
        }
    },
	},
  methods: {
    async create_for_ConfigView()
    {
      this.$store.state.loading = true;
      //如果沒找到對應的FID
      //2023 06 16 PV需求
      let f = 0
      while(!await this.getformula()){
          await formulaSet(this.PV0616Set.type , this.PV0616Set.module , this.PV0616Set.op_count , this.PV0616Set.op)
          f ++
          if(f > 10){
              this.PV0616Set.HV = false
              break;
          }
      }
      if(this.PV0616Set.HV){
          let req = await deviceformulaGet(this.PV0616Set.type , this.PV0616Set.module )
          if(req.status == "ok"){
              for(let i of req.data.device){
                  for(let j of i.formula){
                      if(j.formula_id == this.PV0616Set.fID){
                          this.PV0616Set.have_setting[i.dev_id] = true
                      }
                  }
              }
          }
      }
      if(this.PV0616Set.HV){
          this.PV0616Set.HV = false
          this.PV0616Set.HV = true
      }
      
      if(Object.keys(this.$store.state.virtual.virtualMeterInfo).length !== 0)
      {
        this.virtualMeterList = JSON.parse(JSON.stringify(this.$store.state.virtual.virtualMeterInfo))
      }

      if(Object.keys(this.$store.state.virtual.config_virtualMeterInfo).length !== 0)
      {
        this.config_virtualMeter = JSON.parse(JSON.stringify(this.$store.state.virtual.config_virtualMeterInfo))
      }

      for(let virtualMeter_id of Object.keys(this.virtualMeterList))
      {
        this.front_virtualMeter_array.push({
          front_deviceID: virtualMeter_id,
          meterData_list: this.virtualMeterList[virtualMeter_id]
        })
      }

      console.log("🐛🐛🐛🐛🐛🐛🐛🐛🐛")
      console.log("$store virtualMeterInfo: ", JSON.stringify(this.$store.state.virtual.virtualMeterInfo, null, 4))
      console.log("$store meterInfo:", JSON.stringify(this.$store.state.virtual.meterInfo, null, 4))
      console.log("config_virtualMeter: ", JSON.stringify(this.config_virtualMeter, null, 4))
      console.log("Front virtualMeter array: ", JSON.stringify(this.front_virtualMeter_array, null, 4))
      this.$store.state.loading = false;
    },

    //20230616 PV要求
    async getformula(){
        let req = await formulaGet(this.PV0616Set.type , this.PV0616Set.module)
        if(req.status == 'ok'){
            this.PV0616Set.HV = true
            for(let i of req.data){
                if(i.op_count == this.PV0616Set.op_count && i.op[0] == this.PV0616Set.op){
                    this.PV0616Set.fID = i.formula_id
                    return true
                }
            }
            return false
        }else{
            return true
        }
    },
    async addPV(){
        let add = [] 
        let del = []
        for( let i in this.PV0616Set.have_setting){
            if(this.PV0616Set.have_setting[i]){
                add.push(i)
            }else{
                del.push(i)
            }
        }
        await deviceformulaDel(this.PV0616Set.type , this.PV0616Set.module , del.join(','))
        await deviceformulaSet(this.PV0616Set.type , this.PV0616Set.module , add.join(',') , this.PV0616Set.attr , this.PV0616Set.fID)
    },
    getDeviceName(meter_id){
      let index = this.$store.state.virtual.virtualDeviceNameList.findIndex(dev => {return dev.dev_id === meter_id});
      if(index !== -1) return this.$store.state.virtual.virtualDeviceNameList[index].deviceName;
      return DeviceName[meter_id] || meter_id
    },
    goChange(meter_id) {
      let path = this.$route.path.replace(/configView/i, "ChangeConfig")
      this.$router.push({
        path: path,
        query: {
          devId: meter_id,
          //device_obj: device_obj, ////
        },
      });
    },
    showCommandInfo(meter, index){
        this.infoListLen = Object.keys(this.virtualMeterList[meter]).length;
        if(this.currentCommandIndex === index){
            this.currentCommandIndex = null;
            this.flag = -1
        }
        else{
            this.currentCommandIndex = index;
            this.flag = index;
        }
    },
    deleteVirtualMeter(virtualMeter, virtualMeter_index){
      console.log("==================[Set deleteVirtualMeter]==================")
      console.log("[update virtual meter]")
      console.log("[Pre] front_virtualMeter_array: ", JSON.stringify(this.front_virtualMeter_array, null, 4))
      this.$store.state.virtual.modify_meter[virtualMeter.front_deviceID] = true;
      console.log("[delete] Row:", virtualMeter_index+1,"virtualMeter: ", JSON.stringify(virtualMeter, null, 4))

      virtualMeter.meterData_list = []
      let configVM = {
        device_id: virtualMeter.front_deviceID,
        meterID_array: virtualMeter.meterData_list,
      };
      console.log("configVM: ", JSON.stringify(configVM, null, 4))
      this.$store.commit("virtual/setConfigVirtualMeter", configVM);
      console.log("[finish update virtual meter]==================")

      
      console.log("[update meter]")
      for(let meter_id of Object.keys(this.$store.state.virtual.meterInfo))
      {
        if(this.$store.state.virtual.meterInfo[meter_id].count == 0)
        {
          let meter = {
            front_meterID: meter_id,
            front_attribute_array: [],
          };
        console.log("[check] meter count =>", JSON.stringify(this.$store.state.virtual.meterInfo[meter_id].count, null, 4))
        this.$store.commit("virtual/setConfigMeter", meter);
        }
      }
			console.log("[finish update meter]==================")
  
      let last_num = virtualMeter.front_deviceID[virtualMeter.front_deviceID.length - 1];
      let new_number_list = JSON.parse(JSON.stringify(this.$store.state.virtual.availableNumberList));
      new_number_list[last_num] = 0;
      this.$store.commit("virtual/setAvailableNumberList", new_number_list);
      this.front_virtualMeter_array.splice(virtualMeter_index, 1);

      console.log("[New] front_virtualMeter_array: ", JSON.stringify(this.front_virtualMeter_array, null, 4))
      console.log("==================[Finish set deleteVirtualMeter]==================")
    }
  },
};
</script>