<template>
    <div class='main' :style='stylerSize()'>
        <div class='slaveC _70 h_Messagebox' :style='stylerSize(60,50,20,25)'>
            <div class='slaveC _70 h_Messagebox_titel' :style='stylerSize(100,20,0,0)'>
                ADR通知
            </div>
            <div class='slaveC _40' :style='stylerSize(80,35,10,30)'>
            {{alarm_obj.alarm_time}}台電將進行ADR自動需量反應，系統將自動執行空調降載，是否需臨時取消？<br>(如未點選將會自動執行)
            </div>
            <Button class="slaveC _40 h_Messagebox_YES_Button" :Style='stylerSize(20,15,20,75)' @click="_oncleck('Y')"><div>執行ADR</div></Button>
            <Button class="slaveC _40 h_Messagebox_NO_Button" :Style='stylerSize(20,15,60,75)' @click="_oncleck('N')"><div>不執行</div></Button>
            <!--<div class='slaveC _40 h_Messagebox_OK' :style='stylerSize(5,5,10,75)'>-->
            </div>
        </div>
    </div>
</template>

<script>
import {stop_alarm , setVenEnv , alarm_list , ven_card} from "../data/ston/data.js"
import { ConfigEvent } from "network/uci"
export default {
    data() {
        return {
            alarm_obj : "",
        }
    },
    components: {
    },
    mixins: [],
    created() {
       this.alarm_obj = alarm_list.pop()
    },
    methods: {
        _oncleck(envt){
            console.log(envt)
            if(envt == 'N'){
                let Today=new Date();
                let M = (Today.getMonth()+1).toString()
                let D = (Today.getDate()).toString()
　              let time = Today.getFullYear()+ "-" + (M.length==2?M:"0"+M) + "-" + (D.length==2?D:"0"+D) ;
                setVenEnv(this.alarm_obj.alarm_id , time);
                ConfigEvent("sendOutData", "29-VIRTUALVEN")
                for(let i of ven_card){
                    if(i.venId == this.alarm_obj.alarm_id){
                        i.alarm = false
                        break
                    }
                    
                }
            }
            stop_alarm();
            
        },
    }
};
</script>
<style scoped>
    
</style>

