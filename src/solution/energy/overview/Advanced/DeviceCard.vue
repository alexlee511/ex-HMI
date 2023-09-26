<template>
    <div class="grid-container" v-if="isCardExist">
      <analysis
        v-for="(item,index) in pageCard[this.$store.state.pageNum - 1]"
        :key="index"
        :item-info="item"
      ></analysis>
    </div>
    <div v-else>
      <no-data-back></no-data-back>
    </div>
</template>

<script>
import analysis from "./analysis/analysis";

import deviceCardMixin from "common/mixin/deviceCardMixin";
//清除要抓取得ID與建立需取得的ist
import { update_dev , delete_all} from "common/constant/ist";
import { updateAttr } from "common/constant/attribute"
export default {
  components: {
    analysis,
  },
  data(){
    return {
      itme : [],
      flag : null,
      name : 'energy',
	  };
  },
  mixins: [deviceCardMixin],
  async created() {
    //電能方案統計分析屬性表刷新
    await updateAttr(this.$store.state.backData.back_lang)
    this.max = 8;
    this.flag = this.$store.state.pageNum;
    await this.getAdvancedCard().then(()=>{
      if(!this.card){
        let button = this.$store.state.overview.button
        let index = button["energy"]["features"].findIndex(
          e => e.type == this.$store.state.backData.subSolutionEnable["energy"][0])
        this.card = button[index]
      }
    })
  },
  watch: {
    card: function(){
      this.getAdvancedCard()
    } 
  },
  methods:{
    async getAdvancedCard(){
      let index = this.$store.state.overview.button["energy"]["features"].findIndex(e => e.type == "Advanced")
      if(index != -1)
        this.card = this.$store.state.overview.button["energy"]["features"][index]["order"]
    }
  }
};
</script>

