import { kStringMaxLength } from 'buffer';
import { TicketModel } from '../ticket/ticket.model';
import {BaseModel} from '../_base/crud';



export class DeliveryorderModel extends BaseModel{
	_id : string;
	doId: string;
	ticket: TicketModel;
	attachment: [String];
	description: string;
	status: string;
	fixedDate: string;



	createdDate: Date;
	updatedBy: string;
	updatedDate: Date;
	createdBy: string;




	clear(): void{
		this._id = undefined;
		this.doId = "";
		this.ticket = undefined;
		this.attachment = undefined;
		this.description = "";
		this.status = "";
		this.fixedDate = "";
		this.createdBy = localStorage.getItem("user");
	}
}
