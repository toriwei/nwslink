import InputMessage from './InputMessage'
export default function RowInput({ handleRowSubmit, inputError }) {
  return (
    <form onSubmit={handleRowSubmit}>
      <div className='flex justify-center space-x-2'>
        <label htmlFor='row' className='flex-1 text-right'>
          <span className='pr-2'>Select a tile [1]-[9]:</span>
        </label>
        <div className='flex flex-1 flex-col relative'>
          <input
            autoFocus
            type='number'
            className='border border-black rounded-md w-1/12'
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
