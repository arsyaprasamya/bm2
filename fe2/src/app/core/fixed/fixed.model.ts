import {BaseModel} from '../_base/crud';
import { FiscalModel } from '../fiscal/fiscal.model';



export class FixedModel extends BaseModel{
	_id : string;
	fixedAssetTypeName : string;
    fiscalFixedType : FiscalModel
	createdBy: string;

	clear(): void{
		this._id = undefined;
		this.fixedAssetTypeName = "";
		this.fiscalFixedType = undefined;
		this.createdBy = localStorage.getItem("user");
	}
}
