import {UsertypeModel} from './usertype.model';

export class UserModel {

  constructor() {
    this.type = UsertypeModel.Guest;
  }


  id: string;
  // tslint:disable-next-line:variable-name
  first_name: string;
  // tslint:disable-next-line:variable-name
  last_name: string;
  email?: string;
  phone?: string;
  country?: string;
  token?: string;
  type: UsertypeModel;
  photo?: string;
  photoToken?: string;

  update(id?:string, fname?:string, lname?:string, 
    email?:string, phone?:string, country?:string, 
    token?:string, type?:UsertypeModel, photo?:string, photoToken?:string) {
    this.id = id ? id : this.id;
    this.first_name = fname ? fname : this.first_name;
    this.last_name = lname ? lname: this.last_name;
    this.email = email ? email : this.email;
    this.phone = phone ? phone : this.phone;
    this.country = country ? country : this.country;
    this.token = token ? token : this.token;
    this.type = type ? type : this.type;
    this.photo = photo ? photo : this.photo;
    this.photoToken = photoToken ? photoToken : this.photoToken;
  }

  name() {
    return this.first_name != null && this.last_name != null ? `${this.first_name} ${this.last_name}` : '';
  }
}
