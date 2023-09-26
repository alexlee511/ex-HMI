<template>
    <div class='main' :Style="stylerwd()">
        <img class="slaveC _60" :Style="stylerwd('31' ,'52','68','45')" src="~assets/images/meter_basic_icon.png" alt="" /> 
        <div class="slaveL _60" :Style="stylerwd('100','20','2' ,'5' )">{{ devName }}</div>
        <div class="slaveL"     :Style="stylerwd('90' ,'80','2' ,'20')">
            <img class="slaveC _60"       :Style="stylerwd('60' ,'50','0' ,'0')" src="~assets/images/motor_info_2.png" alt="" /> 
            <div class="slaveM attrView " :Style="stylerwd('45','10','2.5','45')">
                <div class="slaveL      _24" ref="405801_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="405801_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="405801_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('45','10','2.5','60')">
                <div class="slaveL      _24" ref="405802_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="405802_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="405802_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('45','10','2.5','75')">
                <div class="slaveL      _24" ref="405803_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="405803_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="405803_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('40','10','60','0')">
                <div class="slaveL      _24" ref="500900_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="500900_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="500900_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('40','10','60','15')">
                <div class="slaveL      _24" ref="500500_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="500500_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="500500_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('40','10','60','30')">
                <div class="slaveL      _24" ref="500600_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="500600_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="500600_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('40','10','60','45')">
                <div class="slaveL      _24" ref="501200_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="501200_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="501200_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
            <div class="slaveM attrView " :Style="stylerwd('40','10','60','60')">
                <div class="slaveL      _24" ref="400100_name"  :Style="stylerwd('40','100','0' ,'0')">-</div>
                <div class="slaveC text _24" ref="400100_value" :Style="stylerwd('40','100','40','0')">-</div>
                <div class="slaveR unit _24" ref="400100_unit"  :Style="stylerwd('20','100','80','0')">-</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceData as getDeviceData2  ,update_dev} from "common/constant/ist";

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
            return function(w='100',h='100',k='0',t='0'){
                //console.log( "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;");
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
            }
        }
    },
	async created() {
        for(let tmp of this.$store.state.solutionData.motor.card[0].device){
            if(tmp.deviceId == this.devId){
                this.item = tmp ;
                break;
            }
            
        }
        if(this.item == {}){
            return
        }
		this.devName = this.item.deviceName;
		await this.getDeviceData()
		await this.recursive()
		update_dev([this.item.complex])
	},
	methods: {
		async getDeviceData() {
            try{
                console.log("😀😀😀😀😀😀😀😀😀😀")
                let data = [];
                for(let tmp of this.item.complex){
                    console.log(tmp.deviceId)
                    let req = await getDeviceData2(tmp.deviceId)
                    console.log(req)
                    if(req.status != 'fail'){
                        data = data.concat(req.data);
                    }
                }
                console.log(data)
                console.log(this.item.complex)
                for(let tmp of data){
                    console.log("😀😀😀😀😀😀😀😀😀😀")
                    console.log(tmp)
                    switch(tmp.attr){
                        case "400100":
                        case "501200":
                        case "500600":
                        case "500500":
                        case "500900":
                        case "405803":
                        case "405802":
                        case "405801":
                            this.$refs[tmp.attr+"_name"].innerHTML  = this.$t("GENERAL."+tmp.name) == "GENERAL."+tmp.name ? tmp.name : this.$t("GENERAL."+tmp.name)
                            this.$refs[tmp.attr+"_value"].innerHTML  = parseFloat(tmp.value).toFixed(3);
                            this.$refs[tmp.attr+"_unit"].innerHTML  = tmp.unit
                            break
                    }
                        
                }
            }catch (e) {
                console.log(e)
                console.log("😀😀😀😀😀😀😀😀😀😀")
                console.log("😀😀😀😀😀😀😀😀😀😀")
                console.log("😀😀😀😀😀😀😀😀😀😀")
            }
		},
	}
}
</script>

<style scoped>
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