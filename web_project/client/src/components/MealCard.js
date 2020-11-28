import React, { useState } from 'react';
import { Card, CardBody, CardTitle, CardText, CardImg, CardFooter, Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Map from './Map';
import './MealCard.css';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const MealCard = (props) => {
  
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  
  
    const authApi = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(!user) {
          alert('로그인이 필요합니다.');
            window.location.href = "/mypick";
            return ;
          }
        return fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user,
                'Accept': 'application/json'
            }
        }).then(response => response.json())
        .then(result => {
            if(result.message === 'valid token') {
               
              return fetch('/api/pick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': user
                },
                body: JSON.stringify({
                  "cardid":props.id
                })
            }).then(response => response.json())
            .then(result => {
              if(result.message === 'insertion success') {
                alert('MyPick에 담겼습니다.');
              } else if(result.message === 'card exist') {
                 alert('이미 MyPick에 존재합니다.');
              } else {
                alert('error');
              }
            });

            } else {
              alert('로그인이 필요합니다.');
              window.location.href = "/mypick";
            }
        });
    }


    const pickHandler = (e) => {
      e.preventDefault();
      authApi();
    }

  return (
    <>
      <Card style={{
        'marginTop': '0.6rem',
        'marginBottom': '0.6rem',
        'boxShadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}>
        
        <CardImg 
        top width="100%" />
        
        <CardBody>
          <CardTitle><strong>{props.name}</strong></CardTitle>
          <CardText>
            <small>{props.menu}</small>
          </CardText>
        </CardBody>
        <CardFooter className="wrap" style={{
          'padding': '0 0 0 0'
        }}>
        
        <Button 
        onClick={toggleModal}
        className="button"  
        style={{
          'width':'100%',
          'borderRadius':'0 0 0 0',
          'backgroundColor': '#F6F6F6',
          'border': '0px',
          'color':'black'
        }}>
        <span style={{
          'float':'left',
          'fontSize': '14px'
        }}>
        view more
        </span>
          <FontAwesomeIcon style={{
            'color': 'black',
            'float': 'right',
            'paddingTop':'0.1rem'
          }}
          size="lg" icon={faAngleRight} />
        </Button>
        </CardFooter>
      </Card>
     
      <Modal size="lg" className="modalClass" isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{props.name}</ModalHeader>
        <ModalBody>
        
        주소
        <hr className="my-2"/>
        {props.address} 
        <br/>
        <Map
          latitude = {props.latitude}
          longitude = {props.longitude}
        />
        

        </ModalBody>
        <ModalFooter>
        <div style={{
          width:'100%',
          overflow:'hidden',
          wordWrap:'break-word'
        }}>
        <small>
        {/* 썸네일 출처 */}
        <hr className="my-2"/>
        {props.img_source} <Button onClick={pickHandler} size="sm" className="float-right" color="warning">Pick!</Button>
        </small>
        </div>
        </ModalFooter>
      </Modal>
      
    </>
  );
};

export default MealCard;