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
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Channel {
  channelId: string;
  channelName: string;
  createdAt: string;
  description: string;
  owner: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels$: Observable<Channel[]>;
  private channelsCollection: CollectionReference<Channel>;
  private channelSubject = new BehaviorSubject<Channel[]>([]);

  constructor(private firestore: Firestore) {
    this.channelsCollection = collection(this.firestore, 'channels') as CollectionReference<Channel>;
    this.channels$ = collectionData(this.channelsCollection, { idField: 'channelId' }).pipe(
      map(actions => actions.map(a => {
        const { channelId, ...data } = a;
        return { channelId, ...data } as Channel;
      }))
    );
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
    /* const normalizedQuery = cleanedQuery.toLowerCase(); */
    console.log('Normalized Query:', normalizedQuery);
    const channelQuery = query(
      this.channelDataRef(),
      where('channelName', '>=', normalizedQuery),
      where('channelName', '<', normalizedQuery + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(channelQuery);
      const channels: Channel[] = [];
      querySnapshot.forEach((doc) => {
        const channel = {...(doc.data() as Channel), channelId: doc.id};
        channels.push(channel);
        console.log('found channel:', channel.channelName);
      });
      console.log(channels);  
      this.channelSubject.next(channels);
      return channels;
    } catch (error) {
      console.error('Fehler beim Suchen nach Nutzern:', error);
      return [];
    }
  }

  // Neue Methode zum Ausloggen der Channels
  async logChannels(): Promise<void> {
    const querySnapshot = await getDocs(this.channelsCollection);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  }
}