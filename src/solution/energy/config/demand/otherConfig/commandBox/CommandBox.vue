<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:style='stylerSize(120,100,-10,0)'
		:before-close="handleClose"
		append-to-body
		custom-class="dialog-class"
	>
		<div :class="dialogHeightClass[resetSelected]">
			<div class="slaveM" :style='stylerSize(90,40,0,0)'>
				<div class="slaveL _36" :style='stylerSize(15,25,7,25)'> {{ $t("GENERAL.DEVICE_NAME") }} </div>
				<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(42,25,7,50)' v-model="currentDev" @change="changeDevice()">
					<option v-for="(dev, dev_index) in deviceList" :key="dev_index" :value="dev.dev_id">
						{{ dev.dev_name }}
					</option>
				</select>

				<div class="slaveL _36" :style='stylerSize(15,25,62,25)'>  {{ $t("GENERAL.ATTR_RETURN_ASK") }} </div>
				<select class="slaveL _32 hmi_setting_content_select"
						:style='stylerSize(35,25,62,50)'
						v-model="resetSelected">
				<option :value="0"> {{ $t("GENERAL.NO_ATTR_RETURN") }} </option>
				<option :value="1"> {{ $t("GENERAL.ATTR_RETURN") }} </option>
				</select>
			</div>

			<div class="slaveM" :style='stylerSize(90,40,0,40-resetSelected*10)'>
				<div class="slaveL _36" :style='stylerSize(15,25,62,25)'> {{ $t("GENERAL.ATTR_UNLOAD") }}{{ $t("GENERAL.CONTROL_STATUS") }} </div>
				<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,62,50)' v-if="controlRangeValueUnload === '1'" v-model="currentAttrUnload">
					<option v-for="(item, item_index) in valueListUnload" :key="item_index" :value="item.value">
						{{ item.name }}
					</option>
				</select>
				<input class="slaveL _32" :style='stylerSize(35,25,7,50)' v-else-if="controlRangeValueUnload === '2'" v-model.number="currentAttrUnload">
				<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,62,50)' v-else-if="controlRangeValueUnload === '3'" v-model="currentAttrUnload">
					<option v-for="(val, val_index) in valueListUnload" :key="val_index" :value="val">
						{{ val }}
					</option>
				</select>

				<div class="slaveL _36" :style='stylerSize(15,25,7,25)'> {{ $t("GENERAL.ATTR_UNLOAD") }}{{ $t("GENERAL.CONTROL_TYPE") }} </div>
				<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,7,50)' v-model="currentTypeUnload" @change="changeTypeUnload()">
					<option v-for="(ctl, ctl_index) in controlList" :key="ctl_index" :value="ctl.ctl_type">
						{{ ctl.ctl_name }}
					</option>
				</select>
			</div>
		</div>

		<div v-if="resetSelected" class="slaveM" :style='stylerSize(90,40,0,80-resetSelected*20)'>
			<div class="slaveL _36" :style='stylerSize(15,25,7,25)'> {{ $t("GENERAL.ATTR_RETURN") }}{{ $t("GENERAL.CONTROL_TYPE") }} </div>
			<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,7,50)' v-model="currentTypeReset" @change="changeTypeReset()">
				<option v-for="(ctl, ctl_index) in controlList" :key="ctl_index" :value="ctl.ctl_type">
					{{ ctl.ctl_name }}
				</option>
			</select>
			<div class="slaveL _36" :style='stylerSize(15,25,62,25)'> {{ $t("GENERAL.ATTR_RETURN") }}{{ $t("GENERAL.CONTROL_STATUS") }} </div>
			<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,62,50)' v-if="controlRangeValueReset === '1'" v-model="currentAttrReset">
				<option v-for="(item, item_index) in valueListReset" :key="item_index" :value="item.value">
					{{ item.name }}
				</option>
			</select>
			<input class="slaveL _32" :style='stylerSize(35,25,7,50)' v-else-if="controlRangeValueReset === '2'" v-model.number="currentAttrReset">
				<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(35,25,62,50)' v-else-if="controlRangeValueReset === '3'" v-model="currentAttrReset">
					<option v-for="(val, val_index) in valueListReset" :key="val_index" :value="val">
						{{ val }}
					</option>
				</select>
		</div>

		<span slot="footer" class="dialog-footer _28">
			<button class="hmi_setting_content_button" @click="save"> {{ $t("GENERAL.DIALOG_OK") }} </button>
		</span>
	</el-dialog>
