import { Injectable, inject } from "@angular/core";
import { Note } from "../interfaces/note.interface";
import {
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  firestore: Firestore = inject(Firestore);


  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNoteList();

 

  }

  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNoteList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        // console.log(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getNotesRef() {
    return collection(this.firestore, "notes");
  }
  getTrashRef() {
    return collection(this.firestore, "trash");
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
