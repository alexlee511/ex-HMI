<template>
	<div>
		<div v-if="isLock" class="login_modal">
			<div style="display: inline-block; vertical-align: middle; width: 100%;">
				<div class="dialog_class">
					<div class="login_content">
						<div class="login_title">
							<span> {{ $t("GENERAL.USER_LOGIN") }} </span>
						</div>
						<div>
							<div id="inputAccount" class="user_account" @click="inputAccount">
								<i class="el-icon-user"></i>
								<span> {{ account }} </span>
							</div>
							<div id="inputPassword" class="user_password" @click="inputPassword">
								<i class="el-icon-lock"></i>
								<span> {{ visiblePwd }} </span>
							</div>
						</div>
						<div style="display: flex; justify-content: center;">
							<div style="display: flex; align-items: center; padding: 0.5vw;">
								<input type="radio" name="login_param" value="autoLogin" v-model="loginMode"> {{ $t("GENERAL.AUTO_LOGIN") }}
							</div>
							<div style="display: flex; align-items: center; padding: 0.5vw;">
								<input type="radio" name="login_param" value="rememberAccount" v-model="loginMode"> {{ $t("GENERAL.REMEMBER_ACCOUNT") }}
							</div>
						</div>
						<button class="login_button" @click="login"> {{ $t("GENERAL.LOGIN") }} </button>
					</div>
				</div>
				<keyboard ref="keyboard" @getText="getText"></keyboard>
			</div>
		</div>

		<home-typesetting>
			<template v-slot:content>
				<router-view></router-view>
			</template>
		</home-typesetting>
	</div>
</template>

<script>
import HomeTypesetting from "layout/homeTypesetting/HomeTypesetting";
import keyboard from "components/common/keyboard/keyboard.vue"
import { getCookie, setCookie } from "@/router/index.js"

