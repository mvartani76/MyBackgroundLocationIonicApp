import { Component } from "@angular/core";
/* import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx"; */
import { HTTP } from "@ionic-native/http/ngx";
import { FirebaseService } from '../services/firebase.service';
import { ChangeDetectorRef } from '@angular/core';

// Import the SDK in addition to any desired interfaces:
import BackgroundGeolocation, {
  Location,
  MotionChangeEvent,
  MotionActivityEvent,
  GeofenceEvent,
  Geofence,
  HttpEvent,
  ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";  // <-- or "cordova-background-geolocation" for licensed customers
import { Platform } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  base_server_url: string = "https://api.yourserver.com/store?"; // Base Server URL
  device_id: string = "ABCDE001"; // Eventually should replace with device identifier
  locationStatus: string = "Initializing...";
  public location: any = {
    latitude: 0,
    longitude: 0,
    motionchange: 'stopped',
    activitychange: 'still'
  }

  constructor(
    //private backgroundGeolocation: BackgroundGeolocation,
    private http: HTTP,
    private firebaseService: FirebaseService,
    public platform: Platform,
    private changeRef: ChangeDetectorRef
  ) {
    platform.ready().then(this.configureBackgroundGeolocation.bind(this));
  }

  startBackgroundGeolocation() {
    /* const config: BackgroundGeolocationConfig = {
      stationaryRadius: 1,
      distanceFilter: 1,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      stopOnTerminate: false,
      debug: true,
      url: this.base_server_url,
      postTemplate: {
        "telephoneADID": this.device_id.toString(),
        "telephoneLatitude": '@latitude',
        "telephoneLongitude": '@longitude'
      },
      interval: 5000,
      fastestInterval: 1000,
      activitiesInterval: 1000
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);
          this.locationStatus = "Attempting to send location to server...";
          this.sendGPS(location);
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        });
    });
 */
    // start recording location
    //this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();
  }

  stopBackgroundGeolocation() {
    // If you wish to turn OFF background-tracking, call the #stop method.
    //this.backgroundGeolocation.stop();
  }

  sendGPS(location) {
    if (location.speed == undefined) {
      location.speed = 0;
    }
    //let timestamp = new Date(location.time);
    let timestamp = new Date().toLocaleString();
   /*  this.http.post(this.base_server_url,
      {
        telephoneADID: this.device_id,
        telephoneLatitude: '@latitude',
        telephoneLongitude: '@longitude'
      },
      {}
      )
      .then(data => {
        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);
        this.locationStatus = "Location sent to server...";
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        this.locationStatus = "Error sending location to server...";
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      }); */

      let data = {
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        date: timestamp,
      }
      console.log(location);
      this.sendCoordinates(data)
  }

  sendCoordinates(data){
    this.firebaseService.addCoordinates(data)
    .then( res => {
      console.log(res);
    }, err => {
      console.log(err)
    })
  }

  // Like any Cordova plugin, you must wait for Platform.ready() before referencing the plugin.
  configureBackgroundGeolocation() {
    // 1. Listen to events (see the docs a list of all available events)
    BackgroundGeolocation.onLocation(this.onLocation.bind(this));
    BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
    BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
    BackgroundGeolocation.onGeofence(this.onGeofence.bind(this));
    BackgroundGeolocation.onHttp(this.onHttp.bind(this));
    BackgroundGeolocation.onEnabledChange(this.onEnabledChange.bind(this));
    BackgroundGeolocation.onConnectivityChange(this.onConnectivityChange.bind(this));

    // 2. Configure the plugin
    BackgroundGeolocation.ready({
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      url: 'http://your.server.com/locations',
      autoSync: true,
      params: {
        foo: 'bar'
      }
    }, (state) => {
      // Note:  the SDK persists its own state -- it will auto-start itself after being terminated
      // in the enabled-state when configured with stopOnTerminate: false.
      // - The #onEnabledChange event has fired.
      // - The #onConnectivityChange event has fired.
      // - The #onProviderChange has fired (so you can learn the current state of location-services).
      
      if (!state.enabled) {
        // 3. Start the plugin.  In practice, you won't actually be starting the plugin in the #ready callback
        // like this.  More likely, you'll respond to some app or UI which event triggers tracking.  "Starting an order"
        // or "beginning a workout", for example.
        BackgroundGeolocation.start();
      } else {        
        // If configured with stopOnTerminate: false, the plugin has already begun tracking now.        
        // - The #onMotionChange location has been requested.  It will be arriving some time in the near future.        
      }
    });
  }

  onLocation(location:Location) {
    console.log('[location] -', location);
    this.locationStatus = 'located!';
    this.location.latitude = location.coords.latitude;
    this.location.longitude = location.coords.longitude;
    console.log(this.location);
    this.changeRef.detectChanges();
  }
  onMotionChange(event:MotionChangeEvent) {
    console.log('[motionchange] -', event.isMoving, event.location);
    this.location.motionchange = event.isMoving.toString();
    console.log(this.location);
    this.changeRef.detectChanges();
    this.sendGPS(this.location);
  }
  onActivityChange(event:MotionActivityEvent) {
    console.log('[activitychange] -', event.activity, event.confidence);
    this.location.activitychange = event.activity;
    console.log(this.location);
    this.changeRef.detectChanges();
  }
  onGeofence(event:GeofenceEvent) {
    console.log('[geofence] -', event.action, event.identifier, event.location);
  }
  onHttp(event:HttpEvent) {
    console.log('[http] -', event.success, event.status, event.responseText);
  }
  onEnabledChange(enabled:boolean) {
    console.log('[enabledchange] - enabled? ', enabled);
  }
  onConnectivityChange(event:ConnectivityChangeEvent) {
    console.log('[connectivitychange] - connected?', event.connected);
  }

  updateLocation(location){
    this.location = location;
    console.log(this.location);
    this.changeRef.detectChanges();
  }
  
}
