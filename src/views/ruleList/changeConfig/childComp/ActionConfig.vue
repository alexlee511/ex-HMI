<template>
	<div>
		<span class="title_item slaveL _40" :style='stylerSize(15,20,5,10)'>
			{{ $t("GENERAL.LINKAGE_CONTROL") }}
		</span>

		<!--類型-->
		<span class="slaveL _36" :style='stylerSize(15,13,19.5,10)'>{{ $t("GENERAL.TYPE") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(25,13,19.5,24)' v-model="CurrentInfo['type']">
			<option v-for="(type, index) in Object.keys(commandDeviceList)"
				:key="index" :value="type">
				{{ translation_type(type) }}
			</option>
		</select>

		<!--設備名稱-->
		<span class="slaveL _36" :style='stylerSize(15,13,55,10)'>{{ $t("GENERAL.DEVICE_NAME") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(33,13,55,24)' v-model="CurrentInfo['dev_id']" :disabled="currentDevice.length == 0">
			<option v-if="currentDevice.length == 0" value="0"> {{ $t("GENERAL.NO_DEVICE_SETTING") }} </option>
			<option v-for="(dev, index) in currentDevice" :key="index" :value="dev.dev_id">
				{{ dev.dev_name }}
			</option>
		</select>

		<!--控制型態-->
		<span class="slaveL _36" :style='stylerSize(15,13,19.5,50)'> {{ $t("GENERAL.CONTROL_TYPE") }} </span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(20,13,19.5,65)' v-model="control_type">
			<option v-for="(ctl_info, ctl_type, ctl_index) in currentCommand" :key="ctl_index" :value="ctl_type">
				{{ ctl_info.description }}
			</option>
		</select>

		<!--控制狀態-->
		<span class="slaveL _36" :style='stylerSize(15,13,55,50)'> {{ $t("GENERAL.CONTROL_STATUS") }} </span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(25,13,55,65)' v-if="controlRangeValue === '1'" v-model="control_value">
			<option v-for="(ctl_val, val_index) in controlList" :key="val_index" :value="ctl_val.value">
				{{ ctl_val.name }}
			</option>
		</select>
		<input class="slaveL _36 hmi_setting_content_input" :style='stylerSize(25,13,55,65)' v-else-if="controlRangeValue === '2'" v-model.number="control_value">
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(25,13,55,65)' v-else v-model="control_value">
			<option v-for="(ctl_val, val_index) in controlList" :key="val_index" :value="ctl_val">
				{{ ctl_val }}
			</option>
		</select>

	</div>
</template>

<script>
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { typeToKind } from "@/common/constant/type";

export default {
	mixins: [ commandStoreMixin ],
	props: {
		CurrentInfo: {
			type: Object,
			default: {
				type: "",
				dev_id: "",
				cav: "",
				cmd: "",
			}
		},
	},
    data() {
        return {
			control_type: "",
			control_value: "",
            flag : false,
        };
    },
	created(){
		if(this.CurrentInfo.type.length > 0 && this.CurrentInfo.dev_id.length > 0 &&
			this.CurrentInfo.cav.length > 0 && this.CurrentInfo.cmd.length > 0){
			let [channel, attrId, value] = this.CurrentInfo.cav.split('_');
			let ctl_type = Object.entries(this.deviceControlList[this.CurrentInfo.dev_id]).find(item => {
				return item[1].attrId === attrId && item[1].writeCmd === this.CurrentInfo.cmd;
			})[0];
			this.control_type = ctl_type;
			this.control_value = value;
			this.flag = true;
		}
	},
    computed: {
        //檢查allProfile是否有dev_id
		currentType: {
			get(){
				let check_arr = [];
				if(this.commandDeviceList){
					check_arr = JSON.parse(JSON.stringify(this.commandDeviceList));
					for(let module of Object.key(check_arr))
						if(check_arr[module].length == 0) delete check_arr[module];
				}
				return check_arr;
			}
		},
        currentDevice: {
            get() {
                //取得第一個設備名稱
                let check_arr = [];
                if(this.CurrentInfo.type != '')
                    check_arr = this.commandDeviceList[this.CurrentInfo.type];
                return check_arr;
            }
        },
		currentCommand: {
			get(){
				let controlList = [];
				if(this.CurrentInfo.dev_id !== "" && this.deviceControlList)
					controlList = this.deviceControlList[this.CurrentInfo.dev_id];
				return controlList;
			}
		},
		// if the range value in device control info is '1' or '3', return the value list
		controlList(){
			if(this.control_type){
				let ctl_info = this.deviceControlList[this.CurrentInfo.dev_id][this.control_type];
				if(ctl_info.range === '1')
					return ctl_info.value_list;
				else if(ctl_info.range === '3'){
					let valueList = [];
					let min, max;
					if(ctl_info.value_range.includes('~')){
						let [t1, t2] = ctl_info.value_range.split('~');
						min = t1;
						max = t2;
					}else{
						let [t1, t2] = ctl_info.value_range.split('-');
						min = t1;
						max = t2;
					}
					for(let i = min; i <= max; i++)
						valueList.push(i.toString());
					return valueList;
				}
			}
		},
		// return the range value of device control info
		controlRangeValue(){
			if(this.control_type)
				return this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].range;
		},
		returnConfig(){
			if(this.CurrentInfo.type.length > 0 && this.CurrentInfo.dev_id.length > 1 &&
				this.control_type && this.control_value){
				const ctl_info = this.deviceControlList[this.CurrentInfo.dev_id][this.control_type];
				this.CurrentInfo.cav = `${ctl_info.channel}_${ctl_info.attrId}_${this.control_value}`;
				this.CurrentInfo.cmd = ctl_info.writeCmd;
				this.CurrentInfo.target_id = ctl_info.target_id;
				return this.CurrentInfo;
			}
			return {};
		}
    },
    methods: {
        //將類型轉換並套用i18n語系檔
        translation_type(value) {
            return this.$t("GENERAL." + typeToKind(value));
        },
    },
    watch : {     //監聽
        'CurrentInfo.type':{
            handler(newValue){
                
				this.CurrentInfo.dev_id = "";
				if(this.commandDeviceList[newValue].length > 0){
					let first_dev = this.commandDeviceList[newValue][0].dev_id;
					this.CurrentInfo.dev_id = first_dev;    //預設顯示第一個
				}
				else this.CurrentInfo.dev_id = "0";
            }
        },
        'CurrentInfo.dev_id':{
            handler(){
				// 對控制做初始化
				this.control_type = "";
				this.CurrentInfo.cmd = "";
				this.CurrentInfo.cav = "";
                this.control_value  = ""
				if(this.deviceControlList[this.CurrentInfo.dev_id]){
					this.control_type = Object.keys(this.deviceControlList[this.CurrentInfo.dev_id])[0];
                    
                    if(this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].range === '1')
                        this.control_value = this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].value_list[0].value;
                    else if(this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].range === '3'){
						if(this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].value_range.includes('~')){
							this.control_value = this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].value_range.split('~')[0];
						}else{
							this.control_value = this.deviceControlList[this.CurrentInfo.dev_id][this.control_type].value_range.split('-')[0];
						}
					}
                        
                    else
                        this.control_value = "";
					
					this.$emit("getActInfo", this.returnConfig);
				}
            }
        },
		control_type(newValue){
			if(!this.deviceControlList[this.CurrentInfo.dev_id]) return;
            if(this.flag){
                this.flag = false
            }else{
                const ctl_info = this.deviceControlList[this.CurrentInfo.dev_id][newValue];
                if(ctl_info.range === '1')
                    this.control_value = ctl_info.value_list[0].value;
                else if(ctl_info.range === '3'){
					if(ctl_info.value_range.includes('~')){
						this.control_value = ctl_info.value_range.split('~')[0];
					}else{
						this.control_value = ctl_info.value_range.split('-')[0];
					}
				}
                else this.control_value = "";
            }
			this.$emit("getActInfo", this.returnConfig);
		},
		control_value(){
			if(this.CurrentInfo.type.length > 0 && this.CurrentInfo.dev_id.length > 1)
				this.$emit("getActInfo", this.returnConfig);
		}
    }
};
</script>
