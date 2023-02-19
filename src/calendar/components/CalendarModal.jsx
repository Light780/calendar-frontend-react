import ReactDatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker.css'
import ReactModal from 'react-modal'
import { useCalendarModal } from '../../hooks/'
import { getEnvVariables } from '../../helpers'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

registerLocale('es', es)

if (getEnvVariables().VITE_MODE !== 'test') {
  ReactModal.setAppElement('#root')
}

export const CalendarModal = () => {
  const {
    title,
    notes,
    start,
    end,
    isDateModalOpen,
    titleClass,
    onInputChange,
    onDateChange,
    onCloseModal,
    onSubmit
  } = useCalendarModal()

  return (
    <ReactModal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className='modal'
      overlayClassName='modal-fondo'
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className='container' onSubmit={onSubmit}>

        <div className='form-group mb-2'>
          <label>Fecha y hora inicio</label>
          <ReactDatePicker
            locale='es'
            selected={start}
            onChange={(event) => onDateChange(event, 'start')}
            className='form-control'
            placeholder='Fecha inicio'
            dateFormat='Pp'
            showTimeSelect
            timeCaption='Hora'
          />
        </div>

        <div className='form-group mb-2'>
          <label>Fecha y hora fin</label>

          <ReactDatePicker
            locale='es'
            selected={end}
            minDate={start}
            onChange={(event) => onDateChange(event, 'end')}
            className='form-control'
            placeholder='Fecha fin'
            dateFormat='Pp'
            showTimeSelect
            timeCaption='Hora'
          />
        </div>

        <hr />
        <div className='form-group mb-2'>
          <label>Titulo y notas</label>
          <input
            type='text'
            value={title}
            className={`form-control ${titleClass}`}
            placeholder='Título del evento'
            name='title'
            autoComplete='off'
            onChange={onInputChange}
          />
          <small id='emailHelp' className='form-text text-muted'>Una descripción corta</small>
        </div>

        <div className='form-group mb-2'>
          <textarea
            type='text'
            className='form-control'
            placeholder='Notas'
            value={notes}
            rows='5'
            name='notes'
            onChange={onInputChange}
          />
          <small id='emailHelp' className='form-text text-muted'>Información adicional</small>
        </div>

        <button
          type='submit'
          className='btn btn-outline-primary btn-block'
        >
          <i className='far fa-save' />
          <span> Guardar</span>
        </button>

      </form>
    </ReactModal>
  )
}
