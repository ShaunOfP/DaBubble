import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './../../models/user.class';


@Injectable({
  providedIn: 'root'
})
export class UserDatasService {
  private firestore = inject(Firestore);
  userDatas$: Observable<User[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'userDatas');
    this.userDatas$ = collectionData(aCollection);
    this.getUserDatas()
  }

  async saveUser(user: User): Promise<void> {
    try {
      const userPlainObject = { ...user }; // Important!! Firebase need a plainobject to read otherwise its not working!
      const docRef = await addDoc(collection(this.firestore, 'userDatas'), userPlainObject);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }

  async getUserDatas(){  
    const docRef = doc(this.firestore, 'userDatas', 'HWRU8fpwhZTUX6A7NFAa');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }}
}


