export default function InputMessage({ message, isError }) {
  return (
    <p
      className={`absolute -bottom-5 ${
        isError ? 'text-red-500' : 'text-green-500'
      } text-sm text-nowrap`}
    >
      {message}
    </p>
  )
}
