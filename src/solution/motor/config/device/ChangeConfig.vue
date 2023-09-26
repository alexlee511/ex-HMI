<template>
	<div class="main" :Style="stylerwd()">
        <div   class="slaveL _48 text_item"  :Style="stylerwd('50','10','5','0')">{{ $t("MOTOR.NAME") }}</div>
        <input class="slaveL _48 input_item" :Style="stylerwd('50','8','5','10')" v-model='customName' maxlength="20"></input>
        <div   class="slaveM " v-for="(item, index) in selectList" :key="index" :Style="block(`${index}`)">
            <div   class="slaveL _48 text_item" :Style="stylerwd('100',`${index}`,'0' ,'0' , '1')">{{ $t(item.name) }}</div>
            <div   class="slaveM" v-for="(device, Index) in item.dev" :Style="inputSy(`${index}`,`${Index}`)"  :key="Index">
                <input class="slaveL _36 text_item" :Style="stylerwd('10','90','0','0')" @change='Selectdev(device.devid,item.set)' type="checkbox" :checked="getcheck(device.devid)"></input>
                <div   class="slaveL _36 text_item" :Style="stylerwd('90','100','12','0')" >{{device.devid}}</div>
            </div>
        </div>
	</div>
</template>

<script>
import { true_config , Setsetting , Addsetting} from "../../data/ston/data";
import { DeviceName } from "common/constant/profile";
export default {
	data(){
		return{
			customName: "Motor",
			deviceId: this.$route.query.devId,
            devicelist : {},
            selectList : [
                {
                    'name' : "MOTOR.DEV_METER",
                    'dev'  : [],
                    'set'  : 'power',
                },
                {
                    'name' : "MOTOR.DEV_SEN",
                    'dev'  : [],
                    'set'  : 'scence',
                },
                {
                    'name' : "MOTOR.DEV_VIR",
                    'dev'  : [],
                    'set'  : 'vibration',
                }
                ],
            // CSS 比例
            title : 10,
            text  : 10 ,
            len   : 2 ,
		};
	},
    computed:{
        inputSy:function(){
            return function(n = 0 ,f=0){
                //總高
                let h      = this.title +  this.text * Math.ceil(this.selectList[n].dev.length / this.len );
                //文字高
                let text_h  = parseInt(100 * (this.text+1) / h)
                let hd      = parseInt(100 * (this.text-2) / h)
                //標頭高
                let x      = parseInt(100 * this.title / h)
                //幾列
                let r      = parseInt(f%this.len)
                //幾排
                let l      = parseInt(f/this.len)
                //一排長度
                let w = parseInt(100 / this.len) ;
                let tmp = "width: "+w+"%;height:"+hd+"%;left:"+(r * w)+"%;top:"+(( l * text_h )+x)+"%;"; 
                return tmp
            }
        },
        block:function(){
            return function(f=0){
                let h = this.title +  this.text * Math.ceil(this.selectList[f].dev.length / this.len );
                let t = 0
                for(let i = 0 ; i < f ; i++){
                    t += this.title + this.text *  Math.ceil(this.selectList[i].dev.length / this.len );
                }
                return "width: 90%;height:"+h+"%;left:5%;top:"+(t+21)+"%;"; 
            }
        },
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                if(f=='0'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
                }else if(f=='1'){
                    let h_tmp = this.title +  this.text * Math.ceil(this.selectList[h].dev.length / this.len );
                    let x = parseInt(100 * this.title / h_tmp)
                    tmp = "width: "+w+"%;height:"+x+"%;left:"+k+"%;top:"+t+"%;"; 
                }
                return tmp 
            }
        },
        getcheck: function(){
            return function(devid){
                if(devid in this.devicelist){
                    return true;
                }
                return false 
            }
        }
    },
	mixins: [],
	async created(){
        for(let devid of Object.keys(this.$store.state.deviceCommand.deviceAttrList)){
            let data = {
                'devid' : devid,
                'name'  : DeviceName[devid] == undefined ? devid : DeviceName[devid]
            }
            for(let attr of this.$store.state.deviceCommand.deviceAttrList[devid]){
                let flag = false;
                switch(attr.attr){
                    case "500600":
                        this.selectList[0]['dev'].push(data);
                        flag = true;
                        break;
                    case "400100":
                        this.selectList[1]['dev'].push(data);
                        flag = true;
                        break;
                    case "405801":
                        this.selectList[2]['dev'].push(data);
                        flag = true;
                        break;
                }
                if(flag){break;}
            }
        }
        //取得現在選擇的
        for(let devid of Object.keys(true_config)){
            if(devid == this.deviceId){
                for(let devarray of true_config[devid].complex){
                    this.devicelist[devarray.deviceId] = devarray.page_type;
                }
                this.customName = true_config[devid].deviceName;
                break;
            }
        }
	},
	mounted() {
		this.$bus.$on("configLoad", () => {
			// 判斷無空欄位
            let flag = false
            let item = {
                'complex'    : [],
                'deviceName' : this.customName,
            } ;
            
            for(let devid of Object.keys(this.devicelist)){
                item.complex.push({
                    'deviceId'   : devid,
                    'page_type'  : this.devicelist[devid]
                })
                
                
                if(this.devicelist[devid] == 'vibration'){
                    flag = true
                }
            }
            if(! flag){
                //說明沒有選擇震動規
                this.$notify({
					type: 'error',
					title:'',
					message: this.$t("MOTOR.ADD_FLIE"),
				})
                return
            }
            
            
            
            
            this.devicelist
            if(this.deviceId == undefined){
                //新增
                Addsetting(item);
            }else{
                //修改
                Setsetting(this.deviceId , item);
            }
			this.$router.back();
            
		});
	},
	beforeDestroy() {
		this.$bus.$off("configLoad");
	},
	methods: {
        Selectdev(devid , set){
            if(this.devicelist[devid]!= undefined){
                delete this.devicelist[devid]
            }else{
                if(Object.keys(this.devicelist).length > 8){
                    this.$notify({
                        type: 'error',
                        title:'',
                        message: this.$t("MOTOR.LENGTH"),
                    })
                    
                }else{
                    this.devicelist[devid] = set
                }
                
            }
        },
        
	},
};
</script>

<style scoped>
@import "~assets/css/cardItem.css";
.text_item {
    color: #ffffff;
}
.input_item {
    background-color: #9bebff;
    color: #000000;
}

</style>