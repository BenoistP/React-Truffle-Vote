/* React */
import React from "react";

/* Traduction */
import { useTranslation } from 'react-i18next';
// Changement de langue
import i18n from './i18n';

/* React - Bootstrap*/
import Button from 'react-bootstrap/Button';

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

  <div className="container-fluid " role="toolbar" aria-label="User toolbar">
      <div className="row">
          <div className="col-sm-5">
{
  /*
              <ReloadButton handleReload={handleReload}/>
              */
}
              <Button onClick={() => changeLanguage('fr-FR')} variant="primary" size="sm" > <FlagFill size={14} /> Fr </Button>
              <Button onClick={() => changeLanguage('en')} variant="danger" size="sm" > <Flag size={14} /> En </Button>
{
  /*
              <Button variant="light " size="sm" > <Sun size={14} /> </Button>
              <Button variant="light bg-dark " size="sm" > <MoonFill size={14} /> </Button>
  */
}
          </div>
          <div className="col-sm-4 text-sm-left">
              <p className={(connectedAccountAddr===owner?"text-warning":"text-info")+" fw-bold"}><small>{t("votingContract.app.toolbar.connectedAddr")} {connectedAccountAddr}</small></p>
              <p className={"text-warning"+(connectedAccountAddr===owner?" fw-bold":"")}><small>{t("votingContract.app.toolbar.ownerAddr")} {owner}</small></p>
          </div>

      </div>
  </div>

  ); // render

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