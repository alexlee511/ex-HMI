<template>
	<div class="main white_view" :style='stylerSize()'>
		<div class="slaveM title_item" :style='stylerSize(100,15,0,2)'>
			<div class="slaveC _36" :style='stylerSize(10,45,5,0)'>  {{ $t("GENERAL.INDEX") }} </div>
            <div class="slaveC _36" :style='stylerSize(10,45,15,0)'> {{ $t("GENERAL.ENABLE") }} </div>
			<div class="slaveC _36" :style='stylerSize(10,45,37,0)'> {{ $t("GENERAL.RULE_NAME") }} </div>
			<div class="slaveC _36" :style='stylerSize(20,45,60,0)'> {{ $t("GENERAL.CONDITIONAL_STATEMENT") }}與{{ $t("GENERAL.LINKAGE_CONTROL") }}</div>
		</div>

		<div class="slaveM overFlowY"  :style='stylerSize(100,85,5,15)'>
			<div class=" slaveM" v-for="(item, index) in ruleList" :key="index" :style='stylerSize(100,100,0,index*15)' :class="item.isChange && 'change_item'">
				<div class="slaveC _36 text_center" 						    :style='stylerSize(10,8,0,0)'>  {{ item.id }} </div>
				<div class="slaveC _36 text_center" 						    :style='stylerSize(40,8,17,0)'> {{ item.rule_name || item.id }} </div>
				<div class="slaveC _36 text_center hmi_setting_content_button"  :style='stylerSize(10,8,60,0)' @click="checkInfo(index)"> {{ $t("GENERAL.CHECK") }} </div>
				<div class="slaveC _36" :style='stylerSize(3,7,13.5,1.5)'>
                    <input type="radio" @click='ruleEnable($event, item, index)' value="yes" v-model="item.enable">
                </div>
				<img class="slaveC" :style='stylerSize(3.5,8,77,0)' src="~assets/images/modify.png" @click="changeRule(item)"/>
				<img class="slaveC" :style='stylerSize(3.5,8,82,0)' src="~assets/images/remove.png" @click="deleteRule(index)"/>
			</div>
		</div>
		
		<el-dialog custom-class="dialog_class" :visible.sync="dialogVisible" append-to-body>
			<div class="main dialog_size">
				<!--判斷-->
				<div class="slaveL _36 bgcolor" :style='stylerSize(95,40,2.5,8)'>
					<div class="slaveL _48 font" :style='stylerSize(22,20,8,11)'> {{ $t("GENERAL.CONDITIONAL_STATEMENT") }} </div>
					<div class="slaveL _36"  	 :style='stylerSize(50,20,35,15)'> {{ showInfo.device }} </div>
					<div class="slaveL _36" v-for="(sub_item, sub_index) in handleCond()" :key="sub_index" :style='stylerSize(85,20,8,45+sub_index*18)'>
						{{ sub_item.name }}{{ operatorTranslator(sub_item.operator) }}{{ sub_item.limit }}
					</div>
				</div>
				<!--連動控制-->
				<div class="slaveL _36 bgcolor" :style='stylerSize(95,40,2.5,51)'>
					<div class="slaveL _48 font" :style='stylerSize(22,20,8,11)'> {{ $t("GENERAL.LINKAGE_CONTROL") }} </div>
					<div class="slaveL _36"  	 :style='stylerSize(50,20,35,15)'> {{ showInfo.dev_id }} </div>
					<div class="slaveL _36 scrollBarX" v-for="(sub_item, sub_index) in handleCommand()" :key="sub_index" :style='stylerSize(85,20,8,45+sub_index*18)'>
						{{ sub_item.description }}: {{ sub_item.value }}
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import ruleStoreMixin from "../mixin/ruleStoreMixin";
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { ConfigEvent } from '@/network/uci';
import { updateAttr } from "common/constant/attribute"

