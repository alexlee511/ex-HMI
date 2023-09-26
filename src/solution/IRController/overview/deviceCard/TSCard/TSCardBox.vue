<template>
  <el-dialog
    custom-class="dialogClass"
    :visible.sync="dialogTableVisible"
    :append-to-body="true"
  >
    <div class="top-tools" :style="IRStatus.power == 1 ? 'opacity: 1' : 'opacity: .3; pointer-events: none;'">
      <div
        v-debounce="IRCoolControl"
        :style="
          IRStatus.mode == 0 && 'pointer-events: none;'
        "
      >
        <img
          v-if="IRStatus.mode == 0"
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_cool_on.png"
        />
        <img
          v-else
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_cool_off.png"
        />
      </div>
      <div
        v-debounce="IRDryControl"
        :style="
          IRStatus.mode == 1 && 'pointer-events: none;'
        "
      >
        <img
          v-if="IRStatus.mode == 1"
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_dry_on.png"
        />
        <img
          v-else
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_dry_off.png"
        />
      </div>
      <div
        v-debounce="IRFanControl"
        :style="
          IRStatus.mode == 2 && 'pointer-events: none;'
          
        "
      >
        <img
          v-if="IRStatus.mode == 2"
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_fan_on.png"
        />
        <img
          v-else
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_fan_off.png"
        />
      </div>
      <div
        v-debounce="IRAutoControl"
        :style="
          IRStatus.mode == 3 && 'pointer-events: none;'
        "
      >
        <img
          v-if="IRStatus.mode == 3"
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_auto_on.png"
        />
        <img
          v-else
          class="devcard__irc__modebar__icon"
          src="~assets/images/irc_auto_off.png"
        />
      </div>
    </div>
    <div class="top-tools">
      <div class="tools-title">
        <div>溫度</div>
        <select @change="IRtempControl(IRStatus.degree)" v-model="IRStatus.degree" :disabled="IRStatus.mode != 0 || IRStatus.power != 1">
          <option v-for="item in degreeList" :key="item" :value="item">
            {{ item }}℃
          </option>
        </select>
      </div>
      <div class="tools-title">
        <div>風速</div>
        <select @change="IRwindControl(IRStatus.wind)"
                v-model="IRStatus.wind"
                :disabled="IRStatus.power != 1"
                >
          <option :value="0">
            自動
          </option>
          <option v-for="item in windList" :key="item" :value="item">
            {{ item }}級
          </option>
        </select>
      </div>
    </div>
    <div class="top-tools bottom-tools">
      <div :style="IRStatus.power == 1 && 'color: yellow; pointer-events: none;'" @click="IRSwitch(1)">ON</div>
      <div :style="IRStatus.power != 1 && 'color: yellow; pointer-events: none;'" @click="IRSwitch(0)">Off</div>
    </div>
  </el-dialog>
</template>

<script>
import DialogBox from "components/content/dialog/Dialog";

export default {
  props: {
    IRStatus: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    DialogBox,
  },
  data() {
    return {
      dialogTableVisible: false,
    };
  },
  created(){
      //console.log(this.IRStatus)
  },
  async mounted() {
      //console.log(this.IRStatus)
  },
  computed: {
    degreeList() {
      const list = [];
      for (let i = 18; i <= 28; i++) {
        list.push(i.toString());
      }
      return list;
    },
    windList() {
      const list = [];
      for (let i = 1; i <= this.IRStatus.maxWind; i++) {
        list.push(i.toString());
      }
      return list;
    }
  },
  methods: {
    async IRSwitch(value) {
      if(this.IRStatus.power !== value) {
        if(value == 1){
            this.$emit('IRSwitch', value)
        }
        else{
            this.$emit('IRSwitch')
        }
        
      }
    },
    // 控制模式
    async IRtempControl(degree) {
      this.$emit('IRtempControl', degree)
    },
    async IRwindControl(speed) {
      //console.log(speed)
      this.$emit('IRwindControl', speed)
    },
    async IRCoolControl() {
      this.$emit('IRCoolControl')
    },
    async IRDryControl() {
      this.$emit('IRDryControl')
    },
    async IRFanControl() {
      this.$emit('IRFanControl')
    },
    async IRAutoControl() {
      this.$emit('IRAutoControl')
    },
    async handleLoading(arg) {
      // 跑loading 不阻塞
      this.$store.commit("setLoadingState");
      const res = await controlInstruction(this.itemInfo.deviceId, arg);
      this.$store.commit("setLoadingState");
      if (res.status !== "ok") {
        alert("fail");
        return false;
      }
      return true;
    },
  },
};
</script>

<style >
.dialogClass {
  font-weight: bold;
  background: linear-gradient(rgba(33, 96, 184, 0.8), rgba(1, 255, 255, 0.8));
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
  border-radius: 10px;
  border-width: 1.5px;
  border-style: solid;
  -o-border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0),
    #01ffff,
    rgba(33, 96, 184, 0)
  );
  border-image-slice: 1;
  border-left-style: none;
  border-right-style: none;
}
</style>

<style scoped>
.devcard__irc__modebar__icon {
  width: 8vh;
}
.top-tools {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-width: 0px 0px 1.5px 0px;
  border-style: solid;
  -o-border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0.5),
    rgba(1, 255, 255, 0.5),
    rgba(33, 96, 184, 0.5)
  );
  border-image: linear-gradient(
    to left,
    rgba(33, 96, 184, 0.5),
    rgba(1, 255, 255, 0.5),
    rgba(33, 96, 184, 0.5)
  );
  border-image-slice: 1;
}
.top-tools:last-child {
  padding-bottom: 0px;
  border-bottom: none;
}
.bottom-tools {
  font-size: 4vw;
}
.tools-title {
  margin: 16px 0;
}
.tools-title div {
  margin-bottom: 16px;
}
.bottom-tools > div {
  cursor: pointer;
}
.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.title {
  font-size: 2.5vw;
  color: yellow;
}
.context-button {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 2vw;
  margin-bottom: 8px;
  padding: 5px 20px;
  /* height: 20%;
  width: 30%; */
}
.button-border {
  border-style: solid;
  border-width: 1.5px;
  border-image: linear-gradient(to left, #2160b8, #01ffff, #2160b8);
  border-image-slice: 1;
}

.select-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.select-item span {
  text-align: center;
}
select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  font-size: 3vw;
  border-radius: 2px;
  height: 10vh;
}
</style>