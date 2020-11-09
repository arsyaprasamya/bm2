import {BaseModel} from '../../_base/crud';
import {CustomerModel} from '../../customer/customer.model';
import {UnitModel} from '../../unit/unit.model';

export class OwnershipContractModel extends BaseModel {
	_id: string;
	cstmr: CustomerModel;
	contract_number: string;
	contract_date: string;
	expiry_date: string;
	contact_name: string;
	contact_address: string;
	contact_email: string;
	contact_phone: string;
	contact_city: string;
	contact_zip: string;
	unit: UnitModel;
	paymentType:string;
	paymentTerm: number;
	start_electricity_stand: number;
	start_water_stand: number;
	virtualAccount: string;
	isPKP: boolean;
	tax_id: string;
	asset: any;
	receipt : any;
	ktp : string;
	npwp : string;

	clear(): void{
		this._id = undefined;
		this.receipt = undefined;
		this.cstmr = undefined;
		this.contract_number = "";
		this.contract_date = "";
		this.expiry_date = "";
		this.contact_name = "";
		this.contact_address = "";
		this.contact_phone = "";
		this.contact_email ="";
		this.contact_city = "";
		this.contact_zip = "";
		this.unit = undefined;
		this.paymentType = "";
		this.paymentTerm = 0;
		this.start_electricity_stand = 0;
		this.start_water_stand = 0;
		this.virtualAccount = "";
		this.isPKP = undefined;
		this.tax_id = "";
		this.asset = undefined;
		this.ktp  = "";
		this.npwp = "";
	}
}
