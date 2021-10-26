/* React */
import React, { useState, useEffect } from "react";

/* Traduction */
import { useTranslation } from 'react-i18next';


/* React - Bootstrap*/
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

/* Utils */
import  { zeroPad } from "./AppUtils";
/* Constantes */
import  * as CONSTS from "./consts";

/* Icônes */
import { XCircle, PlusCircle, CheckSquare, HandThumbsUpFill, CheckCircle, Trophy } from 'react-bootstrap-icons';



function User( { connectedAccountAddr, workflowStatus, whitelistedAddresses, hasVoted, votedProposalId, allProposals, winningProposalId, onRegisterNewProposal, onVoteForProposal } )
{
  const whitelistedUser = (whitelistedAddresses.indexOf(connectedAccountAddr) != -1)

  if (whitelistedUser)
   {

    if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_00_REGISTERINGVOTERS )
    {
      return (
        <WhitelistedUserInterfaceWait workflowStatus={workflowStatus} />
        )
    }

      if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_01_PROPOSALSREGISTRATIONSTARTED )
        {
          return (
            <WhitelistedUserProposalsDisplayAndInput connectedAccountAddr={connectedAccountAddr} onRegisterNewProposal={onRegisterNewProposal} allProposals={allProposals} />
            )
        }

        if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_02_PROPOSALSREGISTRATIONENDED )
        {
          return (
            <WhitelistedUserProposalsDisplay connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} />
            )
        }

        if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_03_VOTINGSESSIONSTARTED )
        {
          return (
            <WhitelistedUserVoteForProposal connectedAccountAddr={connectedAccountAddr} onVoteForProposal={onVoteForProposal} allProposals={allProposals} hasVoted={hasVoted} votedProposalId={votedProposalId}/>
            )
        }
        
        if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_04_VOTINGSESSIONENDED || workflowStatus === CONSTS.STATUSES_VALUES.STATUS_05_VOTESTALLIED )
        {
          return (
            <WhitelistedUserDisplayVoteProposal connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} hasVoted={hasVoted} votedProposalId={votedProposalId} winningProposalId={winningProposalId} />
            )
        }
        

   } // whitelistedUser

   if (workflowStatus === CONSTS.STATUSES_VALUES.STATUS_05_VOTESTALLIED)
   return (
      <NotWhitelistedUserDisplayVoteProposal connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} winningProposalId={winningProposalId} />
    )

    // Défaut
   return (
    <UnHandled whitelistedUser={whitelistedUser} />
  )


} // User

// ------------------------------------------------------------------------------------------

function WhitelistedUserInterfaceWait({ workflowStatus })
{
  const { t } = useTranslation();

  if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_00_REGISTERINGVOTERS )
  {
    return (
      <div><p className="text-warning">{t("votingContract.app.user.action.wait")} {t(`votingContract.app.dashboard.status.states.${workflowStatus}`)}</p></div>
      )
  }

} // EmptyUserInterface

// ------------------------------------------------------------------------------------------

function WhitelistedUserProposalsDisplayAndInput({ connectedAccountAddr, onRegisterNewProposal, allProposals })
{
  return (
    <div>
      <UserProposalsInput connectedAccountAddr={connectedAccountAddr} onRegisterNewProposal={onRegisterNewProposal} allProposals={allProposals} />
    </div>    
  );
} // WhitelistedUserProposalsDisplayAndInput

// ------------------------------------------------------------------------------------------

function WhitelistedUserProposalsDisplay({ connectedAccountAddr, allProposals })
{
  const { t } = useTranslation();
  // Checkbox
  const [displayAllProposals, toggleDisplayAllProposals] = useToggle( false )
  
  return (
    <div  className="container-fluid bg-dark col-sm-4 ">
      <div>
        <h2 className="text-center">
          { ( displayAllProposals ? t("votingContract.app.user.proposals.title") : t("votingContract.app.user.proposals.input.title") ) }
        </h2>
        {t("votingContract.app.user.proposals.displayAll")} <input type="checkbox" onChange={toggleDisplayAllProposals} checked={displayAllProposals}/>
      </div>
      <div>
        <DisplayProposals connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} displayAllProposals={displayAllProposals} />
      </div>
    </div>    
  );
} // WhitelistedUserProposalDisplayAndInput


// ------------------------------------------------------------------------------------------

