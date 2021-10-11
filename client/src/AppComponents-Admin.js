/* React */
import React, { Component } from "react";
import Collapse from 'react-bootstrap/Collapse'

/* Web3 */
import { isAddress } from "./getWeb3";

/* Traduction */
import { withTranslation /*, useTranslation */ } from 'react-i18next';

/* React - Bootstrap*/
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


/* Constantes */
import  * as CONSTS from "./consts";

/* Icônes */
import { Check2, EraserFill, ArrowDownCircleFill, ArrowUpCircleFill } from 'react-bootstrap-icons';

/* --------------------------------------------------------------------------------------- */

class Admin extends Component
 {
  constructor(props)
   {
    super(props);
    this.handleOnClickWhithelistTitle = this.handleOnClickWhithelistTitle.bind(this);
     this.state = {
      whitelistOpened : false
    }
   } // constructor

  handleOnClickWhithelistTitle()
  {
    this.setState( { whitelistOpened: !this.state.whitelistOpened } )
  }

  render()
  {
    const { t, whitelistedAddresses, owner, workflowStatus } = this.props;

    return (
      <div>

        <div>
            <h2 className="text-center">{t("votingContract.app.admin.title")}</h2>
            <hr></hr>
            <br></br>
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card bg="dark" border="light" style={{ width: '50rem' }}>
            <Card.Header className="text-dark">
              <Button variant="dark" className="btn-outline-light"
                  onClick={() => this.handleOnClickWhithelistTitle() }>
                  {t("votingContract.app.admin.whitelist.whitelistedAddresses")} {this.state.whitelistOpened?<ArrowUpCircleFill/>:<ArrowDownCircleFill/>}
              </Button>
            </Card.Header>
            <Collapse in={this.state.whitelistOpened}>
              <Card.Body >
                <Table className="table table-dark table-striped table-hover table-sm">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>@</th>
                        </tr>
                      </thead>
                      <tbody>
                        { whitelistedAddresses !== null && whitelistedAddresses != undefined &&
                          whitelistedAddresses.map((a,i) => <tr key={a}><td>{i+1}</td><td><p className={(a==owner?"text-warning":"") }>{a}</p></td></tr>)
                        }
                      </tbody>
                  </Table>
              </Card.Body>
            </Collapse>
          </Card>
        </div>
        <br></br>

{ /*        <div>Admin : { JSON.stringify( this.props)  }</div> */ }
         { /* Saisie des adresses seulement dans l'état enregistrement des votants */
           workflowStatus === CONSTS.STATUSES_VALUES.STATUS_00_REGISTERINGVOTERS &&
          <AdminInputNewAddressTranslated handleWhitelistNewAddress={this.props.handleWhitelistNewAddress}/>  }

        <br></br>

      </div>
    );

  } // render()
} // class Admin extends Component

/* --------------------------------------------------------------------------------------- */

class AdminInputNewAddress extends Component
 {
  constructor(props)
  {
    super(props);

    this.getValidationState = this.getValidationState.bind(this)
    this.handleOnNewAddressChange = this.handleOnNewAddressChange.bind(this);
    this.isValidAddress = this.isValidAddress.bind(this);
    this.handleOnClickWhitelistNewAddress = this.handleOnClickWhitelistNewAddress.bind(this);
    this.handleOnClickClearNewAddress = this.handleOnClickClearNewAddress.bind(this);
    this.validateAddress = this.validateAddress.bind(this);

    this.state = { isValidAddress :false, validationState : "text-warning" };
  } // constructor

  handleOnClickWhitelistNewAddress(e)
  {
   this.props.handleWhitelistNewAddress( this.newAddress.value );
   //this.handleOnClickClearNewAddress()
  } // handleOnClickWhitelistNewAddress


  handleOnClickClearNewAddress(e)
   {
    this.newAddress.value = ''
    this.validateAddress(this.newAddress.value)
   }

  validateAddress(address){
    const isValidAddress = this.isValidAddress(address)
    const validationState = this.getValidationState(isValidAddress);
    this.setState({ isValidAddress, validationState });
   }

  handleOnNewAddressChange(e) {
      const addressValue = e.target.value
      this.validateAddress(addressValue)
    } // handleOnNewAddressChange
    
    isValidAddress(address)
    {
      // Eth adddress : 42 chars long including 0x prefix
      // 0xDC25EF3F5B8A186998338A2ADA83795FBA2D695E
      const length = address === undefined ? 0 : address.length;
      if (length === 40 || length === 42)
      {
        return isAddress(address)
      }
      return false
    } // isValidAddress
    
    getValidationState(isValidAddress) {
      let res = "text-warning"
      if (isValidAddress)
      {
        res = 'text-success';
      }
      return res;
    } // getValidationState
    
    render()
    {
      const { t } = this.props;
      return (
          <div style={{display: 'flex', justifyContent: 'center'}} >
  
          <Card style={{ width: '50rem' }}>
            <Card.Header><strong>{t("votingContract.app.admin.whitelist.whitelistNewAccount")}</strong></Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Control type="text" id="address"
                value={this.state.value}
                placeholder={t("votingContract.app.admin.whitelist.addressPlaceHolder")} 
                ref={(input) => { this.newAddress = input }}
                onChange={this.handleOnNewAddressChange}
                min="40"
                maxLength="42"
                className={this.state.validationState}
                isValid={this.state.isValidAddress}              
                isInvalid={!this.state.isValidAddress}
              />
              </Form.Group>
            </Card.Body>
            <Card.Footer>
            <ListGroup variant="flush">
              <ListGroup.Item className="text-center">
                <ButtonGroup aria-label="Input address action">
                  <Button onClick={ (e) => { this.handleOnClickClearNewAddress() } } variant="danger"> <EraserFill/> </Button>
                  <Button disabled={!this.state.isValidAddress} onClick={ this.handleOnClickWhitelistNewAddress } variant={this.state.isValidAddress?"primary":"dark"} > <Check2/> {t("votingContract.app.admin.whitelist.whitelist")} </Button>
                </ButtonGroup>
              </ListGroup.Item>
            </ListGroup>
            </Card.Footer>
          </Card>
          </div>
      );

    } // render()

 } // class AdminInputNewAddress extends Component

const AdminTranslated = withTranslation()(Admin)
const AdminInputNewAddressTranslated = withTranslation()(AdminInputNewAddress)

export { AdminTranslated };