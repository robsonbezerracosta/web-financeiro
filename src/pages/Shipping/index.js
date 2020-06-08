import React from 'react'
import Menu from '../../components/Menu'
import { Link, useHistory } from 'react-router-dom'
import InputMask from "react-input-mask"
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

import api from '../../services/api'

import './styles.css'
export default function Shipping() {
  const { register, handleSubmit } = useForm()
  const history = useHistory()
  const unity = localStorage.getItem('unity')
  const nameUser = localStorage.getItem('nameUser')

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const onSubmit = async (data, e) => { 
    await api.post('/shipping', data).then(response => {
      response.data.created
      ? Toast.fire({
          toast: false,
          text: 'Remessa incluida com sucesso',
          showConfirmButton: false,
          showClass: {
            popup: 'animated bounceInDown faster'
          },
          onOpen: (toast) => {
            e.target.reset()
          },
          onClose: () => {
            history.push(`/document/new/${response.data.shipping.id}`)
          }
        })
      : Toast.fire({
        icon: 'warning',
        showClass: {
          popup: 'animated bounceInDown faster'
        },
        title: 'Remessa já existe'
      })
    })
  }

  return (
    <div className="shipping-container" >
      <Menu title="Remessa" >
        <Link to="/profile" className="button">Início</Link>
      </Menu>
      <div className="shipping-content">
        <span>Nova remessa</span>
        <form onSubmit={handleSubmit(onSubmit)} >

          <p>Usuário<span>{nameUser}</span></p>
          <p>Unidade<span>{unity}</span></p>

          <div className="input-group">

            <InputMask  
                    mask="9999RM999999"
                    maskPlaceholder={null}
                    autoComplete="off"
                    name="number"
                    placeholder="Número"
                    ref={register({ required: true, minLength: 12, maxLength: 12 })} />

            <input  placeholder="Destino"
                    name="destiny"
                    autoComplete="off"
                    ref={register({ required: true })} />

            <input  name="emitter"
                    readOnly={true} 
                    hidden={true}
                    ref={register({ required: true })}
                    value={unity} />

            <InputMask  
                    mask="DiEx - 999"
                    autoComplete="off"
                    maskPlaceholder={null}
                    name="doc_external"
                    placeholder="Documento interno"
                    ref={register({ required: true, minLength: 10, maxLength: 10 })}/>
          </div>
          <textarea cols="40" 
                    rows="1" 
                    name="description" 
                    placeholder="Descrição"
                    ref={register({ required: true })} ></textarea>
          <footer>
            <button type="submit" className="button" >Incluir</button>
          </footer>
        </form>
      </div>
    </div>
  )
}