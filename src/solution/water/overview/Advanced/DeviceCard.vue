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
export default {
  components: {
    analysis,
  },
  data(){
    return {
        itme : [],
		    flag : null,
	};
  },
  mixins: [deviceCardMixin],
  created() {
    this.max = 8;
    let index = -1
    //卡片
    console.log(this.$store.state.overview.button["water"]["features"])
    index = this.$store.state.overview.button["water"]["features"].findIndex(e => e.type == "Advanced")
    if(index != -1){
      this.card = this.$store.state.overview.button["water"]["features"][index]["order"];
    }
    this.flag = this.$store.state.pageNum ;
    
  },
  watch: {
  }
};
</script>

