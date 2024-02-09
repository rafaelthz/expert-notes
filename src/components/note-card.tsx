import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { FaTrash } from "react-icons/fa"


interface NoteCardProps {
  note: {
    id: string
    date: Date
    content: string
  },

  onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 h-[120px] md:h-[250px] px-4 pt-4 pb-1 md:px-5 md:pt-5 md:pb-2 gap-2 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-xs font-medium text-slate-400'>
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className='text-sm leading-6 text-slate-300 h-full w-full break-words overflow-hidden md:overflow-scroll'>
          {note.content}
        </p>
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/0 to-black/60 pointer-events-none' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden'>
          <Dialog.Close className='absolute top-o right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            < X className='size-5' />
          </Dialog.Close>

          <div className='flex flex-1 flex-col gap-3 px-5 pt-5 h-full'>
            <span className='text-sm font-medium text-slate-400'>
              {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
            </span>
            <p className='text-md leading-6 text-slate-300 break-words overflow-scroll h-[calc(100%-96px)] pb-4'>
              {note.content}
            </p>
          </div>

          <button
            type='button'
            onClick={() => onNoteDeleted(note.id)}
            className='w-full absolute bottom-0 inline-flex items-center justify-center gap-1.5 bg-slate-800 py-4 text-center text-sm text-red-400 outline-none font-medium hover:underline'
          >
            <FaTrash className='w-3 h-3' /> Apagar essa nota
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}