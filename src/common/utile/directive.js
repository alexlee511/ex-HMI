const debounce = {
  inserted: function (el, binding) {
    let timer
      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 500)
      })
  }
}

const onlyNum = {
  inserted: function (el, binding, vnode) {
    el.addEventListener('input', () => {
      const { overNum, model } = binding.value
      vnode.context[model] = el.value.replace(/[^\d]|^[0]/g,'')
      if(!overNum) return
      if(Number(el.value) > Number(overNum)) {
        vnode.context[model] = overNum
      }
    })
  }
}

const onlyNumInArr = {
  inserted: function (el, binding, vnode) {
    el.addEventListener('input', () => {
      const { overNum, model } = binding.value
      const [ arr, index, child ] = model
      vnode.context[arr][index][child] = el.value.replace(/[^\d]|^[0]/g,'')
      if(!overNum) return
      if(Number(el.value) > Number(overNum)) {
        vnode.context[arr][index][child] = overNum
      }
    })
  }
}

const match = {
  inserted: function (el, binding, vnode) {
    el.addEventListener('input', () => {
      // const { overNum, model } = binding.value
      el.value = el.value.replace(/[^\d.]/g,'')
    })
  }
}

const deepOnlyNum = {
  inserted: function (el, binding, vnode) {
    el.addEventListener('input', () => {
      const { overNum, model } = binding.value
      updateObjProp(vnode.context, el.value.replace(/[^\d]|^[0]/g,''), model);
      if(!overNum) return
      if(Number(el.value) > Number(overNum)) {
        updateObjProp(vnode.context, overNum, model);
      }
    })
  }
}

const deepOnlyFloat = {
  inserted: function (el, binding, vnode) {
    el.addEventListener('input', () => {
      const { overNum, model } = binding.value
      el.value = el.value.replace(/[^\d.]/g,'')
      el.value = el.value.replace(/^\./g,"");
      el.value = el.value.replace(/\.{2,}/g,".")
      el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
      if(el.value.indexOf(".")< 0 && el.value !== ""){
        if(el.value.substr(0,1) == '0' && el.value.length == 2){ 
          el.value= '0';     
        } 
      }
      updateObjProp(vnode.context, el.value, model);
      if(!overNum) return
      if(Number(el.value) >= Number(overNum)) {
        updateObjProp(vnode.context, overNum - 1, model);
      }
    })
  }
}

const updateObjProp = (obj, value, propPath) => {
  const [head, ...rest] = propPath.split('.');
  !rest.length
    ? obj[head] = value
    : updateObjProp(obj[head], value, rest.join('.'));
}

// function getNestedObj(obj, arr) {
//   const obj = 
// }
  
export {
  debounce,
  onlyNum,
  onlyNumInArr,
  match,
  deepOnlyNum,
  deepOnlyFloat
}