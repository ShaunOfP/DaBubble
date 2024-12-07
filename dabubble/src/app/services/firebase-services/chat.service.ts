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

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);
  constructor() { }

  getChatRef(){
    return collection(this.firestore, 'chat')
  }
}
