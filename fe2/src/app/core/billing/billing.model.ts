import {BaseModel} from '../_base/crud';
import {CustomerModel} from '../customer/customer.model';
import {UnitModel} from '../unit/unit.model';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';

export class BillingModel extends BaseModel {
	_id : string;
	billing_number : string;
	unit : OwnershipContractModel;
	billing : any;
	billed_to : string;
	created_date : string;
	unit2: string;
	billing_date : string;
	due_date : string;
	

	clear(): void {
		this._id = undefined;
		this.billing_number = "";
		this.billing = undefined;
		this.unit = undefined;
		this.unit2 = "";
		this.billed_to = "";
		this.created_date = "";
		this.billing_date = "";
		this.due_date = "";
		
	}
}
