import * as Dialog from '@radix-ui/react-dialog'
import { X, PlusCircle } from 'lucide-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')
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

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    // if (event.target.value === '') {
    //   setShouldShowOnboarding(true)
    // }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content !== '') {
      onNoteCreated(content)
      setContent('')
      setShouldShowOnboarding(true)
      setIsOpenedEditor(false)
      toast.success('Nota criada com sucesso :)')
    } else {
      toast.error('Conteúdo da nota vazio. Grave um áudio ou escreva um texto para salvar.')
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
    setShouldShowOnboarding(false)

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

    if (content === '') {
      setShouldShowOnboarding(true)
    }
  }

  return (
    <Dialog.Root open={isOpenedEditor} onOpenChange={setIsOpenedEditor}>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-700 max-h-[120px] md:h-full md:max-h-[250px] p-4 md:p-5 gap-2 overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <div className='flex flex-row items-center gap-2'>
          <PlusCircle className='size-4' />
          <span className='text-sm md:text-md font-medium text-slate-200'>
            Adicionar nova nota
          </span>
        </div>
        {content !== '' &&
          <p className='text-sm leading-6 text-slate-400 w-full break-words overflow-hidden md:overflow-scroll'>
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
          }}>
          <Dialog.Close onClick={handleStopRecording} className='absolute top-o right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            < X className='size-5' />
          </Dialog.Close>

          <form className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-md font-medium text-slate-200'>
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece <button type='button' onClick={handleStartRecording} className='text-lime-400 font-medium hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='text-lime-400 font-medium hover:underline'>utilize apenas texto</button>.
                </p>
              ) : (
                <textarea
                  autoFocus={!isRecording}
                  className='text-md leading-6 text-slate-300 bg-transparent resize-none flex-1 outline-none'
                  onChange={handleContentChanged}
                  value={content}
                  ref={ref => !isRecording && ref && ref.focus()}
                  onFocus={(e) => !isRecording && e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-semibold hover:text-slate-100'
              >
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando (clique para cancelar)
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSaveNote}
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-semibold hover:bg-lime-500 focus-visible:underline focus-visible:bg-lime-500'
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}