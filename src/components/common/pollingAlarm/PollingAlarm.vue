<template>
    <transition name='polling'>
        <div class="loading_model" style="height:100%" v-if="progressLoading">
            <lodding></lodding>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue'
export default{
    name: "PollingAlarm",
    data(){
        return{
            fatherHeight: 0,
            progressLoading:false
        }
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
    },
    mounted(){
    },
    methods: {
    },
    created() {
    },
    computed: {
    },
    components: {
    },
    watch: {
        loading(oldVal,newVal){
            if(this.$store.state.polling.show){
                Vue.component('lodding' ,  () => this.$store.state.polling.template)
            }
            this.progressLoading = this.$store.state.polling.show
            
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
.polling-enter-active,
.polling-leave-active{ 
    transition: opacity  .9s; 
} 
.polling-enter-from,
.polling-leave-to { 
    //transform: translateX(-100%); 
    opacity: 0;
} 
.polling-enter-to , 
.polling-leave-from { 
    //transform: translateX(100%); 
    opacity: 1;
}
</style>