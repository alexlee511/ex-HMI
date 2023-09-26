

import { requestNode } from 'network'

export function getOldData(devId, attr, st, et) {
  return requestNode({
    method: 'GET',
    url: 'api/data/query',
    params: {
      dev_id: devId,
      attr: attr,
      st: st,
      et: et,
    }
  })
}

export function getHistoryData(devId, attr, st, et, acc) {
  return requestNode({
    method: 'GET',
    url: "api/data/query",
    params: {
      dev_id: devId,
      attr: attr,
      st: st,
      et: et,
      acc: acc
    }
  })
}
