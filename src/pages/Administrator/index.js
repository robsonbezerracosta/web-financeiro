import React, { useState, useEffect } from 'react'
import InputMask from "react-input-mask"
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import Menu from '../../components/Menu'
import { FiXCircle, FiPercent, FiSettings } from 'react-icons/fi'
import $ from 'jquery'
import 'jquery-mask-plugin/dist/jquery.mask.min'
import Retention from './Retention'

import api from '../../services/api'

import './styles.css'

export default function Administrator() {
  const { register, handleSubmit, errors } = useForm()
  const [creditor, setCreditor] = useState('')
  const [codigo, setCodigo] = useState('')
  const [documents, setDocuments] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [count, setCount] = useState(0)
  const [contador, setContador] = useState('')
  const { list_id } = useParams()


  const history = useHistory()
  const unity = localStorage.getItem('unity')

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const onSubmit = async (data, e) => {
    data.value_doc = data.value_doc.replace(".", "")
    data.value_doc = data.value_doc.replace(",", ".")

    data.list_id = list_id
    
    await api.post('newdocument', data).then(response => {
      if(!response.data.created) {

        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Impossivél incluir documento duas vezes',
          footer: 'Documento repetido'
        })

      } else {

        Swal.fire({
          icon: 'success',
          title: 'Yes!',
          text: 'Documento incluido com sucesso',
          onOpen: () => {
            e.target.reset()
            setCreditor('')
            setCodigo('')
            setCount(count +1)
          }
        })

      }
    })
  }

  useEffect(() => {
    $('.money').mask("#.##0,00", { reverse: true, placeholder: '0,00' })
    $('.date').mask("00/00/0000", { placeholder: '__/__/____'})
  })

  async function deleteRetntion(document_id, response) {
    try {

      await api.delete(`/deleteretention/${document_id}`, {
        headers: {
          code: response.code,
          percentage: response.percentage
        }
      }).then(res => {

        Toast.fire({
          icon: 'success',
          title: 'Receita deletada com sucesso',
          onOpen: () => {
            setCount(count + 1)
          }
        })

      })

    } catch (error) {

      Toast.fire({
        icon: 'error',
        title: 'Erro ao deletar receita'
      })

    }
  }

  async function deleteDocument(document_id) {
    await api.delete(`/document/${document_id}`).then(response => {
      setDocuments(documents.filter(document => document.id !== document_id))
      setCount(count - 1)
    })
  }
  
  async function blurCredor() {
    try {

      const data = {  codigoCredor: codigo }
      await api.post('/creditor/seach', data).then(response => {
       setCreditor(response.data.razao)
      })

    } catch (e) {

      setCreditor('')

    }
  }

  useEffect(() => {
    setContador(`${count} Documento(s)`)
    api.get('/document', {
      headers: { authorization: unity }
    }).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
    })
  }, [count, unity, showResults])

  return(
    <div className="administrator-container">
      <Menu title="Documento">
        <div className="content-button">
          <button className="button" onClick={() => history.push('/profile')} >Início</button>
          <button className="button" >{contador}</button>
          <button className="button">Imprimir</button>
        </div>
      </Menu>

      <div className="content-grid">
      <div className="administrator-content">
    
        <form onSubmit={handleSubmit(onSubmit)} >

          <button type="button" className="btn-gallery">Dados do documento de origem</button>

          <p>Credor <span>{creditor}</span></p>
          <div className="form-group-credor">

            <div className="input-group">
              <label>Código credor</label>
              <input  name="codigoCredor" 
                      className={errors.codigoCredor && "input-error"}
                      autoComplete="off"
                      value={codigo}
                      onBlur={blurCredor}
                      onChange={e => setCodigo(e.target.value)} 
                      ref={register({ required: true, minLength: 6, maxLength: 14 })} />
            </div>

            <div className="input-razao">
              <label>Razão</label>
              <input  name="razao"
                      autoComplete="off"
                      ref={register({ required: true })}
                      value={creditor}
                      onChange={e => setCreditor(e.target.value)} />
            </div>

          </div>

          <div className="form-group-document">

            <div className="input-group">
              <label>Número</label>
              <input  name="number_doc" 
                      className={errors.number_doc && "input-error"}
                      autoComplete="off"
                      ref={register({ required: true })} />
            </div>

            <div className="input-group">
            <label>Emissão</label>
              <input  className={`date ${errors.emission && "input-error"}`}
                      autoComplete="off"
                      name="emission"
                      ref={register({ required: true, minLength: 10 })}/>
            </div>

            <div className="input-group">
            <label>Vencimento</label>
              <input  className={`date ${errors.due_date && "input-error"}`}
                      autoComplete="off"
                      name="due_date"
                      ref={register({ required: false, minLength: 10 })}/>
            </div>

            <div className="input-group"> 
            <label>Valor R$</label>
              <input  className={`money ${errors.value_doc && "input-error"}`} 
                      name="value_doc"
                      autoComplete="off"
                      ref={register({ required: true })}/>
            </div>

          </div>

          <button type="button" className="btn-gallery">Dados SIAFI</button>
          <div className="form-group-document-siafi">

            <div className="input-group"> 
            <label>Nota de Empenho</label>
              <InputMask 
                mask="9999NE999999"
                maskPlaceholder={'____NE______'}
                placeholder="____NE______"
                autoComplete="off"
                name="commitment_note"
                className={errors.commitment_note && "input-error"}
                ref={register({ required: true, minLength: 12, maxLength: 12 })}/>
            </div>

            <div className="input-group"> 
            <label>Nota de Sistema</label>
            <InputMask  
                mask="9999NS999999"
                maskPlaceholder={'____NS______'}
                placeholder="____NS______"
                autoComplete="off"
                name="note_system"
                className={errors.note_system && "input-error"}
                ref={register({ required: false, minLength: 12, maxLength: 12 })}/>
            </div>

            <div className="input-group"> 
            <label>Ordem Bancária</label>
              <InputMask  
                mask="9999OB999999"
                maskPlaceholder={'____OB______'}
                placeholder="____OB______"
                autoComplete="off"
                name="bank_order"
                className={errors.bank_order && "input-error"}
                ref={register({ required: false, minLength: 12, maxLength: 12 })}/>
            </div>

          </div>
          
          <button className="button">Incluir</button>

        </form>
      </div>
      
      <div className="content-document">
        <ul>
          {documents.map(document => (
            <li key={document.id}>
              <div className="adm-doc"> 
                <div className="doc-content">
                  <FiXCircle size={22} color="#FE6B8B" onClick={() => deleteDocument(document.id)}/>
                  <FiPercent size={22} color="#FE6B8B" onClick={() => setShowResults({ document  })} />
                  <FiSettings size={22} color="#FE6B8B"/>
                </div>
              </div>
              <p><span>Credor</span>{document.creditorsAss.razao}</p>
              <p><span>Númenro</span>{document.number_doc}</p>
              <p><span>Emissão</span>{document.emission}</p>
              <p><span>Valor R$</span>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(document.value_doc)}</p>
              <span className="impostos">
                <p>Cód</p>
                <p>%</p>
                <p>Calc</p>
                <p>Val R$</p>
                <p>#</p>
              </span>
              {
                document.listRetention.map(taxes => (
                  <span className="impostos-data" key={taxes.id}>
                    <p>{taxes.code}</p>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(taxes.percentage)}</p>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(taxes.retention_document.calculation)}</p>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format((taxes.percentage/100)*taxes.retention_document.calculation)}</p>
                    <p><FiXCircle size={18} color="#FE6B8B" onClick={() => deleteRetntion(taxes.retention_document.document_id, taxes)}/></p>
                  </span>
                ))
              }
              <div className="documents-siafi">

                <div>{document.listCommitment.map(commitment => (
                    <button type="button" key={commitment.id} >{commitment.commitment_note}</button>
                  ))}</div>

                <div>{document.listSystem.map(system => (
                    <button type="button" key={system.id}>{system.note_system}</button>
                  ))}</div>

                <div>{document.listBank.map(orderBank => (
                  <button type="button" key={orderBank.id}>{orderBank.bank_order}</button>
                ))}</div>

              </div>
            </li>
          ))}
        </ul>
        { showResults && (
        <Retention document={showResults} >          
          <button type="button" onClick={() => setShowResults(false)} ><FiXCircle color="#FE6B8B" size={20} /></button> 
        </Retention> )}
      </div>
      </div>
    </div>
  )
}