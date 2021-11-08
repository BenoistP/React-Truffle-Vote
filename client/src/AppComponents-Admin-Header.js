/* React */
import React from "react";

/* Traduction */
import { useTranslation } from 'react-i18next';

/* React - Bootstrap*/
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

/* Icônes */
import { ArrowRight, EnvelopeOpen, StopCircle } from 'react-bootstrap-icons';

/* Constantes */
import  * as CONSTS from "./consts";

const AdminToolbar = ( {workflowStatus, goToNextState, countAndTallyVotes} ) =>
{
    if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_04_VOTINGSESSIONENDED )
    {
      return (
        <CountAndTallyVotesButton countAndTallyVotes={countAndTallyVotes} />
        )
    }
    if ( workflowStatus === CONSTS.STATUSES_VALUES.STATUS_05_VOTESTALLIED )
    {
      return (
        <NoMoreActionAvailable />
        )
    }

    return (
<Container fluid className="bg-dark text-light btn-group" role="group" aria-label="Admin toolbar">
  <Row>
    <Col>
      <GoToNextStateButton goToNextState={goToNextState} size={14} />
    </Col>
  </Row>
</Container>

  );
  /*
      <div className="btn-group" role="group" aria-label="Admin toolbar">
        <GoToNextStateButton goToNextState={goToNextState} />
    </div>
  */
}

const GoToNextStateButton = ( {goToNextState} ) =>
{
  const { t } = useTranslation();

  return (
    <Button onClick={goToNextState} variant="outline-warning" >{t("votingContract.app.admin.toolbar.nextstate")} <ArrowRight style={{verticalAlign: '-10%'}} /></Button>
  );
}


function CountAndTallyVotesButton({ countAndTallyVotes })
{
  const { t } = useTranslation();

  return (
    <Button onClick={countAndTallyVotes} variant="outline-info" >{t("votingContract.app.admin.toolbar.countAndTallyVotes")} <EnvelopeOpen style={{verticalAlign: '-10%'}} /></Button>
  );
} // CountAndTallyVotesButton

function NoMoreActionAvailable({ })
{
  const { t } = useTranslation();

  return (
    <div className="text-light">
      <StopCircle style={{verticalAlign: '-10%'}} /> {t("votingContract.app.admin.action.end")} <StopCircle style={{verticalAlign: '-10%'}} />
    </div>
  );
}

export { AdminToolbar };