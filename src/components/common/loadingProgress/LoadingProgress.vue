<template>
    <div class="loading_model" :style="{'height':fatherHeight + 'px'}" v-if="progressLoading">
        
        <el-progress :style="{width: '30%', margin: '0 auto', marginTop: `${fatherHeight * 0.5}px`}"
            :type="type" :width="70" :text-inside="true" :percentage="progress" :color="colors"
            :show-text="true" :status="percentage === 99 ? undefined : 'success'"
            :stroke-width="strokeWidth">
        </el-progress>
        <div class="content">
            <span class="context">{{message}}</span>
        </div>
    </div>
</template>

<script>
export default{
    name: "loadingProgress",
    data(){
        return{
            percentage: 0,
            fatherHeight: 0,
            strokeWidth: 50,
            colors: [
                { color: "#1989fa", percentage: 98 },
                { color: "#2BD176", percentage: 99 }
            ],
            progressLoading: false
        }
    },
    props: {
        type: {
            type: String,
            default: () => {
                return undefined;
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        completeNum: {
            type: Number,
            default: 0,
        },
        totalNum: {
            type: Number,
            default: 10,
        },
        message: {
            type: String,
            default: "",
        },
    },
    mounted(){
        this.$el.parentNode.style.position = "relative";
    },
    methods: {
        start(){
            this.fatherHeight = this.$el.parentNode.offsetHeight;
            this.$nextTick(() => {
                this.progressLoading = true;
                this.percentage = 0;
            })
        },
        end(){
            this.percentage = 99;
            setTimeout(() => {
                this.progressLoading = false;
            }, 300);
        }
    },
    computed: {
        progress(){
            if(this.percentage > 97)
                return this.percentage = 99;
            else if(!this.totalNum && !this.completeNum)
                return this.percentage = 90 + Math.floor(Math.random() * 10);
            console.log(this.message)
            console.log(this.percentage)
            return this.percentage = Math.floor(this.completeNum / this.totalNum * 100);
        }
    },
    watch: {
        loading(oldValue, newValue){
            if(oldValue) this.start();
            else this.end();
        }
    }
}
</script>

<style scoped>
.loading_model{
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999;
}

div >>> .el-progress-bar__innerText{
    font-size: 1.5rem;
    font-weight:bold;
    color:black;
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  word-wrap:break-word; 
}

.context {
  width: 35%;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  font-size: 2vw;
  margin-bottom: 16px;
  padding: 5px 20px;
  /* height: 20%;
  width: 30%; */
}
</style>