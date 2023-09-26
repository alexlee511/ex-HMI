import { getChargeData } from "network/adv";
import vm from "@/main"

export async function billingStatisticManager(dev_id, attr, st, et, electricity_price){

    //console.log(dev_id)
    let res = await getChargeData(dev_id, attr, st, et, electricity_price)
    
    return res
}