function WhitelistedUserVoteForProposal({ connectedAccountAddr, allProposals, onVoteForProposal, hasVoted, votedProposalId })
{
  const { t } = useTranslation();
  // Checkbox
  const [displayAllProposals, toggleDisplayAllProposals] = useToggle( false )
  
  return (
    <div  className="container-fluid bg-dark col-sm-8 ">
      <div>
        <h2 className="text-center">
          { t("votingContract.app.user.action.vote") }
        </h2>
      </div>
      <div>
        <h3 className="text-center">
          { ( displayAllProposals ? t("votingContract.app.user.proposals.title") : t("votingContract.app.user.proposals.input.title") ) }
        </h3>
        {t("votingContract.app.user.proposals.displayAll")} <input type="checkbox" onChange={toggleDisplayAllProposals} checked={displayAllProposals}/>
      </div>
      <div>
        <VoteForProposal connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} onVoteForProposal={onVoteForProposal} displayAllProposals={displayAllProposals} hasVoted={hasVoted} votedProposalId={votedProposalId} />
      </div>
    </div>    
  );
} // WhitelistedUserVoteForProposals

// ------------------------------------------------------------------------------------------

function WhitelistedUserDisplayVoteProposal({ connectedAccountAddr, allProposals, hasVoted, votedProposalId, winningProposalId })
{
  const { t } = useTranslation();
  // Checkbox
  const [displayAllProposals, toggleDisplayAllProposals] = useToggle( true )
  
  return (
    <div  className="container-fluid bg-dark col-sm-8 ">
      <div>
        <h2 className="text-center">
          { t("votingContract.app.user.action.result") }
        </h2>
      </div>
      <div>
        <h3 className="text-center">
          { ( displayAllProposals ? t("votingContract.app.user.proposals.title") : t("votingContract.app.user.proposals.input.title") ) }
        </h3>
        {t("votingContract.app.user.proposals.displayAll")} <input type="checkbox" onChange={toggleDisplayAllProposals} checked={displayAllProposals}/>
      </div>
      <div>
        <DisplayVoteProposal connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} displayAllProposals={displayAllProposals} hasVoted={hasVoted} votedProposalId={votedProposalId} winningProposalId={winningProposalId} />
      </div>
    </div>    
  );
} // WhitelistedUserDisplayVoteProposal

// ------------------------------------------------------------------------------------------

function NotWhitelistedUserDisplayVoteProposal({ connectedAccountAddr, allProposals, winningProposalId })
{
  const { t } = useTranslation();
  
  return (
    <div  className="container-fluid bg-dark col-sm-8 ">
      <div>
        <h2 className="text-center">
          { t("votingContract.app.user.action.result") }
        </h2>
      </div>
      <div>
        <DisplayVoteProposal connectedAccountAddr={connectedAccountAddr} allProposals={allProposals} displayAllProposals={true} winningProposalId={winningProposalId } />
      </div>
    </div>    
  );
} // NotWhitelistedUserDisplayVoteProposal

// ------------------------------------------------------------------------------------------

function UnHandled({ whitelistedUser })
{
  if ( whitelistedUser )
    {
      return (
        <div>Component :  UnHandled</div>    
      );
    }
    return (
      <NotWhitelistedUser/>
      );

} // UnHandled

// ------------------------------------------------------------------------------------------

function NotWhitelistedUser({ /* TODO */ })
{
  return (
    <div></div>    
  );
} // UnwhitelistedUser

// ------------------------------------------------------------------------------------------

