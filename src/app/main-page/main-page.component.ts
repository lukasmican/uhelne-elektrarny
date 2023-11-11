import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Popup } from 'maplibre-gl'
import { Point } from 'geojson'
import { PowerPlantDetails } from '../power-plant-details';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  @ViewChild("mapa") map!: Map; // MapLibre GL Map object (MapLibre is ran outside angular zone, keep that in mind when binding events from this object)

  powerplant_details: PowerPlantDetails = new PowerPlantDetails();

  constructor(
    private changeDetector: ChangeDetectorRef
   ) { }

  mapLoaded(map: Map) {
    this.map = map;

    this.map.on("click", "elektrarny", (e) => {
      var properties = e.features[0].properties;
      var geometry = e.features[0].geometry as Point;
      let coordinates: [number, number] = [ geometry.coordinates[0], geometry.coordinates[1] ];

      var popup = new Popup()
            .setLngLat(coordinates)
            .setHTML("<b>"+properties["name"]+"</b><br><i>"+properties["type"]+", "+properties["years_in_service"]+"</i><br>"+properties["description_short"])
            .addTo(map);

      this.powerplant_details = properties as PowerPlantDetails;
      this.changeDetector.detectChanges();
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


      

}
