<template>
  <div class="HEADER">
    <div id="header_previous_page_icon" @click="previousPage" style="">
      <img class="header__icon" src="~assets/images/back-arrow.png" />
    </div>
    <div class="header__title">
      <!-- <span class="header__title_span">{{ $t('GENERAL.CSERVER_CONNECT_STATE') }}</span> -->
      <div class="header__title__status" id="status_light"></div>
      <span
        class="header__title_span header__title_span--status"
        id="status_text"
      >
        <!--狀態敘述-->
      </span>
    </div>
    <slot>
      <!-- <div class="header__icon" @click="showConfMenu">
        <img class="header__icon" src="~assets/images/showmenu_btn.png" />
      </div> -->
    </slot>
  </div>
</template>

<script>
export default {
  methods: {
    previousPage() {
      this.$router.back();
    },
    showConfMenu() {
      console.log("1111111");
    },
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