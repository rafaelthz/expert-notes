import logo from './assets/logo-nlw-expert.svg';
import { NoteCard } from './components/note-card';
import { NewNoteCard } from './components/new-note-card';
import { ChangeEvent, useState } from 'react';

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  function toNormalForm(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const filteredNotes = search !== ''
    ? notes.filter(
      note => toNormalForm(note.content.toLocaleLowerCase()).includes(toNormalForm(search.toLocaleLowerCase()))
    ) : notes

  return (
    <div className="mx-auto max-w-6xl my-16 space-y-6 px-5">
      <img src={logo} alt="Logotipo NLW Expert" />

      <form className="w-full space-y-3">
        <input
          type="text"
          placeholder='Busque em suas notas'
          className='w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
        <div className='h-px bg-slate-700' />
      </form>

      <div className='grid sm:md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}