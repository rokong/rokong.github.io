---
date: 2021-04-25 23:08:00 +0900
title: "무작정 이더리움의 contract를 만들어보았다"
excerpt: 처음뵙겠습니다. 여기가 그 유명한 블록체인 맛집인가요?
header:
  overlay_image: https://user-images.githubusercontent.com/59322692/116111423-990c9580-a6f1-11eb-9481-3759a967b227.png
  caption: "&copy; [**logo.wine**](https://www.logo.wine/logo/Ethereum)"
categories: ethereum
---

**글에 대한 설명** : **Mastering Ethereum** 이라는 책의 초반 부분을 읽으면서 따라한 과정을 담고 있다. 아직 Chapter 4. 밖에 안 읽었긴 하지만.
책의 내용은 [github](https://github.com/ethereumbook/ethereumbook) 에서 볼 수 있다.
{: .notice}

## Wallet(Account) 만들기

Ethereum에서 Contract를 한다는 것은 ether가 왔다 갔다 하는 것이다. ether를 다루려면 이를 보관할 수 있는 지갑이 필요한데, 그 역할을 할 수
있는 것이 바로 Account이다. Account를 쉽게 관리할 수 있도록 하는 *Wallet*을 통해 나의 Account를 만들어보자.

**Ether** : 이더리움의 화폐단위. 1 ether, 1 ETH, Ξ1, &#9830;1 모두 같은 단위를 가리킨다. 1 ether는 10<sup>18</sup> wei 라는 단위까지 쪼갤 수 있다.
{: .notice--info}

지금 사용할 Wallet은 브라우저(Chrome이나 Firefox 등) extension 형태인 [**MetaMask**](https://metamask.io/) 이다. 검색하여 설치하자.
그리고 검색할 때 화폐를 다루는 용도이니 리뷰와 다운로드 수를 확인하여 가짜가 아닌지 주의하자.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116092898-2a274080-a6e1-11eb-8042-9dc1c99a155b.png"
       alt="content_01">
  <figcaption>FireFox 에서의 MetaMask 설치 페이지</figcaption>
</figure>

<!--
<figure>
  <img src=""
       alt="content_01">
  <figcaption></figcaption>
</figure>
-->

설치는 금방 끝났고 초기 화면이 브라우저에 나타난다. *New to MetaMask?*라는 질문에는 **Yes, let's get set up!**(오른쪽)이라고 답하면 된다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116097439-1bdb2380-a6e5-11eb-99ed-0f23a67cf786.png"
       alt="content_02">
  <figcaption>(좌) 처음 설치했을 때. 커서를 따라 여우가 고개를 돌린다. / (우) 이미 seed phase가 있는지, 아니면 새로 만들건지 묻는다.</figcaption>
</figure>

그 다음에는 *Help Us Improve MetaMask*라는 명목으로 데이터 수집에 동의를 묻는다. **No Thanks**가 disabled처럼 생겨서 무조건 동의해야 하나
싶었는데 그런건 아니었다. 다음 화면으로 비밀번호를 설정한다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116098333-f4d12180-a6e5-11eb-81fe-3598c00a19c8.png"
       alt="content_03">
  <figcaption>(좌) 정보수집에 동의하시겠습니까? / (우) 사용할 비밀번호를 입력한다.</figcaption>
</figure>

이제 *Secret Backup Phrase*에 관한 화면에 나오게 되는데, 방금 설정한 비밀번호와 혼동되기 시작한다. 방금 만들었던 비밀번호는 MetaMask에 접속할 때 사용되는 것이고,
지금 나오는 Secret Backup Phrase는 백업이나 복구 시에 사용된다고 할 수 있겠다. 지금 브라우저에서 Wallet을 사용할 때는 비밀번호만 입력하면 되고
나중에 컴퓨터가 바뀌거나 다른 곳에서 Wallet을 쓸 일이 있다면 Secret Backup Phrase로 불러오면 되는 것이다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116104150-2ef0f200-a6eb-11eb-8782-57d84e0ca4ba.png"
       alt="content_04">
  <figcaption>(좌) Secret Backup Phrase를 저장한다. / (우) 잘 저장했는지 확인한다.</figcaption>
</figure>

화면에 나오는 단어를 알아서 간수한 뒤, 다음 화면에서는 Secret Backup Phrase를 잘 저장했는지 확인하게 된다.
방금 그 단어 순서대로 단어들을 선택하면 확인이 완료된다. 마지막으로 *Congratulations!* 라는 화면이 보이면 이제 MetaMask에
나의 Wallet이 생성된 것이다.

## Ether 채우기

새롭게 생성된 Wallet의 Account에는 Ether가 0일 것이다. 시험삼아 이더리움을 해보고자 저 Ether를 채우고자 진짜 돈을 쓰진 않을 것이다.
MetaMask 화면 오른쪽 위의 프로필 사진을 클릭하게 되면 *Networks*를 선택할 수 있게 되는데, 테스트 중 하나인 **Ropsten Test Network**를 선택하자.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116106116-e5090b80-a6ec-11eb-912a-6710219f2196.png"
       alt="content_05">
  <figcaption>이더리움 네트워크 선택 화면</figcaption>
</figure>

Test Network는 Mainnet과는 별개로, 부담없이 이더리움을 시험할 수 있는 환경이다. 여기서 ether를 얻는 방법으로는 구매나 채굴이 아닌
*Faucet*을 이용하면 된다.

* [https://faucet.metamask.io](https://faucet.metamask.io)
* [https://faucet.ropsten.be](https://faucet.ropsten.be)
* [https://faucet.dimensions.network](https://faucet.dimensions.network)

**참고** : 이 글을 작성할 당시에는 https://faucet.metamask.io 가 접속이 안 되고 있다. 나머지는 정상적으로 작동한다.
{: .notice--warning}

이 중 아무 Faucet에나 들어가서 내 Account 주소를 입력하면 Test Network 상의 ether가 이체된다. 이게 말로만 듣던 돈 복사인가.
위의 모든 링크들을 포함해 대부분의 Faucet들은 ether를 이체하는 데 제한이 있다. account별 또는 request IP 별로 사용 주기를 관리하니
마구 찍어낼 수는 없다. 그래도 10<sup>18</sup> 분의 1로 쪼개어 사용할 수 있으니 1 ether만 있어도 시험삼아 하기에는 아마 충분할 듯 싶다.

**Account 주소** : MetaMask에서 화면 위쪽의 *Account1 0xCBA2...e071*이라 되어있는 부분을 클릭하면 자신의 Account 주소가 복사된다.
{: .notice--info}

## Transaction 조회하기

Faucet에서 내 Account로 이체를 시켰는지 확인하고 싶다. 이더리움에 있는 모든 Address나 Contract나 Transaction등을 조회할 수 있는 페이지가 있는데,
바로 Etherscan이라는 웹사이트이다. Ropsten Test Network는 [https://ropsten.etherscan.io](https://ropsten.etherscan.io/) 에서 확인할 수 있다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116110087-58f8e300-a6f0-11eb-82cf-2ae94259f01e.png"
       alt="content_06">
  <figcaption>(좌) Etherscan 페이지. / (우) Account 주소를 검색한 화면.</figcaption>
</figure>

Etherscan 홈페이지에서 내 Account를 입력하면 내가 가진 ether의 양과 거래기록을 볼 수 있다. Faucet에서 이체 요청을 한지 얼마 안 되었다면
아직 Network상에 등록되지 않아 보이지 않을 수 있긴 한데, 시간이 좀 지나면 faucet에서 내 account로 transaction이 남을 것이다.
그럼 그 때 부터는 진정한 내 account의 ether가 되는 것이다.

## Contract 만들기

비트코인에게는 없는, 이더리움 만의 매력적인 요소 중 하나는 *Smart Contract* 라는 것이다. 비트코인은 블록체인에 코인이 오고가는 것만 기록할 수 있지만,
이더리움은 코인이 오고가는 어떤 특별한 프로그램도 기록할 수 있다. 이러한 것들을 바로 *Smart Contract*라고 부른다. 개인적으로 법정화폐의
지위를 호시탐탐 노리는 야망 가득한 비트코인보다 블록체인 위에서 이렇게 창의적으로 거래를 할 수 있는 이더리움이 더 쓸모있어 보인다.

### Solidity와 설치가 필요없는 IDE

*Smart Contract*를 개발에 주로 사용되는 언어는 [*Solidity*](https://docs.soliditylang.org/en/v0.8.4/#) 이다. 새로운 언어가 튀어나와서
걱정할 수 도 있을텐데, javaScript나 이런 저런 프로그래밍 언어를 다루어 보았으면 아마 쉽게 이해할 수 있을 것이다. 그리고 이를 컴파일하고 배포하는
과정 또한 신경이 쓰일 수 있지만, 우리에게는 IDE가 있다! Solidty 개발은 설치가 필요 없이 브라우저에서도 작동하는 [*remix IDE*](https://remix.ethereum.org)
위에서 진행할 것이다. IDE에 접속해보자.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116256514-37f6c780-a7ae-11eb-8866-b6707ef17f47.png"
       alt="content_07">
  <figcaption>remix IDE. 여기서 개발, 컴파일 그리고 배포까지 다 할수있단다... 와...</figcaption>
</figure>

### 코드 작성

IDE가 실행됬으면 왼쪽 *File Explorer*에서 `/contracts/` 디렉토리를 눌러보자. 이미 3개의 solidity 예제가 있지만 가볍게 무시하고 디렉토리를
우클릭하여 새 파일을 만들어보자. 파일 이름은 `Faucet.sol`로 하고 아래의 소스코드를 붙여넣는다. 간단히 contract에 대해 살펴보자.

```solidity
// From https://github.com/ethereumbook/ethereumbook/blob/develop/code/Solidity/Faucet.sol

/*- Solidity compiler 버전을 가리킨다. */
pragma solidity 0.6.4;

/*- 마치 어떤 클래스를 선언한 것과 같다. */
contract Faucet {
    /*- contract를 부를 때 어떠한 함수나 데이터도 포함하지 않았다면 실행된다. */
    /*- `external`하게 다른 address에서 이 contract로 ether를 `payable` 할 수 있다. */
    receive() external payable {}

    /*- parameter로 `unit` *(unsigned integer)* 를 받는다. */
    function withdraw(uint withdraw_amount) public {

        /*- 조건문이 false인 경우 contract를 멈추고 exception을 발생시킨다. */
        require(withdraw_amount <= 100000000000000000);

        /*- 이 Faucet 에게 transaction(`msg`)을 부른사람(`sender`)한테 */
        /*- `withdraw_amount` 만큼을 이체하라(`transfer`)는 것이다. */
        msg.sender.transfer(withdraw_amount);
    }
}
```

### Compile

compile은 *Solidty Compiler*(왼쪽 위에서 2번째 아이콘)에서 *Compile Faucet.sol*을 누르면 된다. compile된 결과는 `/contracts/artifacts/Faucet.json`에 위치한다. 그 중에서 data를 찾으면 된다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116260482-b0ab5300-a7b1-11eb-97fa-4b0f8a2139a7.png"
       alt="content_07">
  <figcaption>Faucet.json 안의 solidty의 compile된 코드</figcaption>
</figure>

### Deploy

이 contract를 blockchain에 deploy 하려면 IDE 왼쪽에 있는 *Deploy & Run Transaction*(왼쪽 위에서 3번째 아이콘)을 선택한다. Environment로
*Injected Web3*을 선택하면 이 IDE가 알아서 현재 브라우저에 있는 wallet을 연동시키려고 할 것이다. 그럼 모두 동의하고 IDE와 연결할 Account를 선택하면 된다.
그리고 나서 *Deploy*버튼을 누르면 blockchain으로 contract가 deploy 시작된다.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116262998-fa953880-a7b3-11eb-9700-b49d48a13f97.png"
       alt="content_08">
  <figcaption>(좌)remix의 배포화면. (우)gas fee 결제화면.</figcaption>
</figure>



## Transaction 만들기