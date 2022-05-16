///SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title StakingToken
/// @notice Implements a basic ERC20 staking token with reward distribution
contract StakingToken  is ERC20, Ownable {
    ///using SafeMath for uint;

    constructor(address _owner, uint _supply) ERC20("TestToken","TST") {
        _mint(_owner, _supply);
        console.log("owner() is " , owner());
    }

/// minimum a mount of token to stake (in wei / 10**18 )
uint constant MIN_TOKEN = 1 ether; 

///stakeholders array
address[] internal stakeholders;

/// stakeholder's staking balance
mapping(address => uint) internal stakingBalance;
/// Does this stakeholder have any stake ?
mapping(address => bool) public hasStaked;

/// accumulated rewards for each user
mapping(address => uint) internal rewards;




///@notice A method for stakeholder to stake tokens
///@param _amount - amount of tokens to be staked
function stakeToken(uint _amount) public payable {

    ///require(_amount > 0, "staking amount must be > 0");
    require(_amount > MIN_TOKEN, "staking amount must be >= 1 * 10**18");
    console.log("msg.sender is ", msg.sender);
    console.log("balanceOf(msg.sender) is " , balanceOf(msg.sender) );
    console.log("_amount is ", _amount);
    require(balanceOf(msg.sender) >= _amount, "staking amount > balance");
    transfer(address(this), _amount);
    ///payable(address(this)).transfer(_amount);
    stakingBalance[msg.sender] += _amount;
      ///console.log("msg.sender is " ,  msg.sender);
    ///console.log("stakingBalance is " , stakingBalance[msg.sender]);
    addStakeholder(msg.sender);
  
}


///@notice A method for stakeholder to unstake tokens
///@param _amount - amount of tokens to be unstaked
function unStakeToken(uint _amount) public {
    uint balance = stakingBalance[msg.sender];

    require(balance > 0, "staking balance must be > 0");
    require(balance >= _amount, "staking amount must be < balance");

   console.log("StakingToken : contract balance is ", balanceOf(address(this)));

    stakingBalance[msg.sender] -= _amount;
    if (stakingBalance[msg.sender] == 0) {
        deleteStakeholder((msg.sender));
    }

    ///uint allowance = allowance(msg.sender, address(this));
    ///console.log("allowance is " , allowance);
    ///require(allowance >= _amount, "check the token allowance");
    ///transferFrom(address(this), msg.sender, _amount);
    this.transfer(msg.sender,_amount);

    console.log("StakingToken : contract balance after user unstake is ", balanceOf(address(this)));

    ///-----
    /// cannot use payable because contract does not have any ether
    /// interpret as this contacct pay ether to msg.sender (which is the destination address)
    ///payable(msg.sender).transfer(_amount);
    
  
}



///@notice A method to add a stakeholder
///@param _stakeholder - stakeholder address to add
function addStakeholder(address _stakeholder) internal {
    ///console.log("inside addStakeholder....");
    if ( !hasStaked[_stakeholder]) {
       stakeholders.push(_stakeholder);
       hasStaked[_stakeholder] = true;
    }
}

///@notice A method to delete a stakeholder
///@param _stakeholder - stakeholder address to add
function deleteStakeholder(address _stakeholder) internal {
    if (hasStaked[_stakeholder]) {
        stakeholders.pop();
        hasStaked[_stakeholder] = false;
        stakingBalance[_stakeholder] = 0;
    }    
}

///@notice obtain the total stakes for all stakeholers
function totalStakingBalance() public view returns (uint) {
    uint _totalBalance = 0;

    for (uint i = 0; i < stakeholders.length; i++) {
        _totalBalance += stakingBalance[stakeholders[i]];
    }
    return _totalBalance;
}

//@notice user can request his own staking balance
//@return user's own staking balance
function myStakingBalance() public view returns (uint) {
    return stakingBalance[msg.sender];
}

///--------------------------------------------------------------------
/// simple rewards distribution
///--------------------------------------------------------------------
/// contract
///   - state : keep track of reward for each stakeholder
///   - function : calculate the reward for each stakeholder (fixed amount - simple reward)
///
/// owner :
///   - function : 
///     - trigger the reward distribution to every stakeholder 
///       - notify the stkeholder.
///     - sum up the rewards for all stakeholders.
///
/// user :
///  - funciton : 
///    - check his reward amount
///    - withdraw his reward
///---------------------------------------------------------------------


///@notice calculate the rewards for each stakeholder - fixed amount of 10%
///@param _stakeholder : the stakeholder whose rewards will be calculated for
///@return earned reward for that stakeholder
function calculateReward(address _stakeholder) public view returns (uint) {
    if (hasStaked[_stakeholder]) {
        ///console.log("stakingBalance is " , stakingBalance[_stakeholder]);
        uint reward = (stakingBalance[_stakeholder] * 10) / 100;
        ///console.log(" reward is " , reward);
        return reward ; 
    }
    else {
      return 0;
    }

}

///@notice (only owner can) distribute the rewards to each stakehoolder
function distributeRewards() public onlyOwner {
    for (uint i = 0; i < stakeholders.length; i++ ) {
        address _stakeholder = stakeholders[i];
        if (hasStaked[_stakeholder]) {
           rewards[_stakeholder] +=  calculateReward(_stakeholder);
           console.log(" rewards[_stakeholder] " , rewards[_stakeholder]);
        }
    }
}


///@notice (only owner can ) sum up rewards for all stakeholders
///@return total sum of rewards distributed
function totalRewards() public view  onlyOwner returns (uint) {
    uint _totalRewards = 0;
    for (uint i = 0; i < stakeholders.length; i++) {
        _totalRewards += rewards[stakeholders[i]];
    }
    return _totalRewards;
} 
   

///@notice allow owner to check any stakeholder's rewards
///@param _stakeholder : address of stakeholder
///@return _stakerholder's rewards
function rewardBalance(address _stakeholder) public view onlyOwner returns (uint) {
    if (hasStaked[_stakeholder]) {
        return rewards[_stakeholder];
    }
    else {
      return 0;
    }
}

///@notice allow stakeholder to check his own rewards
///@return _stakeholder's own rewards.
function myRewardBalance() public view returns (uint) {
    if (hasStaked[msg.sender]) {
        return rewards[msg.sender];
    }
    else {
      return 0;
    }
}

///@notice allow stakeholder to withdraw his own rewards
function withdrawReward() public {
    uint reward = myRewardBalance();
    require(reward > 0, "reward must be > 0");
    rewards[msg.sender] = 0;
    this.transfer(msg.sender,reward);
}


}