export default {
	data() {
		return {
			not_num: false,
			dialogVisible: false,
			showInfo: {},
		};
	},
	mixins: [
		ruleStoreMixin,
		commandStoreMixin,
	],
	async created() {
		//規則引擎屬性表刷新
		updateAttr(this.$store.state.backData.back_lang)
		if(this.ruleList.length == 0)
			await this.readRuleList();
	},
	mounted() {
		this.$bus.$on("configApply", async () => {
			this.$store.commit("setLoadingProgress");
			await this.saveRuleList();
			setTimeout(async () => {
				await this.resetRuleList();
				await this.readRuleList();
				ConfigEvent("update", "rule");
				this.$store.commit("setLoadingProgress");
			}, 1500);
		});
	},
	beforeDestroy() {
		this.$bus.$off("configApply");
		this.$bus.$off("previousPage");

		let path = this.$route.path.split('/');
		if(path[path.length - 1] !== 'ruleList')
			this.resetRuleList();
	},
	methods: {
		//處理cond參數的內容
		handleCond(){
			if(Object.keys(this.showInfo).length == 0 || Object.keys(this.deviceAttr).length == 0) {
				return;
			}
			let attrInfoList = [];
			let device_type = this.showInfo.device.substr(2, 2);
			let attrList = this.deviceAttr[device_type][this.showInfo.device];
			if(this.showInfo.attr_1 && this.showInfo.symbol_1 && this.showInfo.upperlimit_1){
				let attrInfo = {};
				let tmp = attrList.find(attr => {
					return attr.value === this.showInfo.attr_1;
				})
				if(tmp) attrInfo.name = tmp.name;
				attrInfo.operator = this.showInfo.symbol_1;
				
				let index = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device].findIndex(e => e.attr == this.showInfo.attr_1)
				if(index != -1){
					if(Object.keys(this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]).includes("value_list") == true){
						let value_index = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]["value_list"].findIndex(e => e.value == this.showInfo.upperlimit_1)
						attrInfo.limit = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]["value_list"][value_index]["name"]
					}
					else{
						attrInfo.limit = this.showInfo.upperlimit_1;
					}
				}
				else{
					attrInfo.limit = this.showInfo.upperlimit_1;
				}
				attrInfoList.push(attrInfo);
			}
			if(this.showInfo.attr_2 && this.showInfo.symbol_2 && this.showInfo.upperlimit_2){
				let attrInfo = {};
				let tmp = attrList.find(attr => {
					return attr.value === this.showInfo.attr_2;
				})
				if(tmp) attrInfo.name = tmp.name;
				attrInfo.operator = this.showInfo.symbol_2;
				let index = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device].findIndex(e => e.attr == this.showInfo.attr_2)
				if(index != -1){
					if(Object.keys(this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]).includes("value_list") == true){
						let value_index = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]["value_list"].findIndex(e => e.value == this.showInfo.upperlimit_2)
						attrInfo.limit = this.$store.state.deviceCommand.deviceAttrList[this.showInfo.device][index]["value_list"][value_index]["name"]
					}
					else{
						attrInfo.limit = this.showInfo.upperlimit_2
					}
				}
				else{
					attrInfo.limit = this.showInfo.upperlimit_2
				}
				attrInfoList.push(attrInfo);
			}
			return attrInfoList;
		},
		handleCommand(){
			if(Object.keys(this.showInfo).length == 0) return;
			let [channel, attrId, value] = this.showInfo.cav.split('_');
			const ctl_info = Object.values(this.deviceControlList[this.showInfo.dev_id]).find(item => {
				return item.attrId === attrId && item.writeCmd === this.showInfo.cmd;
			});
			if(ctl_info.range === '1'){
				value = ctl_info.value_list.find(item => {
					return item.value === value;
				}).name;
			}
			return [{
				description: ctl_info.description,
				value: value
			}];
		},
		changeRule(item) {
			let path = this.$route.path.replace(/configView/i, "ChangeConfig");
			this.$router.push({
				path: path,
				query: {
					ruleId: item.id,
				},
			});
		},
		async deleteRule(index){
			await this.deleteRuleList(index);
		},
		ruleEnable($event, data, index){
            if(data.enable == 'no'){
                data.enable = 'yes'
                $event.target.checked = true
            }else{
                data.enable = 'no'
                $event.target.checked = false
            }
			this.modifyRuleList(this.ruleList[index]);
        },
		checkInfo(index){
			this.dialogVisible = true;
			this.showInfo = this.ruleList[index];
		},
	}
};
</script>

<style scoped>
.dialog_size{
    height: 65vh;
}
.bgcolor{
	background-color: rgba(104, 175, 184, 0.491);
	box-shadow: 0 10px 30px 0 rgba(19, 151, 151, 0.472);
	border-radius: 10px;
}
.scrollBarX{
    overflow-y: hidden;
    overflow-x: auto;
}

.scrollBarX::-webkit-scrollbar {
  height : 0.5vh;
}
.scrollBarX::-webkit-scrollbar-thumb {
  background-color: #88fdff !important;
  
}
.scrollBarX::-webkit-scrollbar-track {
  background: #4285f4 !important;
}
</style>