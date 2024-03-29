import {BaseModel} from '../_base/crud';
import { InvoiceModel } from '../invoice/invoice.model';

export class DepositModel extends BaseModel{
	_id : string;
	depositno: string;
	depositnoout : string;
	invoice : InvoiceModel;
    type : string;
    descin : string;
    descout : string
	depositInDate: string
	
    depositOutDate: string
	pymnttype: string;
	total : string;
	isactive : boolean;
    dpstin: string
    dpstout: string;
    crtdate : string;
	upddate : string;

	clear(): void{
		this._id = undefined;
		this.depositno = "";
		this.depositnoout = "";
		this.invoice =undefined;
		this.isactive = undefined;
		this.type = "";
		this.descin = "";
		this.descout = "";
		this.depositInDate = "";
		this.depositOutDate = "";
		this.pymnttype = "";
		this.total = "";
		this.dpstin = "";
		this.dpstout = "";
		this.crtdate = "";
		this.upddate = "";
	}
}
