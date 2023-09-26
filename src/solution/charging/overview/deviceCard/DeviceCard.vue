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
import charging from "./chargingCard/chargingCard";

import deviceCardMixin from "common/mixin/deviceCardMixin";
import { update_dev , delete_all} from "common/constant/ist";
import { start, end, setDevice } from "solution/charging/data/data/data"
export default {
	data() {
		return{
			current_page : null,
		}
	},
    components: {
        charging,
    },
    mixins: [deviceCardMixin],
    created() {
        this.max = 4;
        this.$store.dispatch("getSolutionData").then(() => {
            this.getCard("charging");
        });
		
		start()
    },
	updated(){
		this.current_page = this.pageCard[this.$store.state.pageNum - 1]
		//console.log("Updated: ",JSON.stringify(this.card,null,4))
	},
	destroyed() {
		end()
	},
	watch: {
		card: function () {
            this.$store.state.card = this.card
			let arr = [];
			let total = 0;
			let index = 0;
			arr[index] = [];
			for (let item of this.card) {
				if (total === this.max) {
					total = 0;
					index = index + 1;
					arr[index] = [];
					arr[index].push(item);
					total++;
				}
				else {
					arr[index].push(item);
					total++;
				}
			}
			this.pageCard = arr;

			delete_all();
			this.$store.commit("addMaxPage", this.pageCard.length);
			if (this.card.length === 0) {
				this.isCardExist = false;
			}else{
				let tmp_arr = []
				for(let i of this.pageCard){
					tmp_arr.push([])
					for(let j of i){
						for(let k of j.cntIdList){
							tmp_arr[tmp_arr.length -1].push({'deviceId': j.deviceId + '|' + k.padStart(2, '0')})
						}
					}
				}
				update_dev(tmp_arr);
			}
		},
		current_page: function(){
			// /*get all cpIds and cntIdLists from pageCard*/
			let cpIdList = []
			let cntIdList = []
			for(let card of this.current_page){
				cpIdList.push(card.cpId)
				cntIdList.push(card.cntIdList)
			}
			setDevice( cpIdList, cntIdList)
		}
	},
};
</script>

<style scoped>
.grid-container {
  grid-template-rows: 100% 100%;
}
</style>
