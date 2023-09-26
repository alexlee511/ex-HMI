<template>
  <el-dropdown trigger="click" class="out-block">
    <el-dropdown-item class="in-block">
      <div class="img-block">
        <img :src="getTrueBack" alt="" srcset="" />
        <i class="el-icon-arrow-down el-icon--right el-abo"></i>
      </div>
    </el-dropdown-item>
    <!-- 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item class="select-item">
        <div
          class="img-block"
          v-for="(item, index) in backgroundSelect"
          :key="index"
          @click="itemClick(index)"
        >
          <img :src="item.url" alt="" srcset="" />
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import img1 from "@/assets/images/overview_bkg.png";
import img2 from "@/assets/images/overview_bkg2.jpg";

export default {
  data() {
    return {
      backIndex: 0,
      backgroundSelect: [
        {
          name: "classic",
          url: img1,
        },
        {
          name: "gray",
          url: img2,
        },
      ],
    };
  },
  created() {
    for (let i = 0; i < this.backgroundSelect.length; i++) {
      if (this.backgroundSelect[i].url === this.getStoreback) {
        this.backIndex = i;
      }
    }
  },
  computed: {
    getTrueBack() {
      return this.backgroundSelect[this.backIndex].url;
    },
    getStoreback() {
      return this.$store.state.backData.backGroundImage;
    },
  },
  methods: {
    itemClick(index) {
      this.backIndex = index;
    },
    changeBack() {
      this.$store.commit("changeBack", this.getTrueBack);
    },
  },
  watch: {
  },
};
</script>

<style scoped>
.el-dropdown {
  width: 40vw;
}
.out-block {
  background-color: #fff;
  height: 50px;
}
.in-block {
  width: 100%;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.img-block {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  margin-left: 2vw;
}
.img-block img {
  height: 40px;
  width: 80%;
}
.select-item {
  width: 40vw;
}
</style>