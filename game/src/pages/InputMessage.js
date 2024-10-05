export default function InputMessage({ message, isError }) {
  console.log(message)
  return (
    <p
      className={`absolute -bottom-5 text-${
        isError ? 'red-500' : 'green-500'
      } text-sm text-nowrap`}
    >
      {message}
    </p>
  )
}
