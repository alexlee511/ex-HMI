import { requestNode } from 'network'

export function getAnalyticInfo(dev_id, attr, st, et, type) {
  
  return requestNode({
    //method: 'GET',
    url: "/api/data/stats/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      st: st,
      et: et,
      type: type,
    }
  })
}

export function getChargeData(dev_id, attr, st, et, type) {
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/data/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      st: st,
      et: et,
      electricity_price: type,
    }
  })
}

//最佳契約容量
export function getContractData(dev_id, attr, st, et, electricity_price) {

  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/contract/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      st: st,
      et: et,
      type: electricity_price,
    }
  })
}

//設備運轉小時報表
export function getOptimeData(dev_id, attr, st, et, type) {

  return requestNode({
    //method: 'GET',
    url: "/api/data/op_time/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      st: st,
      et: et,
      type: type,
    }
  })
}

//異常報表
export function getAbnormaleventData(dev_id, event_type, status_type, st, et) {

  return requestNode({
    //method: 'GET',
    url: "/api/data/abnormal_event/get",
    params: {
      dev_id: dev_id,
      event_type: event_type,
      state: status_type,
      st: st,
      et: et,
    }
  })
}
export function setAbnormaleventData(event_id, status_type) {

  return requestNode({
    //method: 'GET',
    url: "/api/data/abnormal_event/set",
    params: {
      event_id: event_id,
      state: status_type,
    }
  })
}


export function getElectricityPrice() {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/electricity_price/type/get",
    params: {
      //devid: dev_id,
    }
  })
}


export function setTargetData(solution, dev_id, value) {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/target/set",
    params: {
      solution: solution,
      devid: dev_id,
      value: value,
    }
  })
}

export function getTargetData() {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/target/get",
    params: {
      //devid: dev_id,
    }
  })
}

export function deleteTargetData(solution, dev_id) {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/target/delete",
    params: {
      solution: solution,
      devid: dev_id,
    }
  })
}


export function getOrderData() {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/analysis/order/get",
    params: {
      //
    }
  })
}


export function setWaterPriceData(basic_price, other_price, water_price) {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/water/price/set",
    params: {
      basic_price: basic_price,
      other_price: other_price,
      water_price: water_price,
    }
  })
}

export function getWaterPriceData() {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/water/price/get",
    params: {
      //
    }
  })
}

export function getWaterAnalysisData(dev_id, attr, st, et) {
  
  return requestNode({
    //method: 'GET',
    url: "/api/energy/water/analysis/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      st: st,
      et: et,

    }
  })
}
