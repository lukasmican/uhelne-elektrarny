import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Popup } from 'maplibre-gl'
import { Point } from 'geojson'


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  @ViewChild("mapa") map!: Map; // MapLibre GL Map object (MapLibre is ran outside angular zone, keep that in mind when binding events from this object)
  @ViewChild("powerplantinfo") powerplant_info!: ElementRef; // MapLibre GL Map object (MapLibre is ran outside angular zone, keep that in mind when binding events from this object)


  mapLoaded(map: Map) {
    this.map = map;

    this.map.on("click", "elektrarny", (e) => {
      var properties = e.features[0].properties;
      var geometry = e.features[0].geometry as Point;
      let coordinates: [number, number] = [ geometry.coordinates[0], geometry.coordinates[1] ];

      var popup = new Popup()
            .setLngLat(coordinates)
            .setHTML("<b>"+properties["name"]+"</b><br>"+properties["description1"])
            .addTo(map);

      this.powerplant_info.nativeElement.innerHTML = "<b>"+properties["name"]+"</b><br>"+properties["description1"];
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
