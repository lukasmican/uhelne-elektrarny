import { Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { PowerPlantDetails } from '../power-plant-details';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-content',
  templateUrl: './detail-content.component.html',
  styleUrls: ['./detail-content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailContentComponent {
  @Input() powerplant_details: PowerPlantDetails;
  @Output() link_action = new EventEmitter<number>();
  
  @ViewChildren('description') description_components: QueryList<ElementRef>;

  listeners_destroyers: any[] = [];

  constructor(
    public sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked() {
    this.createLinks(this.description_components);
  }

  createLinks(elements: QueryList<ElementRef>){
    if (this.listeners_destroyers != undefined){
      for (const destroyer of this.listeners_destroyers){
        destroyer();
      }
    }
    for (const element of elements){
      for (const component of element.nativeElement.getElementsByTagName("span")) {
        if (component.classList.contains("description-link")){

          this.listeners_destroyers.push(this.renderer.listen(component, 'click', (event) => {
            var target_id = Number(event.target.classList[1]);
            this.link_action.emit(target_id);
          }));
        }
      }
    }
  }
}
