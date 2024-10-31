export default function Modal({
  closeModal,
  title,
  children,
  color,
  secondaryColor,
}) {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75 text-sm'>
      <div className='animate-slideDown relative flex flex-col w-4/5 md:w-1/2 h-3/4 p-4 pb-12 bg-white rounded-lg text-center'>
        <button className='text-right' onClick={closeModal}>
          <span
            className={`bg-${color} hover:bg-${secondaryColor} text-white rounded px-3 text-xl pb-[1px]`}
          >
            &times;
          </span>
        </button>
        <div className='modal-header text-center mb-4'>
          <h2 className='text-3xl font-bold '>{title}</h2>
        </div>

        <div className='modal-content overflow-auto flex flex-col w-full h-full px-4 md:px-8 pb-4 text-left space-y-6'>
          {children}
        </div>
      </div>
    </div>
  )
}
