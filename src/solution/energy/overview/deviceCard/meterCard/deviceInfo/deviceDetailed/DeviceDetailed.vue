<template>
    <div class='main' :Style="stylerwd()">
        <img class="slaveC _60" :Style="stylerwd('31','52','68','45')" src="~assets/images/meter_basic_icon.png" alt="" /> 
        <div class="slaveL _60" :Style="stylerwd('90','20','5' ,'5' )">{{ devName }}</div>
        <div class="slaveL"     :Style="stylerwd('96','80','2' ,'20')">
            <div v-for="(e, index) in show_attr" :key="e.attr" class="slaveM attrView " :Style="style_attr(index)">
                <div v-if="index<2">
                    <div class="slaveL      _36" :Style="stylerwd('40','100','0' ,'0 ')"> {{ e.name }}  </div>
                    <div class="slaveL text _48" :Style="stylerwd('60','100','0' ,'45')"> {{ e.value }} </div>
                    <div class="slaveR unit _48" :Style="stylerwd('20','100','70','45')"> {{ e.unit }}  </div>
                </div>
                <div v-else>
                    <div class="slaveL      _36" :Style="stylerwd('40','100','0' ,'0')"> {{ e.name }}  </div>
                    <div class="slaveL text _36" :Style="stylerwd('60','100','45','0')"> {{ e.value }} </div>
                    <div class="slaveR unit _36" :Style="stylerwd('20','100','75','0')"> {{ e.unit }}  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceData  ,update_dev , page_set} from "common/constant/ist";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"

export default {
    data() {
        return {
            devId: this.$route.query.devId,
            prio_attr: [['500900'],['501200'],['500600','501900'],['500500','501800'],['500700'],['500800']], //order is fixed
            infoState: false,
            devName: "" ,
            show_attr : [],
        };
	},
	mixins: [ajaxTimerMixin],
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                // console.log( "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;");
                return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;";
            }
        },
        style_attr: function(){
            return function(index){
                if(index>1){
                    index -= 2;
                    let t = 40/this.show_attr.length+index*20;
                    return this.stylerwd('45','10','50', t);
                }else{
                    let t = 10+index*30;
                    return this.stylerwd('45','20','2.5',t);
                }
            }
        }
    },
    async created() {
        this.devName = this.$store.state.deviceName[this.devId] ?
        this.$store.state.deviceName[this.devId] : this.devId;

        //console.log(this.devName)
        await this.getDeviceData()
		await this.recursive()
        update_dev([[{deviceId:this.devId}]])
		page_set(0)
    },
	methods: {
		async getDeviceData() {
            try{
                let data = [];
                let req = await getDeviceData(this.devId)
                if(req.status != 'fail'){
                    data = data.concat(req.data);
                    this.show_attr = [];
                }
                // console.log(data)

                //Init all data to show
                for (let p of this.prio_attr){
                    let found = false;
                    for(let p2 of p){
                        for(let d of data){
                            if(d.attr == p2){
                                this.show_attr.push({
                                    attr: d.attr,
                                    name: this.$t("GENERAL."+ d.name) == "GENERAL."+ d.name ? d.name : this.$t("GENERAL."+ d.name),
                                    value: parseFloat(d.value).toFixed(3),
                                    unit: d.unit
                                })
                                found = true;
                                break;
                            }
                        }
                        if(found) break;
                    }
                }
                // console.log(this.show_attr)
            }catch (e) {
            }
		},
	}
}
</script>
<style >
@import "~assets/css/cardItem.css";

</style>
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