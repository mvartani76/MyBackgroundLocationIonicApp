import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public afs: AngularFirestore,
  ) { }

  addCoordinates(data){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/coordinates').add({
        latitude: data.latitude,
        longitude: data.longitude,
        date: data.date
      })
      .then((res) => {
        resolve(res)
      },err => reject(err))
    })
  }
}
