<template>
  <div class="DEVICEINFO_CONTENT_PAGE">
    <div class="content_page__title">
      <span class="content_page__title__text">{{ devName }}</span>
      <div class="time-select">
        <small-button path="month" :dev-id="devId">
          <template>
            <slot> {{ $t('GENERAL.ELECTRICITY_STATS_MONTH') }} </slot>
          </template>
        </small-button>
        <small-button path="date" :dev-id="devId">
          <template>
            <slot> {{ $t('GENERAL.ELECTRICITY_STATS_DAY') }}</slot>
          </template>
        </small-button>
        <small-button path="hour" :dev-id="devId">
          <template>
            <slot> {{ $t('GENERAL.ELECTRICITY_STATS_HOUR') }} </slot>
          </template>
        </small-button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import smallButton from "components/content/smallButton/smallButton";

export default {
  components: {
    smallButton,
  },
  data() {
    return {
      devName: "",
      devId: this.$route.query.devId,
    };
  },
  created() {
    this.devName = this.$store.state.deviceName[this.devId] ?
      this.$store.state.deviceName[this.devId] : this.devId;
  },
};
</script>

<style scoped>
.DEVICEINFO_CONTENT_PAGE {
  width: 75vw;
}
.content_page__title {
  display: flex;
  height: 15vh;
  position: relative;
}
.content_page__title__text {
  font-size: 5vmin;
  align-self: center;
}
.time-select {
  height: 5vh;
  border: 1px solid rgb(207, 207, 207);
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: row-reverse;
  border-width: 0px 0px 3px 0px;
  border-style: solid;
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0.5),
    rgba(1, 255, 255, 0.5),
    rgba(33, 96, 184, 0.5)
  );
  border-image-slice: 1;
}
</style>