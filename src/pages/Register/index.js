import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'

import api from '../../services/api'

import './styles.css'

import logoImg from '../../assets/logo.png'

export default function Register() {
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
  })

  const onSubmit = async (data, e) => {
    try {
      await api.post('/newuser', data).then(response => {
        Toast.fire({
          text: 'Conectado com sucesso',
          onOpen: () => {
            e.target.reset()
          },
          onClose: () => {
            history.push('/')
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
    <div className="register-container">
      <div className="content">

        <section className="content-logo">
          <img src={logoImg} className="logo-1" alt="Financeiro logo"/>
        </section>

        <section className="form">
          
          <form onSubmit={handleSubmit(onSubmit)} >
            <h1>Cadastro de Usuários</h1>

            <input  placeholder="Nome completo" 
                    autoComplete="off"
                    name="name"
                    ref={register({ required: true })} />

            <input  type="email" 
                    placeholder="E-mail" 
                    autoComplete="off"
                    name="email"
                    ref={register({ required: true })} />

            <input  placeholder="ID (cpf)" 
                    autoComplete="off"
                    name="code"
                    ref={register({ required: true, minLength: 11, maxLength: 11 })} />

            <div className="input-group">
              <input  placeholder="Nome de guerra" 
                      autoComplete="off"
                      name="war_name"
                      ref={register({ required: true })} />

              <input  placeholder="Graduação" 
                      autoComplete="off"
                      name="patent"
                      ref={register({ required: true })} />
            </div>

            <input  placeholder="Unidade administrativa" 
                    autoComplete="off"
                    name="unity"
                    ref={register({ required: true })} />

            <input  placeholder="Sua Senha" 
                    name="password"
                    type="password" 
                    ref={register({ required: true, minLength: 8 })}
                    autoComplete="off"/>

            <button type="submit"  className="button">Cadastrar</button>
            <Link to="/" className="back-link"><FiArrowLeft size={20} color="#E02041"/>Retornar ao login</Link>
          </form>
        </section>
      </div>
    </div>
  )
}