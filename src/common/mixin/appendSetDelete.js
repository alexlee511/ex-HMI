//import { formatDate } from "common/utile/utile";

export default {
	data() {
		return {
			//devName: "",
			true_result: [],
			del_result: [],
			add_result: [],
			show_result: [],
			change_result: [],

			
		}
	},
	created(){
		
	},
	mounted(){
		
	},
	methods: {
		Reset(){
			this.true_result = []
			this.del_result = []
			this.add_result = []
			this.show_result = []
			this.change_result = []
		},

		Addsetting(data) {
			console.log(this.true_result)
			console.log(this.del_result)
			console.log(this.add_result)
			console.log(this.show_result)
			let name_check = 0
		
			/*for(let i of devInfo){
				if(i["deviceName"] == data.deviceName){
					data["devid"] = i["deviceId"]
					name_check += 1
				}
			}
			console.log(name_check)
			if(name_check == 0){
				data["devid"] = data.deviceName
			}*/
		
			console.log(data)
			
			
			this.true_result = this.show_result
			console.log(this.show_result)
			this.show_result = []
			this.change_result.push(data)
			this.true_result.push(data) ; 
			for(let i in this.true_result){
				console.log(i)
				this.show_result.push(i)
			
			}
			if(this.add_result.length != 0){
				for(let i of this.add_result){
					console.log(i)
					if(i["id"] != data["id"]){
						this.add_result.push(data)
					}
				}
			}
			else{
				this.add_result.push(data)
			}
		   
		
			for(let i in this.del_result){
				console.log(i)
				console.log(data["id"])
				console.log(this.del_result[i]["id"])
				if(data["id"] == this.del_result[i]["id"]){
					console.log("1111", this.del_result)
					this.del_result.splice(i,1)
				}
					
			}
			console.log(this.true_result)
			console.log(this.del_result)
			console.log(this.add_result)
			console.log(this.show_result)
			//flag ++ ;
		},

		Delsetting(data) {
			console.log(this.add_result)
			let del = this.del_result.indexOf(data)
			let cha = this.change_result.indexOf(data)
			let sho = this.show_result.indexOf(data)
			let detector = this.true_result.indexOf(data)
		
			console.log(data)
		
			let index = -1
		
			if(this.add_result.length !== 0){
				index = this.add_result.indexof(data)
				console.log(index)
				if (index != -1) {
				   
					this.add_result.splice(index, 1)
				}
			}
		
			if(sho != -1){
				this.show_result.splice(sho, 1)
			}
			console.log(this.show_result)
		
			if(del == -1){
				this.del_result.push(data)
				console.log(this.del_result)
			}
			if(cha == -1){
				this.change_result.push(data)
			}
			console.log(detector)
			if(detector != -1){
				this.true_result.splice(detector, 1)
			}
			console.log(this.del_result)
			console.log( this.true_result)
			console.log(this.add_result)
		},

		Setsetting(tag ,data) {
			console.log(data)
			let name_check = 0
		
			let sho = this.show_result.indexOf(tag)
			let cha = this.change_result.indexOf(tag)
			console.log(this.add_result)
		
			/*for(let i of devInfo){
				if(i["deviceName"] == data.deviceName){
					data["devid"] = i["deviceId"]
					name_check += 1
				}
			}
			console.log(name_check)
			if(name_check == 0){
				data["devid"] = data.deviceName
			}*/
		
			this.true_result = data;
			let index = -1;
			console.log(data)
			
			if(this.add_result.length != 0){
				index = this.add_result.indexOf(data)
				console.log(index)
				if (index != -1) {
					console.log("1111")
					//this.add_result[index]["value"] = data["value"]
				}
				else{
					this.add_result.push(data)
				}
			}
			else{
				this.add_result.push(data)
			}
		
			if(sho == -1){
				this.show_result.push(tag)
			}
			if(cha == -1){
				this.change_result.push(tag)
			}
		},
		
	},
}