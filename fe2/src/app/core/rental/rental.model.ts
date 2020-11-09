import {BaseModel} from '../_base/crud';
import { UnitModel } from '../unit/unit.model';
import { CustomerModel } from '../customer/customer.model';
import { RevenueModel } from '../revenue/revenue.model';
import { LeaseContractModel } from '../contract/lease/lease.model';



export class RentalModel extends BaseModel{
	_id : string;
	revenueCode: string;
	contract: LeaseContractModel;
	tenant: string;
	rate: string;
	revenueRental: RevenueModel;
	createdBy: string;

	clear(): void{
		this._id = undefined;
		this.revenueCode = "";
		this.contract = undefined;
		this.tenant = "";
		this.rate  = "";
		this.revenueRental = undefined;		
		this.createdBy = localStorage.getItem("user");
	}
}
