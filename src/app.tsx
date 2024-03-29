import logo from './assets/logo-nlw-expert.svg';
import { NoteCard } from './components/note-card';
import { NewNoteCard } from './components/new-note-card';
import { ChangeEvent, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { toast } from 'sonner'
import { X } from 'lucide-react'

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

    toast.success('Nota apagada com sucesso.', {
      duration: 2500
    })
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  function handleDeleteFilteredNotes() {
    let notFilteredNotes = search !== ''
      ? notes.filter(
        note => !toNormalForm(note.content.toLocaleLowerCase()).includes(toNormalForm(search.toLocaleLowerCase()))
      ) : []

    setNotes(notFilteredNotes);

    localStorage.setItem('notes', JSON.stringify(notFilteredNotes))

    setSearch('')

    toast.success('Notas apagadas com sucesso.', {
      duration: 2500
    })
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
      <div className='flex flex-row items-center justify-between'>
        <img src={logo} alt="Logotipo NLW Expert" />

        <div className='flex flex-row items-center gap-1'>
          {(filteredNotes.length > 0 || search !== '') &&
            <span className='text-xs md:text-sm font-medium text-slate-400'>{notesQuantityText}</span>
          }
          {filteredNotes.length > 0 &&
            <AlertDialog.Root>
              <AlertDialog.Trigger className='text-xs md:text-sm inline-flex items-center gap-1 font-medium text-red-300 hover:text-red-400 hover:underline focus-visible:text-red-400 focus-visible:underline'>
                [Apagar]
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className='inset-0 fixed bg-black/50' />
                <AlertDialog.Content className='fixed inset-auto p-5 gap-4 w-[90vw] max-w-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 rounded-md flex flex-col flex-1 outline-none overflow-hidden'>
                  <div className='space-y-2'>
                    <AlertDialog.Title className='text-md font-medium text-slate-100'>Você deseja apagar {notesQuantityText}?</AlertDialog.Title>
                    <AlertDialog.Description className='text-sm leading-6 text-slate-300'>
                      Essa ação não poderá ser desfeita. Caso tenha filtrado pela busca, apenas as notas filtradas serão apagadas.
                    </AlertDialog.Description>
                  </div>
                  <div className='inline-flex w-full justify-center items-center gap-3'>
                    <AlertDialog.Cancel className="w-2/5 sm:w-full bg-slate-200 rounded-md px-3 py-2 text-slate-700 text-sm font-medium hover:bg-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                      Não apagar
                    </AlertDialog.Cancel>
                    <AlertDialog.Action
                      className="w-3/5 sm:w-full bg-red-100 rounded-md px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      onClick={handleDeleteFilteredNotes}>
                      Sim, quero apagar
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          }
        </div>
      </div>

      <form className="w-full space-y-2 md:space-y-3">
        <div className='flex flex-row justify-between items-center'>
          <input
            type="text"
            placeholder='Busque em suas notas'
            className='bg-transparent w-full text-lg md:text-2xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
            onChange={handleSearch}
            value={search}
          />
          {search && <button type='button' className='text-slate-500 hover:text-slate-400' onClick={() => setSearch('')}><X className='size-6' /></button>}
        </div>
        <div className='h-px bg-slate-700' />
      </form >

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-max-[120px] md:auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div >
  )
}