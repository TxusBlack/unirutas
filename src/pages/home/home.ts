import {Component} from '@angular/core';

import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {NavController} from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  waypoints: any[];
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  map: any = null;
  OrLatLng: any;
  DesLatLng: any;

  constructor(
    public geolocation: Geolocation,
    public naVCtrl: NavController
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();

  }

//Se carga el mapa
  loadMap(position: Geoposition) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');

    // create LatLng object
    this.OrLatLng = {lat: latitude, lng: longitude};
    this.DesLatLng = {lat: 6.471915, lng: -73.262879};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.OrLatLng,
      zoom: 12
    });

    this.directionsDisplay.setMap(this.map);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calculateRoute();
    });
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then(res => {
      this.loadMap(res);
      this.declararwaypoints();
    });
  }

  //Se declaran los waypoints
  declararwaypoints() {
    this.waypoints = [
      {
        //WayPoint Estacion de gasolina pinchote

        location: {lat: 6.541990, lng: -73.165243},
        stopover: true,
      },
      {
        //WayPoint Puente peatonal San Gil
        location: {lat: 6.552328, lng: -73.133355},
        stopover: true,
      }
    ];
  }

  //Traza la ruta
  private calculateRoute() {

    this.bounds.extend(this.OrLatLng);

    this.waypoints.forEach(waypoint => {
      var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
      this.bounds.extend(point);
    });

    this.map.fitBounds(this.bounds);

    this.directionsService.route({
      //Origen
      origin: new google.maps.LatLng(this.DesLatLng.lat, this.DesLatLng.lng),
      //Destino
      destination: new google.maps.LatLng(this.OrLatLng.lat, this.OrLatLng.lng),
      waypoints: this.waypoints,
      //Optimiza waypoints
      optimizeWaypoints: true,
      //Modo conduccion de google maps
      travelMode: google.maps.TravelMode.DRIVING,
      //Omite peajes si existen, desvia la ruta para conseguirlo
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });

  }

  ionViewWillEnter() {
    this.getPosition();
  }
}

