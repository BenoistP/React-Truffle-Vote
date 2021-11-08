/* React */
import React from "react";

import Container from 'react-bootstrap/Container';

/* Traduction */
import { useTranslation } from 'react-i18next';
// Changement de langue
import i18n from './i18n';

/* React - Bootstrap*/
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/* Icônes */
import { BootstrapReboot, Flag, FlagFill, Sun, MoonFill, Moon } from 'react-bootstrap-icons';

const Toolbar = ( {handleReload, owner, connectedAccountAddr} ) =>
{
  // handleOnClickReload() = functionReload;
  const { t } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    }

  return (
<Container fluid className="bg-dark text-light">
  <Row>
    <Col >
      <Button className="mx-1" onClick={() => changeLanguage('fr-FR')} variant="primary" size="sm" > <FlagFill size={14} /> Fr </Button>
      <Button className="mx-1" onClick={() => changeLanguage('en')} variant="danger" size="sm" > <Flag size={14} /> En </Button>
    </Col>
    <Col></Col>
    <Col>
      <Row>
        <Col className={(connectedAccountAddr===owner?"text-warning":"text-info")+""}>
          <small>{t("votingContract.app.toolbar.connectedAddr")} {connectedAccountAddr}</small>
        </Col>
        <Col className={"text-warning"+(connectedAccountAddr===owner?" fw-bold":"")}>
          <small>{t("votingContract.app.toolbar.ownerAddr")} {owner}</small>
        </Col>

      </Row>
    </Col>
  </Row>
</Container>

  ); // render

 /* 
  <div className="container-fluid " role="toolbar" aria-label="User toolbar">
    <div className="row">
        <div className="col-sm-5">
            <ReloadButton handleReload={handleReload}/>
            <Button onClick={() => changeLanguage('fr-FR')} variant="primary" size="sm" > <FlagFill size={14} /> Fr </Button>
            <Button onClick={() => changeLanguage('en')} variant="danger" size="sm" > <Flag size={14} /> En </Button>
            <Button variant="light " size="sm" > <Sun size={14} /> </Button>
            <Button variant="light bg-dark " size="sm" > <MoonFill size={14} /> </Button>
        </div>
        <div className="col-sm-4 text-sm-left">
            <p className={(connectedAccountAddr===owner?"text-warning":"text-info")+" fw-bold"}><small>{t("votingContract.app.toolbar.connectedAddr")} {connectedAccountAddr}</small></p>
            <p className={"text-warning"+(connectedAccountAddr===owner?" fw-bold":"")}><small>{t("votingContract.app.toolbar.ownerAddr")} {owner}</small></p>
        </div>

    </div>
</div>
*/


} // Toolbar

const ReloadButton = ({handleReload}) =>
{
  const { t } = useTranslation();
  return (
      <Button onClick={ handleReload } variant="warning" size="sm" > 
        {t("votingContract.app.toolbar.reload")[0]=='R' &&
         <BootstrapReboot size={28} style={{verticalAlign: '-35%'}} />
        }{" "+ t("votingContract.app.toolbar.reload").substr(1)}
      </Button>
  );
} // ReloadButton

export { Toolbar };