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

import deviceCardMixin from "common/mixin/deviceCardMixin";
import { SceneList , getScene} from "../../data/ston/data.js"
import { delete_all } from "common/constant/ist";
export default {
	components: {
		ContextCard
	},
  mixins: [deviceCardMixin],
	data() {
		return {
			isCardExist: true,
		}
	},
	async created(){
        this.getCard()
	},
	computed: {
		pageNum(){
			return this.$store.state.pageNum - 1;
		}
	},
	beforeDestroy() {
		delete_all();
		this.$store.state.pageNum = 1;
	},
  methods:{
    async getCard(cardType){
		await getScene()
        this.card = JSON.parse(JSON.stringify(SceneList))
    },
  }
  
}
</script>
