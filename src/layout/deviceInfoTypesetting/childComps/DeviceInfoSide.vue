<template>
  <div id="OVERVIEW_SIDE_NAV" class="OVERVIEW_SIDE_NAV">
    <slot></slot>
    <!-- <info-side-item :path="'/' + this.deviceType + '/deviceDetailed'">
      {{ $t('GENERAL.OVERVIEW') }}
    </info-side-item>
    <info-side-item :path="'/' + this.deviceType + '/deviceChart'">
      {{ $t("GENERAL.HISTORY_CHART") }}
    </info-side-item> -->
  </div>
</template>

<script>
import InfoSideItem from "components/content/InfoSideItem/InfoSideItem"

export default {
  components: {
    InfoSideItem
  },
  data() {
    return {
      // deviceId: this.$route.params.deviceId,
    }
  },
  created() {
    // console.log(this.$route.path)
    // console.log(this.$route.path.split('/'))
  },
  computed: {
    // deviceType() {
    //   let deviceType = this.$route.path.split('/')
    //   return deviceType[1]
    // }
  },
};
</script>

<style>
.OVERVIEW_SIDE_NAV{
	display: flex;
	flex-direction: column;
	margin-top: 5vh;
	align-items: center;
	color: #ffffff;
	font-weight: bold;
	width: 18vw;
}

.navbar__item{
	margin: 2vh 0vw;
	width: 80%;
	font-size: 4vmin;
}

.navbar__item--select{
	color: #ffff33;
	border-width: 0px 0px 2px 0px;
    border-style: solid;
    border-image: linear-gradient(to right,#01ffff,#2160b8);
    border-image-slice: 1;
}
</style>