import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { elementAt, Observable } from 'rxjs';
import { User } from './../../models/user.class';


@Injectable({
  providedIn: 'root'
})
export class UserDatasService {
  private firestore = inject(Firestore);
  userDatas$: Observable<User[]>;
  userDatas:any;

  constructor() {
    this.userDatas$ = collectionData(this.userDatasRef());
    this.getUserDatas()
  }

  async saveUser(user: User): Promise<void> {
    try {
      const userPlainObject = { ...user }; // Important!! Firebase need a plainobject to read otherwise its not working!
      const docRef = await addDoc(this.userDatasRef(), userPlainObject);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  }

/*   async getUserDatas(){  
    const docRef = doc(this.firestore, 'userDatas', 'HWRU8fpwhZTUX6A7NFAa');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }} */

    async getUserDatas(){
      this.userDatas = this.userDatas$.subscribe( (list) => {
        list.forEach(element => {
          console.log(element);
          
        })
      })
    }

    userDatasRef(){
      return collection(this.firestore, 'userDatas')
    }
}


