import { Globals } from './../../globals';
import { SequenceComponent } from '../sequence/sequence.component';
import { SimpleComponent } from '../simple/simple.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { Component, ComponentFactoryResolver,ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../element/element.component';


@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})
export class ChoiceComponent extends ElementComponent {
  @ViewChild("control", { read: ViewContainerRef }) control;
  controlRef : any
  selectedChoice: string;

  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  checkChoice() {

    let choice = this.selectedChoice;
    this.children.forEach(function (c) {
      if (c.config.name == choice) {
        c.setShowElement(true);
      } else {
        c.setShowElement(false);
      }
    })
  }

  change(){
    this.global.getString();
  }

  getChildString(indent:string) {
    let e: string = "";
    let choice = this.selectedChoice;
    if (this.children != null) {
      this.children.forEach(function (value) {
        if (value.config.name == choice) {
          e = e.concat(value.getElementString(indent));
        }
      });
    }
    return e;
  }

  isElement(){
    return false;
  }

  getElementString(indent:string) {
    return this.getChildString(indent);
  }

  getSiblingString() {

    return "";

  }
  createElement(el: ItemConfig, type: string) {
    let factory = this.resolver.resolveComponentFactory(SimpleComponent);
    if (type == "sequence") {
      let factory = this.resolver.resolveComponentFactory(SequenceComponent);
      if (el.choice) {
        let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
        this.componentRef = this.container.createComponent(factory);
      } else {
        this.componentRef = this.container.createComponent(factory);
      }
    } else {
      this.componentRef = this.container.createComponent(factory);    
    }
    this.children.push(this.componentRef.instance);
    this.componentRef.instance.setConfig(el);
  }

  addAttChild(x){
    this.attchildren.push(x);
  }
  setConfig(conf: ItemConfig) {
    let x = this;
    this.config =  JSON.parse(JSON.stringify(conf));
    this.selectedChoice = this.config.choiceElementIdentifiers[0];

    this.id = this.bobNumber+this.config.elementPath.replace("{", "").replace("}","");

    if (conf.childelements.length > 0) {
      this.hasChildren = true;
      this.config.childelements.forEach(function (v) {
        v.elementPath = x.config.elementPath+"/"+v.name;
        if (v.childelements == null || v.childelements.length == 0) {
          x.createElement(v, "simple");
        } else {
          x.createElement(v, "sequence");
        }
      });
    }

    this.checkChoice();
  }

}
