<template>
	<div class="main" :style="stylerSize()">
		<img class="slaveL" :style='stylerSize(3.5,7,51,10)' src="~assets/images/modify.png"/>
		<input class="slaveL _60 span" :style="stylerSize(48,10,7,8)" maxlength="20" v-model="customName">
		
		<div class="slaveM _40" :style="stylerSize(94,8,8,23)">
			<div class="slaveL title_item" :style="stylerSize(22,100,1,0)"> 設備 </div>
			<div class="slaveL title_item" :style="stylerSize(18,100,23.5,0)"> 目標屬性 </div>
			<div class="slaveL title_item" :style="stylerSize(25,100,37.5,0)"> 替換屬性 </div>
			<div class="slaveL title_item" :style="stylerSize(20,100,65,0)"> 倍比 </div>
		</div>

		<div class="slaveL _36 text_item overFlowY" :style="stylerSize(90,65,8,35) " >
			<div class="slaveM" :style="stylerSize(100,100,0,0)" v-for="(meter, index) in front_meterData_array" :key="index+'-'+meter.front_meterID" >
				<!--線條-->
				<div class="slaveM underline"
				:style='stylerSize(90,0.1,0,11.5+(index == 0 ? front_meterData_array[index].front_attribute_array.length-1 : settingCount(index-1, parseInt(0))+meter.front_attribute_array.length-1)*15)'>
				</div>
				
				<!--設備選擇-->
				<drop-down-select class="slaveM" ref="dropDownDevice"
					:style="zIndexStyler(index, 22, 10, 1, (index==0 ? 0 : settingCount(index-1, parseInt(1))*15))" 
					:defaultPicked="0"
					:itemList="setMeterSelectList(meter.front_meterID)"
					:attr="'deviceName'"
					:max_selection="5"
					@itemClicked="setCurrentDevice(index, $event)">
				</drop-down-select>				
				
				<!--默認的會超出螢幕範圍--> 
				<div class="slaveM" :style="stylerSize(100,100,0,0)" v-for="(t_attr, t_index) in front_meterData_array[index].front_attribute_array" :key="meter.front_meterID +'-'+ t_attr.key +'-'+ t_attr.attr" >
					<!--目標屬性-->
					<drop-down-select class="slaveM" ref="dropDownTargetAttr" 
						:style="zIndexStyler(index, 13, 10, 24.5, (index==0 ? t_index : settingCount(index-1, parseInt(2))+t_index)*15, t_index)"
						:defaultPicked="0"
						:itemList="targetAttrList(meter.front_meterID, index, t_index, t_attr.key)" 
						:attr="'name'"
						:max_selection="3"
						@itemClicked="setTargetAttr(index, t_index,  $event)">
					</drop-down-select>

					<!--替換屬性-->
					<drop-down-select class="slaveM"  ref="dropDownChangeAttr"
						:style="zIndexStyler(index, 27, 10, 39, (index==0 ? t_index : settingCount(index-1, parseInt(3))+t_index)*15, t_index)"
						:defaultPicked="0"
						:itemList="ChangeAttrList(index, t_index, t_attr.attr)" 
						:attr="'name'"
						:max_selection="5"
						@itemClicked="setChangeAttr(index, t_index, $event)">
					</drop-down-select>
					
					<!--倍比-->
					<img class="slaveL" 
						:style='zIndexStyler(index,4,10,72, (index==0 ? t_index : settingCount(index-1, parseInt(4))+t_index)*15, t_index)' 
						src="~assets/images/modify.png"/>
					<input class="slaveM span" 
						:style="zIndexStyler(index,8,10,68, (index==0 ? t_index : settingCount(index-1, parseInt(5))+t_index)*15, t_index)" 
						v-model="front_meterData_array[index].front_attribute_array[t_index].cvt" 
						maxlength="4"
						@blur="setCvt(index, t_index)"/>
					
					<!--刪除-->
					<img class="slaveL"
					:style='zIndexStyler(index,4,10,85, (index==0 ? t_index : settingCount(index-1, parseInt(6))+t_index)*15, t_index)' src="~assets/images/remove.png" @click="removeRow(index, t_index)"/>
				
					<!--增加屬性-->
						<img class="slaveM" v-if="t_index == front_meterData_array[index].front_attribute_array.length-1"
						:style='zIndexStyler(index,4,10,80,(index == 0 ? front_meterData_array[index].front_attribute_array.length-1 : settingCount(index-1, parseInt(7))+front_meterData_array[index].front_attribute_array.length-1)*15, t_index)' 
						src="~assets/images/add_square.png" 
						@click="addAttribute(index, t_index)"/>
				</div>
			</div>
		</div>

		<button class="slaveC _36 hmi_setting_content_button" 
			:style='stylerSize(11,8,80,22)' 
			@click="insertRow()" > {{ $t('GENERAL.ADD') }}
		</button>
	</div>
