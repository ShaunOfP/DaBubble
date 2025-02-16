import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  where,
  query,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  CollectionReference,
  collectionData,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Channel {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels$: Observable<Channel[]>;
  private channelsCollection: CollectionReference<Channel>;

  constructor(private firestore: Firestore) {
    this.channelsCollection = collection(this.firestore, 'channels') as CollectionReference<Channel>;
    this.channels$ = collectionData(this.channelsCollection, { idField: 'id' }).pipe(
      map(actions => actions.map(a => {
        const { id, ...data } = a;
        return { id, ...data } as Channel;
      }))
    );
  }

  getChannels(): Observable<Channel[]> {
    return this.channels$;
  }

  async getChannelById(id: string): Promise<Channel | undefined> {
    const docRef = doc(this.channelsCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Channel;
      return { ...data, id: docSnap.id };
    } else {
      return undefined;
    }
  }

  async addChannel(channel: Channel): Promise<void> {
    const docRef = doc(this.channelsCollection, channel.id);
    await setDoc(docRef, channel);
  }

  async updateChannel(id: string, data: Partial<Channel>): Promise<void> {
    const docRef = doc(this.channelsCollection, id);
    await updateDoc(docRef, data);
  }

  // Neue Methode zum Ausloggen der Channels
  async logChannels(): Promise<void> {
    const querySnapshot = await getDocs(this.channelsCollection);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  }
}