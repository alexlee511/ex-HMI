import { createNamespacedHelpers } from "vuex"
const { mapState: mapStatisticState, mapMutations: mapStatisticMutations, mapActions: mapStatisticActions } = createNamespacedHelpers('statistics');

export default{
    computed: {
        ...mapStatisticState({
            statisticsList: state => state.statisticsList,
            deleteList: state => state.deleteList,
            addList: state => state.addList
        }),
    },
    methods: {
        ...mapStatisticMutations([
            "addStatisticsList",
            "modifyStatisticsList",
            "deleteStatisticsList",
            "resetStatisticsList",
        ]),
        ...mapStatisticActions([
            "getStatisticsList",
            "setStatisticsList",
        ])
    }
}