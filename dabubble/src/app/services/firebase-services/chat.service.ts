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
  getDoc,
  onSnapshot,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../../models/interfaces';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  constructor() {}

  getChatRef() {
    return collection(this.firestore, 'chat');
  }

  getMessages(channelId: string): Observable<Message[]> {
    const messagesRef = query(
      collection(this.firestore, `channels/${channelId}/messages`),
      orderBy('createdAt', 'asc')
    );
    return collectionData(messagesRef, { idField: 'id' }) as Observable<Message[]>;
  }
  
  saveMessage(channelId: string, message: Message) {
    return addDoc(collection(this.firestore, `channels/${channelId}/messages`), message);
  }

  // getMessages(channelId: string): Observable<Message[]> {
  //   return new Observable((observer) => {
  //     const messagesCollectionRef = collection(this.firestore, `channels/${channelId}/messages`);
  //     const messagesQuery = query(messagesCollectionRef, orderBy('createdAt', 'asc'));

  //     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
  //       const messages: Message[] = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       })) as Message[];
  //       observer.next(messages);
  //     });
  //     return () => unsubscribe();
  //   });
  // }
  

  getThreadCollection(channelId: string, messageId: string): Observable<any[]> {
    return collectionData(
      collection(
        this.firestore,
        `channels/${channelId}/messages/${messageId}/thread`
      )
    ) as Observable<any[]>;
  }
}
