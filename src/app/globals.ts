import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
 // baseURL: string = 'http://aidx.quaysystems.com.au';
  baseURL: string = 'http://localhost:8080/XSD_Forms/json';
  xmlMessage: string = "";
  sampleXMLMessage: string = "";
  root:any;

  getString(){
    this.sampleXMLMessage =this.root.getElementString("");
  }
  
}