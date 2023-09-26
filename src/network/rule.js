import { requestNode } from "network"

export function getRuleList() {
  return requestNode({
    url: "api/rule/get"
  })
}

export function setRuleList(config) {
  return requestNode({
    url: "api/rule/set",
    params: {
      ...config
    }
  })
}

export function deleteRuleList(id) {
  return requestNode({
    url: "api/rule/delete",
    params: {
      id
    }
  })
}