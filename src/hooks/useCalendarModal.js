import { addHours, differenceInSeconds } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useCalendarStore, useUiStore } from './'

export const useCalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore()
  const { activeEvent, startSavingEvent, onSetActiveEvent } = useCalendarStore()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2)
  })

  const titleClass = useMemo(() => {
    if (!formSubmitted) return ''

    return formValues.title.length > 0
      ? ''
      : 'is-invalid'
  }, [formValues.title, formSubmitted])

  useEffect(() => {
    if (activeEvent !== null) {
      setFormValues({ ...activeEvent })
    }
  }, [activeEvent])

  const onInputChange = ({ target }) => {
    const { name, value } = target
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event
    })
  }

  const onCloseModal = () => {
    closeDateModal()
    onSetActiveEvent(null)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setFormSubmitted(true)

    const difference = differenceInSeconds(formValues.end, formValues.start)
    if (difference < 0 || isNaN(difference)) {
      Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
      return
    }
    if (formValues.title.length <= 0) return
    await startSavingEvent(formValues)
    closeDateModal()

    setFormSubmitted(false)
  }

  return {
    isDateModalOpen,
    titleClass,
    ...formValues,
    onInputChange,
    onSubmit,
    onCloseModal,
    onDateChange
  }
}
