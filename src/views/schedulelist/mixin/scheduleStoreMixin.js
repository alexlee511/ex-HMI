import { createNamespacedHelpers } from "vuex";
const { mapState: mapReminderState, mapMutations: mapReminderMutations, mapActions: mapReminderActions } = createNamespacedHelpers('schedule');

export default {
    computed: {
        ...mapReminderState({
            scheduleList: state => state.scheduleList,
        }),
    },
    methods: {
        ...mapReminderMutations([
            "deleteScheduleList",
            "addScheduleList",
            "modifyScheduleList",
            "resetScheduleList",
        ]),
        ...mapReminderActions([
            "GetScheduleList",
            "SetScheduleList",
        ])
    }
}