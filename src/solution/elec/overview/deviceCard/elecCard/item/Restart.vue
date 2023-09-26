<template>
    <div class = 'main'  Style="width: 100%; height: 100%; left: 0%; top: 0%;">
        <button class="slaveC buttonMain _36"   Style="width: 80%     ; height: 40%  ; left: 10%   ; top: 20%  ; " @click='_onclick()'>{{$t('ELEC.ELEC_RESTART')}}</button>
        </div>
    </div>  
</template>
<script>
import {adbrestart} from '@/solution/elec/data/ston/data.js';
export default {
    props: {
        itemInfo: {
            type: Object,
            default: {}
        }
    },
    components: {
    },
    created() {  
    },
    methods: {
        async _onclick(){
            //console.log(this.itemInfo.deviceId)
            this.$store.commit("setLoadingState");
            let req = await adbrestart(this.itemInfo.deviceId)
            this.$store.commit("setLoadingState");
            if(req.status == 'ok'){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.CONTROL_SUCCESS")
				});
            }else{
                this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.CONTROL_FAIL")
				});
            }
        }
            
    },
    watch: {
        
        
    },
};
</script>

<style scoped>
.buttonMain {
    box-shadow: 0px 0px 0px 2px #192f6e;
    background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
    border-radius:20px;
    color : #FFFF00
}
.buttonMain:hover {
  background: linear-gradient( rgba(33, 96, 184, 0.5) , rgba(1, 255, 255, 0.5));
}
</style>