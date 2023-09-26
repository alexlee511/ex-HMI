<template>
	<div class="main" Style="width : 100% ;height : 100% ;left : 0% ;top : 0% ;" @click='flag=false'>
		<div class="slaveL _60" Style="width: 100% ;height: 20%  ;left: 2%   ;top: 5%   ;">{{ devName }}</div>
        <div class="slaveL _48" Style="width: 96%  ;height: 80%  ;left: 2%   ;top: 20%  ;display:flex;">
            <date-pick class="slaveL"           Style="width: 8%   ;height: 10%  ;left: 0%   ;top: 0%  ;" ref="firstDate" @pickDate="pickFirstDate"></date-pick>
            <select    class="slaveL objItem"   Style="width: 8%   ;height: 7%   ;left: 15%  ;top: 0%  ;" v-model="startTime">
                <option v-for="(item, index) in hour" :key="index" :value="item">{{item}}</option>
            </select>
            <div       class="slaveC _48"       Style="width: 2%   ;height: 10%  ;left: 23%  ;top: -2% ;">~</div>
            <date-pick class="slaveL"           Style="width: 8%   ;height: 10%  ;left: 18%  ;top: 0%  ;" ref="lastDate"  @pickDate="pickLastDate" ></date-pick>
            <select    class="slaveL objItem"   Style="width: 8%   ;height: 7%   ;left: 41%  ;top: 0%  ;" v-model="endTime">
                <option v-for="(item, index) in hour" :key="index" :value="item">{{item}}</option>
            </select>
            
            <button    class="slaveC objItem"   Style="width: 15%  ;height: 7%   ;left: 50%  ;top: 0%  ;" @click.stop @click="devlist">{{ $t("MOTOR.DEV_LIST") }}</button>
            <button    class="slaveC objItem"   Style="width: 5%   ;height: 7%   ;left: 90%  ;top: 0%  ;" @click="queryDate">{{ $t("GENERAL.SEARCH") }}</button>
            
            <div       class="slaveL chartView" Style="width: 100% ;height: 70%  ;left: 0%   ;top: 5%  ;"
                v-loading="loading"
				element-loading-lock="true"
				element-loading-background="transparent"
				element-loading-text="Loading"
				element-loading-spinner="el-icon-loading"
				element-loading-custom-class="create-isLoading"
                >
				<data-chart ref="dataChart"></data-chart>
			</div>
            <transition name="dropdown" @click.stop>
                <div class = "slaveC _24 attrView" style="width: 50% ;left: 45% ;top: 2% ;overflow: hidden;" :style="nb" @click.stop v-if="flag">
                    <div class="slaveC" style="width: 90% ;height: 100% ;left: 5% ;top: 0% ;" @click.stop>
                        <div v-for="(item, index) in info_item.complex" :key="index" :value="item" @click.stop  >
                            <div class='text _32'>{{item.deviceName}}</div>
                            <div style='display: flex ;flex-wrap: wrap ;left: 10px' @click.stop >
                                <div v-for="(__attr, index) in $store.state.deviceCommand.deviceAttrList[item.deviceId]" :key="index" :value="__attr" @click.stop>
                                    <div style="width: 100px ;text-align: left ;font-weight: bold ;" v-if="showattr.includes(__attr.attr)" @click.stop >
                                        <input :checked="check_list[item.deviceId]&&check_list[item.deviceId].includes(__attr.value)" type='Checkbox' @change='__onclick(item,__attr , )' @click.stop/>
                                        {{translation(__attr.name)}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
            
        
	</div>
</template>

<script>
import DatePick from "components/common/datePick/DatePick";
import deviceChartMixin from "common/mixin/deviceChartMixin";
import DataChart from '@/components/common/dataChart/DataChart.vue';
import { getOldData } from "network/history"
export default {
	components: {
		DatePick,
		DataChart,
	},
	mixins: [deviceChartMixin],
	data() {
		return {
            info_item : [],
            check_list : {},
            devid : null,
            flag : false,
            showattr : [    "400100",
                            "501200",
                            "500600",
                            "500500",
                            "500900",
                            "405803",
                            "405802",
                            "800501",
                            "800502",
                            "800503",
                            "405801"],
            nb : 'height: 50%'//一個設備 + 10% 4個屬性 +5%
		};
	},
	created(){
        console.log("🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕")
        for(let tmp of this.$store.state.solutionData.motor.card[0].device){
            console.log(tmp)
            if(tmp.deviceId == this.$route.query.devId){
                this.info_item = tmp ;
                break;
            }
        }
        if(this.info_item == {}){
            return
        }
        if(this.info_item.complex != []){
            this.devid = this.info_item.complex[0].deviceId
            this.devId = this.devid
            this.attrId = this.$store.state.deviceCommand.deviceAttrList[this.devid][0].value
            let hi = 0;
            for(let tmp of this.info_item.complex){
                hi += 10
                switch(tmp.page_type){
                    case "power":
                    case "scence":
                        hi += 5
                        break;
                    case "vibration":
                        hi += 10
                        break;
                }
            }
            this.nb = `height: ${hi}%`
        }
        
	},
    methods: {
        __onclick(item , attr){
            //console.log(this.$store.state.deviceCommand.deviceAttrList)
            if(this.check_list[item.deviceId]==undefined){
                this.check_list[item.deviceId] = []
            }
            if(this.check_list[item.deviceId].includes(attr.value)){
                this.check_list[item.deviceId].pop(this.check_list[item.deviceId].indexOf(attr.value))
            }else{
                this.check_list[item.deviceId].push(attr.value)
            }
        },
        async getChartData(start_date, end_date){
            if(this.check_list == {}){
                return
            }
            this.loading = true;
            let dataObj = {};
            let data_list = {}
            //先找出每個時間(分鐘) 內含的項目
            //{時間:{'id_attr':'value'}}
            for(let i of Object.keys(this.check_list)){
                for(let j of this.check_list[i]){
                    let res = await getOldData(i, j, start_date, end_date);
                    if(res.status === 'ok'){
                        if(res.data.length == 0){
                            continue;
                        }
                        let key = this.$store.state.deviceCommand.deviceAttrList[i].find((attr) => {
                            return attr.value === j;
                        });
                        //console.log(key)
                        if(key){
                            //name 
                            
                            let name = i+'_'+key.name
                            dataObj[name] = [];
                            for(let data of res.data){
                                let time = data.timestamp.substr(0,16)
                                if(data_list[time] == undefined){
                                    data_list[time] = {}
                                }
                                data_list[time][name] = data[j];
                            }
                            
                        }
                    }
                }
                
			}
            let attrlist = Object.keys(data_list).sort()
            for(let datalist of attrlist){
                for(let data of Object.keys(dataObj)){
                    dataObj[data].push(data_list[datalist][data])
                }
            }
            this.$refs.dataChart.clearChart();
            this.$refs.dataChart.chart_type = 'line';
            this.$refs.dataChart.x_val = attrlist;
            this.$refs.dataChart.y_val = dataObj;
            
            this.$refs.dataChart.createChart();
			this.loading = false; 
        },
        devlist(){
            this.flag = !this.flag;
        }
    },
    watch: {
        devid: function () {
            this.devId = this.devid
            this.attrId = this.$store.state.deviceCommand.deviceAttrList[this.devid][0].value
        }
       
    }
};
</script>

<style>
@import "~assets/css/cardItem.css";
.dropdown-enter-active, .dropdown-leave-active{
    transition: max-height 0.2s linear;
}

.dropdown-enter, .dropdown-leave-to{
    max-height: 0;
}

.dropdown-enter-to, .dropdown-leave {
    max-height: 20vw ;
}

.create-isLoading .el-loading-spinner {
	top: 50%;
	left: 50%;
	margin-left: -55px;
	background: rgba(0, 0, 0, 0.7);
	padding: 20px;
	border-radius: 4px;
	width: auto;
	text-align: center;
	position: absolute;
}

.create-isLoading i {
  	color: #eee;
}

.create-isLoading .el-loading-text {
  	color: #eee;
}
</style>

<style scoped>
.DEVICEINFO_CONTENT_PAGE {
  	width: 75vw;
}

.content_page__title {
	display: flex;
	height: 15vh;
}

.content_page__title__text {
	font-size: 5vmin;
	align-self: center;
}

.chartView {
	height: 45vh;
	padding-top: 2vh;
	margin-top: 3vh;
	background-color: rgba(234, 234, 234, 0.3);
}

.objItem {
	background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
	border: none;
	color: #ffffff;
	font-weight: bold;
	text-align: center;
	font-size: 2vmin;
	height: 4vh;
    width: 10vh;
	margin-right: 0.5vw;
}

option {
	background-color: rgba(33, 96, 184, 1);
	color: #ffffff;
	font-weight: bold;
}
.attrView{
    background: linear-gradient(rgb(0 , 192 , 255 , 1), rgba(33, 96, 184, 1));
    display: block;
    opacity:1 !important;
    will-change: transform;
    transform: translate3d(6px, 28px, 0px);
    
    
}
</style>