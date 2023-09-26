import { createNamespacedHelpers } from "vuex"
const { mapState: mapRuleState, mapMutations: mapRuleMutations, mapActions: mapRuleActions, mapGetters: mapRuleGetters } = createNamespacedHelpers('rule')

export default {
  computed: {
    ...mapRuleState({
      ruleList: state => state.ruleList,
      addList: state => state.addList,
      deleteList: state => state.deleteList,
      deviceAttr: state => state.deviceAttr,
    }),
  },
  methods: {
    ...mapRuleMutations([
      "addRuleList",
      "modifyRuleList",
      "deleteRuleList",
      "resetRuleList"
    ]),
    ...mapRuleActions([
      "readRuleList",
      "saveRuleList",
    ]),
    operatorTranslator(op){
			switch(op){
				case '>': 
					return this.$t("GENERAL.LARGER_THAN");
				case '<': 
					return this.$t("GENERAL.SMALLER_THAN");
				case '==': 
					return 	this.$t("GENERAL.EQUALS_TO");
				case '>=': 
					return this.$t("GENERAL.LARGER_THAN") + '且' + this.$t("GENERAL.EQUALS_TO");
				case '<=': 
					return this.$t("GENERAL.SMALLER_THAN") + '且' + this.$t("GENERAL.EQUALS_TO");
				case '!=': 
					return this.$t("GENERAL.NOT_EQUALS_TO");
				default: 
					return;
			}
		},
  },
}