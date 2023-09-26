<template>
  <div class="OVERVIEW">
    <div class="header">
      <overview-header></overview-header>
      <overview-menu>
        <slot name="menu-item">
        </slot>
      </overview-menu>
    </div>
    <div class="content">
      <slot name="content"></slot>
      <page-nav></page-nav>
    </div>
    <div class="footer">
      <overview-footer></overview-footer>
    </div>
  </div>
</template>

<script>
import OverviewHeader from "./childComps/OverviewHeader";
import OverviewFooter from "./childComps/OverviewFooter";
import OverviewMenu from "./childComps/OverviewMenu";

import PageNav from "components/common/pageNav/PageNav"

export default {
  components: {
    OverviewHeader,
    OverviewFooter,
    OverviewMenu,
    PageNav
  },
};
</script>

<style scoped>
.header {
  position: absolute;
  width: 100vw;
  height: 20vh;
}

.content {
  position: absolute;
  margin-top: 20vh;
  width: 100vw;
  height: 80vh;
}

.footer {
  position: absolute;
  margin-top: 90vh;
  width: 100vw;
  height: 10vh;
}
</style>