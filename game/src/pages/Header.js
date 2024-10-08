export default function Header({ openStatsModal, openInfoModal }) {
  return (
    <div className='header flex flex-row items-end justify-between max-h-16'>
      <div className='flex-1'></div>
      <h1 className='flex-1 font-bold text-3xl text-center justify-center'>
        NWSLink
      </h1>
      <div className='flex-1 text-right space-x-4'>
        <button
          className='bg-[#0036FF] hover:bg-[#001E60] text-white px-4 py-2 text-sm rounded'
          onClick={openStatsModal}
        >
          STATS
        </button>
        <button
          className='bg-[#EE1B4B] hover:bg-[#CB333B] text-white px-4 py-2 text-sm rounded'
          onClick={openInfoModal}
        >
          INFO
        </button>
      </div>
    </div>
  )
}
