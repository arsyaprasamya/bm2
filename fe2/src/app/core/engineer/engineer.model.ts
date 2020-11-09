import {BaseModel} from '../_base/crud';

export class EngineerModel extends BaseModel{
	_id : string;
	engnrid : string
	name : string;
	status : string;
	phone : string;
	email : string;

	clear(): void{
		this._id = undefined;
		this.engnrid = "";
		this.name = "";
		this.status = "";
		this.phone = "";
		this.email = "";
	}
}
