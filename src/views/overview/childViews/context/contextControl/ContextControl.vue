<template>
	<div class="grid-container" v-if="isCardExist">
		<context-card v-for="item in pageCard[pageNum]" :key="item.scene_id" :item-info="item"></context-card>
	</div>
	<div v-else>
		<no-data-back></no-data-back>
	</div>
</template>

<script>
import ContextCard from "./contextCard/ContextCard"

import { createNamespacedHelpers } from 'vuex'

const { mapState: mapContextState, mapActions: mapContextAction, mapMutations: mapConetextMutation } = createNamespacedHelpers('context')
import {  delete_all} from "common/constant/ist";
export default {
	components: {
		ContextCard
	},
	data() {
		return {
			isCardExist: true,
			pageCard: []
		}
	},
	created(){
		let card_index = 0;
		while(card_index < this.list.length){
			this.pageCard.push(this.list.slice(card_index, card_index + 8));
			card_index += 8;
		}
		this.$store.commit("addMaxPage", this.pageCard.length);
	},
	computed: {
		...mapContextState([
			"list"
		]),
		pageNum(){
			return this.$store.state.pageNum - 1;
		}
	},
	beforeDestroy() {
		delete_all();
		this.$store.state.pageNum = 1;
	}
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 50% 50%;
  grid-column-gap: 5px;
  grid-row-gap: 1em;
  color: #ffffff;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;
  height: 70vh;
}
.cardflex {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.cardflexitem {
  flex: 1;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>