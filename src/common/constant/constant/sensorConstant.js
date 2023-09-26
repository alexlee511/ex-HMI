const _attr = {
  "401500": {
    "attributes": "401500",
    "name": "PM2.5",
    "unit": "μg/m3"
  },
  "401900": {
    "attributes": "401900",
    "name": "PM10",
    "unit": "μg/m3"
  },
  "2": {
    "attributes": "400200",
    "name": "HUMIDITY",
    "unit": "%"
  },
  "1": {
    "attributes": "400100",
    "name": "TEMPERATURE",
    "unit": "℃"
  },
  "6": {
    "attributes": "400600",
    "name": "CO2",
    "unit": "ppm"
  },
  "400200": {
    "attributes": "400200",
    "name": "HUMIDITY",
    "unit": "%"
  },
  "400100": {
    "attributes": "400100",
    "name": "TEMPERATURE",
    "unit": "℃"
  },
  "400600": {
    "attributes": "400600",
    "name": "CO2",
    "unit": "ppm"
  },
  // 震動規
  "800501": {
    "attributes": "800501",
    "name": "X_RMS",
    "unit": "mm/s"
  },
  "800502": {
    "attributes": "800502",
    "name": "Y_RMS",
    "unit": "mm/s"
  },
  "800503": {
    "attributes": "800503",
    "name": "Z_RMS",
    "unit": "mm/s"
  },
  "800601": {
    "attributes": "800601",
    "name": "X_KURTOSIS",
  },
  "800602": {
    "attributes": "800602",
    "name": "Y_KURTOSIS",
  },
  "800603": {
    "attributes": "800603",
    "name": "Z_KURTOSIS",
  },
}

const sensorAttrFilter = (data , key = 'id' , attr = 'attr') => {
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
  sensorAttrFilter
}