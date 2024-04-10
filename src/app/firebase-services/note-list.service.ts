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
  items$;
  items;

  unsubList;
  unsubSingle;

  firestore: Firestore = inject(Firestore);
  constructor() {
    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach((element) => {
        console.log(element);
      });

      this.unsubList = onSnapshot(
        this.getSingleDocRef("notes", "cMIdj9VB5E78C56UxB9n"), (element) => {
        });
    });

    this.unsubSingle();
    this.unsubList();




    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach((element) => {
        console.log(element);
      });
    });
    this.items.unsubscribe();
  }

  getNotesRef() {
    return collection(this.firestore, "notes");
  }
  getTrashRef() {
    return collection(this.firestore, "trash");
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
