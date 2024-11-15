export default function InputError({ inputError }) {
  return (
    <p className='absolute -bottom-5 text-red-500 text-xs md:text-sm'>
      {inputError}
    </p>
  )
}