</template>

<script>
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { Notification } from "element-ui"

export default {
	props: {
		optionList: {
			type: Array,
		},
		selectedDevice: {
			type: Object,
		}
	},
	data() {
		return {
			dialogVisible: false,
			dialogHeightClass:{
				0: "unload_dialog_view",
				1: "unload_and_reset_dialog_view"
			},
			resetSelected: 0,
			currentModule: null,
			currentDev: null,
			currentTypeUnload: null,
			currentTypeReset: null,
			currentAttrUnload: null,
			currentAttrReset: null,
			initFlag: false,
		};
	},
	mixins: [commandStoreMixin],
	created() {
		//create page when dialogvisible == true @watch
	},
	computed: {
		deviceList(){
			return JSON.parse(JSON.stringify(this.optionList));
		},
		controlList(){
			let controlList = [];
            console.log(this.currentDev)
            console.log("😙😙😙😙😙😙😙😙😙😙")
            console.log(this.currentDev)
           
            //20230427標章修改
            if(this.currentDev == "思納捷大樓B1_A充電樁" ||this.currentDev == "思納捷大樓B1_B充電樁"  )return [
                 {ctl_type: '0', ctl_name: '開始充電'},
                {ctl_type: '1', ctl_name: '停止充電'}
            ]
			if(this.currentDev){
				for(let [ctl_type, ctl_info] of Object.entries(this.deviceControlList[this.currentDev])){
					controlList.push({
						ctl_type: ctl_type,
						ctl_name: ctl_info.description,
					})
				}
			}
            console.log(controlList)
			return controlList;
		},
		controlRangeValueUnload(){
            console.log("😉😉😉😉😉😉😉")
            console.log(this.currentDev , this.currentTypeUnload)
            //20230427標章修改
            if(this.currentDev == "思納捷大樓B1_A充電樁" ||this.currentDev == "思納捷大樓B1_B充電樁"  )return 0
            
			if(this.currentDev && this.currentTypeUnload){
                console.log(this.deviceControlList[this.currentDev][this.currentTypeUnload])
				return this.deviceControlList[this.currentDev][this.currentTypeUnload].range;
            }
		},
		controlRangeValueReset(){
			if(this.currentDev && this.currentTypeReset)
				return this.deviceControlList[this.currentDev][this.currentTypeReset].range;
		},
		valueListUnload() {
			if(this.controlRangeValueUnload === '1')
				return this.deviceControlList[this.currentDev][this.currentTypeUnload].value_list;
			else if(this.controlRangeValueUnload === '3'){
				let valueListUnload = [];
				let start, end;
				if(this.deviceControlList[this.currentDev][this.currentTypeUnload].includes("~")){
					let [s, e] = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('~');
					start = s;
					end = e;
				}else{
					let [s, e] = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('-');
					start = s;
					end = e;
				}
				for(let value = start; value <= end; value++)
					valueListUnload.push(value.toString());
				return valueListUnload;
			}
			else return [];
		},
		valueListReset() {
			if(this.controlRangeValueReset === '1')
				return this.deviceControlList[this.currentDev][this.currentTypeReset].value_list;
			else if(this.controlRangeValueReset === '3'){
				let valueListReset = [];
				let start, end;
				if(this.deviceControlList[this.currentDev][this.currentTypeUnload].includes("~")){
					let [s, e] = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('~');
					start = s;
					end = e;
				}else{
					let [s, e] = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('-');
					start = s;
					end = e;
				}
				for(let value = start; value <= end; value++)
					valueListReset.push(value.toString());
				return valueListReset;
			}
			else return [];
		}
	},
	methods: {
		handleClose(){
			this.dialogVisible = false;
		},
		changeDevice(){
			this.selectedDevice.dev_id = this.currentDev
			this.selectedDevice.dev_name = this.$store.state.deviceName[this.currentDev]
			if(this.deviceControlList[this.currentDev]){
				this.currentTypeUnload = Object.keys(this.deviceControlList[this.currentDev])[0];
				if(this.controlRangeValueUnload === '1')
					this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_list[0].value;
				else if(this.controlRangeValueUnload === '2')
					this.currentAttrUnload = "";
				else{
					if(this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.includes('~')){
						this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('~')[0];
					}else{
						this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('-')[0];
					}
				}
					
			}
		},
		changeTypeUnload(){
			if(this.deviceControlList[this.currentDev][this.currentTypeUnload]){
				if(this.controlRangeValueUnload === '1')
					this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_list[0].value;
				else if(this.controlRangeValueUnload === '2')
					this.currentAttrUnload = "";
				else if(this.controlRangeValueUnload === '3'){
					if(this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.includes('~')){
						this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('~')[0];
					}else{
						this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('-')[0];
					}
				}
			}
		},
		changeTypeReset(){
			if(this.deviceControlList[this.currentDev][this.currentTypeReset]){
				if(this.controlRangeValueReset === '1')
					this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_list[0].value;
				else if(this.controlRangeValueReset === '2')
					this.currentAttrReset = "";
				else if(this.controlRangeValueReset === '3'){
					if(this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.includes('~')){
						this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('~')[0];
					}else{
						this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('-')[0];
					}
				}
			}
		},
		save() {
			if(this.currentDev && this.currentTypeUnload && this.currentAttrUnload) {
				let { channel, attrId, writeCmd, target_id } = this.deviceControlList[this.currentDev][this.currentTypeUnload];
				let obj = {
					currentDev: this.currentDev,
					currentTypeUnload: {
						channel: channel,
						attrId: attrId,
						writeCmd: writeCmd,
						target_id: target_id,
					},
					currentAttrUnload: {
						value: this.currentAttrUnload
					}
				}
				if( this.resetSelected && this.currentTypeReset && this.currentAttrReset){
					let { channel, attrId, writeCmd, target_id } = this.deviceControlList[this.currentDev][this.currentTypeReset];
					obj["currentTypeReset"] = {
						channel: channel,
						attrId: attrId,
						writeCmd: writeCmd,
						target_id: target_id,
					}
					obj["currentAttrReset"] = {
						value: this.currentAttrReset
					}
				}

				this.$emit('save', obj);
				this.dialogVisible = false;
			}else {
				Notification({
					type: 'error',
					title: this.$t("GENERAL.DATA_MISSING"),
				})
				return;
			}
		}
	},
	watch: {
		dialogVisible(){
			if(this.dialogVisible){
				if(this.selectedDevice.dev_id && !this.initFlag) {
					this.deviceList.splice( 0, 0, this.selectedDevice)
					this.initFlag = true;
				}
				this.currentDev = this.deviceList[0].dev_id;

				//初始化
				if(!this.selectedDevice.dev_id) {
					this.currentTypeUnload = Object.keys(this.deviceControlList[this.currentDev])[0];
					if(this.controlRangeValueUnload === '1'){
						this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_list[0].value;
					}else if(this.controlRangeValueUnload === '2'){
						this.currentAttrUnload = "";
					}else{
						if(this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.includes('~')){
							this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('~')[0];
						}else{
							this.currentAttrUnload = this.deviceControlList[this.currentDev][this.currentTypeUnload].value_range.split('-')[0];
						}
					}

					this.currentTypeReset = Object.keys(this.deviceControlList[this.currentDev])[0];
					if(this.controlRangeValueUnload === '1'){
						this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_list[0].value;
					}else if(this.controlRangeValueUnload === '2'){
						this.currentAttrReset = "";
					}else{
						if(this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.includes('~')){
							this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('~')[0];
						}else{
							this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('-')[0];
						}
					}
				}
				//如果已有設置裝備但是第一次啟用復歸
				if(this.selectedDevice.dev_id && this.currentTypeReset == null && this.currentAttrReset == null){
					this.currentTypeReset = Object.keys(this.deviceControlList[this.currentDev])[0];
					if(this.controlRangeValueUnload === '1'){
						this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_list[0].value;
					}else if(this.controlRangeValueUnload === '2'){
						this.currentAttrReset = "";
					}else{
						if(this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.includes('~')){
							this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('~')[0];
						}else{
							this.currentAttrReset = this.deviceControlList[this.currentDev][this.currentTypeReset].value_range.split('-')[0];
						}
					}
				}
			}
		}
	}
};
</script>

<style scoped>
.dialog-class {
  font-weight: bold;
  background: linear-gradient(rgba(33, 96, 184, 0.8), rgba(1, 255, 255, 0.8));
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
  border-radius: 10px;
  border-style: solid;
  -o-border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
  border-left-style: none;
  border-right-style: none;
}

</style>
<style scoped>

/*
button {
  background: linear-gradient(rgba(1,255,255,0.5),rgba(33,96,184,0.5));
	color: #ffffff;
	font-weight: bold;
	border-width: 0px;
	outline: none;
  padding: 10px 15px;
  cursor: pointer;
}*/
</style>