import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  where,
  query,
  doc,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Member {
    privateChats: string;
    username: string;
    avatar: string;
    selected: boolean;
    id: string,
}

@Injectable({
  providedIn: 'root',
})

export class ChannelMemberService{
    public firestore = inject(Firestore);
    private membersSubject = new BehaviorSubject<Member[]>([]);
    members$: Observable<Member[]> = this.membersSubject.asObservable();
    private allMembersSubject = new BehaviorSubject<Member[]>([]);
    allMembersSubject$: Observable<Member[]> = this.allMembersSubject.asObservable();
    private selectedMembersSubject = new BehaviorSubject<Member[]>([]);
    selectedMembers$ = this.selectedMembersSubject.asObservable();

    userDatasRef() {
        return collection(this.firestore, 'userDatas');
    }

    async selectAllMembers(){
      const querySnapshot = await getDocs(collection(this.firestore, 'userDatas'));
      const allUsers: Member[] = []
      
      querySnapshot.forEach((doc)=> {
        allUsers.push({...(doc.data() as Member),
          id: doc.id
        })
      });
      this.allMembersSubject.next(allUsers);
      return allUsers
    }

    async searchUsers(queryString: string): Promise<Member[]> {
      const capitalizedQuery = queryString.charAt(0).toUpperCase() + queryString.slice(1);
      const lowercaseQuery = queryString.toLowerCase();
  
      const capitalizedQueryRef = query(
        this.userDatasRef(),
        where('username', '>=', capitalizedQuery),
        where('username', '<', capitalizedQuery + '\uf8ff')
      );
  
      const lowercaseQueryRef = query(
        this.userDatasRef(),
        where('username', '>=', lowercaseQuery),
        where('username', '<', lowercaseQuery + '\uf8ff')
      );
  
      try {
        const [capitalizedSnapshot, lowercaseSnapshot] = await Promise.all([
          getDocs(capitalizedQueryRef),
          getDocs(lowercaseQueryRef),
        ]);
  
        const users: Member[] = [];
        const userIds = new Set<string>();
  
        capitalizedSnapshot.forEach((doc) => {
          const user = doc.data() as Member;
          if (!userIds.has(doc.id)) {
            users.push(user);
            userIds.add(doc.id);
          }
        });
  
        lowercaseSnapshot.forEach((doc) => {
          const user = doc.data() as Member;
          if (!userIds.has(doc.id)) {
            users.push(user);
            userIds.add(doc.id);
          }
        });
  
        this.membersSubject.next(users);
        return users;
      } catch (error) {
        console.error('Error searching for users:', error);
        return [];
      }
    }

    // Old search case sensitive
    // async searchUsers(queryString: string): Promise<Member[]> {
    //     const userQuery = query(
    //       this.userDatasRef(),
    //       where('username', '>=', queryString),
    //       where('username', '<', queryString + '\uf8ff')
    //     );
      
    //     try {
    //       const querySnapshot = await getDocs(userQuery);
    //       const users: Member[] = [];
    //       querySnapshot.forEach((doc) => {
    //         users.push({...(doc.data() as Member) });
    //       });
    //       this.membersSubject.next(users);
    //       return users;
    //     } catch (error) {
    //       console.error('Fehler beim Suchen nach Nutzern:', error);
    //       return [];
    //     }
    //   }
    
      selectMember(member: Member): void{
        const members = this.membersSubject.getValue();
        const updateMembers = members.map(m => 
          m.privateChats[0] === member.privateChats[0] ? {...m, selected: true} : m);
        
        this.membersSubject.next(updateMembers);
    
        const selectedMembers = this.selectedMembersSubject.getValue();
        if (!selectedMembers.find(m => m.privateChats[0] === member.privateChats[0])) {
          this.selectedMembersSubject.next([...selectedMembers, {...member, selected: true}])
        }
      }
    
      removeMember(member: Member){
        const selectedMembers = this.selectedMembersSubject.getValue();
        const updateSelectedMembers = selectedMembers.filter(
          m => m.privateChats[0] !== member.privateChats[0]
        );
        this.selectedMembersSubject.next(updateSelectedMembers);
    
        const members = this.membersSubject.getValue();
        const updateMembers = members.map(m => 
          m.privateChats[0] === member.privateChats[0] ? {...m, selected: false} : m);
    
        this.membersSubject.next(updateMembers);
      }



  async createNewChannel() {
    const generatedId = this.generateRandomId();
    const channelDocRef = doc(this.firestore, 'channels', generatedId);
    const channelData = {
      channelId: generatedId,
      channelName: '',
      createdAt: new Date().getTime(),
      description: '',
    }
  }

  generateRandomId() {
    const array = new Uint8Array(22);
    crypto.getRandomValues(array);
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomId = Array.from(
      array,
      (byte) => characters[byte % characters.length]
    ).join('');
    const generatedRandomId = 'pC' + randomId;
    return generatedRandomId;
  }

}