<template>
  <div Style="position:relative;width: 100%; height: 100%; left: 0%; top: 0%;">
    <config-type-setting>
      <template v-slot:button>
        <header-button @click.native="load">{{ $t('GENERAL.APPLY') }}</header-button>
      </template>
      <template v-slot:content>
        <div class="title-block">
          <div class="title-text">{{ $t('GENERAL.SOLUTION_NAME') }}</div>
          <div class="title-text">{{ $t('GENERAL.SOLUTION_DEVICE') }}</div>
        </div>
        <div class="select-block">
          <div class="select-content">
            <select v-model="solutionKey" @change="solutionChange()">
              <option
                v-for="(value, name) in devicelistall"
                :key="name"
                :value="name"
              >
                {{ translation(value.solutionName) }}
              </option>
            </select>
          </div>
          <div class="select-content">
            <select v-model="solutionDeviceIndex" @change="typeChange()">
              <option
                v-for="(item, index) in devicelistall[solutionKey] &&
                devicelistall[solutionKey].card"
                :key="item.cardId"
                :value="index"
              >
                {{ translation(item.cardName) }}
              </option>
            </select>
          </div>
          <div class="select-tools">
            <div class="user_account" @click="inputAccount">
                <i class="el-icon-search"></i>
                <span> {{ sec }} </span>
            </div>
            <header-button @click.native="All">{{ $t(allfont) }}</header-button>
          </div>
        </div>
        <div class="check-block">
          <div
            class="check-item"
            v-for="(item, index) in displayList"
            :key="index"
          >
            <div class="text-block" @click="checkClick(item)" v-if="update">
              <span style="margin-right: 8px" v-if="item.check">☑</span>
              <span style="margin-right: 8px" v-else>☐</span>
              {{ item.deviceId }} , {{ item.deviceName }}
            </div>
          </div>
        </div>
      </template>
    </config-type-setting>
    <keyboard ref="keyboard" @getText="getText" Style="position:absolute; width: 100%   ; height: 45% ; left: 0%  ; top: 55% ; "></keyboard>
  </div>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting";
import HeaderButton from "components/content/headerButton/HeaderButton";
import keyboard from "components/common/keyboard/keyboard.vue"
import draggable from "vuedraggable";
import { Notification } from 'element-ui';
import { setNameSync } from "network/setConfig";
import { ConfigEvent } from "network/uci";
import { mapGetters, mapState } from "vuex";

