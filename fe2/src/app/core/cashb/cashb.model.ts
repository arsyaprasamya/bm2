import {BaseModel} from '../_base/crud';



export class CashbModel extends BaseModel{
	_id : string;
	paidfrom: string;
    voucherno : string;
    memo : string;
    payee : string;
    chequeno : string;
    date : string;
	pymnttype: string;
	amount : number;
    createdBy: string;




	clear(): void{
		this._id = undefined;
		this.paidfrom = "";
		this.voucherno = "";
		this.memo = "";
		this.payee = "";
		this.chequeno = "";
		this.date = "";
		this.pymnttype = "";
		this.amount = 0;
		this.createdBy = localStorage.getItem("user");
	}
}
