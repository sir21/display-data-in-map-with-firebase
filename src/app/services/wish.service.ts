import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Wish, Location, Place } from '../models/wish';

@Injectable({
  providedIn: 'root'
})
export class WishService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  saveWish(wish: Wish) {
    return this.fireStore.collection('wishes').doc(wish.id).set(wish);
  }

  getWishes() {
    return this.fireStore.collection('wishes').snapshotChanges();
  }

  getWish(id: string) {
    return this.fireStore.collection('wishes').doc(id).get();
  }

  addLocation(place: Place) {
    return this.fireStore.collection('locations').doc(place.loc?.name).set(place);
  }

  updateLocation(place: Place) {
    return this.fireStore.collection('locations').doc(place.loc?.name).update(place);
  }

  getLocation(name: string) {
    return this.fireStore.collection('locations').doc(name).get();
  }

  getMapLocations() {
    return this.fireStore.collection('locations').snapshotChanges();
  }

}
