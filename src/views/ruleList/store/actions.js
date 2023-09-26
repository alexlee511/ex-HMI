import { getRuleList, setRuleList, deleteRuleList } from "network/rule"
import { getDeviceAttrApi } from "network/solution";
import vm from "@/main"
// get all devices' attribute
async function getDeviceAttrList(){
    console.log(vm.$store.state.deviceCommand.deviceAttrList)
    let deviceAttr = {}
	for(let i of Object.keys(vm.$store.state.deviceCommand.deviceAttrList)){
        let typename = i.substr(2,2)
        if(deviceAttr[typename] == undefined){
            deviceAttr[typename] = {}
        }
        deviceAttr[typename][i] = JSON.parse(JSON.stringify(vm.$store.state.deviceCommand.deviceAttrList[i])) 
	}
    return deviceAttr;
}

export default {
  	//取得規則API內容
	async readRuleList ({ state, rootState, commit }) {
		//變數宣告及取值
		let output = [];
		let res = await getRuleList();            //API取得資料
		//console.log(res)
		state.deviceAttr = await getDeviceAttrList();
		let deviceControl = rootState.deviceCommand.deviceControlList;
		if(res['status'] === 'ok'){
			//console.log(res)
			for(let rule of res['rules']){
				console.log(rule)
				if(rule.cav === undefined) continue;
				if(deviceControl[rule.dev_id] === undefined){
                    let c = rule.cav.split('_')[0]
                    if(deviceControl[rule.dev_id+'|'+c] === undefined){
                        state.deleteList.push(rule);
                        continue;
                    }
                    else{
                        rule.dev_id = rule.dev_id+'|'+c
                    }
				}
				let ruleInfo = {
					'id': rule.id,
					'cav': rule.cav,
					'cmd': rule.cmd,
					'device': rule.device,
					'target_id': deviceControl[rule.dev_id][0].target_id,
					'action': rule.action,
					'dev_id': rule.dev_id,
					'act_type': rule.dev_id.substr(2, 2),
					'event_type': rule.device.substr(2, 2),
					'rule_name': rule.rule_name,
					'enable': rule.enable,
					'name': "",
					'attr_1': "",
					'attr_2': "",
					'symbol_1': "",
					'symbol_2': "",
					'upperlimit_1': "",
					'upperlimit_2': "",
				};
				const opList = ['>=', '<=', '==', '!=', '>', '<'];
				const connect_op = ['&&','||'];
				let condStr = rule.cond.indexOf('(') != -1 ? rule.cond.substring(1, rule.cond.length - 1) : rule.cond;
				
				// //FAKE DATA
				// let a = opList.find(op => {
				// 	return condStr.indexOf(op) != -1; 
				// });
				// condStr += '&&$' + condStr.split(a)[0].substr(1) + '>=' + '2477';
				
				let n = 1; //count for cond
				let symbol_ = "symbol_" + n;
				let upperlimit_ = "upperlimit_" + n;
				let attr_ = "attr_" + n;

				// console.log("🍔🍔🍔🍔",condStr)
				for(let coop of connect_op){
					while(condStr.indexOf(coop) != -1){
						let cond = condStr.split(coop)[0];
						condStr = condStr.substring(cond.length + coop.length, condStr.length);
						console.log("first", cond);
						console.log("new condStr", condStr);
						let first_op = opList.find(op => {
							return cond.indexOf(op) != -1; 
						});

						// ！應急用，忽略自定義變數
						if(cond.split(first_op)[0][0]=='@'){
							ruleInfo["attr_3"] = cond.split(first_op)[0].substr(1);
							ruleInfo["upperlimit_3"] = cond.split(first_op)[1];
							ruleInfo["symbol_3"] = first_op;
							continue;
						}
						ruleInfo[attr_] = cond.split(first_op)[0].substr(1);
						ruleInfo[upperlimit_] = cond.split(first_op)[1];
						ruleInfo[symbol_] = first_op;

						n += 1; 
						symbol_ = "symbol_" + n;
						upperlimit_ = "upperlimit_" + n;
						attr_ = "attr_" + n;	
					}
				}
				// if(condStr.indexOf('&&') != -1){
				// 	let [first_cond, second_cond] = condStr.split('&&');
				// 	let first_op = opList.find(op => {
				// 		return first_cond.indexOf(op) != -1; 
				// 	});
				// 	let second_op = opList.find(op => {
				// 		return second_cond.indexOf(op) != -1;
				// 	});
				// 	ruleInfo.symbol_1 = first_op;
				// 	ruleInfo.symbol_2 = second_op;
				// 	ruleInfo.upperlimit_1 = first_cond.split(first_op)[1];
				// 	ruleInfo.upperlimit_2 = second_cond.split(second_op)[1];
				// 	ruleInfo.attr_1 = first_cond.split(first_op)[0].substr(1);
				// 	ruleInfo.attr_2 = second_cond.split(second_op)[0].substr(1);
				// }
				// else if(condStr.indexOf('||') != -1){
				// 	let [first_cond, second_cond] = condStr.split('||');
				// 	let first_op = opList.find(op => {
				// 		return first_cond.indexOf(op) != -1; 
				// 	});
				// 	let second_op = opList.find(op => {
				// 		return second_cond.indexOf(op) != -1;
				// 	});
				// 	ruleInfo.symbol_1 = first_op;
				// 	ruleInfo.symbol_2 = second_op;
				// 	ruleInfo.upperlimit_1 = first_cond.split(first_op)[1];
				// 	ruleInfo.upperlimit_2 = second_cond.split(second_op)[1];
				// 	ruleInfo.attr_1 = first_cond.split(first_op)[0].substr(1);
				// 	ruleInfo.attr_2 = second_cond.split(second_op)[0].substr(1);
				// }
				// else{
				let cond_op = opList.find(op => {
					return condStr.indexOf(op) != -1; 
				});
				ruleInfo[attr_] = condStr.split(cond_op)[0].substr(1);
				ruleInfo[upperlimit_] = condStr.split(cond_op)[1];
				ruleInfo[symbol_] = cond_op;
				// }

				output.push(ruleInfo);
			}
		}
		console.log(output)
		commit('getRuleList', output);
	},
	//寫入規則API
	async saveRuleList ({ state, rootState }) {
		rootState.totalLoading = state.deleteList.length + state.addList.length;
		for(let del_id of state.deleteList){
			await deleteRuleList(del_id).then(res =>{
				rootState.completeLoading += 1;
			});
		}
		for(let addRule of state.addList){
			let api_rule = {
				'id': addRule.id,
				'enable': addRule.enable,
				'rule_name': addRule.rule_name,
				'action': addRule.action,
				'device': addRule.device,
				'dev_id': addRule.target_id,
				'gid': addRule.gid,
				'cav': addRule.cav,
				'cmd': addRule.cmd
			};
			
			let cond_1 = "", cond_2 = "", cond_3 = "";
			if(addRule.attr_1 && addRule.symbol_1 && addRule.upperlimit_1)
				cond_1 = '$' + addRule.attr_1 + addRule.symbol_1 + addRule.upperlimit_1;
			if(addRule.attr_2 && addRule.symbol_2 && addRule.upperlimit_2)
				cond_2 = '$' + addRule.attr_2 + addRule.symbol_2 + addRule.upperlimit_2;
			if(addRule.attr_3 && addRule.symbol_3 && addRule.upperlimit_3)
				cond_3 = '@' + addRule.attr_3 + addRule.symbol_3 + addRule.upperlimit_3;
			
			if(cond_1 !== '' && cond_2 !== '' && cond_3 !== '')
				api_rule['cond'] = `${cond_1}&&${cond_2}&&${cond_3}`;
			else if(cond_1 !== '' && cond_2 !== '')
				api_rule['cond'] = `${cond_1}&&${cond_2}`;
			else if(cond_2 !== '' && cond_3 !== '')
				api_rule['cond'] = `${cond_2}&&${cond_3}`;
			else if(cond_1 !== '' && cond_3 !== '')
				api_rule['cond'] = `${cond_1}&&${cond_3}`;
			else if(cond_1 !== '')
				api_rule['cond'] = `${cond_1}`;
			else if(cond_2 !== '')
				api_rule['cond'] = `${cond_2}`;
			else if(cond_3 !== '')
				api_rule['cond'] = `${cond_3}`;
			await setRuleList(api_rule).then(res => {
				rootState.completeLoading += 1;
			});
		}
	}
}