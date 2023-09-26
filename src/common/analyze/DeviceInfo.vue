<template>
    <device-info-typesetting :full="true">
        <template v-slot:content class="DEVICEINFO_CONTENT">
            <router-view></router-view>
        </template>
    </device-info-typesetting>
</template>

<script>
import DeviceInfoTypesetting from "layout/deviceInfoTypesetting/DeviceInfoTypesetting";

import InfoSideItem from "components/content/InfoSideItem/InfoSideItem";

export default {
    components: {
        DeviceInfoTypesetting,
        InfoSideItem,
    },
    created() {
    },
    computed: {
    },
};
</script>
<style>
@import "~assets/css/cardItem.css";
</style>
<style scoped>

.DEVICEINFO_CONTENT{
    width: 100vw !important;
    height: 78vh !important;
}
</style>