
import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { RewardPage } from '../../../page-objects/LeaderboardRewards/rewards';
import { RedeemRewardPage } from '../../../page-objects/LeaderboardRewards/redeem_reward';


describe('Leaderboard : Redeem Reward Test', () => {

    const redeemedRewardsTab= browser.page.LeaderboardRewards.redeem_reward() as RedeemRewardPage;
    
    before((browser: NightwatchBrowser) => {
        const rewardPage= browser.page.LeaderboardRewards.rewards() as RewardPage;
        rewardPage
        .navigate()
        .maximizeWindow()
        .signIn()
        .goToRewards()
        .assert.urlContains('rewards/list', 'Reward tab is opened');
    });

    beforeEach((browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .openRewardReport();
    });

    after((browser: NightwatchBrowser) => {
        browser.end();
    });

    //TC : 1169 
    it('admin should be able to click on reward report button', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .assert.urlContains('rewards/reward-reports', 'Reward Report is opened.'); 
    });

    //TC : 1170
    it('admin should be able to see list of names', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .assert.elementPresent('@employeeName', 'Employee name is present') 
        .assert.elementPresent('@competencyName', 'Competency name is present')
        .assert.elementPresent('@rewardName', 'Reward name is present') 
        .assert.elementPresent('@redeemPoints', 'Redeem Points is present') 
        .assert.elementPresent('@redeemedDate', 'Redeemed Date is present');
    });

    //TC : 1171
    it('admin should be able to click on any contributors tab', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .openRedeemRequestWindow()
        .assert.textContains('@RedeemRequestWindowTitle', 'Process a Redeem Request', 'Redeem Request window is opened.')
        .closeRedeemRequestWindow(); 
    });


  
    //TC : 1173
    it('admin should able to switch to competency from Individual', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .switchToCompetency()
        .assert.textContains('@rewardReport', 'No Redeemed Reward Available', 'Switched to competency from Individual.')
        .switchToIndividual()
        .waitForElementPresent('@employeeName');
    });

    //TC : 1174
    it('admin should be able to apply filter in all time dropdown', (browser: NightwatchBrowser) => {
        const currentFormattedDate = redeemedRewardsTab.getCurrentFormattedDate();
        redeemedRewardsTab
        .setTimeFilterToToday()
        .assert.textContains('@redeemedDate', currentFormattedDate, 'The Redeem date of rewards is set to today.')
        .resetTimeFilter();
    });

    // TC : 1175
    // BUG : On resetting the filter, the list does not appear
    it('admin should able to filter out the status of reward', (browser: NightwatchBrowser) => {
        const currentFormattedDate = redeemedRewardsTab.getCurrentFormattedDate();
        redeemedRewardsTab
        .setStatusFilterToProcessing()
        .pause(3000);
        browser
        .elements('css selector', 'button.processingStatus', (results : any) => {
            if (results.value.length > 0) { 
            browser.assert.textContains('button.processingStatus', 'PROCESSING', 'Status of redeemed rewards is set to processing.');
            }
            else { 
            console.log('No Redeemed Reward Available'); 
            }
        })
        .refresh();
    });

    // TC : 1176
    //BUG : show more is dispalyed, instead of redeemed rewards msg
    it('admin should able to see blank screen with message', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .searchNasher('Tester')
        .waitForElementPresent('@rewardReport', 5000)
        .assert.textContains('@rewardReport', 'No Redeemed Reward Available', 'Blank screen with message is displayed')
        // actual 
        // .waitForElementPresent('@showMoreCard') 
        // .assert.textContains('@showMoreCard', 'SHOW MORE');
    });

      //TC : 1172
    /**
     * BUG : 
     * 1. On resetting the filter, the list does not appear
     * 2. On clicking process, the window is not closing
     * 3. After processing, the status of the reward changes only on refreshing
     * */
    it('admin should able to change status of reward from processing to process', (browser: NightwatchBrowser) => {
        redeemedRewardsTab
        .setStatusFilterToProcessing()
        .pause(3000);
        browser
        .elements('css selector', 'button.processingStatus', (results : any) => {
            if (results.value.length > 0) { 
            redeemedRewardsTab.openRedeemRequestWindow()
            .pause(3000)
            .getDetailsOfRedeemReward(function (rewardDetails) {
                redeemedRewardsTab
                .processReward()
                //BUG : the window is not closing on its own
                // .closeRedeemRequestWindow()
                .setStatusFilterToProcessed();
                //BUG : the page needs to be refreshed
                // browser.refresh();
                //assert the stored details
                redeemedRewardsTab
                .waitForElementPresent('@employeeName', 5000)
                .assert.textContains('@employeeName', rewardDetails.owner, 'Employee name matched.') 
                .assert.textContains('@competencyName', rewardDetails.competency, 'Competency name matched.')
                .assert.textContains('@rewardName', rewardDetails.reward, 'Reward name matched.') 
                .assert.textContains('@redeemedDate', rewardDetails.redeemedDate, 'Redeemed Date matched.') 
                .assert.textContains('@statusButton', 'PROCESSED', 'Status is processed.');
            });
            }
            else { 
            console.log('No Redeemed Reward Available'); 
            }
        })
        .refresh();
    });
    

});
