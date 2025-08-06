"use client"
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

interface NotesClientProps {
    initialNotes: FetchNotesResponse;
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSearch = useDebouncedCallback((search: string) => { setDebouncedSearch(search) }, 300);

  const handleSearchCange = (search: string) => {
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };
 
 const { data, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({
      page,
      perPage: 12,
      search: debouncedSearch,
    }),
     placeholderData: keepPreviousData,
     initialData: initialNotes
  }
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchCange} />
       {data && data.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} type="button" onClick={() => setModalIsOpen(true)}>Create +</button>
      </header>
      {isSuccess && data?.data?.length > 0 ? (
        <NoteList notes={data.data} />)
        : (
          <p>No notes found</p>
        )
      }
      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <NoteForm onClose={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </div>
    );
}


