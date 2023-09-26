import { getDefaultState } from "../store/index"

export default {
    //寫入ruleList變數
    getRuleList(state, payload){
      	state.ruleList = payload;
    },
	addRuleList(state, payload){
		payload.isChange = true;
		state.addList.push(payload);
		state.ruleList.push(payload);
	},
	modifyRuleList(state, payload){
		//if already in addList, remove the older one
		if(payload.isChange){
			let modified = state.addList.findIndex(item => item.id === payload.id)
			if(modified !== -1){
				state.addList.splice(modified, 1);
			}
		}
		payload.isChange = true;
		const newList = state.ruleList.map(item => {
			return payload.id === item.id ? payload : item;
		});
		state.ruleList = newList;
		state.addList.push(payload);
	},
	deleteRuleList(state, payload){
		let del_id = state.ruleList[payload].id;
		let del_index = state.addList.findIndex( e => { return e.id === del_id; });
		if(del_index != -1){
			state.addList.splice(del_index, 1);
		}
		state.deleteList.push(state.ruleList[payload].id);
		state.ruleList.splice(payload, 1);
	},
	resetRuleList(state){
		Object.assign(state, getDefaultState());
	}
}