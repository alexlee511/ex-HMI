const _attr = {
	"400100": {
		"attributes": "400100",
		"name": "TEMPERATURE",
		"unit": "℃"
	},
	"400200": {
		"attributes": "400200",
		"name": "HUMIDITY",
		"unit": "%"
	},
	"500600": {
		"attributes": "500600",
		"name": "CURRENT",
		"unit": "A",
		"TW": "頻率",
		"EN": "Voltage",
		"setValue": (info) => {
			info.value = Number(Number(info.value).toFixed(2));
			return info
		}
	},
	"702100": {
		"attributes": "702100",
		"name": "室內溫度",
		"unit": "℃",
	}
}
const IRAttrFilter  = (data , key = 'id' , attr = 'attr') => {
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
    newArr.push(item);
  }
  return newArr
}
module.exports = {
  	IRAttrFilter
}