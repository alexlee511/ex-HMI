<template>
  <div>
	<!--事件設定-->
	<span class="title_item slaveL _40" :style='stylerSize(15,20,5,6)'> {{ $t("GENERAL.EVENT_SETTING")}} </span>

	<!--事件名稱-->
	<span class="slaveL _36" :style='stylerSize(15,15,20,6)'>{{ $t("GENERAL.RULE_NAME") }}:</span>
	<input class="slaveL _36 hmi_setting_content_input" :style='stylerSize(20,15,20,23)' maxlength="20" v-model="currentName"/>

	<!--類型-->
	<span class="slaveL _36" :style='stylerSize(15,15,45,6)'>{{ $t("GENERAL.TYPE") }}:</span>
	<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(20,15,45,23)' v-model="CurrentInfo['type']"
		:disabled="showValue.type == 'false'">
		<option v-for="(item, key, index) in currentType"
			:value="key" :key="index">
			{{ translation_type(key) }}
		</option>
	</select>

	<!--設備名稱-->
	<span class="slaveL _36" :style='stylerSize(15,15,70,6)'>{{ $t("GENERAL.DEVICE_NAME") }}:</span>
	<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(27,15,70,23)' v-model="CurrentInfo['device']" :disabled="showValue.dev_id == 'false'">
		<option
		v-for="(item, key, index) in currentDevice"
		:value="key"
		:key="index"
		>{{ DeviceName(key) }}
		</option>
	</select>

	<!--量測屬性-->
	<div v-if="isOpenAttr_1" class="slaveM" :style='stylerwd(100,50,0,1)'>

		<span class="slaveL _36" :style='stylerSize(15,20,20,15)'>{{ $t("GENERAL.ATTRIBUTES") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(20,28,20,50)' v-model="CurrentInfo['attr_1']" :disabled="showValue.attr == 'false'">
			<option v-for="(item, index) in currentAttr"
				:value="item.value" :key="index"> {{ item.name }}
			</option>
		</select>

		<span class="slaveL _36" :style='stylerSize(15,20,45,15)'>{{ $t("GENERAL.CONDITIONAL_STATEMENT") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(15,28,45,50)' v-model="CurrentInfo['symbol_1']">
			<option value=">">{{ $t("GENERAL.LARGER_THAN") }}</option>
			<option value="<">{{ $t("GENERAL.SMALLER_THAN") }}</option>
			<option value="==">{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value=">=">{{ $t("GENERAL.LARGER_THAN") }}{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value="<=">{{ $t("GENERAL.SMALLER_THAN") }}{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value="!=">{{ $t("GENERAL.NOT_EQUALS_TO") }}</option>
			<!--<option value=">">&gt;</option>
			<option value="<">&lt;</option>
			<option value="==">==</option>
			<option value=">=">&gt;=</option>
			<option value="<=">&lt;=</option>
			<option value="!=">!=</option>-->
		</select>

		<span class="slaveL _36" :style='stylerSize(15,20,70,15)'>{{ $t("GENERAL.VALUE") }}:</span>
		<input class="slaveL _36 hmi_setting_content_input" :style='stylerSize(15,28,70,50)' v-if="now_attr_1 == false" maxlength="10" v-model="CurrentInfo['upperlimit_1']">
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(15,28,70,50)' v-else v-model="CurrentInfo['upperlimit_1']" :disabled="showValue.attr == 'false'">
			<option v-for="(item, index) in valueList1" 
				:value="item.value" :key="index"> {{ item.name }}
			</option>
		</select>

		<img class="slaveC" :style='stylerSize(2.5,25,87,50)' v-if="isOpenAttr_1 ^ isOpenAttr_2" 
			@click="addAttrOption_1()" src="~assets/images/add.png">
		<img v-else class="slaveC" :style='stylerSize(2.5,25,87,50)'
			@click="deleteAttrOption_1()" src="~assets/images/minus.png">

	</div>

	<div v-if="isOpenAttr_2" class="slaveM" :style='stylerwd(100,50,0,2)'>

		<span class="slaveL _36" :style='stylerSize(15,20,20,15)'>{{ $t("GENERAL.ATTRIBUTES") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(20,28,20,50)' v-model="CurrentInfo['attr_2']" :disabled="showValue.attr == 'false'">
			<option v-for="(item, index) in currentAttr" 
				:value="item.value" :key="index"> {{ item.name }}
			</option>
		</select>

		<span class="slaveL _36" :style='stylerSize(15,20,45,15)'>{{ $t("GENERAL.CONDITIONAL_STATEMENT") }}:</span>
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(15,28,45,50)' v-model="CurrentInfo['symbol_2']">
			<option value=">">{{ $t("GENERAL.LARGER_THAN") }}</option>
			<option value="<">{{ $t("GENERAL.SMALLER_THAN") }}</option>
			<option value="==">{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value=">=">{{ $t("GENERAL.LARGER_THAN") }}{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value="<=">{{ $t("GENERAL.SMALLER_THAN") }}{{ $t("GENERAL.EQUALS_TO") }}</option>
			<option value="!=">{{ $t("GENERAL.NOT_EQUALS_TO") }}</option>
		</select>
	
		<span class="slaveL _36" :style='stylerSize(15,20,70,15)'>{{ $t("GENERAL.VALUE") }}:</span>
		<input class="slaveL _36 hmi_setting_content_input" :style='stylerSize(15,28,70,50)' v-if="now_attr_2 == false" @input="emitEventConfig()" maxlength="10" v-model="CurrentInfo['upperlimit_2']">
		<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(15,28,70,50)' v-else v-model="CurrentInfo['upperlimit_2']" :disabled="showValue.attr == 'false'">
			<option v-for="(item, index) in valueList2" 
				:value="item.value" :key="index"> {{ item.name }}
			</option>
		</select>

		<img class="slaveC" :style='stylerSize(2.5,25,87,50)' v-if="isOpenAttr_1 ^ isOpenAttr_2" 
			@click="addAttrOption_2()" src="~assets/images/add.png">
		<img class="slaveC" :style='stylerSize(2.5,25,87,50)' v-else 
			@click="deleteAttrOption_2()" src="~assets/images/minus.png">

	</div>

	<!--判斷原則-->
	<span class="slaveL _36" :style='stylerSize(10,15,5,46)'>{{ $t("GENERAL.DECISION_PRINCIPLE") }}:</span>
	<select class="slaveL _36 hmi_setting_content_select" :style='stylerSize(10,13.5,5,64)' v-model="CurrentInfo['action']">
		<option :value="'igw_ctl'" > 成立時 </option>
		<option :value="'event_ctl'" > 達成時 </option>
	</select>
  </div>
</template>

<script>
import { typeToKind } from "@/common/constant/type";
import ruleStoreMixin from "../../mixin/ruleStoreMixin"
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapContextState, mapActions: mapContextAction, mapMutations: mapConetextMutation } = createNamespacedHelpers('context')
export default {
	mixins: [ruleStoreMixin],
	components: {
	},
	data() {
		return {
			showValue: {
				type: 'true',
				dev_id: 'true',
				attr: 'true'
			},
			isOpenAttr_1: true,
			isOpenAttr_2: false,
			flag: 1,
			now_attr_1: false,
			now_attr_2: false,
			valueList1: [],
			valueList2: [],
			arr_check: [],
		};
	},
	props: {
		allProfile: {
			type: Object,
			default() {
				return {};
			},
		},
		CurrentInfo: {
			type: Object,
			default: {
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
		}
	},
	created(){
		//console.log(this.allProfile)
		if(this.CurrentInfo.attr_1 && this.CurrentInfo.symbol_1 && this.CurrentInfo.upperlimit_1)
			this.isOpenAttr_1 = true;
		if(this.CurrentInfo.attr_2 && this.CurrentInfo.symbol_2 && this.CurrentInfo.upperlimit_2)
			this.isOpenAttr_2 = true;
	},
	mounted: function () {
	},
	computed: {
		stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                //console.log(this.flag)
                //console.log("索引值",t)
                
				if(this.isOpenAttr_1 == true && this.isOpenAttr_2 == true && this.flag == 1 && t == 1){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+38+"%;";
                }
				if(this.isOpenAttr_1 == true && this.isOpenAttr_2 == true && this.flag == 1 && t == 2){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+76+"%;";
                }
				if(this.isOpenAttr_1 == true && this.isOpenAttr_2 == true && this.flag == 2 && t == 1){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+76+"%;";
                }
				if(this.isOpenAttr_1 == true && this.isOpenAttr_2 == true && this.flag == 2 && t == 2){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+38+"%;";
                }
				if(this.isOpenAttr_1 == true && this.isOpenAttr_2 == false && t == 1){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+38+"%;";
                }
				if(this.isOpenAttr_1 == false && this.isOpenAttr_2 == true && t == 2){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+38+"%;";
                }

                return tmp 
            }
        },
		...mapContextState([
			"list"
		]),
		DeviceName(){
			return function(id){
				return this.$store.state.deviceName[id] || id;
			}
		},
		//檢查allProfile是否有type
		currentType: {
			get(){
				// if(this.allProfile)
				// 	this.CurrentInfo.type = Object.keys(this.allProfile)[0];
				return this.allProfile;
			}
		},
		//檢查allProfile是否有dev_id
		currentDevice: {
			get(){
				console.log(this.CurrentInfo, this.allProfile)
				let check_arr = [];
				if(this.CurrentInfo['type'] != ''){
					check_arr = Object.keys(this.allProfile[this.CurrentInfo['type']]);
				}
				if(check_arr.length > 0){
					this.showValue['dev_id'] = 'true';
					return this.allProfile[this.CurrentInfo['type']];
				}else{
					this.showValue['dev_id'] = 'false';
				}
			}
		},
		//屬性名稱的處理
		currentAttr: {
			get () {
				console.log(this.CurrentInfo)
				console.log(this.$store.state.deviceCommand)
				if(this.CurrentInfo['type'] != '' && this.CurrentInfo['device'] != ''){
					let check_arr = this.allProfile[this.CurrentInfo['type']][this.CurrentInfo['device']];
					this.arr_check = this.allProfile[this.CurrentInfo['type']][this.CurrentInfo['device']];
					//console.log(check_arr)
					if(check_arr.length > 0){
						this.showValue['attr'] = 'true';
						return check_arr;
					}
					else this.showValue['attr'] = 'false';
				}
				else return;
			}
		},
		currentName:{
			get(){
				return this.CurrentInfo.rule_name
			},
			set(value){
				// 名稱不可超過20位元（中文字符3位元，其他字符1位元）。
				this.CurrentInfo.rule_name = value;
				let count_size = [];
				let total_size = 0;
				for(let i of value){
					if(i.match(/[\u3400-\ufa6a]/)){
						count_size.push(3);
						total_size += 3;
					}else{
						count_size.push(1);
						total_size += 1;
					}
				}
				if(total_size > 20){
					this.$notify({
						type: 'warning',
						title: this.$t("GENERAL.SETTING_ERROR"),
						message: this.$t("GENERAL.ERROR_MSG_024")
					});
					while(total_size>20){
						total_size -= count_size[count_size.length-1];
						count_size.pop()
						this.CurrentInfo.rule_name = this.CurrentInfo.rule_name.substring(0, this.CurrentInfo.rule_name.length-1);
					}
				}
			}
		}
	},
	methods: {
		//將字串透過i18n翻譯
		translation_type(value) {
			return this.$t("GENERAL." + typeToKind(value));
		},
		// 開另外一個屬性控制
		addAttrOption_1(){
			//console.log("第一項")
			if(!this.isOpenAttr_2){
				this.isOpenAttr_2 = true;
				this.flag = 1
			}
				
		},
		addAttrOption_2(){
			//console.log("第二項")
			if(!this.isOpenAttr_1){
				this.isOpenAttr_1 = true;
				this.flag = 2
			}
				
		},
		// 關閉個別的屬性控制
		deleteAttrOption_1(){
			//console.log("刪掉第一項")
			this.isOpenAttr_1 = false;
			this.CurrentInfo.attr_1 = "";
			this.CurrentInfo.symbol_1 = "";
			this.CurrentInfo.upperlimit_1 = "";

		},
		deleteAttrOption_2(){
			//console.log("刪掉第二項")
			this.isOpenAttr_2 = false;
			this.CurrentInfo.attr_2 = "";
			this.CurrentInfo.symbol_2 = "";
			this.CurrentInfo.upperlimit_2 = "";

		},
		emitEventConfig(){
			this.$emit("getEventInfo", this.CurrentInfo);
		}
	},
	watch: {
		'CurrentInfo.type':{
			handler(newValue){
				this.CurrentInfo.device = "";
				let first_dev = Object.keys(this.allProfile[newValue])[0];
				this.CurrentInfo.device = first_dev;    //預設顯示第一個
			}
		},
		'CurrentInfo.device':{
			handler(newValue){
				this.CurrentInfo.attr_1 = "";
				if(this.allProfile[this.CurrentInfo.type][newValue] != {}){
					let first_attr = this.allProfile[this.CurrentInfo.type][newValue][0].value;
					this.CurrentInfo['attr_1'] = first_attr;
				}
			}
		},
		'CurrentInfo.attr_1':{
			handler(){
				console.log(this.CurrentInfo['attr_1'], this.CurrentInfo['device'])
				let index = this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']].findIndex(e => e.attr == this.CurrentInfo['attr_1'])
				if(index != -1){
					console.log((this.$store.state.deviceCommand.deviceAttrList))
					//console.log(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]["value_list"])
					if(Object.keys(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]).includes("value_list") == true){
						this.now_attr_1 = true
						this.valueList1 = JSON.parse(JSON.stringify(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]["value_list"]))
					}
					else{
						this.now_attr_1 = false
					}
				}
			}
		},
		'CurrentInfo.attr_2':{
			handler(){
				//console.log(this.CurrentInfo['attr_2'], this.CurrentInfo['device'])
				let index = this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']].findIndex(e => e.attr == this.CurrentInfo['attr_2'])
				if(index != -1){
					//console.log(Object.keys(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]))
					if(Object.keys(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]).includes("value_list") == true){
						this.now_attr_2 = true
						this.valueList2 = JSON.parse(JSON.stringify(this.$store.state.deviceCommand.deviceAttrList[this.CurrentInfo['device']][index]["value_list"]))
					}
					else{
						this.now_attr_2 = false
					}
				}
			}
		},
	}
};
</script>