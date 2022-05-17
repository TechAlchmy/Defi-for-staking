# Staking Token
This repo shows an example of a simple Defi smart contract for staking ERC20 tokens, with a simple reward calculation, developed using the hardhat framework
<br><br>

## Motivation ##
This is the first of a series of Defi smart contracts using solidity. This Defi series covers the basic codes in varioius areas of Defi projects such as :
- Staking tokens
- borrow & loan ETH, borrow & loan ERC20 tokens
- token swap
- flash loan
- etc

<br>

## Functional Description ##
There are 2 main features here : one is related to token staking, the other is reward earned.
- token staking : 
  - stake token
  - unstake token
  - add and delete stakeholder
  - total staking balance
- rewards earned :
  - calculate rewards
  - distribute rewards
  - total rewards
  - stakeholders reward balance
  - withdraw reward 

### Owner only functions ###
- total staking balance
- distrubute rewards
- check individual's rewards

### User functions ###
- stake token
- unstake token
- staking balance
- calculate reward
- reward balance
- withdraw reward

### Contract (internal) functions ###
- add and delete stakeholders
<br>

## Technical Description ###

### Technical background ###
- As this smart contract project is built using the hardhat framework, please refer to this project/repo [basic smart contract using hardhat](https://github.com/dtan1/contractviahardhat) regarding building a basic smart contract using the hardhat framwork. 
- The README section contains a quick overview and usage of various hardhat commands etc. It serves as a good, quick refresher.

### Technical dependencis ###
Below is a brief summary of the technical libraries or tools that is used in this project :
- development fraemwork : hardhat
- coding libraries : openzeppelin - ERC20.sol, and Ownable.sol
- unit test libraries : chai assertion, ether.js 

### Technical consideration ###

#### States ####
- constant is used to initialize 
  - minimum amount of tokens to stake   
- mapping data structure :
  - stakeholder's staking balance
  - stakeholder's stake existence
  - accumulated reward for each stakeholder
- array :
  - list of stakeholders
    - for use in distributing rewards and calcuation of total rewards 
- storage variable :
  - none


#### Functions ####
- calculate rewards
  - a very simple and straight forward method is used, i.e. 10% of total stakes. 
  - no time factor is used here (normally staking involves a specific time frame in order to earn some rewards).


<br>

## Testing ##

### Unit Test ###
- staking/unstaking tests :
  - user should stake token and get his staking balance correctly
  - after staking, user balance should decrease and contract balance increase correctly
  - user should unstake token and get his staking balance correctly
  - after unstaking, user balance should increase, and contract balance should decrease correctly
  - after unstaking, totalStakingBalance in contract should decrease correctly.

- rewards tests :
  - should calculate rewards correctly
  - owner should distribute rewards correctly
  - owner should be able to check user's reward correctly
  - user should be able to check his own reward correctly
  - user should withdraw his own rewards correctly.



