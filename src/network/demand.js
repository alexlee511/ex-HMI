import { requestNode } from 'network'

export function getDemandList(dev_id) {
  return requestNode({
    methods: 'GET',
    url: 'api/demand',
    params: {
      dev_id: dev_id
    }
  })
}

export async function getDemandConfig(dev_id) {
  return requestNode({
    url: 'api/config/demand/get',
    params: {
      dev_id
    }
  })
}

export function setDemandConfig(dev_id, srcId, threshold, mode, system_alarm, alarm, off_dev, entity_alarm, offset_val) {
  
  const str = off_dev.map(item => {
    const offload = item.offloadCmd !== "NULL"? `${item.offloadCmd.devId},${item.offloadCmd.cmdId},${item.offloadCmd.cav}`: "NULL"
    const resetCmd = item.resetCmd !== "NULL"? `${item.resetCmd.devId},${item.resetCmd.cmdId},${item.resetCmd.cav}`: "NULL"
    return `${item.priority}_${offload}_${resetCmd}`
  }).join(";")

  const alarm_open = entity_alarm.map(alarm => {
    return `${alarm.dev_id},${alarm.open_cmd},${alarm.open_cav}`;
  }).join('_');
  const alarm_close = entity_alarm.map(alarm => {
    return `${alarm.dev_id},${alarm.close_cmd},${alarm.close_cav}`;
  }).join('_');

  return requestNode({
    url: "api/config/demand/set",
    params: {
      dev_id,
      srcId,
      threshold,
      mode,
      system_alarm,
      alarm,
      off_dev: str,
      offset_val,
      entity_alarm: (alarm_close.length > 0) ? alarm_open + ';' + alarm_close : alarm_open
    }
  })
}

export function deleteDemandConfig(dev_id) {
  return requestNode({
    url: "api/config/demand/delete",
    params: {
      dev_id
    }
  })
}

export function closeAlarm(dev_id) {
  return requestNode({
    url: "api/alarm/close",
    params: {
      dev_id
    }
  })
}

export function getAlarm(dev_id = '') {
  if(dev_id == ''){
    return requestNode({
        url: "api/alarm/get",
    })
  }else{
    return requestNode({
        url: "api/alarm/get",
        params: {
        dev_id
        }
    })
  }
  
}
export function getDemand(dev_id = '') {
  if(dev_id == ''){
    return requestNode({
        url: "/api/config/demand/get",
    })
  }else{
    return requestNode({
        url: "/api/config/demand/get",
        params: {
        dev_id
        }
    })
  }
  
}