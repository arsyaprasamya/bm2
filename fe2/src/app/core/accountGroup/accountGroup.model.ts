import {BaseModel} from '../_base/crud';
import { AccountTypeModel } from '../accountType/accountType.model';



export class AccountGroupModel extends BaseModel{
	_id : string;
	acctType : AccountTypeModel;
	acctNo : string;
	acctName :string;
	parents: AccountGroupModel;
	createdBy: string;



	clear(): void{
		this._id = undefined;
		this.acctType = undefined;
		this.acctNo = "";
		this.acctName = "";
		this.parents = undefined;
		this.createdBy = localStorage.getItem("user");
	}
}
