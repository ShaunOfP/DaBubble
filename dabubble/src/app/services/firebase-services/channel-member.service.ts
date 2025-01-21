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
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Member {
  privateChats: string;
  username: string;
  avatar: string;
  selected: boolean;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChannelMemberService {
  public firestore = inject(Firestore);
  private allMembersSubject = new BehaviorSubject<Member[]>([]);
  allMembersSubject$: Observable<Member[]> =
    this.allMembersSubject.asObservable();
  private membersSubject = new BehaviorSubject<Member[]>([]);
  members$: Observable<Member[]> = this.membersSubject.asObservable();
  private selectedMembersSubject = new BehaviorSubject<Member[]>([]);
  selectedMembers$ = this.selectedMembersSubject.asObservable();
  private channelName = new BehaviorSubject<string>('');
  channelName$ = this.channelName.asObservable();
  private channelDescription = new BehaviorSubject<string>('');
  channelDescription$ = this.channelDescription.asObservable();

  /**
   * Get current channel-name and channel-description from create-channel-component and update observables
   */
  setChannelData(name: string, description: string) {
    this.channelName.next(name);
    this.channelDescription.next(description);
  }

  /**
   * Retrieves a Firestore collection reference for user data.
   */
  userDatasRef() {
    return collection(this.firestore, 'userDatas');
  }

  /**
   * Searches for users in the Firestore `userDatas` collection based on a query string.
   * - Normalizes the `queryString` to lowercase for case-insensitive search.
   * - Performs a Firestore query to find users whose `username_lowercase` starts with the normalized query.
   * - Updates the `membersSubject` observable with the resulting users.
   * - Returns an array of matching `Member` objects.
   * @param queryString
   * @returns
   */
  async searchUsers(queryString: string): Promise<Member[]> {
    const normalizedQuery = queryString.toLowerCase();
    const userQuery = query(
      this.userDatasRef(),
      where('username_lowercase', '>=', normalizedQuery),
      where('username_lowercase', '<', normalizedQuery + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(userQuery);
      const users: Member[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...(doc.data() as Member), id: doc.id });
      });
      this.membersSubject.next(users);
      return users;
    } catch (error) {
      console.error('Fehler beim Suchen nach Nutzern:', error);
      return [];
    }
  }

  selectMember(member: Member): void {
    const members = this.membersSubject.getValue();
    const updateMembers = members.map((m) =>
      m.privateChats[0] === member.privateChats[0]
        ? { ...m, selected: true }
        : m
    );

    this.membersSubject.next(updateMembers);

    const selectedMembers = this.selectedMembersSubject.getValue();
    if (
      !selectedMembers.find((m) => m.privateChats[0] === member.privateChats[0])
    ) {
      this.selectedMembersSubject.next([
        ...selectedMembers,
        { ...member, selected: true },
      ]);
    }
  }

  removeMember(member: Member) {
    const selectedMembers = this.selectedMembersSubject.getValue();
    const updateSelectedMembers = selectedMembers.filter(
      (m) => m.privateChats[0] !== member.privateChats[0]
    );
    this.selectedMembersSubject.next(updateSelectedMembers);

    const members = this.membersSubject.getValue();
    const updateMembers = members.map((m) =>
      m.privateChats[0] === member.privateChats[0]
        ? { ...m, selected: false }
        : m
    );

    this.membersSubject.next(updateMembers);
  }

  /**
   * Retrieves all user data from Firebase and updates the members observable:
   * - Fetches all documents from the `userDatas` collection in Firestore
   * - Transforms each document into a `Member` object by including its `id`
   * - Populates the `allUsers` array with the transformed `Member` objects
   * - Updates the `allMembersSubject` behavior subject with the `allUsers` array
   */
  async selectAllMembers() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'userDatas')
    );
    const allUsers: Member[] = [];

    querySnapshot.forEach((doc) => {
      allUsers.push({ ...(doc.data() as Member), id: doc.id });
    });
    this.allMembersSubject.next(allUsers);
  }

  /**
   * Create new channel in firebase
   */
  async createNewChannel(members: Member[], ownerId: string) {
    const generatedId = this.generateRandomId();
    const channelDocRef = doc(this.firestore, 'channels', generatedId);
    const channelData = {
      channelId: generatedId,
      channelName: this.channelName.value,
      createdAt: new Date().getTime(),
      description: this.channelDescription.value,
      owner: ownerId,
      users: members.map((member) => member.id),
    };
    await setDoc(channelDocRef, channelData);
    this.addNewChannelToMembers(members, generatedId);
    this.addNewChannelToOwner(ownerId, generatedId);
  }

  /**
   * Generate and return a new ID for a new channel
   */
  generateRandomId() {
    const array = new Uint8Array(22);
    crypto.getRandomValues(array);
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomId = Array.from(
      array,
      (byte) => characters[byte % characters.length]
    ).join('');
    const generatedRandomId = 'channel' + randomId;
    return generatedRandomId;
  }

  async addNewChannelToOwner(ownerId: string, channelId: string) {
    try {
      const ownerDocRef = doc(this.firestore, 'userDatas', ownerId);
      await updateDoc(ownerDocRef, {
        channels: arrayUnion(channelId),
      });
      console.log(
        `Channel ${channelId} successfully added to owner ${ownerId}`
      );
    } catch (error) {
      console.error(
        `Error adding channel ${channelId} to owner ${ownerId}:`,
        error
      );
    }
  }

  async addNewChannelToMembers(members: Member[], channelId: string) {
    const promises = members.map((member) => {
      const docRef = doc(this.firestore, 'userDatas', member.id);
      return updateDoc(docRef, {
        channels: arrayUnion(channelId),
      });
    });

    try {
      await Promise.all(promises);
      console.log('Channel added to all members successfully');
    } catch (error) {
      console.error('Error adding channel to members:', error);
    }
  }
}
