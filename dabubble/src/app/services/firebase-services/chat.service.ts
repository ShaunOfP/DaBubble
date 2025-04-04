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
  arrayUnion,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Message } from '../../models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  currentChatId: string = '';
  public channelName: string = '';
  public currentChannelUsers: number = 0;
  currentChannelOwner: string = '';
  currentChannelDescription: string = '';
  currentChannelData?: Channel;
  private currentThreadsSubject = new BehaviorSubject<Message[]>([]);
  currentThreads$ = this.currentThreadsSubject.asObservable();
  showCurrentThread = new BehaviorSubject(false);
  chatMarginRight: boolean = true;
  currentMessageId: string = '';
  showChatWhenResponsive: boolean = false;
  showAltHeader: boolean = false;
  showChatDetailsMobileGreyLayer: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
  ) {
    this.getCurrentChatId();
  }


  getCurrentChatId() {
    this.route.queryParams.subscribe((params) => {
      if (params['chatId']) {
        this.currentChatId = params['chatId'];
        console.log(this.currentChatId);
        this.loadChannelInfo();
      } else {
        console.error('No chatId found in query parameters');
      }
    });
  }

  async loadChannelInfo() {
    try {
      const data = await getDoc(this.getChannelDocRef(this.currentChatId));

      if (data.exists()) {
        this.currentChannelData = data.data() as Channel;
      }
    }
    catch (error) {
      console.error('Fehler beim Laden der Kanal-Info:', error);
    }
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
      const newMessage = await addDoc(
        collection(this.firestore, `channels/${this.currentChatId}/messages`),
        message
      );
      this.generateThread(newMessage.id, message)
    }
    if (this.getCurrentRoute() === 'private') {
      await addDoc(
        collection(this.firestore, `privateChats/${this.currentChatId}/messages`),
        message
      );
    }
  }

  setThreadVisible(value: boolean) {
    this.showCurrentThread.next(value);
  }

  async generateThread(messageId: string, message: Message) {
    await addDoc(collection(this.firestore, `channels/${this.currentChatId}/messages/${messageId}/thread`),
      message)
    console.log('thread erfolgreich in Message:' + messageId + ' erstellt');
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


  async updateMessage(emoji: string, messageId: string, userId: string, isThread: boolean) {
    const messagePath = this.getMessagePath(messageId, isThread);
    const messageRef = doc(this.firestore, messagePath);
    try {
      await runTransaction(this.firestore, async (transaction) => {
        const messageSnap = await transaction.get(messageRef);
        if (!messageSnap.exists()) {
          throw new Error("Das Dokument existiert nicht!");
        }
        const data = messageSnap.data();
        const reaction = data?.['reaction'] || {};
        const currentUsers = reaction[emoji] || [];
        const userIndex = currentUsers.indexOf(userId);
        if (userIndex === -1) {
          currentUsers.push(userId);
          reaction[emoji] = currentUsers;
        } else {
          currentUsers.splice(userIndex, 1);
          if (currentUsers.length > 0) {
            reaction[emoji] = currentUsers;
          } else {
            delete reaction[emoji];
          }
        }
        transaction.update(messageRef, { reaction });
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Reaction:", error);
    }
  }

  private getMessagePath(messageId: string, isThread: boolean): string {
    return isThread
      ? `channels/${this.currentChatId}/messages/${this.currentMessageId}/thread/${messageId}`
      : `channels/${this.currentChatId}/messages/${messageId}`;
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


  /**
   * Takes the channelId and returns the reference for that document
   * @param channelId id of the currently opened channel
   * @returns a document reference of a public Chat
   */
  getChannelDocRef(channelId: string) {
    return doc(this.firestore, `channels/${channelId}`);
  }


  /**
   * Takes a channelId from the currently opened Public Chat and returns a string
   * @param channelId a string containing the Id of the currently opened Channel
   * @returns The channel name for the currently opened Public Chat or a string containing an error message
   */
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


  /**
   * Takes a channelId from the currently opened Private Chat and the UserId and returns a string
   * @param channelId a string containing the Id of the currently opened Channel
   * @param currentUserId a string containing the ID of the User which is currently logged in
   * @returns a string with either the Id of the other User from a Private Chat or the error message
   */
  async getOtherUserNameFromPrivateChat(channelId: string, currentUserId: string): Promise<string> {
    const privateChatRef = await getDoc(this.getPrivateChatDocRef(channelId));
    if (privateChatRef.exists()) {
      if (privateChatRef.data()['participants'].length < 1) return 'There are no users in this channel';
      let otherPrivateChatUser;
      for (const user of privateChatRef.data()['participants']) {
        if (user != currentUserId) {
          otherPrivateChatUser = user;
        }
      }
      return otherPrivateChatUser;
    } else return 'Private Chat doesnt exist';
  }


  /**
   * Takes the channelId and returns the reference for that document
   * @param channelId id of the currently opened channel
   * @returns a document reference of a private Chat
   */
  getPrivateChatDocRef(channelId: string) {
    return doc(this.firestore, `privateChats/${channelId}`);
  }


  async updateChatInformation(
    channelId: string,
    updatedField: string,
    updateValue: string
  ) {
    const channelDoc = await getDoc(this.getChannelDocRef(channelId));
    if (channelDoc.exists()) {
      if (updatedField === 'users') {
        await updateDoc(this.getChannelDocRef(channelId), {
          [updatedField]: arrayUnion(updateValue),
        });
      } else {
        if (channelId === 'ER84UOYc0F2jptDjWxFo') {
          //Soll nicht geändert werden
        } else {
          await updateDoc(this.getChannelDocRef(channelId), {
            [updatedField]: updateValue,
          });
        }
      }
    }
  }


  async getMessageThread(messageId: string) {
    const thread = query(
      collection(this.firestore, `channels/${this.currentChatId}/messages/${messageId}/thread`),
      orderBy('createdAt', 'asc')
    );
    const threadObservable = collectionData(thread, { idField: 'id' }) as Observable<Message[]>;
    threadObservable.subscribe(messages => {
      this.currentThreadsSubject.next(messages);
    });
    this.currentMessageId = messageId

  }

}