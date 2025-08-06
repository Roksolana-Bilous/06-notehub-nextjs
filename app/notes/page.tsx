import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api"; 

export default async function Notes() {
  const initialNotes: FetchNotesResponse = await fetchNotes({ page: 1, search: "" });
  
  return (
    <NotesClient initialNotes={initialNotes} />
  );
}