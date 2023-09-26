import { requestNode } from 'network'
import { sleep , set_Device_Data} from '../common/constant/ist'

export async function controlDevice(dev_id, cmd, cav , attr = '0') {
	console.log(dev_id, cmd, cav);
	const before = new Date();
	const res = await requestNode({
		url: "api/control",
		timeout: 5000,
		retry: 0,
		params: {
			dev_id,
			cmd,
			cav
		}
	});
	const after = new Date();
	console.log("👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌👌")
	console.log(res)
    if(res.status != "fail"){
        set_Device_Data(dev_id , attr ,cav.split('_')[2])
    }
	await sleep(3000 - Number(after - before));
	return res;
}