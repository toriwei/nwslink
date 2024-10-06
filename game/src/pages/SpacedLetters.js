export default function SpacedLetters({ parts }) {
  return (
    <div className='space-x-8'>
      {parts.map((part, i) => (
        <span key={i} className='space-x-2'>
          {part.split('').map((char, j) => (
            <span key={j}>{char}</span>
          ))}
        </span>
      ))}
    </div>
  )
}
