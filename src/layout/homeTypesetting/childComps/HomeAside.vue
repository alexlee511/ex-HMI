<template>
  <div>
    <div class="LOGO" :style="getBackImage"></div>
    <lang-change class="LANG_CHANGE"></lang-change>
    <div class="ENTER_SYSTEM" @click="enter">
      <div class="ENTER_SYSTEM__img"></div>
      <span class="ENTER_SYSTEM__text">{{ $t('GENERAL.ENTER_SYSTEM') }}</span>
    </div>
  </div>
</template>

<script>
import langChange from "components/content/langChange/langChange";
import { sleep } from '@/common/constant/ist';

export default {
  components: {
    langChange
  },
  computed: {
    solutionEnable() {
      return this.$store.state.backData.solutionEnable
    },
    subSolutionEnable() {
      return this.$store.state.backData.subSolutionEnable
    },
    getBackImage() {
      if(this.$store.state.backData.homeIcon !== "") {
        return {backgroundImage: `url(${this.$store.state.backUrl + this.$store.state.backData.homeIcon + "?t=" + Math.random()})`}
      } else {
        return {backgroundImage: `url(${require('@/assets/images/logo.png')})`}
      }
    }
  },
  methods: {
    enter() {
      console.log("HomeAside ", this.solutionEnable[0], this.subSolutionEnable)
      console.log(this.$store.state.backData)
      console.log(this.$store.state.backData.subSolutionEnable)
      let sub_sol = this.subSolutionEnable[this.solutionEnable[0]][0]
      if(sub_sol == "overview") sub_sol = "deviceCard";  
      this.$router.replace("/overView/"+ this.solutionEnable[0] + `/${sub_sol}/`);
    },
  },
};
</script>

<style scoped>
.ENTER_SYSTEM {
  position: absolute;
  right: 5vw;
  bottom: 15vh;
  width: 30vw;
  height: 30vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ENTER_SYSTEM__img {
  background-image: url("~assets/images/system_in.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 30vh;
  width: 30vw;
}

.ENTER_SYSTEM__text {
  width: 20vw;
  text-align: center;
  font-size: 4vh;

  border-width: 0px 0px 1.5px 0px;
  border-style: solid;
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
}

.LOGO {
  position: absolute;
  right: 1vw;
  top: 14vh;
  width: 20vw;
  height: 20vh;
  /* background-image: url(~assets/images/logo.png); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

.LANG_CHANGE {
  position: absolute;
  right: 1vw;
  top: 35vh;
  width: 18vw;
  height: 10vh;
}

.contractCap {
  width: 60vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9e9e9e;
  font-size: 3vh;
}
</style>