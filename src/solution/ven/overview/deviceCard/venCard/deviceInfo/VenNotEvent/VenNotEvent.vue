<template>
    <div class="main" Style="width: 100% ;height: 100%  ;left: 0%   ;top: 0%   ;">
        <div class="slaveM" Style="width: 100% ;height: 55%  ;left: 0%   ;top: 0%   ;">
            <date-pick :not-env="notEvent" :select-env="selectData" ref="DatePick"></date-pick>
        </div>
        <div class="slaveM _24 textvalue" Style="width: 60% ;height: 40%  ;left: 20%   ;top: 60%   ;">
            <div style="display:flex;justify-content:center" v-for="(value, index) in selectData" :key="index">
                <div style="width:50%;">{{ value }}</div>
                <div style="width:10%;"></div>
                <div style="width:20%; padding-right: 0px" @click="deleteDevice(index)">
                    <img class="item__toolicon" src="~assets/images/trash_can.png" >
                </div>
            </div>
        </div>
        <button class="slaveC _16 filter__picker_item" Style="width: 15% ;height: 8%  ;left: 82%   ;top: 65%   ;" @click="setNoEnv">
            {{$t("VEN.ADDNOENV")}}
        </button>      
    </div>        
</template>

<script>
import { ven_card , runupdate , getVenEnv , setVenEnv} from '../../../../../data/ston/data.js'
import DatePick from "../../../../../data/ston/DatePick";
import { ConfigEvent } from "network/uci"
export default {
    components: {
    DatePick,
  },
  data() {
    return {
        devId: this.$route.query.devId,
        data: [],
		devName: "",
        notEvent : [],
        selectData : []
       
    };
	},
	async created() {
        this.$store.commit("setLoadingState");
        let res = await runupdate()
        let ans = await getVenEnv(this.devId);
        if(ans.status == 'ok'){
            if(ans.venlist[0] != undefined){
                this.notEvent = ans.venlist[0]['date'];
            }
        }
        this.$refs.DatePick.set_time(this.notEvent)
        this.$store.commit("setLoadingState");
    },
    methods: {
        async setNoEnv(e){
            this.$store.commit("setLoadingState");
            let date = this.selectData.join()
            await setVenEnv(this.devId , date);
            this.notEvent = this.notEvent.concat(this.selectData);
            let ans = await getVenEnv(this.devId);
            if(ans.status == 'ok'){
                if(ans.venlist[0] != undefined){
                    this.notEvent = ans.venlist[0]['date'];
                }
            }
            await ConfigEvent("sendOutData", "29-VIRTUALVEN")
            
            this.selectData = []
            
            this.$store.commit("setLoadingState");
        },
        deleteDevice(e){
            this.selectData.splice(e,1)
        }
    }
}
</script>

<style scoped>
@import "~assets/css/cardItem.css";
.filter__picker_item {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 4vmin;
  height: 6vh;
}

.item__toolicon {
  width: 20%;
}
.inner-scroll_view {
  overflow-x: hidden;
  overflow-y: scroll;
}
.textvalue::-webkit-scrollbar {
  width: 20px;
}

.textvalue::-webkit-scrollbar-thumb {
  background-color: #4285f4 !important;
  border-radius: 20px !important;
}
.textvalue::-webkit-scrollbar-track {
  background: #f5f5f5 !important;
  border-radius: 20px !important;
}
.textvalue{
    overflow-y: scroll;
    overflow-x: hidden;
    border-style:double;
    border-color:#051a3d;

}
</style>