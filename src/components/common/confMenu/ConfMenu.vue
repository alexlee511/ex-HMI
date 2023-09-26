<template>
  <div class="CONF_MENU" id="conf_menu_panel" ref="confMenuPanel" style="display:none">
    <div class="conf_menu_view" ref="confMenuView">
      <div style="display: flex;width: 100%;justify-content: flex-end;">
        <div style="padding: 1vmin" @click="closeMenu">
          <img
            src="~assets/images/closemenu_btn_2.png"
            style="height: 6vmin;"
          />
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      menuStyle: false,
    }
  },
  mounted(){
    //監聽按鈕點擊
    this.$bus.$on('showMenu', () => {
      if(this.$refs.confMenuPanel){
        this.$refs.confMenuPanel.style.display = 'block'
      }
    },true)
    this.$bus.$on('dialogClick', () => {
      this.closeMenu()
    })
    //點擊自身之外
    document.addEventListener("click", this.clickOut);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickOut)
    this.$bus.$off('showMenu')
    this.$bus.$off('dialogClick')
  },
  methods: {
    clickOut(e) {
      if (this.$refs.confMenuView) { //判斷點擊是否為該物件本身
        let isSelf = this.$refs.confMenuView.contains(e.target);
        if (!isSelf) {
          this.closeMenu()
        }
      }
    },
    closeMenu() {
      this.$refs.confMenuPanel.style.display = 'none'
    }
  }
};
</script>

<style scoped>
.CONF_MENU {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 15;
}

.conf_menu_view {
  position: absolute;
  display: flex;
  background-image: url("~assets/images/confmenu_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: white;
  font-weight: bold;
  width: 40vw;
  height: 98vh;
  font-size: 5vmin;
  align-items: center;
  flex-direction: column;
  right: 1vw;
  top: 1vh;
  overflow-y: auto;
}
.conf_menu_view::-webkit-scrollbar {
  width: 10px;
}
.conf_menu_view::-webkit-scrollbar-thumb {
  background-color: #4285f4;
  border-radius: 10px;
}
.conf_menu_view::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 10px;
}
</style>