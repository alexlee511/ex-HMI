<template>
    <div class="main" Style="width : 100% ;height : 100% ;left : 0% ;top : 0% ;" @click='flag=false'>
		<div class='slaveL _60' Style="width: 100% ;height: 20%  ;left: 2%   ;top: 5%   ;">{{ devName }}</div>
        <div class='slaveL'     Style="width: 96%  ;height: 80%  ;left: 2%   ;top: 20%  ;">
            <button class='slaveC objItem' :style="lock['x']" style="width: 10%  ;height: 7%  ;left: 0%   ;top: 0%  ;" @click="_oncleck('x')">X</button>
            <button class='slaveC objItem' :style="lock['y']" style="width: 10%  ;height: 7%  ;left: 12%  ;top: 0%  ;" @click="_oncleck('y')">Y</button>
            <button class='slaveC objItem' :style="lock['z']" style="width: 10%  ;height: 7%  ;left: 24%  ;top: 0%  ;" @click="_oncleck('z')">Z</button>
            <button class='slaveC objItem'                    style="width: 8%   ;height: 7%  ;left: 92%  ;top: 0%  ;" @click="queryDate">{{ $t("GENERAL.SEARCH") }}</button>
            <select class='slaveC objItem' v-model="devid"    style="width: 25%  ;height: 7%  ;left: 36%  ;top: 0%  ;">
				<option v-for="(value, name) in info_item.complex" v-if="value.page_type == 'vibration'":key="name" :value="value.deviceId">
					{{ value.deviceName }}
				</option>
			</select>
            <div class='slaveL chartView' v-loading="loading" style="width: 100% ;height: 70% ;left: 0%   ;top: 5%  ;"
                element-loading-lock="true"
                element-loading-background="transparent"
                element-loading-text="Loading"
                element-loading-spinner="el-icon-loading"
                element-loading-custom-class="create-isLoading"
                >
                <data-chart ref="dataChart"/>
            </div>
		</div>
    </div>
</template>

<script>
import DataChart from '@/components/common/dataChart/DataChart.vue';
import {getFFT} from '@/solution/motor/data/ston/data.js';

export default {
	components: {
		DataChart,
	},
	mixins: [],
	data() {
		return {
            //該卡片的資訊
            info_item : [],
            //選擇的devid
            devid : null,
            //方案的名稱
            devName : null,
            //讀取畫面flag
            loading: false,
            //是否要往下丟fft資訊
            flag: false,
            //三個xyz的按鈕顏色
            lock : {'x' : 'color: #ffff00;' , 'y' : 'color: #FFFFFF;' , 'z' : 'color: #FFFFFF;'  },
            //選中的按鈕
            need_xyz : 'x'
		};
	},
	created(){
        for(let tmp of this.$store.state.solutionData.motor.card[0].device){
            if(tmp.deviceId == this.$route.query.devId){
                this.info_item = tmp ;
                break;
            }
        }
        if(this.info_item == {}){
            return
        }
        this.devName = this.info_item.deviceName;
        if(this.info_item.complex != []){
            for(let tmp of this.info_item.complex){
                if(tmp.page_type == 'vibration'){
                    this.devid = tmp.deviceName
                    break;
                }
            }
        }
	},
    methods: {
        //切換XYZ軸
        _oncleck(envt){
            for(let tmp of Object.keys(this.lock)){
                this.lock[tmp] = 'color: #FFFFFF;';
            }
            this.lock[envt] = 'color: #ffff00;';
            this.need_xyz = envt
        },
        //繪圖
        async queryDate(){
            if(this.flag) return;
            this.flag = true;
            this.$refs.dataChart.clearChart();
            this.loading = true;
            let res =await getFFT(this.devid , this.need_xyz)
            if(res.status != "ok"){
                this.$refs.dataChart.clearChart();
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.DATA_MISSING"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});
                this.loading = false;
                return 
            }
            let fftData = res.data.data.attrList[0].value.split("_")[1].split(",");
            let y_list = []
            for (let i = 1; i <= fftData.length; i++) {
                y_list.push(i);
            }
            this.$refs.dataChart.chart_type = 'line';
			this.$refs.dataChart.x_val = y_list;
            let xyz = this.need_xyz
			this.$refs.dataChart.y_val = { xyz : fftData};
			this.$refs.dataChart.createChart();
            this.flag = false;
            this.loading = false;
        },
    }

};
</script>

<style>
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
</style>