</template>

<script>
import { getGetewayInfo } from "network/module";
import configStoreMixin from "solution/energy/utils/configStoreMixin";
import { DeviceName } from "common/constant/profile"
import dropDownSelect from "components/common/selectsingle/dropDownSelect";

export default {
	components: {
        dropDownSelect,
    },
	data(){
		return{
			constCVT: "1",
			customName: "",
			deviceId: this.$route.query.devId,
			gatewayID: null,
			count: 0,
			front_meterData_array:[],
			meterList: "",
			meter_info:"",
			modify_meter: false,
		};
	},
	mixins: [configStoreMixin],
	async created()
	{
		console.log("==================[ Set created]==================")
		this.$store.state.loading = true;
		await getGetewayInfo().then((res) => {
			this.gatewayID = res.gw_id.substring(4);
			this.gatewayID = this.gatewayID.substring(0, this.gatewayID.length - 2)
		});

		if(this.deviceId) // 編輯設備
		{
			this.meterList = JSON.parse(JSON.stringify(this.$store.state.virtual.virtualMeterInfo[this.$route.query.devId]));
			if(this.meterList == undefined)
			{
				console.log("[METER LIST NOT FOUND]");
				return ;
			}
			for(let meter of this.meterList)
			{
				if(!this.$store.state.virtual.meterInfo[meter]) 
				{
					console.log("[DEVICE NOT FOUND]: " + meter);
					continue;
				}
				this.front_meterData_array.push({
					front_meterID: meter,
					front_attribute_array: JSON.parse(JSON.stringify(this.$store.state.virtual.meterInfo[meter].attribute_array)),
					modify_attr: false,	
				});
			}
			// 初始化名稱
			let selectDeviceName_list = this.$store.state.virtual.virtualDeviceNameList; ////
			let name_index = selectDeviceName_list.findIndex( dev => { return dev.dev_id === this.deviceId });
			this.customName = name_index == -1 ? 
							DeviceName[this.deviceId] || this.deviceId : 
							selectDeviceName_list[name_index].deviceName;
		}
		else // 新增設備
		{
			let available_num = this.$store.state.virtual.availableNumberList.findIndex( e => {return e === 0});
			if(available_num===-1){
				this.$notify({
					type: "warning",
					title: "無法新增設備",
					message: "已達設備數量上限"
				})
				this.$router.back();
			}
			this.deviceId = this.customName = "IN10" + this.gatewayID + 'M'  + available_num;
		}
		this.$store.state.loading = false;
		console.log("==================[Finish created]==================")
	},
	
	mounted() {
		this.$bus.$on("configLoad", () => {
			 
			console.log("==================[Set mounted]==================")
			let available_num = this.$store.state.virtual.availableNumberList.findIndex( e => {return e === 0});
			console.log("front_meterData_array:", JSON.stringify(this.front_meterData_array, null, 4))

			//如果是新增ID要更新到前端
			if(this.deviceId[this.deviceId.length-1] == available_num){
				console.log("[Update device id]")
				let new_array = JSON.parse(JSON.stringify(this.$store.state.virtual.availableNumberList));
				new_array[available_num] = 1;
				this.$store.commit("virtual/setAvailableNumberList", new_array);
			}

			if(this.modify_meter == true)
			{
				console.log("[update virtual meter]")
				this.$store.state.virtual.modify_meter[this.deviceId] = true;

				let front_meterID_array=[];
				console.log("front_meterData_array: ", JSON.stringify(this.front_meterData_array, null, 4))
				for(let meter of this.front_meterData_array)
				{
					front_meterID_array.push(meter.front_meterID)
				}
				console.log("front_meterID_array: ", JSON.stringify(front_meterID_array, null, 4))

				let configVM = {
					device_id: this.deviceId,
					meterID_array: front_meterID_array,
				};
				console.log("configVM: ", JSON.stringify(configVM, null, 4))

				this.$store.commit("virtual/setConfigVirtualMeter", configVM);
				
				console.log("[finish update virtual meter]==================")
			}
			///////////////////////////////////////////////////////////////////
			console.log("[update meter]")
			for(let meter of this.front_meterData_array)
			{
				console.log("[check] front_meterData: ", JSON.stringify(meter, null, 4))
				if(meter.modify_attr == true) 
				{
					console.log("[check] modify attr =>", JSON.stringify(meter.modify_attr, null, 4))
					this.$store.commit("virtual/setConfigMeter", meter);
				}
			}
			if(this.modify_meter == true)
			{
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
			}

			console.log("[finish update meter]==================")

			if(this.front_meterData_array.length == 0)
			{
				delete this.$store.state.virtual.virtualMeterInfo[this.deviceId]
			}

			let idx = this.$store.state.virtual.virtualDeviceNameList.findIndex( e => { 
				return e.dev_id == this.deviceId; 
			});
			if(idx !== -1){
				this.$store.commit("virtual/setVirtualDeviceName", {
					dev_id: this.deviceId,
					deviceName: this.customName
				});
			}
			else if(!DeviceName[this.deviceId] || this.customName != DeviceName[this.deviceId]){
				this.$store.commit("virtual/addVirtualDeviceName", {
					dev_id: this.deviceId,
					deviceName: this.customName
				});
			}
			this.$router.back();
			console.log("==================[Finish mounted]==================")
		});
	},
	beforeDestroy() {
		this.$bus.$off("configLoad");
	},
	methods: {
		zIndexStyler(index, w, h, l, t, attr_index=0)
		{
			let len = this.front_meterData_array.length;
			let size = len == 1 ? this.settingCount(0) : this.settingCount(len-1);
			// z-index隨著資料筆數遞減，則越舊的資料保持在越上層的地方，避免被新資料遮擋
			return `z-index: ${index == 0 ? (size-attr_index) : (size-this.settingCount(index-1)-attr_index)}; 
					width: ${w}%; height: ${h}%; left: ${l}%; top: ${t}%;`; 
		},
		settingCount(index)
		{
			// 回傳當前累積的設定筆數
			let sum = 0;
			for(let i=0; i<index+1; ++i)
			{
				sum += this.front_meterData_array[i].front_attribute_array.length;
			}
			return sum;
		},

		insertRow()
		{
			console.log("==================[Insert row]==================")

			let set_meter_list = this.setMeterSelectList();
			if(set_meter_list.length == 0)
			{
				this.$notify({
					type: "warning",
					title: "無法新增設備_self",
					message: "已經沒有可新增的設備_self"
				})
				return;
			}
			
			let meter_id = set_meter_list[0].deviceId;
			let meter_index = this.front_meterData_array.length;
			this.front_meterData_array.push( this.setMeterData(meter_id, meter_index));
			this.modify_meter = true;
			this.front_meterData_array[meter_index].modify_attr = true;
			console.log("🍟new] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));
			console.log("==================[Finish insert row]==================")
		},
		
		setMeterSelectList(meter_id)	//做電表清單
		{
			console.log("==================[Set meter select list]==================")
			let meterSelectList = JSON.parse(JSON.stringify(this.meter_option_array));
			for(let meter of this.front_meterData_array)
			{
				let meter_exist = meter.front_meterID;
				meterSelectList = meterSelectList.filter(m => { return m.deviceId !==meter_exist});
			}

			if(meter_id != undefined)
			{
				meterSelectList.splice( 0, 0,  {
					deviceId : meter_id,
					deviceName : DeviceName[meter_id] || meter_id,
				});
				console.log("Drop down meterselect list: ", JSON.stringify(meterSelectList, null, 4))
			}

			console.log("==================[Finish set meter select list]==================")			
			return meterSelectList
        },

		setCurrentDevice(meter_index, new_picked)	//選擇電表
		{
			console.log("new_picked: ", JSON.stringify(new_picked, null, 4))
			console.log("==================[Set current device]==================")
			let new_picked_index = new_picked[0];
			let new_picked_item = new_picked[1];
			console.log("new_picked_item: ", JSON.stringify(new_picked_item, null, 4))

			if( new_picked_index === 0) return;
			/***更新目前所顯示***/
			let new_picked_meter_id = this.find_key(DeviceName, new_picked_item) || new_picked_item;
			this.front_meterData_array[meter_index] = this.setMeterData(new_picked_meter_id, meter_index );		
			this.modify_meter = true;
			this.front_meterData_array =[...this.front_meterData_array];
			console.log("🍟new] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));
			console.log("==================[Finish Set current device]==================")
			
		},
		find_key(obj, value)
		{
			for(let key in obj)
			{
				if (obj[key] == value)
				{
					return key;
				}
			}
		},

		setMeterData(meter_id, meter_index)		//製作電表對應的資料
		{
			console.log("==================[Set meter data]==================")
			let tmp_meterData = {
				front_meterID: meter_id,
				front_attribute_array:[],
				modify_attr:false,
			};

			let meter_id_exist = this.$store.state.virtual.meterInfo[meter_id];

			if(meter_id_exist == undefined) //新的電表資料
			{
				if(this.front_meterData_array[meter_index] !== undefined)	//when insert new row
				{
					let tmp_len = this.front_meterData_array[meter_index].front_attribute_array.length;
					this.front_meterData_array[meter_index].front_attribute_array.splice(0, tmp_len);
				}

				// 新增一筆顯示默認值與未被設定的設備
				let tmp_attr_for_key = this.targetAttrList(meter_id, meter_index, 0)[0].attr;
				let tmp_key = this.main_attribute_option_list[tmp_attr_for_key];
				let tmp_attr = this.attribute_option_list[meter_id][0].attr;
				tmp_meterData.front_attribute_array.push({
					key: tmp_key,
					attr:tmp_attr,
					cvt: this.constCVT,
				});
				tmp_meterData.modify_attr = true;
			}
			else //有設定過的電表資料
			{
				let attribute_array_copy = JSON.parse(JSON.stringify(meter_id_exist.attribute_array)) ///必須深拷貝!!!!!!!!
				for(let attr_block of attribute_array_copy )
				{
					tmp_meterData.front_attribute_array.push( attr_block);
				}
				
				tmp_meterData.modify_attr = false;
			}
			console.log("[Set]] tmp_meterData: ", JSON.stringify(tmp_meterData, null,  4));
			console.log("==================[Finish set meter data]==================")
			return tmp_meterData;
		},

		targetAttrList(meter_id, meter_index, attr_index, key)
		{

			console.log("==================[Set target select list]==================")
			//console.log("this.main_attribute_option_list: ", JSON.stringify(this.main_attribute_option_list, null, 4))
			let tmp_array = [];
			for(let obj_key of Object.keys(this.main_attribute_option_list))
			{
				console.log("this.attribute_option_list[meter_id]: ", JSON.stringify(this.attribute_option_list[meter_id], null,  4));
				let idx = this.attribute_option_list[meter_id].findIndex( e => {
					return e.attr == obj_key;
				})


				if(idx !== -1)
				{
					let tmp_attr = JSON.parse(JSON.stringify(this.attribute_option_list[meter_id][idx]))
					tmp_array.push(tmp_attr);
				}

			}
			console.log("All legal main attribute: ", JSON.stringify(tmp_array, null, 4))
			//let count = 0;
			if(meter_index < this.front_meterData_array.length)
			{
				for(let attr_block of this.front_meterData_array[meter_index].front_attribute_array)
				{
					//已選擇的屬性，從key(設定檔)反向找attr => 已存在的attr
					let attr_exist = Object.keys(this.main_attribute_option_list).find(attr => this.main_attribute_option_list[attr] === attr_block.key);
					tmp_array = tmp_array.filter(t => {
						return t.attr !== attr_exist});
				}
			}
			if(key !== undefined)
			{
				let current_attr_of_key = this.find_key(this.main_attribute_option_list, key)
				let current_attr_obj = this.attribute_option_list[meter_id].find(obj => obj.attr === current_attr_of_key)
				console.log("current attr_obj: ", JSON.stringify(current_attr_obj, null, 4))
				tmp_array.splice( 0, 0, JSON.parse(JSON.stringify(current_attr_obj))
				);
			}

			console.log("==================[Finish set target select list]==================")
			return tmp_array;
			
			
		},
		setTargetAttr(meter_index, attr_index, new_picked)
		{
			console.log("==================[Target]==================")
			console.log("Choose target for ROW:", meter_index+1, "attr row:", attr_index)
			console.log("🍟old] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));

			let new_picked_index = new_picked[0];
			let new_picked_item = new_picked[1];

			if(new_picked_index == 0) return;

			let new_main_atrr = this.find_key(this.main_attribute_option_name_list, new_picked_item);
			this.front_meterData_array[meter_index].front_attribute_array[attr_index].key = this.main_attribute_option_list[new_main_atrr];
			this.front_meterData_array[meter_index].modify_attr = true;
			console.log("🍟new] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));
			console.log("==================[Finish target]==================")

		},

		ChangeAttrList(meter_index, attr_index)
		{
			console.log("==================[Set change select list]==================")
			//console.log("meter_index: ", meter_index, "attr_index: ", attr_index)
			let meter_id = this.front_meterData_array[meter_index].front_meterID;
			let current_attr = this.front_meterData_array[meter_index].front_attribute_array[attr_index].attr;
			console.log("current_attr: ", current_attr)
			//console.log("meter_id: ", meter_id)
			//console.log("this.attribute_option_list: ", JSON.stringify(this.attribute_option_list, null,  4));
			let current_obj = this.attribute_option_list[meter_id].filter(obj => obj.attr === current_attr);
			let tmp_list = this.attribute_option_list[meter_id].filter(obj => obj.attr !== current_attr);
			let tmp_array = current_obj.concat(tmp_list);

			console.log("Change list: ", JSON.stringify(tmp_array, null, 4))
			console.log("==================[Finish set change select list]==================")
			return tmp_array;
		},

		setChangeAttr(meter_index, attr_index, new_picked)
		{
			console.log("==================[Change]==================")
			console.log("meter_index: ", meter_index, "attr_index: ", attr_index)
			console.log("🍟old] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));
			let new_picked_index = new_picked[0]
			let new_picked_item = new_picked[1];
			console.log("new_picked_index: ", new_picked_index);
			console.log("new_picked_item: ", new_picked_item);
			if(new_picked_index == 0) return;
			console.log("Attr changed")
			let meter_id = this.front_meterData_array[meter_index].front_meterID;
			console.log("attribute_option_list[meter_id]: ", JSON.stringify(this.attribute_option_list[meter_id], null, 4))
			let select_obj = this.attribute_option_list[meter_id].find((obj) => obj.name === new_picked_item)
			this.front_meterData_array[meter_index].front_attribute_array[attr_index].attr = select_obj.attr;
			this.front_meterData_array[meter_index].modify_attr = true;
			console.log("🍟new] this.front_meterData_array: ", JSON.stringify(this.front_meterData_array, null,  4));
			console.log("==================[Finish change]==================")
		},
		

		setCvt(meter_index, attr_index)
		{
			console.log("==================[set cvt]==================")
			console.log("meter_index: ", meter_index, "attr_index: ", attr_index);
			console.log("[SET_CVT: ATTR_INDEX]", attr_index)
			// 如果沒有指定屬性，遍歷所有屬性
			let doOnce = attr_index == -1 ? false : true;
			for(let i = doOnce ? attr_index : 0; i < this.front_meterData_array[meter_index].length; i++)
			{
				let input = this.front_meterData_array[meter_index].front_attribute_array[i].cvt;
				if(!input) continue;
				if(input < -100 || input>100){
					this.$notify({
						type: "warning",
						title: "不合法輸入",
						message: "輸入必須為-100到100之間"
					})
					if((/[a-zA-Z]/g).test(input)){
						input = 1
					}else if(input<-100){
						input = -100
					}else if(input>100){
						input = 100
					}
					this.front_meterData_array[meter_index].front_attribute_array[i].cvt = input;
					this.front_meterData_array[meter_index].modify_attr = true;
				}
				
			}
			this.front_meterData_array[meter_index].modify_attr = true;
			console.log("front_meterData_array[", meter_index,"]: ", JSON.stringify(this.front_meterData_array[meter_index], null, 4));
			console.log("==================[Finish set cvt]==================")
		},

		addAttribute(meter_index, attr_index)
		{
			console.log("==================[Add attribute]==================")
			console.log("Add atrr for Row ", meter_index+1)
			if(this.front_meterData_array[meter_index].front_attribute_array.length == 3)
			{
				this.$notify({
					type: "warning",
					title: "無法新增屬性設定",
					message: "最多可對三個屬性進行設定"
				})
				return;
			}
			else
			{
				// 新增一筆 
				let meter_id = this.front_meterData_array[meter_index].front_meterID;
				let newTargetAttrList = this.targetAttrList(meter_id, meter_index, attr_index+1);
				console.log("new target list: ", JSON.stringify(newTargetAttrList, null, 4))
				
				if( newTargetAttrList.length == 0)	///有一個電表沒有三個目標屬性，缺少"虛功率"
				{
					this.$notify({
						type: "warning",
						title: "無法新增屬性設定",
						message: "已經沒有更多可以設定的屬性"
					})
					return;
				}
				let new_key = this.main_attribute_option_list[newTargetAttrList[0].attr]
				console.log("new key:", new_key)

				this.front_meterData_array[meter_index].front_attribute_array.push({
					"key": new_key,
					"attr": this.attribute_option_list[meter_id][0].attr,
					"cvt": this.constCVT,
					
				});
			}
			
			this.front_meterData_array[meter_index].modify_attr = true;
			console.log("Front_meterData_array: ", JSON.stringify(this.front_meterData_array, null, 4))
			console.log("==================[Finish set target select list]==================")
		},

		removeRow(meter_index, attr_index)
		{
			// 刪掉屬性
			console.log("==================[Remove row]==================")
			console.log("front_meterData_array: ", JSON.stringify(this.front_meterData_array, null, 4))
			let delete_key = this.front_meterData_array[meter_index].front_attribute_array[attr_index].key
			console.log("Delete Row", meter_index+1,"'s attr row:", attr_index+1)
			console.log("Delete key:", delete_key)
			this.front_meterData_array[meter_index].front_attribute_array.splice(attr_index, 1);
			this.front_meterData_array[meter_index].modify_attr = true;
			let meter_id = this.front_meterData_array[meter_index].front_meterID;
			// 如果沒有剩下任何屬性設定，刪除整筆資料
			if(this.front_meterData_array[meter_index].front_attribute_array.length == 0)
			{
				this.front_meterData_array[meter_index].modify_attr = false;
				console.log("No attribute, delete ROW:", meter_index+1, "meter:", this.front_meterData_array[meter_index].front_meterID)
				this.front_meterData_array.splice(meter_index, 1);
				this.modify_meter = true;
				
			}
			console.log("[Edit] front_meterData_array: ", JSON.stringify(this.front_meterData_array, null, 4))
			console.log("length: ", this.front_meterData_array.length)
			//this.front_meterData_array =[...this.front_meterData_array];
			console.log("==================[Finish remove row]==================")
			
		},

	},
	computed:{
		
		main_attribute_option_list(){
			let tmp = 
			{
				"501200":"SRC_KWH",
				"500900":"SRC_W",
				"501100":"SRC_VAR"
			};
			return tmp;
		},
		main_attribute_option_name_list()
		{
			let tmp = 
			{
				"501200":"累計電量",
				"500900":"功率",
				"501100":"虛功率"
			};

			return tmp;
		},
		
		meter_option_array(){
			let tmp = [];
			console.log("card: ", JSON.stringify(this.$store.state.solutionData.energy.card, null, 4))
			//console.log(JSON.stringify(Object.keys(this.$store.state.virtual.virtualMeterInfo, null, 4)))
			for(let card of this.$store.state.solutionData.energy.card)
			{
				for(let meter of card.device)
				{
					//if(Object.keys(this.$store.state.virtual.virtualMeterInfo).includes(meter.deviceId)) continue; //remove virtual meter
					if(meter.deviceId === this.deviceId) continue; //remove self
					tmp.push(meter.deviceId);
				}
			}
			console.log("tmp meter device:", JSON.stringify(tmp, null, 4))
			let meters = [];
			for(let i of tmp){
				console.log("attribute_option_list[", i,"]:", JSON.stringify(this.attribute_option_list[i], null, 4))
				if(!this.attribute_option_list[i] ) continue; //remove device without attributes
				let tmp_index = this.attribute_option_list[i].findIndex( e => { return e.attr === '501200'});
				if(tmp_index == -1) continue; //remove device without attribute 501200
				meters.push({
					deviceId : i,
					deviceName : DeviceName[i] || i,
				})
			}

			console.log("meter option array:", JSON.stringify(meters, null, 4))
			return meters;
		},

		attribute_option_list(){
			return this.$store.state.deviceCommand.deviceAttrList;
		},

	},
};


</script>
	
<style scoped>
.hmi_setting_content {
	color: #ffffff;
	font-weight: bold;
	margin: auto;

	font-size: 2.5vw;
	height: 80vh;
	width: 90vw;
	display: flex;
	align-items: center;
	justify-content: center;
}
.hmi_setting_content select {
	background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
	background-color: rgba(33, 96, 184, 0.8);
	border-width: 0px;
	color: #ffffff;
	font-weight: bold;
	border-radius: 2px;
}

.span:focus{
    background-color: #9bebff;
	border-width: solid 2px white;
    border-radius: 2px;
	color: black;
}
.span{
	background-color: #9bebff00;
	border: 0px;
	color: white;
}

.underline{
	border-bottom: 0.2px solid #61ddffe9;
}

</style>