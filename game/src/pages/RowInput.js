import InputMessage from './InputMessage'
export default function RowInput({ handleRowSubmit, inputError }) {
  return (
    <form onSubmit={handleRowSubmit} className='w-full'>
      <div className='flex w-full justify-center'>
        <label htmlFor='row' className='flex-1 text-right'>
          <span className='hidden sm:block sm:pr-4 pt-1'>
            Select a tile [1]-[9]:
          </span>
          <div className='flex flex-col sm:hidden px-4'>
            <span className='sm:hidden'>Select a tile</span>
            <span className='sm:hidden'>[1]-[9]:</span>
          </div>
        </label>
        <div className='flex flex-1 flex-col relative justify-end'>
          <input
            autoFocus
            type='number'
            className='border border-black rounded-md w-[50px]'
            name='row'
            id='row'
            min='1'
            max='9'
            autoComplete='off'
            onKeyDown={(e) =>
              ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()
            }
          />
          {inputError && <InputMessage message={inputError} isError={true} />}
        </div>
      </div>
    </form>
  )
}
