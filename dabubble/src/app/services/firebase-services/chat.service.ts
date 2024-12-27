import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);
  constructor() { }

  getChatRef() {
    return collection(this.firestore, 'chat');
  }

  getMessages(channelId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, `channels/${channelId}/messages`);
    return collectionData(messagesRef, { idField: 'id' }) as Observable<any[]>;
  }

  getThreadCollection(channelId: string, messageId: string): Observable<any[]> {
    return collectionData(collection(this.firestore, `channels/${channelId}/messages/${messageId}/thread`)) as Observable<any[]>;
  }
}
