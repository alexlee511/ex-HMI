import { requestNode } from 'network'
import Qs from 'qs'
export function getControlInfo(dev_id, module) {
  // console.log(dev_id, module)
  return requestNode({
    url: "api/config/mbus/device/control_info",
    params: {
      dev_id,
      module_name: module,
    }
  })
}

export function getSubdevice(dev_id) {
  return requestNode({
    url: "api/config/mbus/device/subdevice/get",
    params: {
      dev_id
    }
  })
}
export function getProfile(dev_id = "", module_name = "" , lang = "") {
    let params = {};
    if(dev_id!=""){
        params.dev_id = dev_id
    }
    if(module_name !=""){
        params.module_name = module_name
    }
    if(lang !=""){
        params.lang = lang
    }
    return requestNode({
        url: "api/config/mbus/device/profile",
        params,
        retry: 3
    })

}



export function getControlAttr(module_name, lang) {
  return requestNode({
    url: "api/config/mbus/device/control_attributes",
    params: {
      module_name,
      lang
    }
  })
}

export function getSceneList() {
  return requestNode({
    url: "api/config/scene/get"
  })
}
export function getDeviceList() {
  return requestNode({
    url: "api/config/mbus/device/get"
  })
}
export function setSceneList(name, control, scene_id, message, delay, dependency, dependency_delay_time, override='1') {
  return requestNode({
    method: 'POST',
    url: "api/config/scene/set",
     data: Qs.stringify({
      name,
      control,
      scene_id,
      message : !message ? undefined : message,
      delay : !delay ? undefined : delay,
      dependency : !dependency ? undefined : dependency,
      dependency_delay_time : !dependency_delay_time ? undefined : dependency_delay_time,
      override: override
    })
  })
}

export function deleteSceneList(scene_id, type) {
  return requestNode({
    url: "api/config/scene/delete",
    params: {
      scene_id,
      type, //message, delay, dependency, action_id
    }
  })
}

export function controlScene(scene_id) {
  return requestNode({
    url: "api/config/scene/control",
    params: {
      scene_id,
    },
    //timeout: time * 1000 * 3
  })
  
}
// export function getInquire() {
//   url: "api/inquire"
// }

export function resendControl(scene_id, ctl_id) {
  return requestNode({
    url: "api/config/scene/control",
    params: {
      scene_id,
      ctl_id,
    },
    //timeout: time * 1000 * 3
  })
  
}

export function sceneProgress(scene_id) {
  return requestNode({
    url: "api/config/scene/progress",
    params: {
      scene_id,
    },
  })
}
