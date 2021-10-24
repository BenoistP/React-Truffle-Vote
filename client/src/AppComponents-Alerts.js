/* React */
import React, { useState, useEffect } from "react";

/* Traduction */
import { useTranslation } from 'react-i18next';

import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

/* React - Bootstrap*/
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Table from 'react-bootstrap/Table';

/* Utils */
// import  { zeroPad } from "./AppUtils";
/* Constantes */
// import  * as CONSTS from "./consts";

/* Icônes */
// import { XCircle, PlusCircle, CheckSquare, HandThumbsUpFill, CheckCircle, Trophy } from 'react-bootstrap-icons';



function Alerts( { alertsList/*connectedAccountAddr, workflowStatus, whitelistedAddresses, hasVoted, votedProposalId, allProposals, winningProposalId, onRegisterNewProposal, onVoteForProposal*/ } )
{
   return (

    <ToastContainer className="p-3" position={"bottom-end"}>
{ /* }
<Alert title={"Titre 1"} message={"Message 1"} detail={"detail 1"} time={"time 1"} variant={"warning"} />
      <Alert title={"Titre 2"} message={"Message 2"} detail={"detail 2"} time={"time 2"} variant={"primary"} />
      <Alert title={"Titre 3"} message={"Message 3"} detail={"detail 3"} time={"time 3"} variant={"secondary"} />
      <Alert title={"Titre 4"} message={"Message 4"} detail={"detail 4"} time={"time 4"} variant={"danger"} />
      <Alert title={"Titre 5"} message={"Message 5"} detail={"detail 5"} time={"time 5"} variant={"info"} />
      <Alert title={"Titre 6"} message={"Message 6"} detail={"detail 6"} time={"time 6"} variant={"light"} />
      <Alert title={"Titre 7"} message={"Message 7"}  time={"time 7"} style={"dark"} />
{ 
  
        alertsList &&
      alertsList.map((alert,idx) =>
        <Alert title={alert.title} message={alert.message} detail={alert.detail} time={alert.time} variant={alert.variant} />
      ) // alertsList.forEach

   <div className="bg-light">
  {
 JSON.stringify(alertsList) 
 
  </div>
  */
 
 }
{
alertsList &&
      alertsList.map((alert,idx) =>
        <Alert id={idx} title={alert.title} message={alert.message} detail={alert.detail} time={alert.time} variant={alert.variant} />
      ) // alertsList.forEach
}
  </ToastContainer>
  

  ) // return


} // Alerts

// ------------------------------------------------------------------------------------------

function Alert({ title, message, detail, time, variant, id })
{
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

    return (
      <Toast bg={variant} onClose={() => setShow(false)} show={show} animation={true} delay={60000} autohide key={id} >
        <Toast.Header closeButton={true} >
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">{title}</strong>
          <small>{time}</small>
        </Toast.Header>
      <Toast.Body className={variant === 'Dark' && 'text-white'}>
          {message}
          { detail && <small><hr/>{detail}</small> }
      </Toast.Body>
    </Toast>
      )
} // Alert

// ------------
// ------------------------------------------------------------------------------------------

function useToggle (initialValue = true) {
  const [value, setValue] = useState(initialValue)
  const toggle = function () {
      setValue(v => !v)
  }
  return [value, toggle]
}

// ------------------------------------------------------------------------------------------

export { Alerts };