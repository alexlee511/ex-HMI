const _attr = {
	"3": {
		"attributes": "500700",
		"name": "FREQUENCY",
		"unit": "Hz",
		"original": "3",
	},
	"1": {
		"attributes": "500500",
		"name": "VOLTAGE",
		"unit": "V",
		"original": "1",
	},
	"2": {
		"attributes": "500600",
		"name": "CURRENT",
		"unit": "A",
		"original": "2",
		"setValue": (info) => {
			info.value = Number(Number(info.value).toFixed(2));
			return info
		}
	},
	"5": {
		"attributes": "500900",
		"name": "POWER",
		"unit": "W",
		"original": "5",
		// "setValue": (info) => {
		//   let newInfo = Number(info / 1000).toFixed(2)
		//   return newInfo
		// }
	},
	"4": {
		"attributes": "500800",
		"name": "POWER_FACTOR",
		"unit": "",
		"original": "4",
	},
	"8": {
		"attributes": "501200",
		"name": "ENERGY_USED",
		"unit": "KWh",
		"original": "8",
		"setValue": (info) => {
			info.value = Number(info.value);
			while(info.value >= 10000){
				switch(info.unit){
				case "KWh":
					info.unit = "MWh";
					info.value /= 1000;
					break;
				case "MWh":
					info.unit = "GWh";
					info.value /= 1000;
					break;
				case "GWh":
					info.unit = "TWh";
					info.value /= 1000;
					break;
				default:
					break;
				}
			}
			return info
		}
	},
	// 新代號
	"500700": {
		"attributes": "500700",
		"name": "FREQUENCY",
		"unit": "Hz",
	},
	"500500": {
		"attributes": "500500",
		"name": "VOLTAGE",
		"unit": "V",
	},
	"500600": {
		"attributes": "500600",
		"name": "CURRENT",
		"unit": "A",
		"setValue": (info) => {
			info.value = Number(Number(info.value).toFixed(2));
			return info;
		}
	},
	"500900": {
		"attributes": "500900",
		"name": "POWER",
		"unit": "W",
		// "unit": "kW",
		// "setValue": (info) => {
		//   if(Number(info) < 1000) {
		//     return info
		//   }
		//   let newInfo = Number(info / 1000).toFixed(2)
		//   return newInfo
		// }
	},
	"500800": {
		"attributes": "500800",
		"name": "POWER_FACTOR",
		"unit": "",
	},
	"501200": {
		"attributes": "501200",
		"name": "ENERGY_USED",
		"unit": "KWh",
		"setValue": (info) => {
			info.value = Number(info.value);
			while(info.value >= 10000){
				switch(info.unit){
				case "KWh":
					info.unit = "MWh";
					info.value /= 1000;
					break;
				case "MWh":
					info.unit = "GWh";
					info.value /= 1000;
					break;
				case "GWh":
					info.unit = "TWh";
					info.value /= 1000;
					break;
				default:
					break;
				}
			}
			return info
		}
	},
	
	// 新
	"510200": {
		"attributes": "510200",
		"name": "A相電流",
		"unit": "A",
	},
	"520200": {
		"attributes": "520200",
		"name": "B相電流",
		"unit": "A",
	},
	"530200": {
		"attributes": "530200",
		"name": "C相電流",
		"unit": "A",
	},
	"511400": {
		"attributes": "511400",
		"name": "線電壓Vab",
		"unit": "V",
	},
	"521400": {
		"attributes": "521400",
		"name": "線電壓Vbc",
		"unit": "V",
	},
	"531400": {
		"attributes": "531400",
		"name": "線電壓Vca",
		"unit": "V",
	},
	"501100": {
		"attributes": "501100",
		"name": "虚功率",
		"unit": "",
	},
	"501000": {
		"attributes": "501000",
		"name": "視在功率",
		"unit": "",
	},
	// 卡機
	"405600": {
		"attributes": "405600",
		"name": "STORED_VALUE",
		"unit": "NTD",
		"setValue": (info) => {
			let newInfo = info
			if(info.length >= 10) newInfo = Number(info).toFixed(0);
			return newInfo
		}
	},
	// 卡機
	"602405": {
		"attributes": "602405",
		"name": "卡片序號",
		"unit": "",
		"setValue": (info) => {
			info.value  = info.value.slice(-11)
			return info;
		}
	},
}

const meterAttrFilter = (data , key = 'id' , attr = 'attr') => {
  let newArr = [];
  for (let item of data) {
    const obj = item;
    if (!_attr[item[key]]) {
        obj.unit = " "
        obj.name = item.name
        obj[attr] = item[key]
    }else{
        obj.unit = _attr[item[key]].unit;
        obj.name = _attr[item[key]].name;
        obj[attr] = _attr[item[key]].attributes;
        if (_attr[item[key]].setValue) {  //如果存在屬性變化
        obj.value = _attr[item[key]].setValue(obj.value)
        }
    }
    if(obj[attr] === "500900"){ // 超過一千轉為KW
		if(Number(obj.value) > 1000){
			obj.value = Number(obj.value / 1000).toFixed(2);
			obj.unit = "kW";
		}
	}
    newArr.push(item);
  }
  return newArr
}

module.exports = {
  	meterAttrFilter
}