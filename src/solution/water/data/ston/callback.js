import { getWaterAnalysisData } from "network/adv";
import vm from "@/main"

export async function billingStatisticManager(dev_id, attr, st, et){

    //console.log(dev_id)
    let res = await getWaterAnalysisData(dev_id, attr, st, et)
    
    return res
}