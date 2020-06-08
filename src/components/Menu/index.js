import React from 'react'
import { FiCircle } from 'react-icons/fi'

import './styles.css'

export default function Menu(props) {
  return (
    <div className="menu-container" >
      <button className="button" >
        <FiCircle size={20} color="#007140"/>
        <FiCircle size={20} color="#e6a338"/>
        <FiCircle size={20} color="#5ca0cd"/>
      </button>
      <button className="button" >{props.title}</button>
      {props.children}
    </div>
  )
}