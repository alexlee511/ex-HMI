<template>
  <div class="DIALOG_PAGE" id="dialog_page">
			<div class="dialog_title">
				<img id="dialog_title_icon" src="" style="height: 15vh;display:none">
				<span id="dialog_title_text">{{ $t('GENERAL.DIALOG_PROMPT') }}</span>
				<hr width=100% color=#000000 class="dialog_hr">
			</div>
			<div class="dialog_content" id="dialog_content">
				<!--內容-->
			</div>
			<div class="dialog_footer" id="dialog_footer">
				<!--按鈕-->
        <button @click="enter">確認</button>
			</div>
		</div>
</template>

<script>
export default {
  methods: {
    enter() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.DIALOG_PAGE{
	display: flex;
	flex-direction: column;
	color: #ffffff;
	
	font-weight: bold;

  font-weight: bold;
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0px;
  height: 100%;
  width: 100%;
  overflow: hidden;
	z-index:5;
    background-size: cover;
}

.dialog_title{
	text-align: center;
    height: 30vh;
    align-items: center;
    justify-content: flex-end;
    display: flex;
    font-size: 3vw;
	flex-direction: column;
}

.dialog_content{
	text-align: center;
    height: 50vh;
    display: flex;
	flex-direction: column;
    font-size: 3vw;
}

.dialog_footer{
	text-align: center;
    height: 20vh;
    align-items: flex-start;
    justify-content: space-evenly;
    display: flex;
    font-size: 3vw;
}

.dialog_hr{
	border: 0;
    height: 2px;
    background-image: linear-gradient(to right, rgba(0.5,35,100,185), #05ffff, rgba(0.5,35,100,185));
}

.DIALOG_PAGE button{
	background: linear-gradient(rgba(1,255,255,0.8),rgba(33,96,184,0.8));
	border-width:0px;
	color:#ffffff;
	
	font-weight: bold;
	border-radius: 1vw;
}

</style>