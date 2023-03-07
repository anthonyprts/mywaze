import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { MapsService } from '../services/myapp.services';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements AfterViewInit {
  myposLat!: number;
  mysposLong!: number;
  AdresseDepartSaisie: string = '';
  AdresseArriveSaisie: string = '';
  departlat: number =0;
  departlong: number =0;
  arriveelat: number =0;
  arriveelong: number = 0;
  resultatdepart: boolean = false;
  resultatarrivee: boolean = false;
  itineraire: boolean = false;

  private map:any;
  private marker1:any;
  private marker2: any;
  myIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
  });
  

  constructor(private mapservice: MapsService){}

  private initMap(): void {
    
    
    navigator.geolocation.getCurrentPosition((succsess) => {

      const crd = succsess.coords;

      console.log("Votre position actuelle:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      this.myposLat = crd.latitude;
      this.mysposLong = crd.longitude;

      

    })
      
    
    
    this.map = L.map('map', {
      center: [16.2412500, -61.5361400],
      zoom: 12
    });
    

    

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    
  }
  

  ngAfterViewInit(): void {
    this.initMap();
    
  }

  onSearch(){

    console.log(this.AdresseDepartSaisie);
    console.log(this.AdresseArriveSaisie);

    try {
      this.mapservice.getCoordonneeDepart(this.AdresseDepartSaisie).subscribe((data) => {
        console.log(data)
        
        this.departlat = data.features[0].geometry.coordinates[1];
        this.departlong = data.features[0].geometry.coordinates[0];
        this.marker1 = L.marker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], { icon: this.myIcon }).bindPopup('Départ');
        this.marker1.addTo(this.map).openPopup();
        console.log("les coordonnées sont !" + data.features[0].geometry.coordinates[1] + "et" + data.features[0].geometry.coordinates[0])
        this.resultatdepart = true;
 
        
      });

      this.mapservice.getCoordonneeArrivee(this.AdresseArriveSaisie).subscribe(async (data) => {

        console.log(data)
        this.arriveelat = data.features[0].geometry.coordinates[1];
        this.arriveelong = data.features[0].geometry.coordinates[0];
        this.marker2 = L.marker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]], { icon: this.myIcon }).bindPopup('Arrivé');
        this.marker2.addTo(this.map).openPopup();
        console.log("les coordonnées 2 sont !" + data.features[0].geometry.coordinates[1] + " et " + data.features[0].geometry.coordinates[0])
        this.resultatarrivee = true;
      
          
      });

      
      
    } catch (error) {
      console.log(error)
      
    }
    

  }

  viewIntineraire(){
    L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: `http://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      fitSelectedRoutes: false,
      show: true,
      waypoints: [
        L.latLng(this.departlat, this.departlong),
        L.latLng(this.arriveelat, this.arriveelong)
      ],
      routeWhileDragging: true,
    }).addTo(this.map);

    this.itineraire = true;
  }

  viewIntineraireCurrentLocation() {

    L.marker([this.myposLat, this.mysposLong], { icon: this.myIcon }).bindPopup('Ma position actuelle').addTo(this.map).openPopup();;
    L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: `http://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      fitSelectedRoutes: false,
      show: true,
      waypoints: [
        L.latLng(this.myposLat, this.mysposLong),
        L.latLng(this.arriveelat, this.arriveelong)
      ],
      routeWhileDragging: true,
    }).addTo(this.map);

    this.itineraire = true;
  }

  deleteItineraire(){
    this.map.remove();
    this.initMap();
    this.resultatdepart = false;
    this.resultatarrivee = false;
    this.itineraire = false;
  }

  


  

}
