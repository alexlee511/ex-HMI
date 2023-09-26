<template>
  <div class="d-flex flex-row justify-content-around">
    <div class="d-flex flex-column">
      <span>{{ $t("GENERAL.DNS_SERVICE") }}:</span>
      <input v-model="val" v-onlyNum="{ overNum: '500', model: 'val' }" style="width: 40vw" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    content: "",
  },
  data() {
    return {
      val: ""
    }
  },
};
</script>

<style scoped>
.justify-content-around {
  -ms-flex-pack: distribute !important;
  justify-content: space-around !important;
}
.flex-row {
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}
.d-flex {
  display: -ms-flexbox !important;
  display: flex !important;
}
.flex-column {
  -ms-flex-direction: column !important;
  flex-direction: column !important;
}
input {
  background-color: #9bebff;
  color: #000000;
  font-weight: bold;
  border-radius: 2px;
  border-width: 0px;
  height: 5vh;
}
</style>