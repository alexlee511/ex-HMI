<template>
	<div>
		<div class="hmi_setting_content">
			<event-config
				class="slaveM"
				:style='stylerSize(100,40,0,0)'
				:allProfile="deviceAttr"
				:CurrentInfo="eventInfo"
				@getEventInfo="getEventInfo" />

			<hr class="slaveM setting_hr"  :style='stylerSize(100,0.3,0,49)'/>

			<action-config
				class="slaveM"
				:style='stylerSize(100,50,0,50)'
				:CurrentInfo="actInfo"
				@getActInfo="getActInfo" />
		</div>
	</div>
</template>

<script>
import HmiContentScroll from "components/common/hmiContentScroll/HmiContentSrcoll";
import EventConfig from "./childComp/EventConfig";
import ActionConfig from "./childComp/ActionConfig";
import ruleStoreMixin from "../mixin/ruleStoreMixin";
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { Notification } from "element-ui"

export default {
	mixins: [
		ruleStoreMixin,
		commandStoreMixin,
	],
	components: {
		HmiContentScroll,
		EventConfig,
		ActionConfig,
	},
	data() {
		return {
			ruleId: this.$route.query.ruleId,
			currentInfo: {},
			eventInfo: {},
			actInfo: {}
		};
	},
	async created() {
		//console.log(this.deviceAttr)
		console.log(this.ruleList)
		if(this.ruleId){
			//編輯
			this.currentInfo = this.ruleList.find(rule => {
				return rule.id === this.ruleId;
			});
			console.log(this.currentInfo);
			this.eventInfo = {
				action: this.currentInfo.action,
				rule_name: this.currentInfo.rule_name,
				type: this.currentInfo.event_type,
				device: this.currentInfo.device,
				attr_1: this.currentInfo.attr_1,
				attr_2: this.currentInfo.attr_2,
				attr_3: this.currentInfo.attr_3,
				symbol_1: this.currentInfo.symbol_1,
				symbol_2: this.currentInfo.symbol_2,
				symbol_3: this.currentInfo.symbol_3,
				upperlimit_1: this.currentInfo.upperlimit_1,
				upperlimit_2: this.currentInfo.upperlimit_2,
				upperlimit_3: this.currentInfo.upperlimit_3,
			}

			this.actInfo = {
				type: this.currentInfo.act_type,
				dev_id: this.currentInfo.dev_id,
				cav: this.currentInfo.cav,
				cmd: this.currentInfo.cmd,
                target_id: this.currentInfo.target_id,
			}
		}
		else{
			//新增
			this.currentInfo = {
				enable: 'yes',
				id: this.getTrueNum().toString(),
				gid: 'NULL', 		// optional 等api改好之後可以刪掉
			};
			this.eventInfo = {
				action: "igw_ctl",
				rule_name: "",
				type: "",
				device: "",
				attr_1: "",
				attr_2: "",
				symbol_1: "",
				symbol_2: "",
				upperlimit_1: "",
				upperlimit_2: "",
			}
			this.actInfo = {
                target_id: "",
				type: "",
				dev_id: "",
				cav: "",
				cmd: "",
			}
		}
	},
	async mounted() {
		this.$bus.$on("configLoad", () => {
			if(this.checkEventInfo()) return;
			if(this.checkActInfo()) return;
			
			this.currentInfo = this.configDataMerge();
			if(this.ruleId)
				this.modifyRuleList(this.currentInfo);
			else
				this.addRuleList(this.currentInfo);
			this.$router.back();
		});
		this.$bus.$on("previousPage", () => {});
	},
	beforeDestroy() {
		this.$bus.$off("configLoad");
		this.$bus.$off("previousPage");

		let path = this.$route.path.split('/');
		if(path[path.length - 1] !== 'ruleList')
			this.resetRuleList();
	},
	methods: {
		configDataMerge(){
			let newConfig = {
				enable: this.currentInfo.enable,
				id: this.currentInfo.id,
				gid: this.currentInfo.gid,
				action: this.eventInfo.action,
				rule_name: this.eventInfo.rule_name,
				event_type: this.eventInfo.type,
				device: this.eventInfo.device,
				attr_1: this.eventInfo.attr_1,
				attr_2: this.eventInfo.attr_2,
				symbol_1: this.eventInfo.symbol_1,
				symbol_2: this.eventInfo.symbol_2,
				upperlimit_1: this.eventInfo.upperlimit_1,
				upperlimit_2: this.eventInfo.upperlimit_2,
				act_type: this.actInfo.type,
				dev_id: this.actInfo.dev_id,
				cav: this.actInfo.cav,
				cmd: this.actInfo.cmd,
                target_id: this.actInfo.target_id,
			};
			return newConfig;
		},
		
		getTrueNum(num = 1){
			const arr = this.ruleList.map((item) => item.id);
			if(arr.indexOf(num.toString()) !== -1){
				num = num + 1;
				return this.getTrueNum(num);
			}
			else return num;
		},
		getEventInfo(newVal) {
			console.log("Event Info: ",newVal)
			this.eventInfo = newVal;
		},
		getActInfo(newVal) {
			//console.log(newVal)
			this.actInfo = newVal;
		},
		// 檢查資料
		checkEventInfo(){
			if(this.eventInfo.device === ''){
				Notification({
					type: 'error',
					title: this.$t("GENERAL.DATA_MISSING"),
					message: this.$t("GENERAL.DATA_MISSING_DEVICE_ID"),
				});
				return true;
			}

			let check_attr = true;
			if(this.eventInfo.attr_1.length > 0 && this.eventInfo.symbol_1.length > 0 && this.eventInfo.upperlimit_1.length > 0)
				check_attr = false;
			else if(this.eventInfo.attr_2.length > 0 && this.eventInfo.symbol_2.length > 0 && this.eventInfo.upperlimit_2.length > 0)
				check_attr = false;
			if(check_attr){
				Notification({
					type: 'error',
					title: this.$t("GENERAL.DATA_MISSING"),
					message: this.$t("GENERAL.DATA_MISSING_ATTRIBUTE"),
				});
				return true;
			}
			return false;
		},
		checkActInfo(){
			if(this.actInfo.dev_id === ''){
				Notification({
					type: 'error',
					title: this.$t("GENERAL.DATA_MISSING"),
					message: this.$t("GENERAL.DATA_MISSING_DEVICE_ID"),
				});
				return true;
			}
			else if(this.actInfo.cav.length == 0){
				 this.$notify({
                    type: 'error',
                    title: this.$t("GENERAL.DATA_MISSING"),
                    message: this.$t("GENERAL.DATA_MISSING_COMMAND")
                });
                return true;
			}
			return false;
		}
	},
};
</script>
