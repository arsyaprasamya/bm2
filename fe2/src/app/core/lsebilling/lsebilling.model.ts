
import { LeaseContractModel } from '../contract/lease/lease.model';
import {BaseModel} from '../_base/crud';



export class LsebillingModel extends BaseModel{
	_id : string;
	billingNo : string;
	lease : LeaseContractModel;
	notes: string;
	price: number;
	createdDate : string;
	billingDate : string;
	dueDate: string;
	// isApproved : boolean;
	createdBy: string;


	


	clear(): void{
		this._id = undefined;
		this.billingNo = "";
		this.lease = undefined;
		this.price = 0;
		this.notes = "",
		this.createdDate = "",
		this.billingDate ="";
		this.dueDate = "";
		// this.isApproved = undefined;
		this.createdBy = localStorage.getItem("user");
	}
}
