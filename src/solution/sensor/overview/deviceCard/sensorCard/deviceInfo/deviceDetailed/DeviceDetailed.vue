<template>
    <div class='main' :Style="stylerwd()">
        <img class="slaveC _60" :Style="stylerwd('31' ,'52','68','45')" src="~assets/images/meter_basic_icon.png" alt="" /> 
        <div class="slaveL _60" :Style="stylerwd('100','20','2' ,'5' )">{{ devName }}</div>
        <div class="slaveL"     :Style="stylerwd('90' ,'80','2' ,'20')">
            <div class="slaveM attrView " v-for="(Item, Index) in data" :key="Index" :Style="stylerwd('45','10',`${Index}`,`${Index}`,'1')" >
                <div class="slaveL      _32" :Style="stylerwd('60','100','0' ,'0')">{{Item.name}}</div>
                <div class="slaveC text _32" :Style="stylerwd('60','100','30','0')">{{Item.value}}</div>
                <div class="slaveR unit _32" :Style="stylerwd('10','100','90','0')">{{Item.unit}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceData  ,update_dev} from "common/constant/ist";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"

export default {
  data() {
    return {
        devId: this.$route.query.devId,
        data: [],
        infoState: false,
		devName: "" ,
        item : {},
    };
	},
	mixins: [ajaxTimerMixin],
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                if(f=='0'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
                }else if(f=='1'){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+(2.5+ parseInt(k/6) * 57.5)+"%;top:"+(parseInt(t%6)*15)+"%;"; 
                    //console.log(tmp);
                }
                return tmp 
            }
        }
    },
	async created() {
        this.devName = this.$store.state.deviceName[this.devId] ?
			this.$store.state.deviceName[this.devId] : this.devId;
		await this.getDeviceData()
		await this.recursive()
		update_dev([[{'deviceId':this.devId}]])
	},
	methods: {
		async getDeviceData() {
			await getDeviceData(this.devId).then((res) => {
				this.data = res.data;
				this.infoState = true
			});
		},
	}
}
</script>

<style scoped>
@import "~assets/css/cardItem.css";
.DEVICEINFO_CONTENT_PAGE{
	width: 75vw;
}

.content_page__title{
	display: flex;
    height: 15vh;
}

.attrView{
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-image: linear-gradient(to right,#01ffff,#2160b8);
    border-image-slice: 1;
    margin: 2vh 0vw;
}

.content_page__title__text{
	font-size:5vmin;
	align-self: center;
}

.content_page__icon_view{
	position: absolute;
	bottom: 3vh;
	right: 3vw;
}

.content_page__icon{
	height: 40vh;
}

</style>