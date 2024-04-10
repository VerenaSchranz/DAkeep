import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection,  doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
items$;
items;
  firestore: Firestore = inject(Firestore);
  constructor() { 
    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe( (list) => {
      list.forEach(element => {
        
      });
    })
    this.items.unsubscribe();
  }
  // const itemCollection = collection(this.firestore, 'items');

  getNotesRef( ){
    return collection(this.firestore, 'notes');
  }
  getTrashRef( ){
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId)
  }
}