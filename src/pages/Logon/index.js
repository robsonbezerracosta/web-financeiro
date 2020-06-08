import React from 'react'
import {FiArrowRight} from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'

import api from '../../services/api'

import './styles.css'
import logoImg from '../../assets/logo.png'


export default function Logon() {
  const { register, handleSubmit } = useForm()

  const history = useHistory()

  const Toast = Swal.mixin({
    toast: false,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    allowOutsideClick: false,
    backdrop: 'rgba(0, 0, 0, 0.1)',
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    onClose: (toast) => {
      history.push('/profile')
    }
  })
  const onSubmit = async (data, e) => {
    try {
      await api.post('/login', data).then(response => {
        localStorage.setItem('idUser', response.data.id)
        localStorage.setItem('nameUser', response.data.name)
        localStorage.setItem('unity', response.data.unity)

        Toast.fire({
          text: 'Conectado com sucesso',
          onOpen: () => {
            e.target.reset()
          }
        })
      })  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        background: '#dcdce6',
        title: 'Houve um problema',
        text: 'Seus dados estão incorretos',
        showConfirmButton: true,
      })
    }
  }

  
  return (
    <div className="logon-container">
      <div className="content">
      <section className="content-logo">
        <img src={logoImg} className="logo-1" alt="Financeiro"/>
      </section>
      <section className="form">
      <p>Sistema de apoio administrativo</p>
      <p> Batalhão de Polícia do Exército de Brasília</p>
      
        <form onSubmit={handleSubmit(onSubmit)} >
          <h1>Conecte-se</h1>
  
          <input  placeholder="Seu ID" 
                  autoComplete="off" 
                  name="code"
                  ref={register({ required: true, minLength: 11, maxLength: 11 })} />

          <input  placeholder="Sua Senha" 
                  name="password"
                  type="password" 
                  ref={register({ required: true, minLength: 8 })}
                  autoComplete="off"/>

          <button className="button" type="submit">Entrar</button>
          <Link to="/register" className="back-link" ><FiArrowRight size={20} color="#E02041" />Não tenho cadastro</Link>
        </form>
      </section>
      </div>
    </div>
  )
}