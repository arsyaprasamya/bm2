import {BaseModel} from '../../_base/crud';
import {PowerMeterModel} from '../meter/meter.model';

export class PowerTransactionModel extends BaseModel{
	_id : string;
	pow : PowerMeterModel;
	powname : string;
	strtpos : number;
	endpos : number;
	strtpos2 : number;
	endpos2 : number;
	billmnt : string;
	billamnt : number;
	loss: number;
	lossres : number;
	checker : boolean;


	clear(): void{
		this._id = undefined;
		this.pow = undefined;
		this.powname = "";
		this.strtpos = 0;
		this.endpos = 0;
		this.strtpos2 = 0;
		this.endpos2 = 0;
		this.billmnt = "";
		this.billamnt = 0;
		this.loss = 0;
		this.lossres = 0;
		this.checker = undefined;
	}
}
