import { Component } from "@angular/core";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";
import { HTTP } from "@ionic-native/http/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  base_server_url: string = "https://api.yourserver.com/store?"; // Base Server URL
  device_id: string = "ABCDE001"; // Eventually should replace with device identifier
  locationStatus: string = "Initializing...";

  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private http: HTTP
  ) {}

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      stationaryRadius: 1,
      distanceFilter: 1,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      interval: 1000,
      fastestInterval: 500,
      activitiesInterval: 1000
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);
          this.sendGPS(location);
          this.locationStatus = "Attempting to send location to server...";
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        });
    });

    // start recording location
    this.backgroundGeolocation.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }

  sendGPS(location) {
    if (location.speed == undefined) {
      location.speed = 0;
    }
    let timestamp = new Date(location.time);
    var urlsuffix: string = "storeBy=dm&telephoneADID="+this.device_id+"&telephoneLatitude="
                            +location.latitude.toString()+"&telephoneLongitude="
                            +location.longitude.toString()+"&telephoneAltitude="
                            +location.altitude.toString();
    this.http.post(this.base_server_url+urlsuffix,{},{})
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
      });
  }
}
