export class User{
  constructor(
    private email:string,
    private token:string,
    private localid:string,
    private expirationdate:Date){}

    getExpirationDate(){
      return this.expirationdate;
    }
}
