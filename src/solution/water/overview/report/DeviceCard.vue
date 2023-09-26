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

import deviceCardMixin from "common/mixin/deviceCardMixin";

export default {
  components: {
    analysis,
  },
  data(){
    return {
        itme : [],
		flag : null,
        name : 'water',
	};
  },
  mixins: [deviceCardMixin],
  created() {
    this.max = 8;
    //卡片
    this.card = [ 
        "unusual",
        "billingStatistic"
    ]
    this.flag = this.$store.state.pageNum ;
    
  },
  watch: {
  }
};
</script>

