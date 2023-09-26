import { createNamespacedHelpers, mapState } from "vuex";
const { mapState: mapCommandState, mapMutations: mapCommandMutations } = createNamespacedHelpers('deviceCommand');

export default{
    computed: {
        ...mapCommandState({
            commandDeviceList: state => state.commandDeviceList,
            controlClassList: state => state.controlClassList,
            deviceControlList: state => state.deviceControlList,
        }),
    },
}