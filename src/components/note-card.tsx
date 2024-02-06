export function NoteCard() {
  return (
    <button className='rounded-md text-left flex-col bg-slate-800 p-5 space-y-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
      <span className='text-small font-medium text-slate-300'>
        há 4 dias
      </span>
      <p className='text-small leading-6 text-slate-400'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi cupiditate, delectus quos animi molestias eveniet quae sapiente officia eius consequatur quam suscipit. Ex similique dignissimos sequi rem aperiam dolorem cupiditate!
      </p>
      <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/0 to-black/60 pointer-events-none' />
    </button>
  )
}