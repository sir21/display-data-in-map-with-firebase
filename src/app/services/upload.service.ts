import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  uploadImage(file: File, name: string) {
    return this.storage.upload(`/upload/${name}`, file);
  }
}
