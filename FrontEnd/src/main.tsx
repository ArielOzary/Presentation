import React from 'react'

import App from 'containers'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './locales'

import 'antd/dist/reset.css'
import 'assets/styles/global.scss'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