const admin = {
	account: "admin",
	password: "admin"
}
const user = {
	account: "user",
	password: "user"
}
export default {
	components: {
		keyboard,
		HomeTypesetting,
	},
	data() {
		return {
			account: "",
			password: "",
			visiblePwd: "",
			isLock: true,
			textMode: null,
			dialogVisible: true,
			loginMode: null,
		};
	},
	async created() {
        if(this.$store.login){
            this.isLock = false; 
            return
        }
	    if(location.hostname === "hmiweb.insynerger.com" || location.hostname === "localhost" ){
			this.isLock = false;
            this.$store.state.loading = true;
            this.$store.pr = 0
            
            //console.log(this.$store.pr)
            return
        }
	    
		this.account = getCookie("account") ? getCookie("account") : "";
		this.password = getCookie("password") ? getCookie("password") : "";
		if(getCookie("autoLogin") === 'true'){
			// send api to check if account & password in cookie are correct
			if(this.account === admin.account && this.password === admin.password){
				this.isLock = false;
				this.$store.state.loading = true;
                setCookie("pr", 0, 30);
			}
            else if(this.account === user.account && this.password === user.password){
                this.isLock = false;
				this.$store.state.loading = true;
                setCookie("pr", 1, 30);
            }
			else this.$notify({
				type: 'error',
				title: this.$t("GENERAL.LOGIN_FAIL"),
				message: this.$t("GENERAL.ACCOUNT_PASSWORD_ERROR")
			})
		}
        if(this.$store.pr == undefined){
            this.$store.pr = getCookie("pr") ? getCookie("pr") : -1;
        }
	},
	mounted(){
		document.addEventListener('keydown', e => {
			if(e.key==='Tab'){
				if(this.textMode == 'getAccount'){
					this.$refs.keyboard.text = "";
					this.textMode = 'getPassword';
				}
			}else if(e.key==='Enter'){
				if(this.textMode == 'getPassword'){
					this.login();
				}
			}
		})
	},
	beforeDestroy(){
		document.removeEventListener('keydown', e=>{});
	},
	watch: {
		password(){
			this.visiblePwd = "";
			while(this.visiblePwd.length < this.password.length)
				this.visiblePwd += '*';
		},
		loginMode(){
			if(this.loginMode === "rememberAccount"){
				this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.NOTICE_REMEMBER")
				});
			}
			else{
				this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.NOTICE_AUTOLOGIN")
				});
			}
		}
	},
	methods: {
		inputAccount(){
			this.textMode = 'getAccount';
			this.$refs.keyboard.text = this.account;
			this.$refs.keyboard.open = true;
		},
		inputPassword(){
			this.textMode = 'getPassword';
			this.$refs.keyboard.text = this.password;
			this.$refs.keyboard.open = true;
		},
		getText(value){
			this [this.textMode] (value);
		},
		getAccount(value){
			if(value.length > 15){
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.SETTING_ERROR"),
					message: this.$t("GENERAL.ACCOUNT_PASSWORD_ERROR")
				})
			}
			else this.account = value;
		},
		getPassword(value){
			if(value.length > 30){
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.SETTING_ERROR"),
					message: this.$t("GENERAL.ACCOUNT_PASSWORD_ERROR")
				})
			}
			else this.password = value;
		},
		login(){
			if( this.account === admin.account && this.password === admin.password ||
                this.account === user.account && this.password === user.password
                ){
				if(this.loginMode === "rememberAccount"){
					setCookie("account", this.account, 30);
					setCookie("password", this.password, 30);
				}
				// update cookie and add auto login option
				// there is not the api for account, so canceling auto login temporarily
				else if(this.loginMode === "autoLogin"){
					setCookie("autoLogin", true, 30);
					setCookie("account", this.account, 30);
					setCookie("password", this.password, 30);
				}
				// send api to check if account & password in cookie are correct
				// when user pressing the login button, we have to judge that the system whether processes creating device card or not
				// if so, open the loading page until the processing end
				if(this.$store.state.isProgressProfile)
					this.$store.state.loading = true;
                if(this.account === admin.account){
                    this.$store.pr = 0
                }else if(this.account === user.account){
                    this.$store.pr = 1
                }
                this.$store.login = true ;
				this.isLock = false;
			}
			else this.$notify({
				type: 'error',
				title: this.$t("GENERAL.LOGIN_FAIL"),
				message: this.$t("GENERAL.ACCOUNT_PASSWORD_ERROR")
			});
		}
	}
};
</script>

<style>
.login_modal{
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999;
	vertical-align: middle;
	display: inline-block;
	text-align: center;
}

.login_modal::before{
	display: inline-block;
	vertical-align: middle;
	height: 100vh;
	content: "";
}

.dialog_class{
	font-weight: bold;
	background-color: #0061A8;
	background: linear-gradient(rgba(0, 97, 168, 1), rgba(41, 120, 181, 0.9));
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

	width: 60%;
	margin: 0 auto;
}

.login_content{
	color: #ffffff;
	display: flex;
	font-size: 2.5vw;
	flex-direction: column;
	justify-content: center;
	padding: 2vw;
}

.login_title{
	font-size: 3vw;
	text-align: center;
	margin-bottom: 1vw;
}

.user_account, .user_password{
	display: flex;
	align-items: center;
	width: 80%;
	height: 3.5vw;
	border: 4px #2978B5 solid;
	background: #8AB6D6;
	margin: 0 auto;
	margin-bottom: 1vw;
	cursor: pointer;
}

i{
	margin: 0 1vw;
	color: #0061A8;
}

input[type="radio"]{
	width: 4vmin;
    height: 4vmin;
	margin-right: 4px;
}

.login_button{
	background: linear-gradient(rgba(1,255,255,0.5),rgba(33,96,184,0.5));
	color: #ffffff;
	font-weight: bold;
	padding: 5px 15px;
	cursor: pointer;
	border-radius: 8px;
	width: 40%;
	margin: 0 auto;
}
</style>