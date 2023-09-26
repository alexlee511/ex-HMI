<template>
	<div class="navbar-area">
		<div class="search">
			<img @click="showDialog" :style="isSearch==false && 'opacity: 0.5; pointer-events: none;'" src="~assets/images/search_icon.png">
		</div>
		<div
			class="navbar"
			ref="containerEl"
			@mousedown="start($event)"
			@mousemove.stop="move($event)"
			@mouseup="end($event)"
			@mouseleave="leave"
			>
			<slot></slot>
		</div>
		<div class="page-icon right" v-if="overbutton >= 6">
			<!-- <img class="content__pagenav__icon" src="~assets/images/arrow_right.png" /> -->
			<div>
				<i class="icon-right"></i>
			</div>
		</div>

		<el-dialog :visible.sync="dialogVisible" width="60%"
			custom-class="dialog-class" :append-to-body="true">
			<div class="content" v-for="(dev, dev_index) in card" :key="dev_index">
				<span style="width: 60%; text-align: right;"> {{ dev.deviceName }} </span>
				<div style="width: 40%; text-align: center;">
					<button @click="pageJump(dev_index)"> {{ $t("GENERAL.GO") }} </button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	mixins: [],
	data() {
		return {
			state: 0,
			oldEvent: null,
			scrollLeft: 0,
			isClick: true,
			overbutton: 0,
			dialogVisible: false,
			isSearch: false,
            card : [],
		};
	},
	created(){
		let solution = this.$route.path.split('/').slice(-2, -1)[0];
		if(this.$route.path.split('/').slice(-1)[0] == "deviceCard"){
			this.isSearch = true
            this.getDeviceList(solution);
		}
		else{
			this.isSearch = false
		}
		
		
	},
	mounted() {
		this.$bus.$on("overbutton", (index) => {
			this.overbutton = index
		})
	},
	beforeDestroy() {
		this.$bus.$off("overbutton")
	},
	watch: {
		'$route.path'(){
			let solution = this.$route.path.split('/').slice(-2, -1)[0];
			if(this.$route.path.split('/').slice(-1)[0] == "deviceCard"){
				this.isSearch = true
				this.$store.dispatch("getSolutionData").then(() => {
					this.getDeviceList(solution);
				});
			}
			else{
				this.isSearch = false
			}
		}
	},
	methods: {
        getDeviceList(solution){
            let deviceOrder = [];
			for(let cardId of Object.values(this.$store.state.backData.selectDevice[solution])){
                deviceOrder = deviceOrder.concat(cardId);
            }
			deviceOrder.sort((a, b) => Number(a.order) - Number(b.order));
            let solutionData = this.$store.state.solutionData
			let newArr = [];
			for(let dev of deviceOrder){
				for(let card of solutionData[solution].card){
					let dev_info = card.device.find(item => {
						return item.deviceId === dev.dev_id;
					});
					if(dev_info != undefined) newArr.push(dev_info);
				}
			}
            this.card = newArr;
        },
		start(e) {
			this.state = 1;
			this.oldEvent = e;
			this.scrollLeft = this.$refs.containerEl.scrollLeft;
		},
		move(event) {
			if (this.state != 1) return;
			// 發送事件
			this.isClick = false;

			let left = this.$refs.containerEl.offsetLeft;

			if (Math.abs(event.pageX - this.oldEvent.pageX) < 15) {
				// 判斷距離小於15不動
				return;
			}
			if (event.pageX < this.oldEvent.pageX) {
				// 移動的距離
				left -= this.oldEvent.pageX - event.pageX;
			} else {
				left += event.pageX - this.oldEvent.pageX;
			}
			left - 15; // 去掉一開始不動的距離
			this.$refs.containerEl.scrollLeft =
				this.scrollLeft - left >= 0 ? this.scrollLeft - left : 0; //加上移動的距離
		},
		end(e) {
			this.state = 0;
			this.$bus.$emit("mousemove", this.isClick);
			this.isClick = true;
		},
		leave() {
			this.state = 0;
			this.$bus.$emit("mousemove", this.isClick);
			this.isClick = true;
		},
		showDialog(){
			this.dialogVisible = true;
		},
		pageJump(index){
			this.$store.state.pageNum = Math.floor(index / 8) + 1;
			this.dialogVisible = false;
		}
	},
};
</script>

<style scoped>
.navbar-area {
  display: flex;
  position: relative;
}
.page-icon {
  position: absolute;
  width: 5%;
  height: 6vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-icon img {
  width: 100%;
  height: 100%;
}
.page-icon.right {
  top: 0;
  right: 0;
}
.navbar {
  display: flex;
  color: #ffffff;

  font-weight: bold;
  width: 90%;
    flex-wrap: nowrap;
  margin: auto;
  overflow-x: auto;
  user-select: none;
}
.navbar::-webkit-scrollbar {
  height: 0px;
}
/* 
.navbar::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 5px;
}
.navbar::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 5px;
} */

i {
  border: solid yellow;
  border-width: 0 7px 7px 0;
  display: inline-block;
  padding: 7px;
}
.icon-right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.search{
	position: absolute;
	width: 5%;
	height: 6vh;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

button {
	background: linear-gradient(rgba(1,255,255,0.5),rgba(33,96,184,0.5));
	color: #ffffff;
	font-weight: bold;
	border-width: 0px;
	outline: none;
	padding: 10px 15px;
	cursor: pointer;
}

.content{
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  margin-bottom: 1vh;
}
</style>

<style>
/*會影響到情境方案的dialog*/
.dialog-class {
  font-weight: bold;
  background: linear-gradient(rgba(19, 60, 131, 0.8), rgba(7, 118, 118, 0.8));
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
  border-radius: 10px;
  border-width: 1.5px;
  border-style: solid;
  -o-border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
  border-left-style: none;
  border-right-style: none;
}
</style>