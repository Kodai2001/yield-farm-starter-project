// TokenFarm_test.js

// 使用するスマートコントラクトをインポートする
const DappToken = artifacts.require(`DappToken`)
const DaiToken = artifacts.require(`DaiToken`)
const TokenFarm = artifacts.require(`TokenFarm`)

// chai のテストライブラリ・フレームワークを読み込む
const { assert } = require('chai');
require(`chai`)
    .use(require('chai-as-promised'))
    .should()

// 任意のETHの値をWeiに変換する関数
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () =>{
        //コントラクトの読み込み
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //全てのDappトークンをファームに移動する(1 million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })

    // DaiToken
    describe('Mock DAI deployment', async () => {
        // テスト1
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    // DappToken
    describe('Dapp Token deployment', async () => {
         // テスト2
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    // TokenFarm
    describe('Token Farm deployment', async () => {
         // テスト3
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, "Dapp Token Farm")
        })

        // テスト4
        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
})