import {BaseModel} from '../_base/crud';
import { OwnershipContractModel } from '../contract/ownership/ownership.model';
import { SubdefectModel } from '../subdefect/subdefect.model';
import { EngineerModel } from '../engineer/engineer.model';
import { LeaseContractModel } from '../contract/lease/lease.model';



export class TicketModel extends BaseModel{
	_id : string;
	ticketId: string;
    subject: string;
	contract: OwnershipContractModel;
    subDefect: SubdefectModel;
    description: string;
    dateScheduled: string;
    dateList: [];
		rescheduleDate: string;
		reason: string;
    priority: string;
	attachment: [string];
   
    status: string;
	engineerId: EngineerModel;
	
    rating: string; //0,1,2,3,4,5
	feedback: string;

	createdDate:string;
    updatedBy: string;
    updatedDate: string;
	createdBy: string;




	clear(): void{
		this._id = undefined;
		this.ticketId = "";
		this.subject= "";
		this.contract = undefined;
		this.subDefect = undefined;
		this.description = "";
		this.dateScheduled = "";
		this.dateList = [];
		this.rescheduleDate = "";
		this.priority = "";
		this.attachment = undefined;
		this.reason = "";
		this.status = "";
		this.engineerId = undefined;
		this.rating = "";
		this.feedback ="";
		
		this.createdBy = localStorage.getItem("user");
		this.createdDate = "";
		this.updatedBy = localStorage.getItem("user");
		this.updatedDate ="";

		
	}
}
