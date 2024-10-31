export default function Header({ openStatsModal, openInfoModal }) {
  return (
    <div className='header flex flex-row items-center justify-between max-h-16 text-purple-500 sm:text-orange-500 sm:text-green-500 md:text-blue-500 lg:text-pink-500'>
      <div className='flex-none md:flex-1'></div>
      <h1 className='flex-1 font-bold text-3xl text-left md:text-center justify-center'>
        NWSLink
      </h1>
      <div className='flex-1 text-right space-x-4'>
        <button
          className='bg-nwslElectricBlue hover:bg-nwslNavy text-white px-4 py-2 text-xs sm:text-sm rounded font-bold'
          onClick={openStatsModal}
        >
          STATS
        </button>
        <button
          className='bg-nwslRed hover:bg-nwslDeepRed text-white px-4 py-2 text-xs sm:text-sm rounded font-bold'
          onClick={openInfoModal}
        >
          INFO
        </button>
      </div>
    </div>
  )
}
