import {formateUciString} from "../formateUci"


const app = formateUciString('10-EM1100P.list', 'CARD', '<enable>:<devId>:<rate>:<balance>:<powerOffDelay>')
const app2 = formateUciString('10-EBI21R.list', 'CARD', '<enable>:<devId>:<rate>:<balance>:<powerOffDelay>')

export const {
  getResetInfo: EM1100PgetResetInfo,
  deleteInfo: EM1100PdeleteInfo,
  setInfo: EM1100PsetInfo,
  addInfo: EM1100PaddInfo
} = app
export const {
  getResetInfo: EBI21RgetResetInfo,
  deleteInfo: EBI21RdeleteInfo,
  setInfo: EBI21RsetInfo,
  addInfo: EBI21RaddInfo
} = app2