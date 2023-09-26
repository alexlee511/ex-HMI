<template>
  <div class="nodata_img">
    <span style="padding-bottom: 5vh">{{ $t('GENERAL.NODATA_MSG') }}</span>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.nodata_img {
  background-image: url("~assets/images/nodata_bg.png");
  width: 100vw;
  height: 70vh;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: #00fafa;
  font-size: 6vmin;
  font-weight: bold;
}
</style>