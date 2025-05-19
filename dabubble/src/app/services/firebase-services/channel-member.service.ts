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
  arrayUnion
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Channel } from './channel.service';
import { UserDatasService } from './user-datas.service';

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
  subscribe(): any {
    throw new Error('Method not implemented.');
  }
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
  private isComponentVisibleSource = new BehaviorSubject<boolean>(false);
  isComponentVisible$ = this.isComponentVisibleSource.asObservable();
  showAddMembersMenu: boolean = false;
  showChatGreyScreen: boolean = false;

  constructor(private userDatasService: UserDatasService) { }

  updateComponentStatus(isVisible: boolean) {
    this.isComponentVisibleSource.next(isVisible);
  }

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

  /**
   * Selects a member and updates the relevant observables
   * - Marks the given `member` as selected by updating the `membersSubject` observable
   * - If the `member` is not already in the `selectedMembersSubject` observable, it is added to it
   */
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

  /**
   * Removes a member from the selection and updates the relevant observables
   * - filters the specified member out of the `selectedMembersSubject` observable
   * - Updates the `membersSubject` observable by marking the member's `selected` property as `false`
   */
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
      users: [ownerId, ...members.map((member) => member.id)],
    };
    await setDoc(channelDocRef, channelData);
    await this.addNewChannelToMembers(members, generatedId);
    await this.addNewChannelToOwner(ownerId, generatedId);
    await this.userDatasService.refreshCurrentUserData(ownerId);
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

  /**
   * Adds new channel id to channel creator
   */
  async addNewChannelToOwner(ownerId: string, channelId: string) {
    try {
      if (this.userDatasService.checkIfGuestIsLoggedIn()) {
        const ownerDocRef = doc(this.firestore, 'guestDatas', ownerId);
        await updateDoc(ownerDocRef, {
          channels: arrayUnion(channelId),
        });
      } else {
        const ownerDocRef = doc(this.firestore, 'userDatas', ownerId);
        await updateDoc(ownerDocRef, {
          channels: arrayUnion(channelId),
        });
      }
    } catch (error) {
      console.error(
        `Error adding channel ${channelId} to owner ${ownerId}:`,
        error
      );
    }
  }

  /**
   * Adds new channel id to each channel member
   */
  async addNewChannelToMembers(members: Member[], channelId: string) {
    const promises = members.map((member) => {
      const docRef = doc(this.firestore, 'userDatas', member.id);
      return updateDoc(docRef, {
        channels: arrayUnion(channelId),
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error adding channel to members:', error);
    }
  }

  /**
   * Updates the Database to remove the current User from the Public Channel
   * @param userId a string with the ID of the currently logged in User
   * @param channelData
   */
  async removeCurrentUserFromChannel(userId: string, channelData: Channel) {
    let userArray = channelData.users;
    userArray = userArray.filter((user: string) => user !== userId);
    const docRef = doc(this.firestore, 'channels', channelData.channelId);
    await updateDoc(docRef, {
      users: userArray,
    });
  }
}
