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
  providedIn: 'root', // Dies sorgt dafür, dass der Service global verfügbar ist.
})

export class ChannelMemberService{
    public firestore = inject(Firestore);
    private membersSubject = new BehaviorSubject<Member[]>([]);
    members$: Observable<Member[]> = this.membersSubject.asObservable();
    private selectedMembersSubject = new BehaviorSubject<Member[]>([]);
    selectedMembers$ = this.selectedMembersSubject.asObservable();

    userDatasRef() {
        return collection(this.firestore, 'userDatas');
    }

    async searchUsers(queryString: string): Promise<Member[]> {
        const userQuery = query(
          this.userDatasRef(),
          where('usernameLower', '>=', queryString),
          where('usernameLower', '<', queryString + '\uf8ff')
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