import InputMessage from './InputMessage'
export default function RowInput({ handleRowSubmit, inputError }) {
  return (
    <form onSubmit={handleRowSubmit}>
      <div className='flex justify-center'>
        <label className='flex-1 text-right'>
          <span className='pr-4'>Enter a number 1-9:</span>
        </label>
        <div className='flex flex-1 flex-col relative'>
          <input
            autoFocus
            type='number'
            className='border w-1/12'
            name='row'
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
