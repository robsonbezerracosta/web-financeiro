import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import InputMask from "react-input-mask"
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import { FaRegTrashAlt, FaTools } from 'react-icons/fa'
import Menu from '../../components/Menu'

import './styles.css'
import '../../animate.css'

import api from '../../services/api'

import Modal from '../../components/Modal'

export default function Document() {
  const { register, handleSubmit } = useForm()
  const [value, setValue] = useState('')
  const [shipping, setShipping] = useState({})
  const [list, setList] = useState([])
  const [idCredor, setIdCredor] = useState('')
  const [creditor, setCreditor] = useState('')
  const [codigo, setCodigo] = useState('')
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const [contador, setContador] = useState('')
  const [showResults, setShowResults] = useState(false)
  const { id } = useParams()
  const unity = localStorage.getItem('unity')
  const nameUser = localStorage.getItem('nameUser')
  const history = useHistory()
  
  if(!nameUser) {  history.push('/') }

  function maskValue(valor) {
    valor = valor.replace(/\D/g,"")
    var len = valor.length
    if (len > 2) { valor = valor.replace(/(\d{2})$/,'.$1') }
    setValue(valor)
  }

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
  
  async function handleCredor(e) {
    setCodigo(e.target.value)
    const data = {  codigoCredor: e.target.value }

    try {
      const result = await api.post('/creditor/seach', data)
      setCreditor(result.data)
      setIdCredor(result.data.id)
    } catch (error) {
      setCreditor('')
      setIdCredor('')
    }
  }

  async function deleteDocument(idDoc) {
    await api.delete(`/document/${idDoc}`, { 
      headers: { authorization: unity } 
    })
    setList(list.filter(shipp => shipp.id !== idDoc))
  }

  useEffect(() => {
    setContador(`${count} Documento(s)`)

    api.get(`/shipping/${id}`, { 
      headers: { authorization: unity }
    }).then(response => {
      setShipping(response.data) 
      setList(response.data.shippingList)
      setCount(response.data.shippingList.length)
    }).catch(data => { setError('Não há dados') })

  }, [count, id, unity])

  const onSubmit = async (data, e) => { 
    await api.post(`shipping/${id}/document`, data, {
      headers: { authorization: unity }
    }).then(response => {
      response.data.created 
      ? Toast.fire({
          toast: false,
          icon: 'success',
          title: 'Documento incluido com sucesso',
          showConfirmButton: true,
          showClass: { popup: 'animated fadeIn faster' },
          timer: false,
          timerProgressBar: false,
          onOpen: (toast) => {
            setCount(count +1)
            e.target.reset()
            setValue('')
            setCreditor('')
            setIdCredor('')
            setCodigo('')
          }
        })
      : Toast.fire({
        icon: 'warning',
        showClass: { popup: 'animated bounceInDown faster' },
        title: 'Documento já existe'
      })
    })
  }

  return (
    <div className="document-container">
      <Menu title="Documento" >
      <Link to="/profile" className="button">Início</Link>
      </Menu>
      <div className="document-content">
        <div className="header-shipping">
          <p>Remessa</p>
          <p>Número <span>{shipping.number}</span></p>
          <p>Emitente <span>{shipping.emitter}</span></p>
          <p>Destino <span>{shipping.destiny}</span></p>
          <p>Documento Interno <span style={{color: "#5ca0cd"}} >{shipping.doc_external}</span></p>
          <p>Descrição <span>{shipping.description}</span></p>
          <p>Numero de documentos <span>{contador}</span></p>
        </div>
        <p>Novo documento</p>


        <p>Credor <span>{creditor.razao}</span></p>
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="input-group">

            <div className="input-group-dc">
              <input  name="codigoCredor" 
                      autoComplete="off"
                      ref={register({ required: true, minLength: 6, maxLength: 14 })} 
                      placeholder="Código do credor" 
                      value={codigo}
                      onChange={handleCredor} />
            </div>

            <div className="input-group-dc">
              <input  name="creditor_id" 
                      readOnly={true} 
                      hidden={true}
                      ref={register({ required: true, minLength: 1 })} 
                      value={idCredor} />
            </div>

            <div className="input-group-dc">
              <input  name="number_doc" 
                      autoComplete="off"
                      ref={register({ required: true })}
                      placeholder="Número" />
            </div>

            <div className="input-group-dc">
              <InputMask 
                      autoComplete="off"
                      name="emission"
                      ref={register({ required: true, minLength: 10 })}
                      mask="99/99/9999"
                      maskPlaceholder={null}
                      placeholder="Emissão" />
            </div>

            <div className="input-group-dc">
              <InputMask  
                      autoComplete="off"
                      name="due_date"
                      ref={register({ required: true, minLength: 10 })}
                      mask="99/99/9999"
                      maskPlaceholder={null}
                      placeholder="Vencimento"/>
            </div>

            <div className="input-group-dc">
              <input  name="value_doc"
                      autoComplete="off"
                      ref={register({ required: true, maxLength: 10 })}
                      placeholder="Valor R$" 
                      value={value}
                      onChange={e => maskValue(e.target.value)}/>
            </div>
          </div>
          <button type="submit" className="button" >Incluir</button>
        </form>
      </div>
      <div className="content-document">
        <table>
          <thead className="thead-document">
            <tr>
              <th>Código Credor</th>
              <th>Nome Credor</th>
              <th>Número</th>
              <th>Emissão</th>
              <th>Vencimento</th>
              <th>Valor R$</th>
              <th> </th>
            </tr>
            <tr>
              <th colSpan="7">{error}</th>
            </tr>
          </thead>
          <tbody>
          {list.map(ship => (
            <tr key={ship.id} >
              <td>{ship.creditorsAss.codigoCredor}</td>
              <td>{ship.creditorsAss.razao}</td>
              <td>{ship.number_doc}</td>
              <td>{ship.emission}</td>
              <td>{ship.due_date}</td>
              <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(ship.value_doc)}</td>
              <td>
                <FaTools onClick={e => setShowResults({ state: true, ship })} size={18} color="rgb(132, 255, 194)" />
                <FaRegTrashAlt onClick={() => deleteDocument(ship.id)} size={18} color="rgb(255, 124, 124)" />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <span className="createBy" >MIT ©  
        <a href="https://www.instagram.com/robson06_rocha/">R O B S O N  R O C H A</a>
      </span>
      { showResults && 
      <Modal dateDoc={showResults} >          
        <button type="submit" className="button" >Incluir</button>
        <button type="button"onClick={e => setShowResults(false)} className="button" >Cancelar</button> 
      </Modal> }
    </div>
  )
}
