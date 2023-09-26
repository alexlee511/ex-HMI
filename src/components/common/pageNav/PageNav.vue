<template>
  <div class="OVERVIEW_CONTENT_NAV">
		<div class="content__pagenav">
			<div @click="firstPage">
				<img id="firstPage" class="content__pagenav__icon" src="~assets/images/回到最前.png">
			</div>
			<div @click="previousPage">
				<img id="previousPage" class="content__pagenav__icon" src="~assets/images/上一頁.png">
			</div>
			<div style="display:flex;flex:8">
				<span class="content__pagenav__pagenum">{{pageNum}}</span>
			</div>
			<div @click="nextPage">
				<img id="nextPage" class="content__pagenav__icon" src="~assets/images/下一頁.png">
			</div>
			<div @click="lastPage">
				<img id="lastPage" class="content__pagenav__icon" src="~assets/images/回到最後.png">
			</div>
		</div>
	</div>
</template>

<script>
import { page_set } from "common/constant/ist";
import { hideIcon } from "./hidePageIcon"

export default {
	mounted(){
		hideIcon(this.pageNum, this.maxPageNum);
	},
	watch: {
		pageNum(){
			const page_number = this.$store.state.pageNum;
			page_set(page_number - 1);
			hideIcon(this.pageNum, this.maxPageNum);
		},
		maxPageNum(){
			hideIcon(this.pageNum, this.maxPageNum);
		}
	},
	methods: {
		firstPage() {
			if(this.pageNum > 1) {
				this.$store.commit('changePage', 'first');
				page_set(0);
				hideIcon(1, this.maxPageNum);
			}
		},
		previousPage() {
			if(this.pageNum > 1) {
				this.$store.commit('changePage', 'previous');
                page_set(this.pageNum -1);
				hideIcon(this.pageNum, this.maxPageNum);
			} 
		},
		nextPage() {
			if(this.pageNum < this.maxPageNum) {
				this.$store.commit('changePage', 'next');
                page_set(this.pageNum -1);
				hideIcon(this.pageNum, this.maxPageNum);
			}		
		},
		lastPage() {
			if(this.pageNum < this.maxPageNum) {
				this.$store.commit('changePage', 'last');
				page_set(this.maxPageNum - 1);
				hideIcon(this.maxPageNum, this.maxPageNum);
			}
		},
	},
	computed: {
		state(){
			let pageName = this.$route.path.split('/').pop();
			return pageName === 'deviceCard' || pageName === 'contextControl';
		},
		pageNum() {
			return this.$store.state.pageNum
		},
		maxPageNum() {
			return this.$store.state.maxPageNum
		}
	},
};
</script>

<style scoped>
.OVERVIEW_CONTENT_NAV {
    display: flex;
    position: absolute;
    bottom: 0px;
    width: 100vw;
    height: 10vh;
    justify-content: center;
    color: #ffffff;
    font-weight: bold;
}
.content__page{
	width: 100vw;
	margin-left: 0vw;
}

.content__devcard{
    display: flex;
	justify-content: center;
	height:35vh;
}

.content__devcard--empty{
	opacity: 0.4;
}

.content__devcard__view{
	display: flex;
	align-items: center;
    flex-direction: column;
	background: linear-gradient(rgba(33,96,184,0.8), rgba(1,255,255,0.8));
    width: 22vw;
    height: 34vh;
	border-radius: 10px;
	border-width: 1.5px;
    border-style: solid;
    border-image: linear-gradient(to left,rgba(33,96,184,0.0),#01ffff,rgba(33,96,184,0.0));
    border-image-slice: 1;
    border-left-style: none;
    border-right-style: none;
}

.devcard__devname{
	font-size: 2.2vmin;
}

.devcard__devattr__carousel{
	display: flex;
	align-items: center;
    flex-direction: column;
	width: 22vw;
	height: 15vh;
}

.devcard__devattrname{
	width: 90%;
	height: 2.5vh;
	text-align: left;
    color: #c9c9c9;
	font-size: 2vh;
}

.devcard__devattrvalue{
	color: #ffff33;
	display: flex;
    align-items: center;
}

.devcard__devattrunit{
	width: 90%;
	height: 2.5vh;
	text-align: right;
    color: #c9c9c9;
	font-size: 2vh;
}

.devcard__devslaveid, .devcard__devslaveid--right, .devcard__devslaveid--left{
	width: 90%;
	font-size: 1.5vmin;
}

.devcard__devslaveid--right{
	text-align: right;
}

.devcard__devslaveid--left{
	text-align: left;
}

.devcard__toolbar{
    display: flex;
    justify-content: flex-start;
	align-items: flex-end;
	width: 90%;
	height: 10vh;
}

.devcard__toolicon{
	height: 5.5vh;
	z-index: 1;
	margin: 1vh;
}

.devcard__controlbar{
	display: flex;
	align-items: center;
	height:23.5vh;
}

.devcard__controlicon--do{
	height:20vh;
}

.devcard__controlicon--di{
	height: 8vmin;
}

.content__pagenav{
	display: flex;
	width: 25vw;
	z-index: 1;
}

.content__pagenav__pagenum{
	width: 100%;
    text-align: center;
    align-self: center;
	font-size: 4vh;
}


.content__pagenav__icon{
	height: 5.5vh;
    margin: 2.5vh 0vh;
}

.devcard___devtype_icon_view{
	position: absolute;
    bottom: 2vh;
    left: 3vw;
    opacity: 0.8;
}

.devcard___devtype_icon{
	height: 5vh;
}

.devcard__irc__basic_view{
	height: 6vh;
	width: 90%;
	display: flex;
    z-index: 1;
}

.devcard__irc__temp_view{
	height: 6vh;
    width: 8vw;
    background-color: #494949;
    border-radius: 1vh;
    margin: 0vw 1vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3vw;
}

.irc_temp_control_icon{
	height: 4vh;
}

.devcard__irc__modebar{
	display: flex;
    width: 90%;
    height: 6vh;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
}

.devcard__irc__modebar__icon{
	width: 5.5vh;
}

.devcard_attrval_textfill{
	height: 10vh;
	width: 20vw;
	display: flex;
	align-items: center;
	justify-content: center;
}

#firstPage{
	opacity: 0;
}

#previousPage{
	opacity: 0;
}

#nextPage{
	opacity: 0;
}

#lastPage{
	opacity: 0;
}
</style>