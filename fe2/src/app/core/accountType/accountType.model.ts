import {BaseModel} from '../_base/crud';



export class AccountTypeModel extends BaseModel{
	_id : string;
	acctypeno : string;
	acctype : string;
	createdBy: string;




	clear(): void{
		this._id = undefined;
		this.acctypeno = "";
		this.acctype = "";
		this.createdBy = localStorage.getItem("user");
	}
}
