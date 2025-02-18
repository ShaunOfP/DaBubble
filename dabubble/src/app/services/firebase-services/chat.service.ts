import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  doc,
  getDoc,
  orderBy,
  updateDoc,
  runTransaction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../../models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  currentChatId: string = ``;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.getCurrentChatId();
  }


  getCurrentChatId() {
    this.route.queryParams.subscribe((params) => {
      if (params['chatId']) {
        this.currentChatId = params['chatId'];
        console.log(this.currentChatId);
      } else {
        console.error('No userID found in query parameters');
      }
    });
  }


  getChatRef() {
    return collection(this.firestore, 'chat');
  }

  getMessages(): Observable<Message[]> {
    let currentRoute: string = '';
    if (this.getCurrentRoute() === 'public') {
      currentRoute = 'channels';
    }
    if (this.getCurrentRoute() === 'private') {
      currentRoute = 'privateChats';
    }
    const messagesRef = query(
      collection(this.firestore, `${currentRoute}/${this.currentChatId}/messages`),
      orderBy('createdAt', 'asc')
    );
    return collectionData(messagesRef, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  async saveMessage(message: Message) {
    if (this.getCurrentRoute() === 'public') {
      await addDoc(
        collection(this.firestore, `channels/${this.currentChatId}/messages`),
        message
      );
    }
    if (this.getCurrentRoute() === 'private') {
      await addDoc(
        collection(this.firestore, `privateChats/${this.currentChatId}/messages`),
        message
      );
    }
  }


  /**
   * Helper function to determine the current route
   * @returns a string with a simplified version of the current route
   */
  getCurrentRoute(): string {
    const currentRoute = this.router.url;
    if (currentRoute.includes('public-chat')) {
      return 'public';
    }
    if (currentRoute.includes('private-chat')) {
      return 'private';
    }
    return 'undefined';
  }


  async updateMessage(emoji: string, messageId: string, userId: string) {
    const messageRef = doc(this.firestore, `channels/${this.currentChatId}/messages/${messageId}`);

    try {
      await runTransaction(this.firestore, async (transaction) => {
        // Aktuellen Stand des Dokuments abrufen
        const messageSnap = await transaction.get(messageRef);
        if (!messageSnap.exists()) {
          throw new Error("Das Dokument existiert nicht!");
        }

        // Daten aus dem Dokument lesen
        const data = messageSnap.data();
        const reaction = data?.['reaction'] || {};

        // Liste aller User-IDs für das übergebene Emoji ermitteln (oder leeres Array)
        const currentUsers = reaction[emoji] || [];
        const userIndex = currentUsers.indexOf(userId);

        if (userIndex === -1) {
          // User war noch nicht in der Liste -> hinzufügen
          currentUsers.push(userId);
          reaction[emoji] = currentUsers;
        } else {
          // User ist schon in der Liste -> entfernen
          currentUsers.splice(userIndex, 1);
          if (currentUsers.length > 0) {
            reaction[emoji] = currentUsers;
          } else {
            // Keine User mehr für dieses Emoji -> Emoji-Key entfernen
            delete reaction[emoji];
          }
        }

        // Aktualisierte Daten zurückschreiben
        transaction.update(messageRef, { reaction });
      });

      // Optional: Hier kannst du eine Erfolgsmeldung oder weitere Aktionen einbauen
      console.log("Reaction erfolgreich aktualisiert.");

    } catch (error) {
      // Fehlerbehandlung
      console.error("Fehler beim Aktualisieren der Reaction:", error);
    }
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


  async getChannelDocSnapshot(channelId: string): Promise<string> {
    const channelRef = await getDoc(this.getChannelDocRef(channelId));
    try {
      if (channelRef.exists()) {
        const channelData = channelRef.data();
        return channelData['channelName'];
      }
      else return "no channel";
    } catch (error) {
      return 'cant load channel!';
    }
  }


  async updateChatInformation(
    channelId: string,
    updatedField: string,
    updateValue: string
  ) {
    const channelDoc = await getDoc(this.getChannelDocRef(channelId));
    if (channelDoc.exists()) {
      console.log(channelDoc.data());
      await updateDoc(this.getChannelDocRef(channelId), {
        [updatedField]: updateValue,
      });
    }
  }

  // changeChannel(channelId:string){
  //   this.currentChatId = channelId
  //   console.log(this.currentChatId);

  // }
}