function UserProposalsInput( { connectedAccountAddr, onRegisterNewProposal, allProposals }  )
{
  const { t } = useTranslation();
  const [newProposal, setnewProposal] = useState( "" )

  // Affichage de la ligne de saisie d'une nouvelle proposition
  const [displayNewProposalInput, setDisplayNewProposalInput] = useState( false )
  // Permet l'envoi d'une proposition : bouton actif/inactif
  const [enableButtonSendNewProposal, setEnableButtonSendNewProposal] = useState( false )

  const myProposals = allProposals.filter((p) => p.proposingAddr === connectedAccountAddr)

  // Formattage de l'affichage du nombre de proposition : ajout de zéros en préfixe
  const proposalsMaxNumLen = Math.max(myProposals.length.toString().length, 2)

  const hideResetNewProposalInputs = (resetToEmpty=true ) => {
    setDisplayNewProposalInput(false)
    setEnableButtonSendNewProposal(false)
    if (resetToEmpty) { setnewProposal("") }
  }

  // Réinitialiser les champs de saisie au changement de compte connecté
  useEffect ( () => {
    hideResetNewProposalInputs()
    }, [connectedAccountAddr]

  )
 
const registerProposal = async () => {
 await onRegisterNewProposal( newProposal )
 hideResetNewProposalInputs()
} // registerProposal

const handleOnNewProposalChange = (e) => {
// console.log("UserProposalInput:handleOnNewProposalChange:e.target.value= '"+e.target.value+"'")
  const value = e.target.value
  setnewProposal(value);
  setEnableButtonSendNewProposal( (value.length > 0 ) )
  } // handleOnNewProposalChange

const handleOnClickCancel = (e) => {
  hideResetNewProposalInputs(false)
}

  const handleOnClickToggleNewProposalVisible = (e) => {
    setDisplayNewProposalInput(v=>!v)
  }

  return (
    <div>
  { console.log("UserProposalInput : Render ") }
<div>

<div>
    <h2 className="text-center">{t("votingContract.app.user.proposals.title")}</h2>
    <hr></hr>
    <br></br>
</div>
<div style={{display: 'flex', justifyContent: 'center'}}>
  <Card style={{ width: '50rem' }}>
    <Card.Header className="text-dark"><h5 className="card-text">{t("votingContract.app.user.proposals.input.title")}</h5></Card.Header>
    <Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Table className="table table-primary table-striped table-hover table-sm-10">
            <thead className="table-dark">
              <tr>
                <th className="col-sm-1 text-center">{t("votingContract.app.user.proposals.input.id")}</th>
                <th>{t("votingContract.app.user.proposals.input.description")}</th>
                <th className="col-sm-4 text-center ">{t("votingContract.app.user.proposals.input.action")}</th>
              </tr>
            </thead>
            <tbody>


              {
                myProposals
                .map((p,i) => <tr key={i}>
                    <td className="col-sm-1 text-center">{zeroPad(i+1,proposalsMaxNumLen)}</td>
                    <td><input value={p.description} readOnly={true} contentEditable={false} size={50} minLength={10} maxLength={100}></input></td>
                    <td/></tr>)
              }

              { displayNewProposalInput &&
              <tr>
              <td className="col-sm-1 text-center text-secondary">
                <p>{zeroPad(myProposals.length+1,proposalsMaxNumLen)}</p>
              </td>
              <td>
                <input placeholder={t("votingContract.app.user.proposals.input.placeholder")}
                 contentEditable={true} size={50} minLength={10} maxLength={100}
                 onChange={handleOnNewProposalChange}
                 />
              </td>
              <td className="col-sm-4 text-right ">
                <span>
                <Button variant="info" size="sm"
                  disabled={!enableButtonSendNewProposal}
                  onClick={registerProposal}> <CheckSquare style={{verticalAlign: '-10%'}} /> {t("votingContract.app.user.proposals.input.send")}
                </Button>
                </span>
                <span>
                  <Button variant="warning" size="sm"
                  onClick={handleOnClickCancel /* setDisplayNewProposalInput */}> <XCircle style={{verticalAlign: '-10%'}} /> {t("votingContract.app.user.proposals.input.cancel")}
                  </Button>
                </span>
              </td>
            </tr>
              }
          </tbody>

          </Table>
        </ListGroup.Item>
        <ListGroup.Item>
          {
              !displayNewProposalInput &&
          <Button variant="dark" size="sm" onClick={handleOnClickToggleNewProposalVisible}> <PlusCircle size={22} style={{verticalAlign: '-30%'}} /> {t("votingContract.app.user.proposals.input.new")}</Button>
          }

        </ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
</div>
<br></br>

<br></br>

</div>
    </div>   
  ); // render
} // WhitelistedUser


// ------------------------------------------------------------------------------------------


function DisplayProposals( { connectedAccountAddr, allProposals, displayAllProposals = true }  )
{
  const { t } = useTranslation();

  const displayedProposals = ( displayAllProposals ? allProposals : allProposals.filter((p) => p.proposingAddr === connectedAccountAddr) )

  // Formattage de l'affichage du nombre de proposition : ajout de zéros en préfixe
  const proposalsMaxNumLen = Math.max(displayedProposals.length.toString().length, 2)

  return (

    <Table className="table table-primary table-striped table-hover table-sm">
    { /*console.log("UserProposalInput : Render ") */ }
    <thead className="table-dark">
      <tr>
        <th>{t("votingContract.app.user.proposals.input.id")}</th>
        <th>{t("votingContract.app.user.proposals.input.description")}</th>
      </tr>
    </thead>
    <tbody>
      {
        displayedProposals
        .map((p,i) => <tr key={i}><td>{zeroPad(i+1,proposalsMaxNumLen)}</td><td><input value={p.description} readOnly={true} contentEditable={false} size={50} minLength={10} maxLength={100}></input></td></tr>)
      }
    </tbody>
  </Table>
  ); // render


} // DisplayProposals

