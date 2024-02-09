import * as Dialog from '@radix-ui/react-dialog'
import { X, PlusCircle, Mic } from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState(() => {
    const draftOnStorage = localStorage.getItem('draft')

    if (draftOnStorage) {
      return draftOnStorage
    }

    return ''
  })
  const [isOpenedEditor, setIsOpenedEditor] = useState(false)

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpenedEditor(false)
        handleStopRecording()
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    localStorage.setItem('draft', event.target.value)
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content !== '') {
      setIsRecording(false)
      onNoteCreated(content)
      setContent('')
      setIsOpenedEditor(false)
      localStorage.setItem('draft', '')
      toast.success('Nota criada com sucesso :)', {
        duration: 2500
      })
    } else {
      toast.error('Conteúdo da nota vazio. Grave um áudio ou escreva um texto para salvar.', {
        duration: 2500
      })
    }
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a gravação por áudio.')
      return
    }

    setIsRecording(true)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new speechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '')

      setContent(transcript)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root open={isOpenedEditor} onOpenChange={setIsOpenedEditor}>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 max-h-[120px] md:h-full md:max-h-[250px] px-4 md:px-5 gap-2 overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <div className='flex flex-row items-center gap-2'>
          <PlusCircle className='size-4' />
          <span className='text-sm md:text-md font-medium text-slate-200'>
            Adicionar nova nota
          </span>
        </div>
        {content !== '' &&
          <p className='text-sm leading-6 text-slate-400 w-full break-words overflow-hidden md:overflow-scroll pb-10 whitespace-pre-wrap'>
            <span className='text-yellow-500'>Rascunho: </span>{content}
          </p>
        }
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden'
          onInteractOutside={() => {
            setIsOpenedEditor(false)
            handleStopRecording()
          }}
        >
          <Dialog.Close onClick={handleStopRecording} className='absolute top-o right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            < X className='size-5' />
          </Dialog.Close>

          <form className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <div className='space-y-1'>
                <span className='text-md font-medium text-slate-200'>
                  Adicionar nota
                </span>

                <p className='text-sm leading-6 text-slate-400'>
                  Digite seu texto abaixo ou grave um áudio
                </p>
              </div>

              <textarea
                autoFocus={!isRecording}
                className='text-md leading-6 text-slate-300 bg-transparent resize-none flex-1 outline-none pb-40'
                onChange={handleContentChanged}
                value={content}
                ref={ref => !isRecording && ref && ref.focus()}
                onFocus={(e) => !isRecording && e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
              />
            </div>

            {isRecording ?
              <button
                type='button'
                onClick={handleStopRecording}
                className='absolute right-0 bottom-[64px] rounded-full w-fit inline-flex items-center gap-3 bg-slate-950 p-5 mr-3 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300'
              >
                <div className='size-2 rounded-full bg-red-500 animate-ping' />
                Clique para parar de gravar
              </button>
              :
              <button
                type='button'
                onClick={handleStartRecording}
                className='absolute right-0 bottom-[64px] rounded-full w-fit bg-slate-900 p-5 mr-3 text-center text-sm text-slate-300 outline-none font-semibold hover:text-slate-100'
              ><Mic className='size-5' /></button>

            }
            <button
              type='button'
              onClick={handleSaveNote}
              disabled={isRecording}
              className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-semibold 
                    hover:bg-lime-500
                    focus-visible:underline focus-visible:bg-lime-500
                    disabled:cursor-not-allowed disabled:bg-lime-700 disabled:text-lime-900'
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}