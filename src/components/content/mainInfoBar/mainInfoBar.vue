<template>
  <div :class="styleName">
    <span class="maininfo__attrname"><slot name="attrname"></slot></span>
    <span class="maininfo__attrvalue"><slot name="attrvalue"></slot></span>
    <span class="maininfo__attrunti"><slot name="attrunti"></slot></span>
  </div>
</template>

<script>
export default {
  props: {
    styleName:{
      type: String,
      default: 'maininfobar'
    } 
  },
  computed: {

  }
};
</script>

<style>

.maininfobar,
.maininfobarshort {
  font-size: 2.5vw;
  display: flex;
  align-items: center;
  width: 80vw;
  height: 20vh;
  background: linear-gradient(rgba(33, 96, 184, 0.8), rgba(1, 255, 255, 0.8));
  -webkit-clip-path: polygon(100% 0, 100% 40%, 90% 100%, 0 100%, 0 0);
  clip-path: polygon(100% 0, 100% 40%, 90% 100%, 0 100%, 0 0);

  border-width: 1.5px;
  border-style: solid;
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

.maininfobarshort {
  width: 50vw;
}

.maininfo__attrname {
  width: 15vw;
  padding-left: 1vw;
}

.maininfo__attrvalue {
  font-size: 9vw;
  color: #ffff33;
  padding-right: 1vw;
}

.maininfo__attrunti {
  height: 90%;
}


</style>