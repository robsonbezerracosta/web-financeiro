import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import $ from 'jquery'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import Swal from 'sweetalert2'
import 'jquery-mask-plugin/dist/jquery.mask.min'

import './styles.css'
import '../../../animate.css'

import api from '../../../services/api'

export default function Modal(props) {
  const { register, handleSubmit, reset } = useForm()
  const [document] = useState(props.document.document)
  const [value, setValue] = useState(Intl.NumberFormat('pt-BR', {currency: 'BRL'}).format(document.value_doc))
  const [retention, setRetention] = useState([])

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  useEffect(() => {
    $('.money').mask("#.##0,00", {reverse: true, placeholder: '0,00'})
  })

  const onSubmit = async (data, e) => {
    data.percentage = data.percentage.replace(".", "")
    data.percentage = data.percentage.replace(",", ".")

    data.calculation = data.calculation.replace(".", "")
    data.calculation = data.calculation.replace(",", ".")

    await api.post(`newretention/${document.id}`, data).then(response => {
      Toast.fire({
        icon: 'success',
        title: 'Receita incluida com sucesso',
        onOpen: () => {
          reset()
          setRetention(response.data.res_doc.listRetention)
        }
      })
    })
  }

  async function deleteRetntion(response) {
    try {
      await api.delete(`/deleteretention/${document.id}`, {
        headers: {
          code: response.code,
          percentage: response.percentage
        }
      }).then(res => {
        Toast.fire({
          icon: 'success',
          title: 'Receita deletada com sucesso',
          onOpen: () => {
            setRetention(retention.filter(retentions => retentions.id !== response.id))
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

  useEffect(() => {
    api.get(`/document/${document.id}`).then(response => {
      setRetention(response.data.listRetention)
    })
  }, [document.id])

  return(
    <div className="document-container" >´
      <div id="modal" className="modal-container">
        <div className="modal animated fadeIn faster">
          <div className="modal-header">
            <span>Retenções</span>
            {props.children}
          </div>
          <form className="modal-form" onSubmit={handleSubmit(onSubmit)} >
          <p>Documento<span>{document.number_doc}</span></p>
          <div className="modal-content" spellCheck="false">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Percentual</th>
                <th>Cálculo</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>

                <td>
                  <input  type="text" 
                          autoComplete="off"
                          ref={register({ required: true, minLength: 4, maxLength: 4 })}
                          name="code" />
                </td>

                <td>
                  <input  type="text"
                          autoComplete="off"
                          ref={register({ required: true })}
                          className="money"
                          name="percentage"/>
                  </td>

                <td>
                  <input  type="text"
                          autoComplete="off"
                          ref={register({ required: true })}
                          className="money"
                          name="calculation"
                          value={value}
                          onChange={e => setValue(e.target.value)}/>
                </td>

                <td>
                  <button type="submit" className="button"><FiCheckCircle size={28} color="#FE6B8B" /></button>
                </td>
                
              </tr>
              {
                retention.map(response => (
                  <tr key={response.id}>
                    <td>{response.code}</td>
                    <td>{Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.percentage/100)}</td>
                    <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format((response.percentage/100)*response.retention_document.calculation)}</td>
                    <td>
                      <button type="button" className="button" onClick={() => deleteRetntion(response)}>
                        <FiXCircle size={22} color="#FE6B8B"/>
                      </button>
                    </td>
                  </tr>
                ))
              }
              
            </tbody>
          </table>

          </div>
          </form>
        </div>
      </div>
    </div>
  )
}