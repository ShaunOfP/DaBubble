import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  where,
  query,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Member {
    privateChats: string;
    username: string;
    avatar: string;
    selected: boolean;
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
        allUsers.push({...(doc.data() as Member)})
      });
      this.allMembersSubject.next(allUsers);
      return allUsers
    }

    async searchUsers(queryString: string): Promise<Member[]> {
        const userQuery = query(
          this.userDatasRef(),
          where('username', '>=', queryString),
          where('username', '<', queryString + '\uf8ff')
        );
      
        try {
          const querySnapshot = await getDocs(userQuery);
          const users: Member[] = [];
          querySnapshot.forEach((doc) => {
            users.push({...(doc.data() as Member) });
          });
          this.membersSubject.next(users);
          return users;
        } catch (error) {
          console.error('Fehler beim Suchen nach Nutzern:', error);
          return [];
        }
      }
    
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

}