const TokenFarm = artifacts.require(`TokenFarm`);
const DappToken = artifacts.require(`DappToken`);
const DaiToken = artifacts.require(`DaiToken`);

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    await deployer.deploy(DappToken)
    const dappToken = await DappToken.deployed()

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
    const tokenFarm = await TokenFarm.deployed()

    //100万Dappデプロイする
    await dappToken.transfer(tokenFarm.address, "1000000000000000000000000")

    //100万Daiデプロイする
    await daiToken.transfer(accounts[1], "1000000000000000000000000")
}