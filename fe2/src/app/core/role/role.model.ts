import {BaseModel} from '../_base/crud';



export class RoleModel extends BaseModel{
	_id : string;
	roleCode: string;
	desc: string;
	startEffDate: string;
	endEffDate: string;
	active: boolean;
	//delete: boolean;
	ipadd: string;
	createdBy:string;

	clear(): void{
		this._id = undefined;
		this.roleCode = "";
		this.desc ="";
		this.startEffDate = "";
		this.endEffDate = "";
		this.active = false;
		//this.delete = undefined;
		// this.ipadd = "";
		this.createdBy = localStorage.getItem("user");
	}
}
