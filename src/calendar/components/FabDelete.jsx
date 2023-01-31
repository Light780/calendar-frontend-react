import { useCalendarStore, useUiStore } from '../../hooks'

export const FabDelete = () => {
  const { isDateModalOpen } = useUiStore()
  const { startDeleteEvent, hasEventSelected } = useCalendarStore()

  const handleClick = async () => {
    await startDeleteEvent()
  }

  return (
    <button
      className='btn btn-danger fab-delete'
      onClick={handleClick}
      style={{ display: hasEventSelected && !isDateModalOpen ? '' : 'none' }}
    >
      <i className='fas fa-trash' />
    </button>
  )
}
