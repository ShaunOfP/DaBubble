import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  // Weitere Felder je nach Bedarf
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelsCollection: AngularFirestoreCollection<Channel>;
  channels$: Observable<Channel[]>;

  constructor(private firestore: AngularFirestore) {
    this.channelsCollection = firestore.collection<Channel>('channels');
    this.channels$ = this.channelsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const { id: dataId, ...data } = a.payload.doc.data() as Channel;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getChannels(): Observable<Channel[]> {
    return this.channels$;
  }

  async getChannelById(id: string): Promise<Channel | undefined> {
    const doc = await this.channelsCollection.doc(id).ref.get();
    if (doc.exists) {
      const data = doc.data() as Channel;
      return { ...data, id: doc.id };
    } else {
      return undefined;
    }
  }
}