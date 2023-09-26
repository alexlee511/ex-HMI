<template>
	<div class="main white_view" :style='stylerSize()'>
		<div class="slaveC" :style='stylerSize(60,100,0,7)'> 
			<span class="font slaveC _48" :style='stylerSize(100,8,0,0)'> {{$t("GENERAL.DEVICE_NAME")}} </span>
			<span class="slaveC _48" v-for="(dev_name, index) in dev_name_list" :key="index"
				:style='stylerSize(100,8,0,15*index+16)'> {{ dev_name }} 
				<!--underline-->
				<hr class="setting_hr slaveC" :style='stylerSize(80,3,10,15*index+100-15*index)' color="#000000" v-if="numberOfAlarm>0"/>
			</span>
		</div>

		<div class="slaveM" :style='stylerSize(40,100,60,2)'>
			<div class="slaveC _48" v-for="(alarm, alarm_index) in entityAlarmList" 
				:key="alarm_index" 
				:value="alarm_index"
				:style='stylerSize(100,10,0,15*alarm_index+20)'>
				<button class="slaveC hmi_setting_content_button" :style='stylerSize(50,100,0,0)' 
					@click="openDialog(alarm_index)" >
					{{ $t("GENERAL.ALARM_OPTION") }}
				</button>
				<button class="slaveC hmi_setting_content_button" :style='stylerSize(20,100,60,0)' 
					@click="deleteAlarm(alarm_index)">
					{{ $t("GENERAL.DELETE_CONFIG") }}
				</button>
			</div>
			
		
			<button class="slaveC _48 hmi_setting_content_button" :style='stylerSize(50,10,0,5)'
				@click="openDialog(-1)" >
				新增{{ $t("GENERAL.ALARM_OPTION") }}
			</button>
		</div>

		<el-dialog  :style='stylerSize(120,100,-10,0)' :visible.sync="dialogVisible"
			:before-close="handleClose" append-to-body custom-class="dialog_class">
			<div class="alarm_dialog_view">
				<div class="slaveM" :style='stylerSize(90,30,0,0)'>
					<span class="slaveL _40" :style='stylerSize(10,8,11,15)'> {{ $t("GENERAL.CLASS") }} </span>
					<el-select class="slaveL _36" :style='stylerSize(30,10,11,40)' v-model="currentType"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(type, type_index) in typeList"
							:key="type_index" :value="type" :label="typeChange(type)">
						</el-option>
					</el-select>

					<span class="slaveL _40" :style='stylerSize(10,8,50,15)'> {{ $t("GENERAL.DEVICE_NAME") }} </span>
					<el-select class="slaveL _36" :style='stylerSize(45,10,20,40)' v-model="currentDevice" 
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(dev, dev_index) in deviceList"
							:key="dev.dev_id + dev_index" :value="dev.dev_id" :label="dev.dev_name"
							:disabled="checkPicked(dev.dev_id)">
						</el-option>
					</el-select>
				</div>

				<div class="slaveM" :style='stylerSize(100,30,0,30)'>
					<span class="slaveL _40" :style='stylerSize(10,8,2,38)'> {{ $t("GENERAL.ALARM_OPEN") }} </span>

					<span class="slaveL _40" :style='stylerSize(10,8,10,13)'> {{ $t("GENERAL.CONTROL_TYPE") }} </span>
					<el-select class="slaveL _36" :style='stylerSize(25,10,10,38)' v-model="currentOpenCommand"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(command, command_index) in commandList"
							:key="command.description + command_index" :value="command.ctl_type" :label="command.description">
						</el-option>
					</el-select>
					
					<span class="slaveL _40" :style='stylerSize(10,8,45,13)'> {{ $t("GENERAL.CONTROL_STATUS") }} </span>
					<el-select v-if="openRangeValue == '1'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model="currentOpenCtlValue"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(item, val_index) in rangeValueList('open')"
							:key="val_index" :value="item.value" :label="item.name">
						</el-option>
					</el-select>
					<input v-else-if="openRangeValue == '2'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model.number="currentOpenCtlValue">
					<el-select v-if="openRangeValue == '3'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model="currentOpenCtlValue"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(val, val_index) in rangeValueList('open')"
							:key="val_index" :value="val" :label="val">
						</el-option>
					</el-select>
				</div>

				<div class="slaveM" :style='stylerSize(100,30,0,60)'>
					<span class="slaveL _40" :style='stylerSize(10,8,2,38)' > {{ $t("GENERAL.ALARM_CLOSE") }} </span>

					<span class="slaveL _40" :style='stylerSize(10,8,10,13)'> {{ $t("GENERAL.CONTROL_TYPE") }} </span>
					<el-select class="slaveL _36" :style='stylerSize(25,10,10,38)' v-model="currentCloseCommand"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(command, command_index) in commandList"
							:key="command.description + command_index" :value="command.ctl_type" :label="command.description">
						</el-option>
					</el-select>

					<span class="slaveL _40" :style='stylerSize(10,8,45,13)'> {{ $t("GENERAL.CONTROL_STATUS") }} </span>
					<el-select v-if="closeRangeValue == '1'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model="currentCloseCtlValue"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(item, val_index) in rangeValueList('close')"
							:key="val_index" :value="item.value" :label="item.name">
						</el-option>
					</el-select>
					<input v-else-if="closeRangeValue == '2'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model.number="currentCloseCtlValue">
					<el-select v-if="closeRangeValue == '3'" class="slaveL _36" :style='stylerSize(20,8,20,38)' v-model="currentCloseCtlValue"
						:placeholder="$t('GENERAL.CHOOSE')" :no-data-text="$t('GENERAL.NO_DATA')">
						<el-option v-for="(val, val_index) in rangeValueList('close')"
							:key="val_index" :value="val" :label="val">
						</el-option>
					</el-select>
	
				</div>
			</div>

			<span slot="footer" class="dialog-footer _28">
				<button @click="save()" class="hmi_setting_content_button"> {{ $t("GENERAL.DIALOG_OK") }} </button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import demandStoreMixin from "../mixin/demandStoreMixin"
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { ADD_ALARMLIST, DELETE_ALARMLIST } from '../store/mutation-types';
import { typeToKind } from "@/common/constant/type"
import { Notification } from "element-ui"

