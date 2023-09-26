<template>
    <div class="content__devcard" >
        <div class="content__devcard__view main "  :style="stylerSize(90,100,5,0)" >
            <div    class="slaveC  text_item _48 " :style="stylerSize(100,30,0,5)">{{$t(`GENERAL.${itemInfo}`)}}</div>
            <button  class="slaveC text_item _32 context-button"  :style="stylerSize(60,30,20,45)" @click="infoClick">{{$t("GENERAL.Inanalysis")}}</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        itemInfo: {
            type: String,
            default: {},
        },  
    },
    components: {
    },
    computed:{

    },
    mixins: [],
    data() {
        return {
            data: {},
            time: null,
            isAttrStatus: false,
        };
    },
    async created() {
    },
    methods: {
        infoClick() {
            let deviceType = this.$route.path.split("/");

            this.$router.push({
                //path: "/" + deviceType[2] + "/energyReport/" + this.itemInfo,
                path: "/" + "report/" + this.itemInfo,
                query: { solution: 'energy' , attr:'501200'},
            });
        },
    },
    watch: {},
};
</script>
