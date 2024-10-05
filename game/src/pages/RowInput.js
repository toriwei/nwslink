import InputMessage from './InputMessage'
export default function RowInput({ handleRowSubmit, inputError }) {
  return (
    <form onSubmit={handleRowSubmit}>
      <div className='flex justify-center'>
        <label>
          <span className='mr-4'>Enter a number 1-9:</span>
        </label>
        <div className='flex flex-col relative'>
          <input
            autoFocus
            type='number'
            className='border'
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
