import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  getDocs,
  where, 
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './../../models/user.class';

interface UserData {
  mail: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserDatasService {
  private firestore = inject(Firestore);
  userDatas$: Observable<User>;
  found: boolean = false

  constructor() {
    this.userDatas$= collectionData(this.userDatasRef());
    this.getUserDatas('Test@test.de', '123');
  }

  async saveUser(user: User): Promise<void> {
    try {
      const userPlainObject = { ...user }; // Important!! Firebase need a plainobject to read, otherwise its not working!
      const docRef = await addDoc(this.userDatasRef(), userPlainObject);
      console.log('Document written with ID: ', docRef.id);
      this.saveLocalStorage(docRef.id, user.name);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  async getUserDatas(email:string, password:string) {
    const q = query(this.userDatasRef(), where("mail", "==", email))    
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        if(userData.password === password){
        console.log('ID:', doc.id);
        console.log('Data:', userData);
        this.found = true;
        }
      });
      this.found ? false : console.log('falsche Email oder falsches Passwort');
    }    
    catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  saveLocalStorage(id: string, name:string){
    const user = { id: id, name: name  };
    localStorage.setItem('user', JSON.stringify(user));
  }

  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }
}
