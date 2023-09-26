<template>
  <div>
    <div class="content">
      <main-info-bar>
        <template v-slot:attrname>{{ $t('GENERAL.ATTR_POWER') }}</template>
        <template v-slot:attrunti>KW</template>
      </main-info-bar>
      <main-info-bar>
        <template v-slot:attrname>{{ $t('GENERAL.ATTR_ENERGY_USED') }}</template>
        <template v-slot:attrunti>kWh</template>
      </main-info-bar>
      <main-info-bar styleName="maininfobarshort">
        <template v-slot:attrname>{{ $t('GENERAL.ATTR_CURRENT_DEMAND') }}</template>
        <template v-slot:attrunti>%</template>
      </main-info-bar>
    </div>
  </div>
</template>

<script>
import mainInfoBar from "components/content/mainInfoBar/mainInfoBar";

export default {
  components: {
    mainInfoBar,
  },
};
</script>

<style scoped>
.content {
  position: absolute;
  width: 100vw;
  height: 90vh;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 2.5vw;

  left: 0px;
  top: 0px;
}
</style>