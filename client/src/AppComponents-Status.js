/* React */
import React, { Component } from "react";

/* Traduction */
import { withTranslation, useTranslation } from 'react-i18next';


/* React - Bootstrap*/
import ProgressBar from 'react-bootstrap/ProgressBar'
import Alert from 'react-bootstrap/Alert'


function VoteStatusProgressStep({ states, workflowStatus })
{
  const { t } = useTranslation();
  return (
          <nav aria-label="{t('votingContract.app.dashboard.status.title')}">
                <ul className="pagination">
                { states !== null && states.map((state) => <li key={state} className={"page-item " + (state===workflowStatus?"active":"disabled")}><div className="page-link" href="#" tabIndex="">{t(`votingContract.app.dashboard.status.states.${state}`)}</div></li> ) }
                </ul>
            </nav>
  );
}

function VoteStatusProgressBar({ states, workflowStatus })
 {
  const { t } = useTranslation();
   return (
    <div className="progressBar "  style={{ height: 30 }} >

        <ProgressBar style={{ height: 30 }}>
          {
            states !== null && states.map((state) => 
              <ProgressBar striped={state===workflowStatus} animated min={1} max={17} now={17} key={state} label={t(`votingContract.app.dashboard.status.states.${state}`)} bsPrefix={(state===workflowStatus?"":"in")+"active-state-progressbar"} /> )
          }
        </ProgressBar>
    </div>
    );
 }

function VoteStatusSimpleText({ workflowStatus })
{
  const { t } = useTranslation();
   return (
            <Alert variant="primary">
              {t(`votingContract.app.dashboard.status.states.${workflowStatus}`)}
            </Alert>
    );
 }


class Status extends Component
 {

  render()
   {
    const { t, displayType="ProgressBar", workflowStatus, states } = this.props;

    return (
      <div className="row ">
        <div className="col-sm-12 text-center"><p className="text-light fw-bold">{t("votingContract.app.dashboard.status.title")}</p>
        {
          { "ProgressBar": <VoteStatusProgressBar states={states} workflowStatus={ workflowStatus }/>,
            "ProgressStep": <VoteStatusProgressStep states={states} workflowStatus={ workflowStatus }/>
          }[displayType] || <VoteStatusSimpleText workflowStatus={ workflowStatus }/>
        }
        </div>
      </div>
    )
  } // render()
}

const StatusTranslated = withTranslation()(Status)

function Web3Loader()
{
  return (
  <div>
    <table className="table table-bordered">
    <tbody>
      <tr className='table-warning'>
        <td className='warning'>
          Loading Web3, accounts, and contract...
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  )
}


export { Web3Loader, StatusTranslated /* , Status, VoteStatusStep, VoteStatusProgress */ };
