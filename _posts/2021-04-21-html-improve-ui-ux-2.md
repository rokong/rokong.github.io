---
date: 2021-04-21 22:57:00 +0900
title: "나만의 웹페이지 UI/UX 개선하기(2/2)"
excerpt: IndexedDB로 서버없이 html에 날개를 달아보아요 
header:
  overlay_image: https://user-images.githubusercontent.com/59322692/115569862-93314180-a2f8-11eb-9fd4-6f7c2f7227bd.png
categories: frontend javascript
---

## ajax만 써봐서 그런지

군대에 있을 때 InternetExplorer 8에서도 작동하는 페이지를 개발했던 나는 ES6 문법이나 W3C 최신 표준이 어색하다. DBR Viewer 1세대에서는
데이터를 불러올 때 ajax (jQuery 없이 쓸 때는 [XMLHttpRequest](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest)) 
를 사용하여 매번 요청을 보냈다. 하지만 이젠 CORS proxy에 제한이 생겨버린 request를 줄이고자 캐싱을 해야 하는데, 다행이도 [IndexedDB](https://developer.mozilla.org/ko/docs/Web/API/IndexedDB_API)
라는 게 존재하여 이를 활용해보기로 했다. 다만 비동기 프로그래밍이 익숙하지 않은 나란 사람을 배려하고자 라이브러리 처럼 최대한 활용하기 쉽게 구현해보기로 했다.

## repo.js

모던한 javaScript가 익숙하지 않은 개발자(특히 나)를 위해 최대한 활용하기 쉽게 IndexedDB를 지원하는 `repo.js`를 만들 것이다. 기존 1세대에서
사용하던 ajax를 쓰는 것 같으면서도 IndexedDB가 제공하는 DBMS스러운 기능들도 누릴 수 있는 방식으로 개발할 생각이다. 주요 메서드를 정리하자면
다음과 같다.

- \#ajax(String url) : CORS proxy를 통한 XMLHttpRequest를 수행하게 된다
- \#tx(String mode) : IndexedDB에 readwrite 또는 readonly로 transaction을 연다
- \#insert(String storeName, JSON Value) : DML의 INSERT 역할
- \#getValueByKey(String storeName, String key) : DML의 SELECT 역할. key로 한 건만 조회한다
- \#put(String storeName, JSON value) : DML의 UPDATE 역할

### 비동기적인 사용법

절차적인 프로그래밍 언어로 개발할 때는 

