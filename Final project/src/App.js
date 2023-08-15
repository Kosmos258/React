import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { nanoid } from 'nanoid'

import { defaultContext, ThemeContext } from './utils/ThemeContext'
import { store, persistor } from './store'
import { auth } from './store/profile/actions'
import { firebaseAuth, messagesRef } from './services/firebase'
import { onValue } from "firebase/database";

import { Header } from './components/Header/Header'
import { MainPage } from './pages/MainPage'
import { ProfilePage } from './pages/ProfilePage'
import { AboutWithConnect } from './pages/AboutPage'
import { ChatsPage } from './pages/ChatsPage/ChatsPage'
import { ChatList } from './components/ChatList/ChatList'
import { Articles } from './pages/Articles'
import { SingIn } from './pages/SingIn'
import { SignUp } from './pages/SignUp'
import { PrivateRoute } from './utils/PriviteRoute'
import { PublicRoute } from './utils/PublicRoute'

export function App () {
  const dispatch = useDispatch()

  const [theme, setTheme] = useState(defaultContext.theme)

  const [messagesDB, setMessagesDB] = useState({})
  const [chats, setChats] = useState([])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(auth(true))
      } else {
        dispatch(auth(false))
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      console.log('snapshot', data)

      const newChats = Object.entries(data).map((item) => ({
        name: item[0],
        messages: item[1].messageList
      }))

      setMessagesDB(data)
      setChats(newChats)
      console.log('newChats', newChats)
      console.log('messagesDB', messagesDB)
    })
  }, [])

  return (
    <>
      <PersistGate persistor={persistor}>
        <ThemeContext.Provider value={{
          theme,
          toggleTheme
        }}>
          <Routes>
            <Route path='/' element={<Header />}>
              <Route index element={<MainPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="about" element={<AboutWithConnect />} />
              <Route path="chats" element={<PrivateRoute />}>
                <Route
                  index
                  element={<ChatList chats={chats} messagesDB={messagesDB} />}
                />
                <Route
                  path=":chatId"
                  element={<ChatsPage chats={chats} messagesDB={messagesDB} />}
                />
              </Route>
              <Route path="articles" element={<Articles />} />
              <Route path="signin" element={<PublicRoute component={<SingIn />} />} />
              <Route path="signup" element={<SignUp />} />
            </Route>

            <Route path="*" element={<h2>404 Page not FOUND</h2>} />
          </Routes>
        </ThemeContext.Provider>
      </PersistGate>
    </>
  )
}