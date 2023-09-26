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
import MotorCard from "./motorCard/MotorCard";

import deviceCardMixin from "common/mixin/deviceCardMixin";
//清除要抓取得ID與建立需取得的ist
import { update_dev , delete_all} from "common/constant/ist";
export default {
  components: {
    MotorCard,
  },
  data(){
    return {
		flag:null,
	};
  },
  mixins: [deviceCardMixin],
  created() {
    this.max = 4;
    this.$store.dispatch("getSolutionData").then(() => {
      this.getCard("motor");
    });
    this.flag = this.$store.state.pageNum ;
  },
  watch: {
        pageCard: function () {
            delete_all();
            let tmp = [];
            //因為複合式裝置需要將訂閱ist的devid拆開來，不能使用卡片本身的devid，所以必須實作這區塊
            for(let t1 of this.pageCard){
                let t2 = [];
                let t6 = [];
                for(let t4 of t1){
                    for(let t3 of t4.complex){
                        //console.log(t3.deviceId)
                        if(!t6.includes(t3.deviceId)){
                            t2.push({"deviceId":t3.deviceId})
                            t6.push(t3.deviceId)
                        }
                    }
                }
                tmp.push(t2)
            }
			update_dev(tmp);
        },
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 100% 100%;
  grid-column-gap: 5px;
  grid-row-gap: 1em;
  color: #ffffff;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;
  height: 70vh;
}
</style>
