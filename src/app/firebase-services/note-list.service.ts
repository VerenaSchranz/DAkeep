import { Injectable, inject } from "@angular/core";
import { Note } from "../interfaces/note.interface";
import {
  query,
  orderBy,
  limit,
  where,
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
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

  async deleteNote(colId: "notes" | "trash", docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(colId, docId));
      console.log("Document deleted successfully");
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  }
  

  async updateNote(note: Note) {
    if (note.id) {
      const docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      try {
        await updateDoc(docRef, this.getCleanJson(note));
        console.log("Document updated successfully");
      } catch (err) {
        console.error("Error updating document:", err);
      }
    }
  }
  

  getCleanJson(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note: Note) {
    if(note.type == 'note') {
      return 'notes'
    } else{
      return 'trash'
    }
  }

   async addNote(item: Note, colId: 'note' | 'trash') {
    if (colId == 'note') {
      await addDoc(this.getNotesRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID: ', docRef);
        });
    }
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
    const q = query(this.getNotesRef(), orderBy("state"), limit(100));
    return onSnapshot(q, (list) => {
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
