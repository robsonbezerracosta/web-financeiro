import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiDownload, FiExternalLink, FiTrash2, FiPrinter } from 'react-icons/fi'
import Swal from 'sweetalert2'
import Menu from '../../components/Menu'

import api from '../../services/api'

import '../../animate.css'
import './styles.css'
import logo from '../../assets/logoInterna.png'
export default function Profile() {
  const [shippings, setShippings] = useState([])
  const [list, setList] = useState([])

  const nameUser = localStorage.getItem('nameUser')
  const unity = localStorage.getItem('unity')
  const idUser = localStorage.getItem('idUser')

  const history = useHistory()

  if(!nameUser) {  history.push('/') }

  function logout() {
    Swal.fire({
      title: 'Deseja Sair ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, desejo sair!',
      showClass: {
        popup: 'animated fadeIn faster'
      },
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          position: 'top',
          text: 'Saindo, Até logo',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          onClose: (toast) => {
            localStorage.clear()
            history.push('/')
          }
        })
      }
    })
  }

  async function deleteShipping(id, registro) {
    await Swal.fire({
      title: 'Você tem certeza?',
      showClass: { popup: 'animated fadeIn faster border-pad' },
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {

        if (registro > 0) {

          Swal.fire({
            title: 'Erro!',
            text: 'Impossível excluir remessa que contenha documentos',
            icon: 'error',
            showClass: { popup: 'animated fadeIn faster border-pad' }
          })

        } else {

          Swal.fire({
            title: 'Ação bem sucedida',
            text: 'Remessa excluida com sucesso.',
            icon: 'success',
            showClass: { popup: 'animated fadeIn faster border-pad' },
            onOpen: () => {
              api.delete(`/shipping/${id}`, {
                headers: {
                  authorization: unity
                }
              })
              setShippings(shippings.filter(shipping => shipping.id !== id))
            }
          })

        }
      }
    })
  }

  useEffect(() => {
    api.get('shipping', { 
      headers: { authorization: unity }
    }).then(response => { 
      setShippings(response.data) 
    })
  }, [idUser, unity])

  useEffect(() => {
    api.get('/list').then(response => { 
      setList(response.data) 
    })
  }, [])

  return (
    <div className="profile-container">

      <header>
        <img src={logo} alt="Financeiro"/>
        <Link className="button" to="/shipping/new">NOVA REMESSA</Link>
        <button type="button" onClick={logout} ><FiPower size={18} color="#E02041" /></button>
      </header>
  
      <div className="profille-content">
        <Menu title={unity}>
          <button className="button" >{nameUser}</button>
          <div className="content-button">
          <button className="button" >Gerar lista</button>
          </div>
        </Menu>

        <div className="grid-content">
          <div className="content">
            <h2>Remessas cadastradas</h2>
            <ul>
              {shippings.map(shipping => (
                <li key={shipping.id} >
                  <strong>Número</strong>
                  <p>{shipping.number}</p>
                  <strong>Destino</strong>
                  <p>{shipping.destiny}</p>
                  <strong>Documento Interno</strong>
                  <p>{shipping.doc_external}</p>
                  <strong>Descrição</strong>
                  <p>{shipping.description}</p>
                  <i><span>-</span>Contém {shipping.shippingList.length} Documento(s)</i>

                  <button><FiDownload size={18} color="rgb(0, 185, 93)"  /></button>
                  <button><Link to={`/document/new/${shipping.id}`} ><FiExternalLink size={18} color="rgb(19, 141, 255)"  /></Link></button>
                  <button onClick={() => deleteShipping(shipping.id, shipping.shippingList.length)} ><FiTrash2 size={18} color="#E02041"  /></button>

                </li>
              ))}
            </ul>
          </div>

          <div className="content-list">
            <h2>Lista de documentos</h2>
            <ul>
              {list.map(keys => (
                <li key={keys.id}>
                  <p>{keys.key}
                    <span>{keys.unity}</span>
                    <Link to={`/administrator/${keys.id}`} >
                      <FiExternalLink size={18} color="rgb(30, 144, 255, 1)"  />
                    </Link>
                    <FiPrinter size={18} color="rgb(254, 107, 139)" />
                    <FiTrash2 size={18} color="#E02041"  />
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}