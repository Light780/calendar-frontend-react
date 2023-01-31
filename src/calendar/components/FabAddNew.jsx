import { addHours } from 'date-fns'
import { useCalendarStore, useUiStore } from '../../hooks'

export const FabAddNew = () => {
  const { openDateModal } = useUiStore()
  const { onSetActiveEvent } = useCalendarStore()

  const handleClick = () => {
    onSetActiveEvent({
      title: '',
      notes: '',
      start: new Date(),
      end: addHours(new Date(), 2),
      user: {
        _id: '123ABC',
        name: 'Bruno'
      }
    })
    openDateModal()
  }

  return (
    <button
      className='btn btn-primary fab'
      onClick={handleClick}
    >
      <i className='fas fa-plus' />
    </button>
  )
}
