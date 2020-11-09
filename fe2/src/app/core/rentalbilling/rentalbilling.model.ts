import { LeaseContractModel } from '../contract/lease/lease.model';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';
import {BaseModel} from '../_base/crud';



export class RentalbillingModel extends BaseModel{
	_id : string;
	billingNo : string;
	lease : LeaseContractModel;
	notes: string;
	createdDate : string;
	billingDate : string;
	dueDate: string;
	// isApproved : boolean;
	createdBy: string;
	
	
	clear(): void{
		this._id = undefined;
		this.billingNo = "";
		this.lease = undefined;
		this.notes = "",
		this.createdDate = "",
		this.billingDate ="";
		this.dueDate = "";
		// this.isApproved = undefined;
		this.createdBy = localStorage.getItem("user");
	}
}
