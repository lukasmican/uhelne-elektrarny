import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Popup, Marker } from 'maplibre-gl'
import { Point } from 'geojson'
import { PowerPlantDetails } from '../power-plant-details';

import { default as powerplants_json } from '../../assets/elektrarny_geojson.json';

import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  map: Map = null; // MapLibre GL Map object (MapLibre is ran outside angular zone, keep that in mind when binding events from this object)
  @ViewChild("detailcard") detail_card!: ElementRef;

  detail_card_expanded = false;

  powerplant_details: PowerPlantDetails;

  powerplants: PowerPlantDetails[] = [];
  popup: Popup;
  marker: Marker;

  deviceInfo: DeviceInfo = null;
  isMobile = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private deviceService: DeviceDetectorService
  ) {
    for (const element of powerplants_json.features) {
      this.powerplants.push(element.properties as PowerPlantDetails);
      this.powerplants[this.powerplants.length - 1].coordinates = [element.geometry.coordinates[0], element.geometry.coordinates[1]];
    }
    this.powerplants.sort((a, b) => a.name.localeCompare(b.name))

    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
  }


  mapLoaded(map: Map) {
    this.map = map;

    this.map.on("click", "elektrarny", (e) => {

      var properties = e.features[0].properties;
      var geometry = e.features[0].geometry as Point;
      this.powerplant_details = properties as PowerPlantDetails;
      this.powerplant_details.coordinates = [geometry.coordinates[0], geometry.coordinates[1]];

      this.mapShowPopup(this.powerplant_details);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mouseenter', 'elektrarny', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'elektrarny', () => {
      this.map.getCanvas().style.cursor = '';
    });

  }

  mapShowPopup(powerplant: PowerPlantDetails) {
    if (this.popup != null) {
      this.popup.remove();
      this.popup = null;
    }

    if (this.marker != null) {
      this.marker.remove();
      this.marker = null;
    }

    this.marker = new Marker({ draggable: true })
      .setLngLat(powerplant.coordinates)
      .addTo(this.map);

    // this.popup = new Popup()
    // .setLngLat(powerplant.coordinates)
    // .setHTML("<span style='color: black;'></span>")
    // .addTo(this.map);

    //.setHTML("<span style='color: black;'><b>"+powerplant.name+"</b><br><i>"+powerplant.type+", "+powerplant.years_in_service+"</i><br>"+powerplant.description_short+"</span>")
    this.changeDetector.detectChanges();
  }

  mapShowPowerPlantByID(powerplant_id: number) {
    this.mapShowPowerPlant(this.powerplants[powerplant_id]);
  }
  mapShowPowerPlant(powerplant: PowerPlantDetails) {
    this.powerplant_details = powerplant;
    this.mapShowPopup(powerplant);
    this.mapFlyTo(powerplant.coordinates);
  }

  mapFlyTo(coordinates: [number, number]) {
    this.map.flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: coordinates,
      zoom: 8,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing(t) {
        return t;
      },

      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true
    });
  }

  detailsToggleClicked() {
    if (this.detail_card.nativeElement.classList.contains("detail-card-up")) {
      this.detail_card_expanded = false;
      this.detail_card.nativeElement.classList.remove("detail-card-up");
      this.detail_card.nativeElement.classList.add("detail-card-down");
    } else {
      this.detail_card_expanded = true;
      this.detail_card.nativeElement.classList.remove("detail-card-down");
      this.detail_card.nativeElement.classList.add("detail-card-up");
    }
    this.changeDetector.detectChanges();

  }

}
