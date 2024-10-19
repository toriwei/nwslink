export default function SpacedLetters({ parts }) {
  return (
    <div className='space-x-4 sm:space-x-6 lg:space-x-8'>
      {parts.map((part, i) => (
        <span key={i} className='space-x-1 sm:space-x-1.5 lg:space-x-2'>
          {part.split('').map((char, j) => (
            <span key={j}>{char}</span>
          ))}
        </span>
      ))}
    </div>
  )
}
