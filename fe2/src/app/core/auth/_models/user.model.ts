import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';
import {Permission} from './permission.model';
import {Role} from './role.model';

export class User extends BaseModel {
	_id: string;
	id: string;
	username: string;
	password: string;
	email: string;
	token: string;
	accessToken: string;
	refreshToken: string;
	role: string;
	roles: number[];
	pic: string;
	first_name: string;
	last_name: string;
	fullname: string;
	occupation: string;
	companyName: string;
	phone: string;
	address: Address;
	socialNetworks: SocialNetworks;

	clear(): void {
		this._id = undefined;
		this.id = undefined;
		this.username = '';
		this.password = '';
		this.email = '';
		this.role = '';
		this.roles = [];
		this.first_name = '';
		this.last_name = '';
		this.fullname = '';
		this.token = '';
		this.accessToken = 'access-token-' + Math.random();
		this.refreshToken = 'access-token-' + Math.random();
		this.pic = './assets/media/users/default.jpg';
		this.occupation = '';
		this.companyName = '';
		this.phone = '';
		this.address = new Address();
		this.address.clear();
		this.socialNetworks = new SocialNetworks();
		this.socialNetworks.clear();
	}
}
