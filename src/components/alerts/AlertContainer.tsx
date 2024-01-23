import { useAlert } from '../../context/AlertContext'
import { Alert } from './Alert'

export const AlertContainer = () => {
  const { message, status, isVisible, setIsVisible } = useAlert()

  return (
    <Alert
      isOpen={isVisible}
      setIsOpen={setIsVisible}
      message={message || ''}
      variant={status}
    />
  )
}
