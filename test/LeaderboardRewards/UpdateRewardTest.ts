import { NightwatchTests, NightwatchBrowser } from 'nightwatch';
import { RewardPage } from '../../../page-objects/LeaderboardRewards/rewards';
import { UpdateRewardPage } from '../../../page-objects/LeaderboardRewards/update_reward';



describe('Leaderboard : Update Reward Test', () => {

    const updateRewardsTab = browser.page.LeaderboardRewards.update_reward() as UpdateRewardPage;

    before ((browser: NightwatchBrowser) => {
        const rewardPage= browser.page.LeaderboardRewards.rewards() as RewardPage;
        browser
        .url('https://nashtechglobal.qa.go1percent.com')
        .window.maximize();
        rewardPage
        .signIn()
        .goToRewards()
        .assert.urlContains('rewards/list', 'Reward tab is opened');
    });

    after((browser: NightwatchBrowser) => {
        browser.end();
    });

    // TC: 1164
    it('admin should not be able to edit Available For option', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .openUpdateTab()
        .assert.textContains('@updateRewardTitle', 'Update Reward', 'Update Reward tab is opened.')
        .editAvailableFor()
        .isEnabled('@availableForButton', function(result) {
            this.assert.equal(result.value, false, 'Available for Button is disabled.');
        })
        .closeUpdateTab();
    });

    // TC: 1165
    it('admin should be able to change expiry date of existing rewards', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .openUpdateTab()
        .changeExpiryDate()
        .assert.textContains('@alert', 'Reward was successfully updated!')
        .waitForElementNotPresent('@alert', 5000);
    });

    // TC: 1166
    it('admin should be able to click on cancel button', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .openUpdateTab()
        .closeUpdateTab()
        .assert.not.elementPresent('@updateRewardTitle', 'Update Reward tab is closed.');
    });

    // TC: 1167
    it('admin should be able to delete existing reward by clicking on delete button', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .openUpdateTab()
        .deleteReward()
        .assert.textContains('@alert', 'Reward is disabled', 'Disabled existing reward by clicking on delete button.')
        .waitForElementNotPresent('@alert', 5000);
    });

    // TC: 1168
    it('admin should be able to switch on for competency option', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .switchToCompetency()
        .assert.cssProperty('@competencyOption', 'background-color', 'rgba(236, 64, 122, 1)', 'Switched to Competency.');
    });

    // TC: 1182
    it('admin should be able to delete reward from competency section', (browser: NightwatchBrowser) => {
        updateRewardsTab
        .switchToCompetency()
        .assert.cssProperty('@competencyOption', 'background-color', 'rgba(236, 64, 122, 1)', 'Switched to Competency.')
        .openUpdateTab()
        .deleteReward()
        .assert.textContains('@alert', 'Reward is disabled', 'Disabled existing reward by clicking on delete button.');
    });
});

