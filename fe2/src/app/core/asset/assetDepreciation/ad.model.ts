import { AccountGroupModel } from '../../accountGroup/accountGroup.model';
import { FixedModel } from '../../fixed/fixed.model';
import {BaseModel} from '../../_base/crud';
import { AmModel } from '../assetManagement/am.model';



export class AdModel extends BaseModel{
	_id : string;
	assetManagement: AmModel;
	aquicitionDate: string;
	assetAccount: AccountGroupModel
	accumulatedDepAcct: AccountGroupModel
	depreciationExpAcct: AccountGroupModel;
	expenditures: AccountGroupModel;
	intangibleAsset: Boolean;
	fiscalFixedAsset: boolean;
	remarks: string;
	depMethod : string;
	life : string;
	depRate : string;
	


	createdDate: string;
	updateBy: string;
	updateDate: string;
	createdBy: string;




	clear(): void{
		this._id = undefined;
		this.assetManagement = undefined;
		this.aquicitionDate = "";
		this.life = "",
		this.depMethod = "";
		this.depRate = "";
		this.assetAccount = undefined;
		this.expenditures = undefined;
		this.accumulatedDepAcct = undefined;
		this.depreciationExpAcct = undefined;
		this.intangibleAsset = undefined;
		this.fiscalFixedAsset = undefined;
		this.remarks = "";
		this.createdBy = localStorage.getItem("user");
	}
}
