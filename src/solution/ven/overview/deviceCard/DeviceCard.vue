<template>
    <div class="grid-container" v-if="isCardExist">
      <component
        :is="item.cardType"
        v-for="item in pageCard[this.$store.state.pageNum - 1]"
        :key="item.deviceId"
        :item-info="item"
      ></component>
    </div>
    <div v-else>
      <no-data-back></no-data-back>
    </div>
</template>

<script>
import VenCard from "./venCard/VenCard";
import { ven_card , runupdate } from '../../data/ston/data.js'
import deviceCardMixin from "common/mixin/deviceCardMixin";
import { delete_all} from "common/constant/ist";
import { hideIcon } from "components/common/pageNav/hidePageIcon";
export default {
  components: {
    VenCard ,
  },
  mixins: [deviceCardMixin],
   async created() {
   await runupdate();
    this.card = ven_card;
  },
  watch: {
    card: function () {
      let arr = [];
      let total = 0;
      let index = 0;
      arr[index] = [];
      for (let item of this.card) {
        if (total == 8) {
          total = 0;
          index = index + 1;
          arr[index] = [];
          arr[index].push(item);
          total++;
        } else {
          arr[index].push(item);
          total++;
        }
      }
      this.pageCard = arr;
      delete_all();
      this.$store.commit("addMaxPage", this.pageCard.length);
      hideIcon(this.$store.state.pageNum, this.$store.state.maxPageNum);
      if (this.card.length == 0) {
        this.isCardExist = false;
      } 
    }
  }
  
};
//[
//    {
//        "cardId": "energyCard-01",
//        "cardType": "meterCard",
//        "cardName": "ENERGY.DEV_METER",
//        "deviceId": "IN10-C400AD25B007-02",
//        "type": "10",
//        "typename": "EM1100P",
//        "slave": "2",
//        "deviceName": "IN10-C400AD25B007-02"
//    }
//]
</script>

