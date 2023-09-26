import NoDataBack from "components/common/noDataBack/NoDataBack"
import { mapGetters, mapState } from "vuex";
import { update_dev , delete_all} from "common/constant/ist";

export default {
	components: {
		NoDataBack
	},
	data() {
		return {
			isCardExist: true,
			card: [],
			pageCard: [],
            max : 8,
		};
	},
	mounted() {
		// console.log(this.solutionData)
	},
	beforeDestroy() {
		delete_all();
		this.$store.state.pageNum = 1;
		//this.$store.commit("addMaxPage", 0);
		//this.$store.commit("addMaxPage", this.pageCard.length);
	},
	Destroy() {
		this.$store.commit("addMaxPage", 0);
	},
	computed: {
		...mapState({
			solutionData: state => state.solutionData,
			selectDevice: state => state.backData.selectDevice
		}),
		...mapGetters(["getType"]),
	},
	methods: {
		handleExceptionId(item) {
			// if (item.setting) {
			//   return item.deviceId + "|" + item.setting.devNo
			// }
			return item.deviceId
		},
		async getCard(cardType) {
			if(!this.solutionData[cardType]) return;
			let deviceOrder = [];
			for(let cardId of Object.values(this.selectDevice[cardType]))
				deviceOrder = deviceOrder.concat(cardId);
			deviceOrder.sort((a, b) => Number(a.order) - Number(b.order));

			let newArr = [];
			for(let dev of deviceOrder){
				//console.log(dev)
				for(let card of this.solutionData[cardType].card){
					// console.log(card)
					let dev_info = card.device.find(item => {
						return this.handleExceptionId(item) === dev.dev_id;
					});
					if(dev_info != undefined) newArr.push(dev_info);
				}
			}
			this.card = newArr;
            this.$store.state.card = this.card
		},
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
				update_dev(this.pageCard);
			}
		},
	},
}