import { ChoiceSequenceComponent} from './../choicesequence/choicesequence.component';
import { Globals } from './../../globals';
import { SequenceComponent } from '../sequence/sequence.component';
import { SimpleComponent } from '../simple/simple.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../element/element.component';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})
export class ChoiceComponent extends ElementComponent {
  controlRef: any
  selectedChoice: string;
  opts: any[] = [];

  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  checkChoice() {

    this.container.detach();

    let x = this;
    let choice = this.selectedChoice;
    this.opts.forEach(function (c) {
      if (c.name == choice) {
        if (c.childelements == null || c.childelements.length == 0) {
          x.createElement(c, "simple");
        } else {
          x.createElement(c, "sequence");
        }
      }
    })
  }

  change() {
    this.global.getString();
  }

  getChildString(indent: string) {
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

  isElement() {
    return false;
  }

  getElementString(indent: string) {
    return this.getChildString(indent);
  }

  getSiblingString() {
    return "";
  }
  createElement(el: ItemConfig, type: string) {
    let factory = this.resolver.resolveComponentFactory(SimpleComponent);
    if (type == "sequence") {
      let factory = this.resolver.resolveComponentFactory(ChoiceSequenceComponent);
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

  setConfig(conf: ItemConfig) {
    let x = this;
    this.config = JSON.parse(JSON.stringify(conf));
    this.selectedChoice = this.config.choiceElementIdentifiers[0];

    this.id = this.bobNumber + this.config.elementPath.replace("{", "").replace("}", "");

    if (conf.childelements.length > 0) {
      this.hasChildren = true;
      this.config.childelements.forEach(function (v) {
        v.elementPath = x.config.elementPath + "/" + v.name;
        x.opts.push(v);
      });
    }

    this.checkChoice();
  }

}
