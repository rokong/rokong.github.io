---
date: 2021-04-25 23:08:00 +0900
title: "무작정 이더리움의 contract를 만들어보았다"
excerpt: 처음뵙겠습니다. 여기가 그 유명한 블록체인 맛집인가요?
header:
  overlay_image: https://user-images.githubusercontent.com/59322692/115996783-b2431280-a61b-11eb-9933-1ae1e4fe5811.png
caption: "&copy; [**O'reilly**](https://www.oreilly.com/)"
categories: ethereum
---

**글에 대한 설명** : **Mastering Ethereum** 이라는 책의 초반 부분을 읽으면서 따라한 과정을 담고 있다. 아직 Chapter 4. 밖에 안 읽었긴 하지만.
책의 내용은 [github](https://github.com/ethereumbook/ethereumbook) 에서 볼 수 있다.
{: .notice--info}

## Account 만들기

Ethereum에서 Contract를 한다는 것은 ether가 왔다 갔다 하는 것이다. ether를 다루려면 이를 보관할 수 있는 지갑이 필요한데, 그 역할을 할 수
있는 것이 바로 Account이다. Account를 쉽게 관리할 수 있도록 하는 *Wallet*을 통해 나의 Account를 만들어보자.

**Ether** : 이더리움의 화폐단위. 1 ether, 1 ETH, Ξ1, &#9830;1 모두 같은 단위를 가리킨다. 1 ether는 10<sup>18</sup> wei 라는 단위까지 쪼갤 수 있다.
{: .notice--info}

### MetaMask 설치

지금 사용할 Wallet은 브라우저(Chrome이나 Firefox 등) extension 형태인 [**MetaMask**](https://metamask.io/) 이다. 검색하여 설치하자.
그리고 검색할 때 화폐를 다루는 용도이니 리뷰와 다운로드 수를 확인하여 가짜가 아닌지 주의하자.

<figure>
  <img src="https://user-images.githubusercontent.com/59322692/116092898-2a274080-a6e1-11eb-8042-9dc1c99a155b.png"
       alt="content_01">
  <figcaption>FireFox 에서의 MetaMask 설치 페이지</figcaption>
</figure>

<figure>
  <img src=""
       alt="content_01">
  <figcaption></figcaption>
</figure>

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

<figure>
  <img src=""
       alt="content_04">
  <figcaption></figcaption>
</figure>