<template>
  <div class="HEADER">
    <div id="header_previous_page_icon" @click="previousPage" style="display: block">
      <img style="height: 7vh" src="~assets/images/back-arrow.png" />
    </div>

    <div id="header_title_name" class="header__title">
      <span class="header__title_span header__title_span--name" id="title_name">
        <slot name="title"></slot>
      </span>
    </div>
    <slot name="button"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noModify: true,
    };
  },
  components: {},
  mounted() {
    this.$bus.$on("getSomeModify", (value) => {
      const { modify, action, showConfirm = true } = value;
      if (!modify) return;
      this.noModify = false;
      if (showConfirm) {
        this.$confirm(this.$t("GENERAL.LEAVE_PAGE_MESSAGE"), this.$t("GENERAL.CONFIRM_MESSAGE"), {
          distinguishCancelAndClose: true,
          confirmButtonText: this.$t("GENERAL.DIALOG_OK"),
          cancelButtonText: this.$t("GENERAL.DIALOG_CANCEL"),
        })
          .then(() => {
            if (action) this.$store.dispatch(action);
            this.$router.back();
          })
          .catch((action) => {});
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("getSomeModify");
  },
  methods: {
    previousPage() {
      this.$bus.$emit("previousPage");
      if (this.noModify) this.$router.back();
      this.noModify = true;
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