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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  constructor() {}

  getChatRef() {
    return collection(this.firestore, 'chat');
  }

  // getMessages(channelId: string): Observable<any[]> {
  //   const messagesRef = collection(this.firestore, `channels/${channelId}/messages`);
  //   return collectionData(messagesRef, { idField: 'id' }) as Observable<any[]>;
  // }

  getMessages(channelId: string) {
    const messagesData: Array<Object> = [];
    const messagesCollectionRef = collection(this.firestore, `channels/${channelId}/messages`);
    const unsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
      // Clear the array to avoid duplicate data on each snapshot update
      messagesData.length = 0;
  
      snapshot.docs.forEach((doc) => {
        // Combine doc.id with the document data
        messagesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
  
      console.log(messagesData); // Log the updated messagesData array
    });
  
    // Return the unsubscribe function to stop listening when no longer needed
    return unsubscribe;
  }
  

  getThreadCollection(channelId: string, messageId: string): Observable<any[]> {
    return collectionData(
      collection(
        this.firestore,
        `channels/${channelId}/messages/${messageId}/thread`
      )
    ) as Observable<any[]>;
  }
}
