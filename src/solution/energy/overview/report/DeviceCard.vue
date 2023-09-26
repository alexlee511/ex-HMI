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
import analysis from "./energyReport/EnergyReport";
import { updateAttr } from "common/constant/attribute"
import deviceCardMixin from "common/mixin/deviceCardMixin";

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
  created() {
    //電能方案報表屬性表刷新
    updateAttr(this.$store.state.backData.back_lang)
    this.max = 8;
    //卡片
    this.card = [ 
        "timeAccumulation",
        "unusual",
        "billingStatistic",
        "consumption",
        "historyReport"
    ]
    this.flag = this.$store.state.pageNum ;
    
  },
  watch: {
  }
};
</script>

