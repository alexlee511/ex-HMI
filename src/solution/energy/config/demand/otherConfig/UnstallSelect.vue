<template>
  <div class="">

	<div v-if="itemIndex!==-1">
		<select
		class="slaveC _32 hmi_setting_content_select"
		:style='stylerSize(6,60,7,35)'
		v-model="itemInfo.priority"
		>
		<option v-for="item in 5" :key="item">{{ item }}</option>
		</select>

	  	<hr class="setting_hr slaveC" :style='stylerSize(35,3,16,70)'/>

		<img
		class="slaveC"
		:style='stylerSize(3,60,73,40)'
		v-if="itemIndex !== undefined"
		@click="deleteClick"
		src="~assets/images/minus.png"
		/>
	</div>
	
	<button class="slaveC _32 hmi_setting_content_button"
			:style='stylerSize(15,70,55,35)'
			@click="openBox(itemInfo.offloadCmd, itemInfo.resetCmd)"
			@save="save">
		{{itemIndex === -1 ? $t("GENERAL.NEW_DEVICE") : $t("GENERAL.DEVICE_SETTING")}}
	</button>

    <command-box @save="save" ref="commandBox" 
		:option-list="optionList" 
		:selected-device="devInfo">
	</command-box>

  </div>
</template>

<script>
import CommandBox from "./commandBox/CommandBox";
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { createNamespacedHelpers } from "vuex";
const { mapMutations: mapDemandMutations } = createNamespacedHelpers("demand");
import * as demandtypes from "../store/mutation-types";

export default {
	props: {
		itemInfo: {
			type: Object,
			default() {
				return {};
			},
		},
		itemIndex: {
			type: Number,
		},
		optionList: {
			type: Array,
		},
	},
	components: {
		CommandBox,
	},
	data() {
		return {
			flag: 0,
			devInfo:{
				dev_name: "",
				dev_id: ""
			}
		};
	},
	mixins: [commandStoreMixin],
	created() {
		if (this.itemIndex === -1) {
			// 如果沒有資料
			this.resetData();
		}else{
			this.devInfo.dev_id = this.itemInfo.offloadCmd.devId
			this.devInfo.dev_name = this.$store.state.deviceName[this.devInfo.dev_id] || this.devInfo.dev_id
		}
	},
	computed: {},
	methods: {
		...mapDemandMutations([
			demandtypes.CHANGE_OFFLOADLIST,
			demandtypes.ADD_OFFLOADLIST,
			demandtypes.DELETE_OFFLOADLIST
		]),
		openBox(infoOffload, infoReset) {
			this.getInfo(infoOffload, "offloadCmd");
			this.getInfo(infoReset, "resetCmd");
			this.$refs.commandBox.dialogVisible = true;
		},
		getInfo( info, key){
			if (info !== "NULL" && info) {
				// 判斷如果沒有資料或為不復歸不給初值
				const [channel, attrId, value] = info.cav.split(",");
				const trueId = channel !== "NULL" ? `${info.devId}|${channel}` : info.devId;
				const currentDev = Object.keys(this.deviceControlList).find(dev => {
					return dev == trueId;
				});
				this.$refs.commandBox.currentDev = currentDev;
				this.devInfo.dev_id = currentDev;
				this.devInfo.dev_name = this.$store.state.deviceName[currentDev] || currentDev

				const dev_info = this.deviceControlList[currentDev];
				const currentType = Object.keys(this.deviceControlList[currentDev]).find(ctl_type => {
					return 	dev_info[ctl_type].channel == channel &&
							dev_info[ctl_type].attrId == attrId &&
							dev_info[ctl_type].writeCmd == info.cmdId;
				});
				
				const currentAttr = value;
				if(key === "offloadCmd"){
					this.$refs.commandBox.currentTypeUnload = currentType;
					this.$refs.commandBox.currentAttrUnload = currentAttr;
				}else{
					this.$refs.commandBox.resetSelected = 1;
					this.$refs.commandBox.currentTypeReset = currentType;
					this.$refs.commandBox.currentAttrReset = currentAttr;
				}
			}
		},
		resetData() {
			// 重置資料
			this.resetSelected = 0
			this.itemInfo.resetCmd = "NULL"
			this.itemInfo.priority = "1"
			delete this.itemInfo.offloadCmd
		},
		save(info) {
			const { currentDev, currentTypeUnload, currentAttrUnload, currentTypeReset, currentAttrReset } = info;
			
			const objUnload = {
				cav: `${currentTypeUnload.channel},${currentTypeUnload.attrId},${currentAttrUnload.value}`,
				cmdId: currentTypeUnload.writeCmd,
				devId: currentTypeUnload.target_id,
			};
			this.itemInfo["offloadCmd"] = objUnload;

			if(currentTypeReset){
				const objReset = {
					cav: `${currentTypeReset.channel},${currentTypeReset.attrId},${currentAttrReset.value}`,
					cmdId: currentTypeReset.writeCmd,
					devId: currentTypeReset.target_id,
				};
				this.itemInfo["resetCmd"] = objReset;
			}
			
			// 如果是新增
			if (this.itemIndex === -1) {
				if(this.itemInfo.priority && this.itemInfo.resetCmd && this.itemInfo.offloadCmd){
					this.$emit("addOffloadList", this.itemInfo);
					let index = this.optionList.findIndex( dev => {
						return currentDev === dev.dev_id
					})
					this.optionList.splice( index, 1);
				}
			}else{
				let modifiedItemInfo = {}
				modifiedItemInfo["index"] = this.itemIndex;
				modifiedItemInfo["info"] = JSON.parse(JSON.stringify(this.itemInfo));
				this[demandtypes.CHANGE_OFFLOADLIST] (modifiedItemInfo)
			}
		},
		deleteClick() {
			this [demandtypes.DELETE_OFFLOADLIST] (this.itemIndex)
			this.flag = 1
			this.$bus.$emit("delete", this.flag);
			this.flag = 0
			this.optionList.splice(0,0,this.devInfo);
		},
	}
};
</script>
