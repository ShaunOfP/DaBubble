import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  CollectionReference,
  collectionData,
  getDoc,
  query,
  where,
  collectionGroup,
  collectionSnapshots,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../models/interfaces';
import { UserDatasService } from './user-datas.service';

export interface Channel {
  channelId: string;
  channelName: string;
  createdAt: string;
  description: string;
  owner: string;
  users: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelsCollection: CollectionReference<Channel>;
  private channelSubject = new BehaviorSubject<Channel[]>([]);
  messages$: Observable<Message[]>;
  channels$: Observable<Channel[]>;
  channelNames: string[] = [];
  isCreateChannelClosed: boolean = true;
  isAddMembersToNewChannelVisible: boolean = false;
  isCreateChannelOverlayVisible: boolean = false;

  constructor(private firestore: Firestore, private userDatasService: UserDatasService) {
    this.channelsCollection = collection(this.firestore, 'channels') as CollectionReference<Channel>;
    this.channels$ = this.getChannelsCollection();
    this.messages$ = this.getMessagesCollection();
  }


  getChannelsCollection() {
    return collectionData(this.channelsCollection, { idField: 'channelId' }).pipe(
      map(actions => actions.map(a => {
        const { channelId, ...data } = a;
        return { channelId, ...data } as Channel;
      }))
    );
  }


  getMessagesCollection() {
    const messagesGroupRef = collectionGroup(this.firestore, 'messages');
    return collectionSnapshots(messagesGroupRef).pipe(
      map((messages: any[]) => {
        return messages.map(msg => {
          const fullPath = msg.ref.path || '';
          const channelIdMatch = fullPath.match(/channels\/([^\/]+)\/messages/);
          const channelId = channelIdMatch ? channelIdMatch[1] : '';
          if (!channelId) return null;
          const data = msg.data();
          return {
            ...data,
            channelId,
          } as Message;
        }).filter(msg => msg !== null);
      })
    );
  }


  async getChannelNames() {
    const snapshot = await getDocs(this.channelDataRef());
    snapshot.forEach((doc) => {
      if (doc.data()['users'].includes(this.userDatasService.currentUserId)){
        this.channelNames.push(doc.data()['channelName']);
      }
    });
  }


  checkIfChannelAlreadyExists(inputString: string): Boolean {
    if (this.channelNames.includes(inputString)) {
      return true;
    } else {
      return false;
    }
  }


  getChannels(): Observable<Channel[]> {
    return this.channels$;
  }


  channelDataRef(): CollectionReference<Channel> {
    return collection(this.firestore, 'channels') as CollectionReference<Channel>;
  }


  async getChannelById(id: string): Promise<Channel | undefined> {
    const docRef = doc(this.channelsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Channel;
      return { ...data, channelId: docSnap.id };
    } else {
      return undefined;
    }
  }


  async addChannel(channel: Channel): Promise<void> {
    const docRef = doc(this.channelsCollection, channel.channelId);
    await setDoc(docRef, channel);
  }


  async updateChannel(id: string, data: Partial<Channel>): Promise<void> {
    const docRef = doc(this.channelsCollection, id);
    await updateDoc(docRef, data);
  }


  async searchChannels(queryString: string): Promise<Channel[]> {
    const normalizedQuery = queryString.startsWith('#') ? queryString.substring(1) : queryString;
    const channelQuery = query(
      this.channelDataRef(),
      where('channelName', '>=', normalizedQuery),
      where('channelName', '<', normalizedQuery + '\uf8ff')
    );
    try {
      const querySnapshot = await getDocs(channelQuery);
      const channels: Channel[] = [];
      querySnapshot.forEach((doc) => {
        const channel = { ...(doc.data() as Channel), channelId: doc.id };
        channels.push(channel);
      });
      this.channelSubject.next(channels);
      return channels;
    } catch (error) {
      console.error('Fehler beim Suchen nach Channeln:', error);
      return [];
    }
  }
}