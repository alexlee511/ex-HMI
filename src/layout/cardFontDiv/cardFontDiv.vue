<template>
    <div :class="fontChang(text)+' '+cssClass+' slaveC text_center'" :style='stylerSize()'>
        <slot name="center">{{text}}</slot>
    </div>
</template>

<script>
export default {
    props: {
    text: {
      default() {
        return ""
      }
    },
    cssClass: {
        type: String,
        default() {
            return ""
        }
    }
    
  },
  computed:{
        fontChang:function(){
          return function(text){
                let tmp  = text.toString()
                if(       tmp.length < 7) {
                    return "_70";
                }else if( tmp.length < 10){
                    return "_40";
                }else if( tmp.length < 15){
                    return "_36";
                }else if( tmp.length < 20){
                    return "_32";
                }else{
                    return "_28";
                }
               
            }
        }
    },
};
</script>
<style scoped>
</style>