<template>
	<div class="HEADER">
		<div id="header_previous_page_icon" @click="previousPage" style="">
			<img class="header__icon" src="~assets/images/home.png" />
		</div>
		<div id="header_status_title" class="header__title" style="">
			<div style="display: flex" v-if="isloginCloud">
				<span id="status_title_name" class="header__title_span">
					{{ $t('GENERAL.CSERVER_CONNECT_STATE') }}
				</span>
				<div :class="headerStatus" v-if="login" id="status_light"></div>
				<span id="status_text" v-if="login" class="header__title_span header__title_span--status">
					{{ this.loginStatus ? $t('GENERAL.CSERVER_CONNECT_STATE_OK') : $t('GENERAL.DEVICE_CONNECT_STATE_FAIL') }}
				</span>
			</div>
		</div>
		<div v-show="$store.pr==0" class="header__icon" @click.stop="showConfMenu">
			<img class="header__icon" src="~assets/images/showmenu_btn.png" />
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSystemStatus, webRestart } from "network/gateway";
import { uciApi } from "network/uci";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"

export default {
	data() {
		return {
			login: "",
			restart: false,
            isloginCloud : false
		};
	},
	mixins: [ajaxTimerMixin],
	async created() {
		await this.getDeviceData();
        await this.show_isloginCloud()
		
		await this.recursive(60000);
	},
	computed: {
		...mapGetters(["getTrueHome"]),
		loginStatus() {
			//是否有連線上
			return this.login === "yes" ? true : false;
		},
		
		headerStatus() {
			if (this.loginStatus) {
				return "header__title__status--run";
			} else {
				return "header__title__status--fail";
			}
		},
	},
	methods: {
        async show_isloginCloud() {
			//是否應該連入雲端
			let res = await this.cloudStatus()
			console.log(res)
			this.isloginCloud = res
			//return this.$store.state.backData.isCloudConnect;
		},
		async getDeviceData() {
			let res = await getSystemStatus()
			this.login = res.login;
			this.restart = res.restart ? res.restart === 'true' : false;
            if(this.restart && location.hostname === "hmiweb.insynerger.com"){
                await webRestart();
                location.reload();
            }
			res = null;
			this.recursive(60000);
			
		},
		previousPage() {
			this.$router.replace("/home/" + this.getTrueHome);
		},
		showConfMenu() {
			this.$bus.$emit("showMenu");
		},
		async cloudStatus(){
			let res = await uciApi("get","CONNECT_CSERVER_FLAG")
			console.log(res)
            if(res.status == "ok"){
                if(res.output[0] == "0"){
				return false
                }
                else if(res.output[0] == "1"){
                    return true
                }
            }else{
                return true
            }
			

		}
	},
};
</script>

<style scoped>
.HEADER {
  display: flex;
  padding: 1.5vh;
  color: #ffffff;

  font-weight: bold;
}

.header__icon {
  height: 7vh;
  font-size: 2vw;
}

.header__button {
  height: 7vh;
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;

  width: 11vw;
  margin: 0vh 1vw;
}

.header__title {
  display: flex;
  flex: 8;
  justify-content: center;
  align-self: center;
}

.header__title_span {
  font-size: 2.5vmin;
  align-self: center;
}

.header__title_span--status {
  font-size: 5vmin;
}

.header__title_span--name {
  font-size: 5vmin;
}

.header__title__status,
.header__title__status--run,
.header__title__status--fail {
  width: 4vmin;
  height: 4vmin;
  border-radius: 50%;
  display: flex;
  align-self: center;
  margin-left: 2vh;
  margin-right: 1vh;
}

.header__title__status--run {
  background: #7ed321;
}
.header__title__status--fail {
  background: #ff001f;
}
</style>