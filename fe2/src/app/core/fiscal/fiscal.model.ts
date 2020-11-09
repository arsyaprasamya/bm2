import {BaseModel} from '../_base/crud';



export class FiscalModel extends BaseModel{
	_id : string;
	fiscalName : string;
    fiscalDepMethod : string;
    fiscalLife : string; //number
    fiscalDepRate: number; // number
	createdBy: string;
	updatedBy : string;




	clear(): void{
		this._id = undefined;
		this.fiscalName = "";
		this.fiscalDepMethod = "";
		this.fiscalLife = "";
		this.fiscalDepRate = 0;
		this.createdBy = localStorage.getItem("user");
		this.updatedBy = localStorage.getItem("user");
	}
}