// ------------------------------------------------------------------------------------------

function VoteForProposal( { connectedAccountAddr, allProposals, onVoteForProposal, displayAllProposals = true, hasVoted, votedProposalId }  )
{
  const { t } = useTranslation();

  const displayedProposals = ( displayAllProposals ? allProposals : allProposals.filter((p) => p.proposingAddr === connectedAccountAddr) )

  // Formattage de l'affichage du nombre de proposition : ajout de zéros en préfixe
  const proposalsMaxNumLen = Math.max(displayedProposals.length.toString().length, 2)

  const handleVoteForProposal = async (  proposalId  ) => {
   // alert("handleVoteForProposal")
    // console.log(proposalId)
    await onVoteForProposal(proposalId)
  } // handleVoteForProposal

  return (

    <Table className="table table-primary table-striped table-hover table-sm-8">
    { /*console.log("UserProposalInput : Render ") */ }
    <thead className="table-dark">
      <tr>
        <th>{t("votingContract.app.user.proposals.input.id")}</th>
        <th>{!hasVoted?t("votingContract.app.user.proposals.input.select"):t("votingContract.app.user.proposals.input.selected")}</th>
        <th>{t("votingContract.app.user.proposals.input.description")}</th>
      </tr>
    </thead>
    <tbody>
      {
        displayedProposals
        .map((p,i) => <tr key={p.id} >
                        <td className="col-sm-1 text-center">{zeroPad(i+1,proposalsMaxNumLen)}</td>
                        <td className="col-sm-2">
                          {
                            !hasVoted &&
                            <Button variant="dark" size="sm"
                            onClick={() => handleVoteForProposal(p.id)}
                          >
                              <HandThumbsUpFill style={{verticalAlign: '-10%'}} /> {t("votingContract.app.user.proposals.input.select")}
                          </Button>
                          }
                          {
                            hasVoted && votedProposalId == p.id &&
                            <CheckCircle style={{verticalAlign: '-10%'}} />
                          }
                        </td>
                        <td>
                            <p className="">{p.description}</p>
                        </td>
                      </tr>)
      }

    </tbody>
  </Table>
  ); // render


} // VoteForProposal

// ------------------------------------------------------------------------------------------

function DisplayVoteProposal( { connectedAccountAddr, allProposals, displayAllProposals = true, hasVoted, votedProposalId, winningProposalId }  )
{
  const { t } = useTranslation();
  const displayedProposals = ( displayAllProposals ? allProposals : allProposals.filter((p) => p.proposingAddr === connectedAccountAddr) )
  // Formattage de l'affichage du nombre de proposition : ajout de zéros en préfixe
  const proposalsMaxNumLen = Math.max(displayedProposals.length.toString().length, 2)

  return (
    <Table className="table table-primary table-striped table-hover table-sm-8">
    <thead className="table-dark">
      <tr>
        <th>{t("votingContract.app.user.proposals.input.id")}</th>
        <th>{t("votingContract.app.user.proposals.input.results")}</th>
        <th>{t("votingContract.app.user.proposals.input.description")}</th>
      </tr>
    </thead>
    <tbody>
      {
        displayedProposals
        .map((p,i) => <tr key={p.id} className={winningProposalId == p.id ? 'table-success': hasVoted && votedProposalId == p.id ? 'table-info':'' }>
                        <td className="col-sm-1 text-center"><p className={winningProposalId == p.id ?"fw-bold":""}>{zeroPad(i+1,proposalsMaxNumLen)}</p></td>
                        <td className="col-sm-2">
                          {
                            hasVoted && votedProposalId == p.id &&
                            <CheckCircle style={{verticalAlign: '-10%'}} />
                          }
                          {
                             winningProposalId == p.id &&
                            <Trophy style={{verticalAlign: '-10%'}} />
                          }
                        </td>
                        <td>
                          <p className={winningProposalId == p.id ?"fw-bold":""}>{p.description}</p>
                        </td>
                      </tr>)
      }
    </tbody>
  </Table>

  ); // render

} // DisplayVoteProposal

// ------------------------------------------------------------------------------------------

function useToggle (initialValue = true) {
  const [value, setValue] = useState(initialValue)
  const toggle = function () {
      setValue(v => !v)
  }
  return [value, toggle]
}

// ------------------------------------------------------------------------------------------

export { User };