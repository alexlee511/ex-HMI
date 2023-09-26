<template>
  <div v-if="!disable">
    <config-type-setting>
      <template v-slot:button>
        <header-button v-if="store && !other" @click.native="load">{{ $t('GENERAL.SAVE') }}</header-button>
        <header-button v-if="!store || apply2" @click.native="apply">{{ $t('GENERAL.APPLY') }}</header-button>
        <header-button v-if="!store" :class="{'button-disabled': getAddDisabled}" @click.native="add">{{ $t('GENERAL.ADD') }}</header-button>
      </template>
      <template v-slot:content>
        <router-view></router-view>
      </template>
    </config-type-setting>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"

export default {
  components: {
    ConfigTypeSetting,
    HeaderButton
  },
  data() {
    return {
    }
  },
  methods: {
    apply() { //套用
      this.$bus.$emit('configApply')
    },
    add() { //新增
      this.$bus.$emit('configAdd')
      if(!this.getAddDisabled && !this.$store.state.emergencyDisabled) {
        let path = this.$route.path.split('/')
        if(path[3]){
          this.$router.push('/changeConfig/' + path[2] + '/' + path[3])
        }else{
          this.$router.push('/changeConfig/' + path[2])
        }
      }   
    },
    load() { //暫存
      this.$bus.$emit('configLoad')
    },
  },
  computed: {
    getAddDisabled() {
      if(this.$store.state.setCacheModule) {
        return this.$store.state.setCacheModule.addDisabled
      }
    },
    store() {
      return this.$route.meta.store
    },
    disable() {
      return this.$route.meta.disable
    },
    other() {
      return this.$route.meta.other
    },
    apply2() {
      return this.$route.meta.apply
    },
    isChange() {
      if(this.$store.state.isChangeInfo) {
        return true
      }else{
        return false
      }
    }
  },
}
</script>

<style scoped>
.button-disabled {
  filter: grayscale(100%);
  opacity: 0.4;
}
</style>