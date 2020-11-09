import {BaseModel} from '../_base/crud';
import { UnitModel } from '../unit/unit.model';
import { CustomerModel } from '../customer/customer.model';
import { VehicleTypeModel } from '../vehicletype/vehicletype.model';
import { BlockModel } from '../block/block.model';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';



export class AddparkModel extends BaseModel{
	_id : string;
	codeAddParkLot : string;
	unit:  OwnershipContractModel;
	unitcustomer : string;
	customer: string;
	vehicle: VehicleTypeModel;
	vehicleNum: string;
	blockPark: BlockModel;
	space: string;
	status : string;
	parkingRate: string;
	avaliablespace : string;
	createdBy: string;
	type : string;

	clear(): void{
		this._id = undefined;
		this.codeAddParkLot = "";
		this.unitcustomer = "";
		this.unit = undefined;
		this.customer = "";
		this.vehicle = undefined;
		this.blockPark = undefined;
		this.status = "";
		this.type = "";
		this.space = "";
		this.parkingRate = "";
		this.avaliablespace = "";
		this.createdBy = localStorage.getItem("user");
	}
}
