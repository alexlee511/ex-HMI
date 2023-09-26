//import { uciApi, setCache, getCache } from "network/uci";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { getVirtualMeter, getVirtualMeterSrc, setVirtualMeter, setVirtualMeterSrc } from "solution/energy/utils/virtualMeter";
import { setConfigName } from "network/setConfig";
//import { config } from "vue/types/umd";

export default {
  async created() {

    this.$store.state.loading = true;
    if (!this.$store.state.virtual) { //註冊後不重複註冊saveConfig
      console.log("註冊模塊和初始化")
      await this.createNewModule();
      await this.initAll();
    }
    //console.log("結束create in mixin!")
    await this.create_for_ConfigView();
    this.$store.state.loading = false;
  },
  computed: {
    ...mapState("virtual", [
      "availableNumberList",
      "availableNumberList",
      "virtualDeviceNameList",

      "virtualMeterInfo",
      "meterInfo",
      
    ]),
  },
  methods: {
    ...mapActions("virtual", [
      "saveConfig",
    ]),
    ...mapMutations("virtual", [

      "setAvailableNumberList",

      "addVirtualDeviceName",
      "setVirtualDeviceName",

      "setConfigVirtualMeter",
      "setConfigMeter",

    ]),
    createNewModule() {
      console.log("註冊模塊");
      //創建動態vuex模塊
      this.$store.registerModule("virtual", {
        namespaced: true,
        state: {
          availableNumberList: [],
          availableNumberList:[],

          virtualDeviceNameList: [],

          virtualMeterInfo : {}, //(virtualMeterList) deviceData_array
          meterInfo : {}, //()  //selectMeterData_list

          config_virtualMeterInfo:{},
          config_meterInfo:{},

          main_attribute_option_key : ['SRC_KWH', 'SRC_W', 'SRC_VAR'],
          modify_meter:{},
          
        },
        actions:{
          async saveConfig({state}){
            console.log("==================[Save ConfigVirtualMeter: to API]==================")
            console.log("Saving config...")
            console.log("state.config_virtualMeterInfo:",JSON.stringify(state.config_virtualMeterInfo,null,4))
            console.log("state.config_meterInfo:",JSON.stringify(state.config_meterInfo,null,4))
            
            let meter ="";
            console.log("meter_test:", meter)
            console.log("[save virtual meter's meter(device)]")
            for(let vm of Object.keys(state.config_virtualMeterInfo))
            {
              console.log("in for")
              console.log
              if(state.modify_meter[vm] == true)
              {
                if(state.config_virtualMeterInfo[vm].length == 0)
                {
                  meter = undefined;
                }
                else
                {
                  meter = state.config_virtualMeterInfo[vm].join();
                }

                await setVirtualMeter(vm, meter);
                state.modify_meter[vm] = false;
              }
              
            }
            console.log("[finish save virtual meter's meter(device)]")


            // 處理成字串來下API
            console.log("[save meter's attribute]")
            console.log("state.config_meterInfo: ", JSON.stringify(state.config_meterInfo, null, 4))
            let attr_str, meter_str, cvt_str;
            for(let key of Object.keys(state.config_meterInfo))
            {
              attr_str = "";
              meter_str = "";
              cvt_str = "";
              for(let meter_setting of Object.keys(state.config_meterInfo[key]))
              {
                meter_str += state.config_meterInfo[key][meter_setting].meterID + ',';
                attr_str += state.config_meterInfo[key][meter_setting].attr + ',';
                cvt_str += state.config_meterInfo[key][meter_setting].cvt + ',';
              }
              console.log("meter:", meter_str, "attr_str:", attr_str, "cvt_str:", cvt_str);
              if(meter_str.includes(',')) meter_str = meter_str.substring( 0, meter_str.length-1);
              if(attr_str.includes(',')) attr_str = attr_str.substring( 0, attr_str.length-1);
              if(cvt_str.includes(',')) cvt_str = cvt_str.substring( 0, cvt_str.length-1);
              if(meter_str.length == 0) continue;

              console.log("KEY: ", key)
              console.log("config attribute: ", JSON.stringify(meter_str), JSON.stringify(attr_str), JSON.stringify(cvt_str))
              await setVirtualMeterSrc(key, meter_str, attr_str, cvt_str);

              console.log("[finish save meter's attribute]")              
            }

            if(state.virtualDeviceNameList.length > 0){
              setConfigName(state.virtualDeviceNameList);
              
            }
            console.log("==================[Finish save ConfigVirtualMeter: to API]==================")
          },
        },
        mutations: {
          setAvailableNumberList(state, payload){
            state.availableNumberList = payload;
          },

          addVirtualDeviceName(state, payload){
            state.virtualDeviceNameList.push(payload);
          },
          setVirtualDeviceName(state, payload){
            state.virtualDeviceNameList[payload.deviceId] = payload.deviceName;
          },

         //////////////////////////////////////////////////////////////////////////////////////////////////      
          setConfigVirtualMeter(state, payload) //設定虛擬電表的設備
          {
            console.log("==================[Set ConfigVirtualMeter]==================")
            let device_id = payload.device_id;
            let meter_id_array = payload.meterID_array;

            if(state.virtualMeterInfo[device_id] == undefined)
            {
              state.virtualMeterInfo[device_id] = "";
            }
            console.log("[Pre] virtualMeterInfo[",device_id,"]: ", JSON.stringify(state.virtualMeterInfo[device_id], null, 4))
            console.log("[Pre] meterInfo:", JSON.stringify(state.meterInfo, null, 4))
            
            //更新電表的使用數
            if(state.virtualMeterInfo[device_id].length !== 0 )   //原本有使用的電表
            {
              state.virtualMeterInfo[device_id].forEach(value => {
                if (!meter_id_array.includes(value)) {
                  state.meterInfo[value].count -= 1;
                }
              });
            }

            //原本沒有使用的電表
            meter_id_array.forEach(value => {
              if (!state.virtualMeterInfo[device_id].includes(value)) {
                if(state.meterInfo[value] === undefined)  //原本皆沒有被設備使用的電表(無設定)
                {
                  state.meterInfo[value]={
                    attribute_array:[],
                    count: 1,
                  };
                }
                else
                {
                  state.meterInfo[value].count += 1;
                }
              }
            });

            //更新虛擬電表中使用的電表
            state.virtualMeterInfo[device_id] = meter_id_array ; 
            console.log("[New] virtualMeterInfo[",device_id,"]: ", JSON.stringify(state.virtualMeterInfo[device_id], null, 4))
            state.config_virtualMeterInfo[device_id] = meter_id_array
            console.log("config_virtualMeterInfo[",device_id,"]: ", JSON.stringify(state.config_virtualMeterInfo[device_id], null, 4))
            console.log("[New] meterInfo[",device_id,"]: ", JSON.stringify(state.meterInfo, null, 4))
            console.log("==================[Fiinsh set ConfigVirtualMeter]==================")
          },


          setConfigMeter(state, payload)  //設定電表屬性
          { 
            console.log("==================[set ConfigMeter]==================")
            let meter_id = payload.front_meterID;
            console.log("meter_id:", meter_id)

            state.meterInfo[meter_id].attribute_array = [];
            
            //更新store的電表資料
            for(let attribute_block of payload.front_attribute_array)  
            {
              state.meterInfo[meter_id].attribute_array.push({
                key: attribute_block.key,
                attr: attribute_block.attr,
                cvt: attribute_block.cvt
              })
            }
            console.log("[New] meterInfo:", JSON.stringify(state.meterInfo, null, 4))

            //預設為刪除屬性
            state.main_attribute_option_key.forEach((key) => {  
              if (state.config_meterInfo[key] == undefined) 
              {
                state.config_meterInfo[key] ={}
                if(state.config_meterInfo[key][meter_id] == undefined)
                {
                  state.config_meterInfo[key][meter_id] = {};
                }
              }
              state.config_meterInfo[key][meter_id] = {
                meterID: meter_id,
                attr: null,
                cvt: ""
              }
            });
            console.log("[null] config_meterInfo:", JSON.stringify(state.config_meterInfo, null, 4))

            //寫入有更動的目標屬性
            payload.front_attribute_array.forEach((obj) => {    
              if (state.main_attribute_option_key.includes(obj.key)) {
                state.config_meterInfo[obj.key][meter_id] = {
                  meterID: meter_id, 
                  attr: obj.attr,
                  cvt: obj.cvt
                }
              }
            });
            console.log("[New] config_meterInfo:", JSON.stringify(state.config_meterInfo, null, 4))
            console.log("state.meterInfo[meter_id]:", JSON.stringify(state.meterInfo[meter_id], null, 4))

            if(state.meterInfo[meter_id].count == 0)  //準備刪除store中所有虛擬電表都沒使用的電表
            {
              console.log("[Delete] meter: " + meter_id +" is deleted in meterInfo !");
              delete state.meterInfo[meter_id];
              console.log("[New] meterInfo:", JSON.stringify(state.meterInfo, null, 4));
            }

            console.log("[Final] meterInfo:", JSON.stringify(state.meterInfo, null, 4));
            console.log("==================[Finish set ConfigMeter]==================")
          },
          
        },
      });
    },
    async initAll(){
      console.log("==================[Init info from API]]==================")
      //取得虛擬電表資訊
      let res = await getVirtualMeter();
      if(res.status != 'ok'){
        return this.$notify({
          type: 'warning',
          title: this.$t("GENERAL.DATA_MISSING"),
          message: "無電表資料"
        });
      }
      let vm_list = {};
      //取得不重複的來源電表
      let set_of_dev = new Set([]);
      if(res.status == 'ok'){
        for(let i of res.data){
          vm_list[i.meter_id] = [];
          for(let j of i.dev_id){
            vm_list[i.meter_id].push(j);
            set_of_dev.add(j);
          }
        }

        console.log("[Check] res1: ", JSON.stringify(res, null, 4))
        console.log("vm_list: ", JSON.stringify(vm_list, null, 4))
        console.log("set_of_dev: ",set_of_dev)

        //取得電表設定
        let dev_list_str = "";
        for(let i of set_of_dev)
        {
          dev_list_str += i + ',';
        }
        if(dev_list_str.length>0){
          let res2 = await getVirtualMeterSrc(dev_list_str.substring(0,dev_list_str.length-1)); //remove last comma
          if(res2.status != 'ok'){
            return this.$notify({
              type: 'warning',
              title: this.$t("GENERAL.DATA_MISSING"),
              message: "無電表資料"
            });
          }
          console.log("[Check] res2: ", JSON.stringify(res2, null, 4))
          let dev_obj = {};
          //遍歷有被設定的來源電表
          for(let dev of res2.data){
            dev_obj[dev.dev_id] = {
              attribute_array:[],
              count:0
            };
            for(let src of dev.SRC){
              dev_obj[dev.dev_id].attribute_array.push({
                key: src.key,
                attr: src.attr,
                cvt: src.cvt,
              });
            }
          }

          //計算電表使用次數
          for (let vm_key in vm_list) 
          {
            let attribute_array = vm_list[vm_key];
            for (let dev_key in dev_obj) 
            {
              let dev_value = dev_obj[dev_key];
              if (attribute_array.includes(dev_key)) 
              {
                dev_value.count++;
              }
            }
          }

          this.$store.state.virtual.virtualMeterInfo = vm_list;
          this.$store.state.virtual.meterInfo = dev_obj;
        }
      }
      
      //init available_number for new virtual devices (0~9)
      let map_num = new Array(10).fill(0);
			for(let i = 0; i < Object.keys(vm_list).length; i++){
				let meter_id = Object.keys(vm_list)[i].toString()
        for(let j=0; j<10; j++){
          if(meter_id[meter_id.length - 1] == j){
            map_num[j] = 1;
            break;
          }
        }
			}

      this.setAvailableNumberList(map_num);
      console.log("==================[Finish init info from API]]==================")
    }
  },
  beforeDestroy() {
    const routePathArr = this.$route.path.split("/")
    //銷毀store
    console.log(routePathArr)
    let thisPath = routePathArr[3];
    if (thisPath !== "virtual") {
      this.$store.unregisterModule("virtual");
    }
  },
}