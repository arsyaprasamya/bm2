import { AddparkModel } from '../addpark/addpark.model';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';
import {BaseModel} from '../_base/crud';



export class PrkbillingModel extends BaseModel{
	_id : string;
	parking : AddparkModel;
	billingNo : string;
	billingDate : string;
	dueDate: string;
	parkingFee : number;
	isNEW : boolean;
	notes: string;
	createdDate : string;
	createdBy: string;

	clear(): void{
		this._id = undefined;
		this.isNEW = undefined;
		this.billingNo ="";
		this.billingDate ="";
		this.dueDate = "";
		this.notes = "";
		this.parkingFee = 0,
		this.createdDate = "";
		this.parking =undefined;
		this.createdBy = localStorage.getItem("user");
	}
}
