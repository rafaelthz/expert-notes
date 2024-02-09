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
      const notesArray = JSON.parse(notesOnStorage)
      return notesArray
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

  const notesQuantityText = filteredNotes.length === 1 ? `${filteredNotes.length} nota` : `${filteredNotes.length} notas`

  return (
    <div className="mx-auto max-w-6xl my-4 md:my-16 space-y-4 md:space-y-6 px-4">
      <img src={logo} alt="Logotipo NLW Expert" />

      <form className="w-full space-y-2 md:space-y-3">
        <div className='flex flex-row items-center justify-between'>
          <input
            type="text"
            placeholder='Busque em suas notas'
            className='bg-transparent text-lg md:text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
            onChange={handleSearch}
          />
          <span className='text-xs md:text-sm font-light text-slate-400'>{notesQuantityText}</span>
        </div>
        <div className='h-px bg-slate-700' />
      </form>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-max-[120px] md:auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}