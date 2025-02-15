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
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '../../models/interfaces';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  currentChatId: string = ``;

  constructor(private route: ActivatedRoute) {
    this.getCurrentChatId();
  }

  getCurrentChatId() {
    this.route.queryParams.subscribe((params) => {
      if (params['userID']) {
        this.currentChatId = params['userID'];
      } else {
        console.error('No userID found in query parameters');
      }
    });
  }

  getChatRef() {
    return collection(this.firestore, 'chat');
  }

  getMessages(channelId: string): Observable<Message[]> {
    const messagesRef = query(
      collection(this.firestore, `channels/${channelId}/messages`),
      orderBy('createdAt', 'asc')
    );
    return collectionData(messagesRef, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  saveMessage(channelId: string, message: Message) {
    return addDoc(
      collection(this.firestore, `channels/${channelId}/messages`),
      message
    );
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

  getChannelDocRef(channelId: string) {
    return doc(this.firestore, `channels/${channelId}`);
  }

  async getChannelDocSnapshot(channelId: string) {
    return await getDoc(this.getChannelDocRef(channelId));
  }

  async updateChatInformation(
    channelId: string,
    updatedField: string,
    updateValue: string
  ) {
    let channelDoc = await this.getChannelDocSnapshot(channelId);

    if (channelDoc.exists()) {
      console.log(channelDoc.data());
      await updateDoc(this.getChannelDocRef(channelId), {
        [updatedField]: updateValue,
      });
    }
  }
}
