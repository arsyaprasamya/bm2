import {BaseModel} from '../_base/crud';
import { UnitModel } from '../unit/unit.model';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';

export class InvoiceModel extends BaseModel{
	_id : string;
	invoiceno: string;
	amount : string;
	custname : string;
	unit : string;
    contract : OwnershipContractModel;
    desc : string;
    invoicedte: string;
    invoicedteout: string;
	total: string;
	discount : string;
	address : string;
	isclosed : boolean;
    crtdate : string;
	upddate : string;


	clear(): void{
		this._id = undefined;
		this.invoiceno = "";
		this.custname = "";
		this.unit = "";
		this.contract = undefined;
		this.address = "";
		this.desc = "";
		this.invoicedte = "";
		this.invoicedteout= "";
		this.total = "";
		this.discount = "";
		this.amount = "";
		this.isclosed = undefined;
		this.crtdate = "";
		this.upddate = "";
	}
}
