# MyBackgroundLocationIonicApp
Simple application that tests cordova-plugin-background-geolocation using Ionic 4.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
node.js
ionic
cordova
```

### Installing

A step by step series of examples that tell you how to get a development env running

#### Install

```
npm install
```

#### Update to VT API Format
The VT API requires background location data to be sent as JSONObject while the plugin uses JSONArray. Replace the PostLocationTask.java file with what is included in this repository. As ```npm install``` will overwrite the file, we need to checkout the file again.

##### Android
```
git checkout <yourpathtoApp>\platforms\android\app\src\main\java\com\mariahello\bgloc\PostLocationTask.java
```

##### iOS
```
TBD
```

#### Run in Browser

```
ionic serve
```


#### Add Platform Android

```
ionic cordova platform add android
```


#### Run in Android

```
ionic cordova run android
```


## Deployment

```
ionic cordova build android --prod
```

## Built With

* [Ionic](https://ionicframework.com/) - The framework used
* [Background-Geolocation](https://www.npmjs.com/package/@mauron85/cordova-plugin-background-geolocation) - cordova-plugin-background-geolocation
