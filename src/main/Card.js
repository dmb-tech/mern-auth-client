import React, {Fragment} from 'react'
import axios from 'axios'
import {useLocation} from 'react-router-dom'
import {getCookie, isAuth} from '../auth/helpers'
import Image from '../styledComponents/Image'
import styled from 'styled-components'
import { WaveTopBottomLoading } from 'react-loadingg'
import {ToastContainer, toast} from 'react-toastify'
import {Delete} from '@styled-icons/material-outlined/Delete'
import DataCard from './../styledComponents/DataCard';
const Container = () => <WaveTopBottomLoading color="#03cffc"/>;

const Trash = styled(Delete)`
  color: grey;
  width: 25px;
  height: auto;
  display: inline-block;
  padding: 0 0 4px 0 ;
  transition: color ease 0.75s;
  &:hover { 
    color: white;
  }
`
const OptionsWrapper = styled.div`
  text-align: center;
  width: 100%;
  height: auto;
  margin-top: -15px;
  cursor: pointer;
  transition: background-color ease 0.75s;
  border-radius: 6px;
  &:hover { 
    background-color: royalblue;
    color: white;
  }
  a {
    display: block;
    padding: 5px 60px;
    font-size: 14px;
  }
`



const Card = ({
  titles, 
  collections, 
  item, 
  setValues, 
  expandCard, 
  containerTitle, 
  refresh }) => {

    let location = useLocation()
    const user = isAuth()._id
    const token = getCookie('token')
    
    const addToCollection = async (e) => {
      e.preventDefault()
      // get selected card index
      const collections = document.getElementById(e.target.id)
      const selectedContainer = collections.options[collections.selectedIndex].text
      // get card data from dom
      const children = collections.parentElement.childNodes
      var imgFullURL = children[1].src;

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API}/cards`,
        params: {
          title: children[0].innerHTML,
          img: imgFullURL,
          name: children[2].childNodes[0].innerHTML,
          date: children[2].children[1].innerHTML,
          containerTitle: selectedContainer,
          id : user
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        toast.info(`Added to ${selectedContainer} Collection`)
      }).catch(error => {
        console.log('SAVE CARD ERROR', error)
      })
    }
    
  const cardDelete = async (e) => {
    e.preventDefault()
    const title = e.target.parentNode.parentNode.childNodes[0].innerHTML
    const error = e.target.parentNode.parentNode.childNodes
    console.log(error)
    await axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API}/cards/delete`,
      params: {
        containerTitle: containerTitle,
        id : user,
        title: title
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setValues({collections: res.data})
      toast.info(`Deleted from ${containerTitle} collection`)
      refresh()
    }).catch(error => {
      console.log('DELETE CARD ERROR', error)
    })
  }
  return (
    <Fragment>
      <DataCard key={Math.random()} containerTitle={item.containerTitle}>
         {/* {values.loading &&
          <Container width={500} height={500} key={Date.now()} color="#03cffc" />
        }  */}
        <h5>{item.title}</h5>
        <Image id="card-image" loading="lazy" src={item.img}  onClick={expandCard} className="item-img"/>
        <div id="inline-wrap">
          <h6>{item.name}</h6>
          <p>{item.date}</p>
        </div>
        {location.pathname === "/search" &&
        
          <select id={Math.random()} onChange={(e) => addToCollection(e)}>
          <option values=""  defaultValue key={Math.random()}>Add to  collection</ option>
            {titles.titles.map((item, index) => {
              return(
                <Fragment>
                <option value={item} key={index} id={index}>{item} </ option>
                </Fragment>
              )
             })} 
          </select>
        }
        {location.pathname === "/collections" && 
          <OptionsWrapper>
            <a onClick={(e) => cardDelete(e)}>
              <Trash />
            </a>
          </OptionsWrapper>
        }
      </DataCard>
    </Fragment>     
  )
}

export default Card