export default {
	components: {
		ConfigTypeSetting,
		HeaderButton,
		draggable,
		keyboard,
	},
	data() {
		return {
			displayList: [],
			devicelistall : {},
			solutionKey: null,
			solutionDeviceIndex: 0,
			sec : "",
			update: true,
			
			allfont:'GENERAL.CHOOSE_ALL',
			choose :'GENERAL.CHOOSE_ALL',
			cancel :'GENERAL.CANCEL_ALL'
		};
	},
	created() {
		this.$store.dispatch("getSolutionData").then(() => {
			//移除掉沒有設定的裝置
			for(let i of Object.keys(this.solutionData)){
				
				if(this.solutionData[i].card.length == 0 )continue;
				for(let j of this.solutionData[i].card){
					
					if(j.device.length != 0){
						//將卡片暫時複製上去
						let tmp = {};
						tmp.cardId   =  j.cardId  ;
						tmp.cardName =  j.cardName;
						tmp.device   = [] ;
						
						for(let k of j.device){
							if(k.deviceName !== k.deviceId){
								let l = {}
								l.check = false;
								l.deviceId = k.deviceId;
								l.deviceName = k.deviceName;
								tmp.device.push(l)
							}
						}
						//沒有裝置
						if(tmp.device.length == 0)continue;
						
						//放入物件中
						
						//如果這是第一個
						if(!Object.keys(this.devicelistall).includes(i)){
							this.devicelistall[i] = {
								'card' : [] ,
								'solutionName' : this.solutionData[i].solutionName
							}
						}
						this.devicelistall[i].card.push(tmp)
					}
				}
			}

			if(Object.keys(this.devicelistall).length ==0){
					this.$notify({
						title: this.$t('GENERAL.NOTICE'),
						message: this.$t('GENERAL.NO_NAME'),
						type: 'warning'
				}   );
			}
			else{
				this.solutionKey = Object.keys(this.devicelistall)[0]
			}
			this.displayList = this.devicelistall[this.solutionKey].card[this.solutionDeviceIndex].device
		})
	},
	mounted() {
	},
	methods: {
		getText(value){
			this.sec = value;
			if(!value || value.length == 0)
				this.displayList = this.solutionDevice;
			else{
				this.displayList = [];
				for(const dev of this.solutionDevice){
					if( dev.deviceId.match(value) || dev.deviceName.match(value) ){
						this.displayList.push(dev);
					}
				}
			}
		},
		inputAccount(){
			this.$refs.keyboard.text = this.sec;
			this.$refs.keyboard.open = true;
		},
		//顯示名稱
		translation(value) {
			return this.$t(`${value}`)
		},
		//方案切換
		solutionChange() {
			this.solutionDeviceIndex = 0;
			this.displayList = this.devicelistall[this.solutionKey].card[this.solutionDeviceIndex].device
			this.allfont = this.choose ;
			this.$refs.keyboard.open = false;
			this.sec = '';
		},
		//型態(類型)切換
		typeChange(){
			this.displayList = this.devicelistall[this.solutionKey].card[this.solutionDeviceIndex].device
			this.allfont = this.choose;
			this.$refs.keyboard.open = false;
			this.sec = '';
		},
		//點擊按鈕
		checkClick(item) { 
			item.check = !item.check;
		},
		//寫入API
		async load() {
			let tmp = []
			for(let i of Object.keys(this.devicelistall)){
				for(let j of this.devicelistall[i].card){
					for(let k of j.device){
						if(k.check){
							tmp.push(k.deviceId)
						}
					}
				}
			}
			this.$store.commit("setLoadingState");
			let req = await setNameSync(tmp.join(','))
			if(req.status != 'ok'){
				this.$notify({
					title: this.$t('GENERAL.SETTING_ERROR'),
					message: req.err.msg,
					type: 'warning'
				}   );
				this.$store.commit("setLoadingState");
				return ;
			}
			//env
			await ConfigEvent( '0' ,'syncName' )
			this.$store.commit("setLoadingState");
			this.$router.back();
		},
		//全選或全取消
		All(){
			this.$refs.keyboard.open = false;
			if(this.allfont == this.choose){
				for(let item of this.displayList) {
					item.check = true;
				}
				this.allfont = this.cancel ;
			}else{
				for(let item of this.displayList) {
					item.check = false;
				}
				this.allfont = this.choose ;
			}
		}
	},
	computed: {
		...mapState({
			solutionData: (state) => state.solutionData,
		}),
		solutionDevice(){
			return this.devicelistall[this.solutionKey].card[this.solutionDeviceIndex].device
		}
	}
};
</script>

<style scoped>
.user_account, .user_password{
    display: flex;
    align-items: center;
    width: 40%;
    height: 3.5vw;
    border: 4px #2978B5 solid;
    background: #8AB6D6;
    margin: 0 auto;
    margin-bottom: 1vw;
    cursor: pointer;
}
.title-block {
  display: flex;
  width: 80vw;
  height: 8vh;
  align-items: center;
  color: #01ffff;
  font-size: 2.5vw;
  margin: 0 auto;
  font-weight: bold;
}
.title-text {
  width: 25%;
  text-align: center;
}
.select-block {
  display: flex;
  width: 80vw;
  height: 13vh;
  align-items: center;
  font-size: 2vw;
  margin: 0 auto;
  font-weight: bold;
}
.select-content {
  width: 25%;
  text-align: center;
}
.select-tools {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  width: 70%;
}
.check-block {
  margin: auto;
  width: 80vw;
  
  flex-wrap: wrap;
  height: calc(100% - 13vh - 8vh);
  overflow: auto;
}
/* .check-block::-webkit-scrollbar {
  width: 0 !important;
} */
.text-block {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* text-align: center; */
}
.check-item {
  width: 95%;
  height: 13vh;
  font-size: 2vw;
  color: #ffffff;
 
  align-items: center;
  background: linear-gradient(rgba(89, 106, 202, 0.8), rgba(33, 96, 184, 0.8));
  
  margin-bottom: 25px;
}
.list-group {
  width: 100%;
  height: 40%;
}
.check-block::-webkit-scrollbar {
  width: 30px;
}
.check-block::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 10px;
}
.check-block::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}
</style>
<style>
.select-tools .header-button {
    width: 20vw;
}
</style>