//15*numberOfAlarm+13
export default {
    mixins: [
        commandStoreMixin,
        demandStoreMixin
    ],
	data(){
		return {
			alarm_index: -1,
			modifyFlag: false,
			deviceBeforeModify: null,
			typeBeforeModify: null,
			numberOfAlarm: 0,
			dev_name_list: [],
			deviceName:  this.$store.state.deviceName,
			dialogVisible: false,
            currentType: null,
            currentDevice: null,
            currentOpenCommand: null,
            currentCloseCommand: null,
            currentOpenCtlValue: null,
            currentCloseCtlValue: null,
			alarmOptionList: [],
			removedAlarmOptions: [],
		};
	},
	created(){
		let entity = this.currentConfig.entity_alarm
		let alarmOptionList = JSON.parse(JSON.stringify(this.$store.state.deviceCommand.commandDeviceList))
		if(entity.length > 0) {
			this.dev_name_list = [];
			this.numberOfAlarm = entity.length;

			for(let item of entity){
				this.dev_name_list.push(this.deviceName[item.dev_id] || item.dev_id)

				for(let type of Object.keys(alarmOptionList)){
					let index = alarmOptionList[type].findIndex( dev => {
						return dev.dev_id === item.dev_id
					})
					if(index!==-1) alarmOptionList[type].splice( index, 1)
				}
			}
		}
		console.log(this.currentConfig.entity_alarm)
    	this.alarmOptionList = alarmOptionList;
	},
	computed: {
		entityAlarmList(){
			if(this.currentConfig.entity_alarm.length > 0){
				return this.currentConfig.entity_alarm;
			}
			else return [];
		},
		handleClose(){
            this.dialogVisible = false;
        },
        typeList(){
            let typeList = [];
            if(this.commandDeviceList)
                typeList = Object.keys(this.commandDeviceList).filter(type => {
                    return this.commandDeviceList[type].length > 0;
                });
            return typeList;
        },
        deviceList(){
            let deviceList = [];
            if(this.commandDeviceList[this.currentType])
                deviceList = this.commandDeviceList[this.currentType];
            return deviceList;
        },
        commandList(){
            let commandList = [];
            if(this.deviceControlList[this.currentDevice]){
                for(let [ctl_type, ctl_info] of Object.entries(this.deviceControlList[this.currentDevice])){
                    commandList.push({
                        description: ctl_info.description,
                        ctl_type: ctl_type,
                    });
                }
            }
            return commandList;
        },
        openRangeValue(){
            if(this.currentOpenCommand)
                return this.deviceControlList[this.currentDevice][this.currentOpenCommand].range;
        },
        closeRangeValue(){
            if(this.currentCloseCommand)
                return this.deviceControlList[this.currentDevice][this.currentCloseCommand].range;
        },
        rangeValueList(){
            return function(commit){
                if(commit == 'open'){
                    if(this.openRangeValue == '1')
                        return this.deviceControlList[this.currentDevice][this.currentOpenCommand].value_list;
                    else if(this.openRangeValue == '3'){
                        let valueList = [];
                        let start, end;
						if(this.deviceControlList[this.currentDevice][this.currentOpenCommand].includes("~")){
							let [s, e] = this.deviceControlList[this.currentDevice][this.currentOpenCommand].value_range.split('~');
							start = s;
							end = e;
						}else{
							let [s, e] = this.deviceControlList[this.currentDevice][this.currentOpenCommand].value_range.split('-');
							start = s;
							end = e;
						}
                        for(let i = start; i <= end; i++)
                            valueList.push(i);
                        return valueList;
                    }
                }
                else{
                    if(this.closeRangeValue == '1')
                        return this.deviceControlList[this.currentDevice][this.currentCloseCommand].value_list;
                    else if(this.closeRangeValue == '3'){
                        let valueList = [];
                        const [start, end] = this.splitRangeValue();
                        for(let i = start; i <= end; i++)
                            valueList.push(i.toString());
                        return valueList;
                    }
                }
            }
        }
	},
    watch: {
        currentType(){
            if(this.alarm_index===-1 || this.typeBeforeModify !== this.currentType){
                this.currentDevice = this.alarmOptionList[this.currentType][0].dev_id
				this.currentOpenCommand = Object.keys(this.deviceControlList[this.currentDevice])[0];
				this.currentCloseCommand = this.currentOpenCommand;
			}
            else this.currentDevice = this.entityAlarmList[this.alarm_index].dev_id;
        },
        currentDevice(){
            if(this.deviceControlList[this.currentDevice] && this.alarm_index === -1){
				this.currentOpenCommand = Object.keys(this.deviceControlList[this.currentDevice])[0];
				this.currentCloseCommand = this.currentOpenCommand;
				const default_command = Object.values(this.deviceControlList[this.currentDevice])[0];
				if(default_command.range == '1'){
					const val = default_command.value_list[0].value;
					this.currentOpenCtlValue = val;
					this.currentCloseCtlValue = val;
				}
				else if(default_command.range == '2'){
					this.currentOpenCtlValue = "";
					this.currentCloseCtlValue = "";
				}
				if(default_command.range == '3'){
					let val;
					if(default_command.value_range.includes("~")){
						val = default_command.value_range.value_range.split('~');
					}else{
						val = default_command.value_range.value_range.split('-');
					}
					this.currentOpenCtlValue = val;
					this.currentCloseCtlValue = val;
				}
            }
        },
        currentOpenCommand(){
			//第一次點開對話框顯示原本的值
			if(!this.modifyFlag || this.alarm_index !== -1) {
				this.modifyFlag = true;
				return;
			}
            const ctl_info = this.deviceControlList[this.currentDevice][this.currentOpenCommand];
            if(ctl_info.range == '1')
                this.currentOpenCtlValue = ctl_info.value_list[0].value;
            else if(ctl_info.range == '2')
                this.currentOpenCtlValue = "";
            if(ctl_info.range == '3'){
				if(ctl_info.value_range.includes('~')){
					this.currentOpenCtlValue = ctl_info.value_range.split('~')[0];
				}else{
					this.currentOpenCtlValue = ctl_info.value_range.split('-')[0];
				}
			} 
        },
        currentCloseCommand(){
			if(!this.modifyFlag || this.alarm_index !== -1) {
				this.modifyFlag = true;
				return;
			}
            const ctl_info = this.deviceControlList[this.currentDevice][this.currentCloseCommand];
            if(ctl_info.range == '1')
                this.currentCloseCtlValue = ctl_info.value_list[0].value;
            else if(ctl_info.range == '2')
                this.currentCloseCtlValue = "";
            if(ctl_info.range == '3'){
				if(ctl_info.value_range.includes('~')){
					this.currentCloseCtlValue = ctl_info.value_range.split('~')[0];
				}else{
					this.currentCloseCtlValue = ctl_info.value_range.split('-')[0];
				}
			}
        }
    },
	methods: {
		async afterCreateStore() {
			// do nothing
		},
        typeChange(type){
			console.log("type: ", type);
            return this.$t("GENERAL." + typeToKind(type));
        },
		checkPicked(dev_id){
			let index = this.alarmOptionList[this.currentType].findIndex( dev => {
				return dev.dev_id === dev_id
			})
			if(index === -1) return true;
			return false;
		},
		openDialog(index){
			this.alarm_index = index;
			if(index !== -1){
				this.currentType = this.entityAlarmList[index].type;
				this.currentDevice = this.entityAlarmList[index].dev_id;
				this.typeBeforeModify = JSON.parse(JSON.stringify(this.currentType))
				this.deviceBeforeModify = JSON.parse(JSON.stringify(this.currentDevice))
				
				let [channel, attrId, value] = this.entityAlarmList[index].open_cav.split(',');
				for(let [ctl_type, ctl_info] of Object.entries(this.deviceControlList[this.currentDevice])){
					if(channel == ctl_info.channel && attrId == ctl_info.attrId){
						this.currentOpenCommand = ctl_type;
					}
				}
				this.currentOpenCtlValue = value;
				[channel, attrId, value] = this.entityAlarmList[index].close_cav.split(',');
				for(let [ctl_type, ctl_info] of Object.entries(this.deviceControlList[this.currentDevice])){
					if(channel == ctl_info.channel && attrId == ctl_info.attrId){
						this.currentCloseCommand = ctl_type;
					}
				}
				this.currentCloseCtlValue = value;
				this.dialogVisible = true;
				console.log(this.deviceControlList[this.currentDevice])
				console.log(this.currentOpenCommand, this.currentOpenCtlValue, this.currentCloseCommand, this.currentCloseCtlValue)
			}
			else{
				this.modifyFlag = false;
				//搜尋deviceList長度大於0的
				let idx = this.typeList.findIndex( type => { return this.alarmOptionList[type].length>0 });
				if( idx !== -1 ){
					this.currentType = this.typeList[idx];
					this.currentDevice = this.alarmOptionList[this.currentType][0].dev_id;
					this.dialogVisible = true;
				}else{
					this.$notify({
						type: 'info',
						title: this.$t("GENERAL.NOTICE"),
						message: "無可新增設備"
					});
				}
			}
		},
		addAlarm(alarm_info){
			this [ADD_ALARMLIST] (alarm_info);

			this.numberOfAlarm += 1;
			if(this.numberOfAlarm === 1) this.dev_name_list = [];
			this.dev_name_list.push(this.deviceName[alarm_info.dev_id] || alarm_info.dev_id);
			
			this.removedAlarmOptions.push(alarm_info);

			let index = this.alarmOptionList[alarm_info.type].findIndex(dev => {
				return alarm_info.dev_id === dev.dev_id;
			})
			if(index !== -1) this.alarmOptionList[alarm_info.type].splice( index, 1);
		},
		deleteAlarm(target_index){
			let alarm_info = this.entityAlarmList[target_index];
			this [DELETE_ALARMLIST] (target_index);

			this.numberOfAlarm -= 1;
			this.dev_name_list.splice(target_index, 1);
			if(this.numberOfAlarm === 0) this.dev_name_list = [];

			let index = this.removedAlarmOptions.findIndex(dev => {
				return alarm_info.dev_id === dev.dev_id;
			})
			if(index !== -1) this.removedAlarmOptions.splice(index, 1);
			
			index = this.commandDeviceList[alarm_info.type].findIndex(dev => {
				return alarm_info.dev_id === dev.dev_id;
			})
			this.alarmOptionList[alarm_info.type].push(this.commandDeviceList[alarm_info.type][index])
		},
        save(){
			if(this.currentType && this.currentDevice && 
                this.currentOpenCommand && this.currentCloseCommand &&
                this.currentOpenCtlValue && this.currentCloseCtlValue){

				const open_info = this.deviceControlList[this.currentDevice][this.currentOpenCommand];
				const close_info = this.deviceControlList[this.currentDevice][this.currentCloseCommand];

				let currentAlarmInfo = {
					type: this.currentType,
					dev_id: this.currentDevice,
					open_cav: `${open_info.channel},${open_info.attrId},${this.currentOpenCtlValue}`,
					open_cmd: this.deviceControlList[this.currentDevice][this.currentOpenCommand].writeCmd,
					close_cav: `${close_info.channel},${close_info.attrId},${this.currentCloseCtlValue}`,
					close_cmd: this.deviceControlList[this.currentDevice][this.currentCloseCommand].writeCmd,
				}

				//編輯設備
				if(this.alarm_index!==-1) this.deleteAlarm(this.alarm_index);

				this.addAlarm(currentAlarmInfo);
					
                this.dialogVisible = false;
            }
            else{
                Notification({
                    type: 'error',
                    title: this.$t("GENERAL.DATA_MISSING"),
                });
            }
        },
	}
};
</script>

<style scoped>
.dialog_class{
	font-weight: bold;
	background: linear-gradient(rgba(33, 96, 184, 0.8), rgba(1, 255, 255, 0.8));
	border-width: 2px;
	border-color: #0b6f94;
	white-space: nowrap;
	border-radius: 10px;
	border-width: 1.5px;
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

.el-select >>> .el-input__inner{
	font-size: 2vw !important;
}

</style>

