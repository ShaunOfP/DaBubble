import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  getDoc,
  doc,
  onSnapshot,
  getDocs,
} from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';
import { User } from './../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  userDatas$: Observable<User[]>;
  userDatas: any;

  constructor() {
    this.userDatas$ = collectionData(this.userDatasRef());
    this.getUserDatas();
  }

  async saveUser(user: User): Promise<void> {
    try {
      const userPlainObject = { ...user }; // Important!! Firebase need a plainobject to read, otherwise its not working!
      const docRef = await addDoc(this.userDatasRef(), userPlainObject);
      console.log('Document written with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  async getUserDatas() {
    try {
      const querySnapshot = await getDocs(this.userDatasRef());
      querySnapshot.forEach((doc) => {
        console.log('ID:', doc.id);
        console.log('Data:', doc.data());
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }
}
