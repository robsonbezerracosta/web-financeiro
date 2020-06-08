import React, { useState } from 'react'
import InputMask from "react-input-mask"
import { useForm } from 'react-hook-form'

import './styles.css'
import '../../animate.css'

export default function Modal(props) {
  const { register, handleSubmit } = useForm()
  const [notaEmpenho, setNotaEmpenho] = useState('')
  const [notaSistema, setNotaSistema] = useState('')
  const [ordemBancaria, setOrdemBancaria] = useState('')

  const onSubmit = async (data, e) => {

  }

  return(
    <div className="document-container" >
      <div id="modal" className="modal-container">
        <div className="modal animated fadeIn faster">
          <div className="modal-header">
            <span>Pré-Doc</span>
          </div>
          <form className="modal-form" onSubmit={handleSubmit(onSubmit)} >
          <p>Credor<span></span></p>
          <p>Documento<span></span></p>
          <div className="modal-content" spellCheck="false">

            <div className="input-group-dc">
              <InputMask 
                mask="9999NE999999"
                maskPlaceholder={'____NE______'}
                autoComplete="off"
                placeholder="Nota de empenho"
                name="note_commitment"
                ref={register({ required: true, minLength: 12, maxLength: 12 })}
                value={notaEmpenho}
                onChange={e => setNotaEmpenho(e.target.value)}/>
            </div>

            <div className="input-group-dc">
              <InputMask  
                mask="9999NS999999"
                maskPlaceholder={'____NS______'}
                autoComplete="off"
                placeholder="Nota de sistema"
                name="system_note"
                ref={register({ required: true, minLength: 12, maxLength: 12 })}
                value={notaSistema}
                onChange={e => setNotaSistema(e.target.value)}/>
            </div>

            <div className="input-group-dc">
              <InputMask  
                mask="9999OB999999"
                maskPlaceholder={'____OB______'}
                autoComplete="off"
                placeholder="Ordem bancária"
                name="bank_order"
                ref={register({ required: true, minLength: 12, maxLength: 12 })}
                value={ordemBancaria}
                onChange={e => setOrdemBancaria(e.target.value)}/>
            </div>

          </div>
          <footer>
            {props.children}
          </footer>
          </form>
        </div>
      </div>
    </div>
  )
}