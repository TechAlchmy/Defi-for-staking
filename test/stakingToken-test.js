const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingToken", function () {
  const TOTAL_SUPPLY = 1000;
  const OWNER_STAKE = 50;
  const USER_INITIAL = 30;
  const USER_STAKE = 20;
  const USER1_INITIAL = 40;
  const USER2_INITIAL = 50;
  const USER3_INITIAL = 70;
  const USER_UNSTAKE = USER_STAKE - 1;


  let StakingToken;
  let stakingToken;
  let owner;
  let user ;
  let user1;
  let user2;
  let user3;
  let user1StakingBalance;
  let userStakingBalance;
  let userAcctBalanceAfterStaking;
  let totalStakingBalanceAfterStaking;

  // comment out below to turn console.log back on
  console.log = function(){}; // turn off console.log

 

  before(async function () {
    StakingToken = await ethers.getContractFactory("StakingToken");
    [owner, user, user1, user2, user3] = await ethers.getSigners();
    console.log("owner add is " + owner.address);
    console.log("user addr is " + user.address);

    stakingToken = await StakingToken.deploy(owner.address, TOTAL_SUPPLY.toString());
    await stakingToken.deployed();
    provider = ethers.provider;
    
  });
    
    //
    describe("StakingToken staking testing .....", function () {
      before(async function () {
      // set up  user with USER_INITIAL token (transferred from owner)
      await stakingToken.transfer(user.address, USER_INITIAL, {from: owner.address});

      await stakingToken.transfer(user1.address, USER1_INITIAL, {from: owner.address});
      });
    

      // it('owner should stake token correctly', async() => {
      //   console.log('-------------------------------------------------"');
      //   await stakingToken.stakeToken(OWNER_STAKE);
      //   stakingTokenBalance = await stakingToken.totalStakingBalance();
      //   expect(stakingTokenBalance.toString()).to.equal(OWNER_STAKE.toString());
      //   console.log("owner staking amount is " + OWNER_STAKE.toString());
      //   console.log("owner balance is " + await stakingToken.balanceOf(owner.address) );

      // });


  

      it("user should stake token and get his staking balance correctly", async() => {
        console.log('-------------------------------------------------"');

        
        console.log("user's starting balance is " + await stakingToken.balanceOf(user.address));
        await stakingToken.connect(user).stakeToken(USER_STAKE);
        
        console.log("user is staking the amount of  " + USER_STAKE.toString());

        userStakingBalance = await stakingToken.connect(user).myStakingBalance();
        console.log("user's staking balance in contract is " + userStakingBalance);
        expect(userStakingBalance).to.equal(USER_STAKE.toString());

      });

      it("after staking, user account balance should reduce correctly", async() => {
        console.log('-------------------------------------------------"');
        
        userAcctBalanceAfterStaking = await stakingToken.balanceOf(user.address);
        console.log('after staking, user account balance is ' + userAcctBalanceAfterStaking);
        expect(userAcctBalanceAfterStaking).to.equal((USER_INITIAL- USER_STAKE).toString());


      });

      it("after staking, contract balance should increase correctly", async() => {
        console.log('-------------------------------------------------"');
        
        let contractBalance = await stakingToken.balanceOf(stakingToken.address);
        console.log('contract balance is ' + contractBalance);
        expect(contractBalance).to.equal((USER_STAKE).toString());


      });

      // order of test below is important. Do not change.
      it("user1 should stake token and get his staking balance correctly", async() => {
        console.log('-------------------------------------------------"');

        console.log("user1's starting balance is " + await stakingToken.balanceOf(user1.address));
        await stakingToken.connect(user1).stakeToken(USER1_INITIAL);
        
        console.log("user is staking the amount of  " + USER1_INITIAL.toString());

        user1StakingBalance = await stakingToken.connect(user1).myStakingBalance();
        console.log("user1's staking balance in contract is " + user1StakingBalance);
        expect(user1StakingBalance).to.equal(USER1_INITIAL.toString());

      });

      it('contract should show totalStakingBalance correctly ', async() => {
        console.log('-------------------------------------------------"');
        totalStakingBalanceAfterStaking = await stakingToken.totalStakingBalance();
        console.log("user's staking balance in contract is " + userStakingBalance);
        console.log("user1's staking balance in contract is " + user1StakingBalance);
        console.log("contract's totalStakingBalance is " + totalStakingBalanceAfterStaking);
        expect(totalStakingBalanceAfterStaking.toString()).to.equal(
            (parseInt(userStakingBalance) + parseInt(user1StakingBalance)).toString());

      });

      it("after staking by 2 users, contract balance should increase/show correctly", async() => {
        console.log('-------------------------------------------------"');
        
        let contractBalance = await stakingToken.balanceOf(stakingToken.address);
        console.log('contract balance is ' + contractBalance);
        expect(contractBalance).to.equal(totalStakingBalanceAfterStaking);


      });

      // it('owner should unstake token  correctly .... ', async() => {

      //   console.log('-------------------------------------------------"');
      //   await stakingToken.approve(stakingToken.address, OWNER_STAKE-1);
      //   await stakingToken.unStakeToken(OWNER_STAKE);
      //   ownerBalance = await stakingToken.balanceOf(owner.address);
      //   console.log('in test after unstake, owner balance is ' + ownerBalance);
      //   expect(userBalance).to.equal(TOTAL_SUPPLY.toString());
      // });


      // it("user should unstake his token correctly  ...", async() => {
      //   console.log('-------------------------------------------------"');
      //   let userBalance = await stakingToken.balanceOf(user.address);
      //   console.log("in test, userBalance is " + userBalance);

      //   unStakeAmount = USER_STAKE-1;
      //   console.log("unStakeAmount is " + unStakeAmount);
      //   await stakingToken.connect(user).unStakeToken(unStakeAmount);

        
      //   newUserBalance = await stakingToken.balanceOf(user.address);
      //   console.log('in test after unstake, new user balance is ' + newUserBalance);
      //   expect(newUserBalance).to.equal( (parseInt(userBalance) + parseInt(unStakeAmount)).toString());


      // });

      // ---------------------------------------------------------------------------
      // order of test is important. do not change.
      //----------------------------------------------------------------------------
      // after unstaking, need to verify :
      // - user staking balance in contract
      // - user account balance
      // - contract's totalStakingBalance
      // - contract balance
      
      it("user should unstake token and get his staking balance correctly", async() => {
        console.log('-------------------------------------------------"');

        
        //console.log("user's current account balance is " + await stakingToken.balanceOf(user.address));
        console.log("user staking balance in contract is " + userStakingBalance.toString());
        unStakeAmount = USER_UNSTAKE;
        //console.log("unStakeAmount is " + unStakeAmount);
        console.log("user is unstaking the amount of  " + unStakeAmount);
        await stakingToken.connect(user).unStakeToken(unStakeAmount);

        userBalanceAfterUnstaking = await stakingToken.connect(user).myStakingBalance();
        console.log("after unstaking, user's staking balance in contract is now " + userBalanceAfterUnstaking);
        expect(userBalanceAfterUnstaking).to.equal(
          (parseInt(userStakingBalance) - parseInt(unStakeAmount)
          ).toString()
        );

      });

      it("after unstaking, user account balance should increase back correctly", async() => {
        console.log('-------------------------------------------------"');
        
        console.log("user account balance (after staking before) is " + userAcctBalanceAfterStaking);
        console.log("user's unstaking amount is " + USER_UNSTAKE);
        let userAccountBalance = await stakingToken.balanceOf(user.address);
        console.log('after unstaking, user account balance is now ' + userAccountBalance);
  
        expect(userAccountBalance).to.equal(
          (parseInt(userAcctBalanceAfterStaking) + USER_UNSTAKE
          ).toString()
        );


      });

      it('after user unstaking, contract should show reduciton in totalStakingBalance correctly ', async() => {
        console.log('-------------------------------------------------"');
        console.log('total staking balance before unstaking is ' + totalStakingBalanceAfterStaking);
        console.log("total amount unstaken by user is " + unStakeAmount);
        totalStakingBalance = await stakingToken.totalStakingBalance();
        console.log("total staking balance after usntaking is " + totalStakingBalance);
        expect(totalStakingBalance.toString()).to.equal(
            (parseInt(totalStakingBalanceAfterStaking) - parseInt(unStakeAmount)).toString());

      });

      it("after unstaking, contract balance should decrease/show correctly", async() => {
        console.log('-------------------------------------------------"');
        
        totalStakingBalance = await stakingToken.totalStakingBalance();
        console.log("total staking balance after usntaking is " + totalStakingBalance);
        let contractBalance = await stakingToken.balanceOf(stakingToken.address);
        console.log('after unstaking, contract balance is ' + contractBalance);
        expect(contractBalance).to.equal(totalStakingBalance);


      });
      


    });

    //---------------------------------------------------------------------
    // rewards testing
    //---------------------------------------------------------------------
    describe("StakingToken rewards testing .....", function () {
      before(async function () {
        StakingToken = await ethers.getContractFactory("StakingToken");
        [owner, user, user1, user2, user3] = await ethers.getSigners();
        console.log("owner add is " + owner.address);
        console.log("user addr is " + user.address);
    
        stakingToken = await StakingToken.deploy(owner.address, TOTAL_SUPPLY.toString());
        await stakingToken.deployed();
        provider = ethers.provider;
        // set up  user with USER_INITIAL token (transferred from owner)
        console.log('-------------------------------------------------"');
        await stakingToken.transfer(user1.address, USER1_INITIAL, {from: owner.address});
        await stakingToken.connect(user1).stakeToken(USER1_INITIAL);
        await stakingToken.transfer(user2.address, USER2_INITIAL, {from: owner.address});
        await stakingToken.connect(user2).stakeToken(USER2_INITIAL);
        await stakingToken.transfer(user3.address, USER3_INITIAL, {from: owner.address});
        await stakingToken.connect(user3).stakeToken(USER3_INITIAL);

      });

      it('should calculate reward correctly .... ', async() => {

        console.log('-------------------------------------------------"');
        let reward = await stakingToken.calculateReward(user1.address);
        //rew = ethers.utils.formatEther(reward);
        console.log("reward is " + reward );
        let correctReward = USER1_INITIAL * 10 / 100;
        console.log("correct reward is " + correctReward );
        expect(reward.toString()).to.equal(correctReward.toString());
    

      });

      it("should distribute rewards correctly  ...", async() => {
        console.log('-------------------------------------------------"');
        await stakingToken.distributeRewards( {from: owner.address});
        let totalRewards = await stakingToken.totalRewards({from: owner.address});
        console.log("totalRewards is " + totalRewards);
        let correctTotalReward = (
          USER1_INITIAL + USER2_INITIAL + USER3_INITIAL) / 10;
        console.log("correctTotalRewards is " + correctTotalReward);
        expect(totalRewards.toString()).to.equal(correctTotalReward.toString());

      });

      it("Owner should be able to check any user rewards correctly  ...", async() => {
        console.log('-------------------------------------------------"');
        let rewardBalance = await stakingToken.rewardBalance(user1.address);
        console.log("rewardBalance is " + rewardBalance);
        let correctRewardBalance = (USER1_INITIAL) / 10;
        console.log("correctRewardBalance is " + correctRewardBalance);
        expect(rewardBalance.toString()).to.equal(correctRewardBalance.toString());

      });
      
      it("user should be able to check his own rewards correctly  ...", async() => {
        console.log('-------------------------------------------------"');
        let myRewardBalance = await stakingToken.connect(user2).myRewardBalance();
        console.log("myRewardBalance is " + myRewardBalance);
        let correctRewardBalance = (USER2_INITIAL) / 10;
        console.log("correctRewardBalance is " + correctRewardBalance);
        expect(myRewardBalance.toString()).to.equal(correctRewardBalance.toString());

      });

    });

});



