import { requestNode } from 'network'

export const getVirtualMeter = async(meter_id) => {
  return requestNode({
    method: 'GET',
    url: "api/virtual/meter/config/virtualmeter/get",
    params: {
      meter_id: meter_id,
    }
  })
}

export const setVirtualMeter = async(meter_id, dev_id) => {
  return requestNode({
    method: 'GET',
    url: "api/virtual/meter/config/virtualmeter/set",
    params: {
      meter_id: meter_id,
      dev_id: dev_id,
    }
  })
}

export const getVirtualMeterSrc = async(dev_id, attr, cvt) => {
  return requestNode({
    method: 'GET',
    url: "api/virtual/meter/config/src/get",
    params: {
      dev_id: dev_id,
      attr: attr,
      cvt: cvt,
    }
  })
}

export const setVirtualMeterSrc = async(key, dev_id, attr, cvt) => {
  return await requestNode({
    method: 'GET',
    url: "api/virtual/meter/config/src/set",
    params: {
      key: key,
      dev_id: dev_id,
      attr: attr,
      cvt: cvt,
    }
  })
}