// TokenFarm.sol
pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm{
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    // 7. これまでにステーキングを行ったすべてのアドレスを追跡する配列を作成
    address[] public stakers;

    // 4.投資家のアドレスと彼らのステーキングしたトークンの量を紐づける mapping を作成
    mapping (address => uint) public stakingBalance;

    // 6. 投資家のアドレスをもとに彼らがステーキングを行ったか否かを紐づける mapping を作成
    mapping (address => bool) public hasStaked;

    // 10. 投資家の最新のステイタスを記録するマッピングを作成
    mapping (address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }
    // 1.ステーキング機能を作成する
    function stakeTokens(uint _amount) public {
        // 2. ステーキングされるトークンが0以上あることを確認
        require(_amount > 0, "amount can't be 0");
        // 3. 投資家のトークンを TokenFarm.sol に移動させる
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // 5. ステーキングされたトークンの残高を更新する
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // 8. 投資家がまだステークしていない場合のみ、彼らをstakers配列に追加する
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        // 9. ステーキングステータスの更新
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, "caller must be owner");
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer((recipient), balance);
            }
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be 0");
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }    
}
