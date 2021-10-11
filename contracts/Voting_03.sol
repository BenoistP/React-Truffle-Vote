// Défi - Système de vote
// https://ecole.alyra.fr/mod/assign/view.php?id=727

// Voting_03.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.11;

pragma experimental ABIEncoderV2;

// Whitelist / OpenZeppelin Ownable
import "./Admin_WL_03.sol";

// SafeMath
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/math/SafeMath.sol
//import 'https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.1.0/contracts/math/SafeMath.sol';
// import '@openzeppelin/contracts/math/SafeMath.sol';
import "./openzeppelin-contracts/contracts/math/SafeMath.sol";


contract Voting_03 is Admin_WL_03
{

    using SafeMath for uint256;

    // ===================================
    // Structs
    // ===================================
    struct Voter
     {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
     }

    struct Proposal
     {
        string description;
        uint voteCount;
        address proposing; // adresse du proposant
     }

    // ===================================
    // Enums
    // ===================================

    // Voting workflow steps
    enum WorkflowStatus
     {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
     }

    // ===================================
    // Events
    // ===================================
    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    
    // ===================================
    // Persistent data / state variables
    // ===================================
    
    //
    uint256 public winningProposalId;

    Proposal[] public _proposals;

    mapping (address => Voter) public _voters;

    // Worflow state
    // init
    WorkflowStatus public _workflowStatus = WorkflowStatus.RegisteringVoters;

    // ***************************************
    // Modifiers
    // ***************************************


    // State checks

     /**
     * @dev Throws if called outside WorkflowStatus.RegisteringVoters state.
     */
    modifier registeringVoters()
     {
        require( _workflowStatus == WorkflowStatus.RegisteringVoters, "Not in 'RegisteringVoters' state.");
        _;
     } // modifier registeringVoters

     /**
     * @dev Throws if called outside WorkflowStatus.ProposalsRegistrationStarted state.
     */
    modifier proposalsRegistrationStarted()
     {
        require( _workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Not in 'ProposalsRegistrationStarted' state.");
        _;
     } // modifier proposalsRegistrationStarted

     /**
     * @dev Throws if called outside WorkflowStatus.ProposalsRegistrationEnded state.
     */
    modifier proposalsRegistrationEnded()
     {
        require( _workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Not in 'ProposalsRegistrationEnded' state.");
        _;
     } // modifier proposalsRegistrationEnded

     /**
     * @dev Throws if called outside WorkflowStatus.VotingSessionStarted state.
     */
    modifier votingSessionStarted()
     {
        require( _workflowStatus == WorkflowStatus.VotingSessionStarted, "Not in 'VotingSessionStarted' state.");
        _;
     } // modifier votingSessionStarted

     /**
     * @dev Throws if called outside WorkflowStatus.VotingSessionEnded state.
     */
    modifier votingSessionEnded()
     {
        require( _workflowStatus == WorkflowStatus.VotingSessionEnded, "Not in 'VotingSessionEnded' state.");
        _;
     } // modifier votingSessionEnded

     /**
     * @dev Throws if called outside WorkflowStatus.VotesTallied state.
     */
    modifier votesTallied()
     {
        require( _workflowStatus == WorkflowStatus.VotesTallied, "Not in 'VotesTallied' state.");
        _;
     } // modifier votesTallied

    // Users checks
    modifier hasNotAlreadyVoted(address _address)
     {
         require( ! _voters[_address].hasVoted, "Already voted." );
         _;
     } // modifier hasNotAlreadyVoted


    // Notify events
    /*
    modifier workflowStatusChanged(WorkflowStatus previousStatus, WorkflowStatus newStatus)
     {
        _;
        emit WorkflowStatusChange( previousStatus,  newStatus );
     }
    */
    modifier notifyEventWorkflowStatusChanged
     {
        WorkflowStatus workflowStatusBefore = _workflowStatus;
        _;
        emit WorkflowStatusChange( workflowStatusBefore,  _workflowStatus );
     }

    // ***************************************
    // Functions
    // ***************************************

    // Admin only : onlyOwner modifier

    // States transitions 

    // RegisteringVoters -> ProposalsRegistrationStarted
    function setStateStartProposalsRegistration() public onlyOwner registeringVoters notifyEventWorkflowStatusChanged // workflowStatusChanged(_workflowStatus, WorkflowStatus.ProposalsRegistrationStarted)
     {
        _workflowStatus =  WorkflowStatus.ProposalsRegistrationStarted;
        emit ProposalsRegistrationStarted();
     }

    // ProposalsRegistrationStarted -> ProposalsRegistrationEnded
    function setStateEndProposalsRegistration() public onlyOwner proposalsRegistrationStarted notifyEventWorkflowStatusChanged // workflowStatusChanged(_workflowStatus, WorkflowStatus.ProposalsRegistrationEnded)
     {
        _workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit ProposalsRegistrationEnded();
     }

    // ProposalsRegistrationEnded -> VotingSessionStarted
    function setStateStartVotingSession() public onlyOwner proposalsRegistrationEnded notifyEventWorkflowStatusChanged // workflowStatusChanged(_workflowStatus, WorkflowStatus.VotingSessionStarted)
     {
        _workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit VotingSessionStarted();
     }

    // VotingSessionStarted -> VotingSessionEnded
    function setStateEndVotingSession() public onlyOwner votingSessionStarted notifyEventWorkflowStatusChanged // workflowStatusChanged(_workflowStatus, WorkflowStatus.VotingSessionEnded)
     {
        _workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit VotingSessionEnded();
     }

    // VotingSessionEnded -> VotesTallied
    function setStateVotesTallied() internal onlyOwner votingSessionEnded notifyEventWorkflowStatusChanged // workflowStatusChanged(_workflowStatus, WorkflowStatus.VotesTallied)
     {
        _workflowStatus = WorkflowStatus.VotesTallied;
        emit VotesTallied();
     }

    // Other
    
    // L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
    function whitelist(address _address) public override ( Admin_WL_03 ) registeringVoters
     {
        super.whitelist( _address );
        _voters[ _address ] = Voter( true, false, 0 );// (bool isRegistered, bool hasVoted, uint votedProposalId)
        _voters[ _address ].isRegistered = true;
        emit VoterRegistered( _address );
      } // function whitelist

    // Compte des votes en 'view' : pas de limite de gas
    function countVotes() votingSessionEnded public /* internal */ view onlyOwner returns (uint256)
    {
        uint256 proposalIdWithMaxCount;
        uint256 proposalIdWithMaxCount_Count;
        //for (uint i=0; i<1000;i++){            uint a=i;         }
        for ( uint32 proposalId=0; proposalId < _proposals.length; proposalId++ )
         {
             
             if ( _proposals[ proposalId ].voteCount > proposalIdWithMaxCount_Count )
              {
                proposalIdWithMaxCount = proposalId;
                proposalIdWithMaxCount_Count = _proposals[ proposalId ].voteCount;
              }
         } // for each proposal

        return proposalIdWithMaxCount;

/*
        for ( uint32 proposalId=0; proposalId < _proposals.length; proposalId++ )
         {
             
             if ( _proposals[ proposalId ].voteCount = proposalIdWithMaxCount_Count )
              {
                  if ( proposalIdWithMaxCount != proposalId )
                   {
                       // Au moins deux propositions ont le même plus grand nombre de votes
                   }
              }
         } // for each proposal

*/
    }
    
    // Décompte des votes
    function countAndTallyVotes () public onlyOwner returns (uint256)
     {
        winningProposalId = countVotes();
        setStateVotesTallied();
     } // function tallyVotes

    // ---------
    // Non Admin
    // ---------
    
    /**
     * _msgSender() -> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.0.0/contracts/GSN/Context.sol
     */
    function registerProposal( string memory _description ) public proposalsRegistrationStarted whitelisted( _msgSender() )
     {
    	// _proposals.push( Proposal( _description, 0 ) ); // string description, uint voteCount
    	_proposals.push( Proposal( _description, 0, _msgSender() ) ); // string description, uint voteCount, proposant
         emit ProposalRegistered( _proposals.length );
     } // function registerProposal

    function vote( uint256 _proposalId ) public votingSessionStarted whitelisted( _msgSender() ) hasNotAlreadyVoted( _msgSender() )
     {
        _proposals[_proposalId].voteCount = _proposals[_proposalId].voteCount.add( 1 ); // SafeMath

        Voter storage voter = _voters[ _msgSender() ];
        voter.hasVoted = true;
        voter.votedProposalId = _proposalId;
        
         emit Voted ( _msgSender() ,  _proposalId );
     } // function vote
     
     function getWinningProposal() public view votesTallied returns (uint256)
      {
          return winningProposalId;
      } // function getWinningProposal
      

    function getAllProposals() public view returns (Proposal[] memory)
     {
    	return _proposals;
     } // function getAllProposals

    function hasVoted(address _adr) public view returns (bool, uint256)
     {
         return (_voters[_adr].hasVoted, _voters[_adr].votedProposalId);

     } // function hasVoted

} // contract Voting
