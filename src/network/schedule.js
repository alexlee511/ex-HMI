import { requestNode } from "network";


export function getScheduleList(dev_id) {
  return requestNode({
    url: "api/schedule/get",
    params: {
      dev_id
    }
  })
}

export function setScheduleList(config) {
  return requestNode({
    url: "api/schedule/set",
    params: {
      ...config
    }
  })
}

export function deleteScheduleList(target_id) {
  return requestNode({
    url: "api/schedule/delete",
    params: {
      target_id
    }
  })
}