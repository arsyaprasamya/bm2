import {BaseModel} from '../../_base/crud';
import {UnitModel} from "../../unit/unit.model";
import {WaterRateModel} from "../rate/rate.model";

export class WaterMeterModel extends BaseModel{
	_id : string;
	nmmtr : string;
	unt: UnitModel;
	rte: WaterRateModel;

	clear(): void{
		this._id = undefined;
		this.nmmtr = "";
		this.unt = undefined;
		this.rte = undefined;
	}
}
