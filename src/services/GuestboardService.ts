// services/GuestboardService
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

export interface GuestNoteInterface {
  id?: string;
  name: string;
  city: string;
  date: Date;
  message?: string;
  position: {
    x: number;
    y: number;
  };
}

const COLLECTION_NAME = "guests";

export async function addGuestNote(
  note: Omit<GuestNoteInterface, "id" | "date">,
): Promise<string | null> {
  try {
    if (!db) console.error("* DB was not successfully initialized.");

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name: note.name,
      city: note.city,
      content: note.message,
      position: note.position,
      date: Timestamp.now()
    });

    console.log("+ Note was added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    let errorMessage = "";
    errorMessage += "* There was an error adding a note.\n";
    errorMessage += error;
    console.error(errorMessage);
    return null;
  }
}

export async function getGuestNotes(): Promise<GuestNoteInterface[]> {
  try {
    if (!db) console.error("* DB was not successfully initialized.");

    const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const notes: GuestNoteInterface[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        name: data.name,
        city: data.city,
        date: data.date.toDate(),
        message: data.content,
        position: data.position,
      });
    });

    return notes;
  } catch (error) {
    let errorMessage = "";
    errorMessage += "* There was an error fetching notes.\n";
    errorMessage += error;
    console.error(errorMessage);
    return [];
  }
}

export function TransformToGuestNote(doc: DocumentData, id: string): GuestNoteInterface {
  return {
    id,
    name: doc.name || "",
    city: doc.city || "",
    date: doc.date.toDate() || new Date(),
    message: doc.content || "",
    position: doc.position || {x: 0, y: 0},
  };
}
