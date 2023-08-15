import PropTypes from 'prop-types'
import { useState } from 'react'
import { AUTHOR } from '../../constants'
import { useDispatch } from 'react-redux'
import { addMessage, addMessageWithReply } from '../../store/messages/actions'
import { useParams } from 'react-router-dom'

import { push } from "firebase/database";
import { getMessageListById } from '../../services/firebase'

import Button from '@mui/material/Button'


export function Form() {
  const [text, setText] = useState('')
  const dispatch = useDispatch()
  const { chatId } = useParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addMessageWithReply(chatId, {
      author: AUTHOR.user,
      text
    }))
    push(getMessageListById(chatId), {
      author: AUTHOR.user,
      text
    })

    setText('')
  }

  return (
    <>
      <h1>Отпарвка сообщения</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button 
        variant="contained" 
        color="success"
        type="submit"
        size="small">
        Add message
      </Button>
      </form>

    </>
  )
}

Form.propTypes = {
  addMessage: PropTypes.func
}