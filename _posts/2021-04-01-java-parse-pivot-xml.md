---
date: 2021-04-01 00:17:00 +0900
title: "Oracle PIVOT XML을 파싱하기"
excerpt: PIVOT을 동적으로 사용하려면 XML 형태로 받을 수 밖에 없다. 그걸 java가 받아서 풀어보겠다.
categories: sql oracle java
---

## PIVOT을 쓰면서 아쉬웠던 점

여러 행에 걸쳐 조회되는 결과를 `PIVOT`을 통해 여러 열을 생성하여 한 행만으로도 표현할 수 있었다. 이런 대단한 기능을 자체 내장함수로
지원한다는 점에서 마음에 들었지만 아쉬웠던 것은 하나 있다. 바로 **일일이 생성할 열의 값을 선언해 주어야 한다**는 것이다.

## CLOB를 처리하자

Mybatis에서 resultType을 일반적인 Map으로 정의하고 사용한다면 CLOB 타입을 조회할 떄는 오류가 발생한다. 이를 해결하는 방법들을 간단히 소개하겠다.

첫번째로 **CLOB를 VARCHAR2로 형 변환(Cast)** 을 하는 방법은 다음과 같다.
```sql
SELECT CAST(XML_DOC, VARCHAR2(4000)) /* VARCHAR2는 4000byte 까지 */
  FROM TAB_XML
```
한계점으로는 4000바이트가 넘어가는 데이터에 대해서는 뒤가 잘린다...는 점이다.
그 다음으로 **resultMap에서 CLOB를 java.lang.String으로 매핑**하는 방법이다.
```xml
<resultMap id="clob" type="HashMap">
    <result property="xmlDoc" column="XML_DOC" jdbcType="CLOB" javaType="java.lang.String" />
    <!-- property : key(in Java) / column : columnName(in SQL) -->
</resultMap>

<!-- resultType이 아니라 resultMap이다. -->
<select id="selectXmlDocument" parameterType="Map" resultMap="clob">
SELECT XML_DOC
  FROM TAB_XMl
</select>
```
이 역시 일일이 resultMap을 정의해 줘야한다는 것 자체가 귀찮다는 것이 가장 큰 걸림돌이다.
마지막으로는 CLOB는 아니지만 BLOB로 Cast하여 byte[]에 담아 처리하는 방법도 있다.

```sql
SELECT PIVOT_XML BLOB -- XML을 BLOB로 변환한다.
  FROM TAB_XML
```

```java
// byte[]를 String으로 보기 좋게 만든다.
String pivotXml = new String(PIVOT_XML);
// ...
```

## Handler 설정하기

XML Document를 DB에서 Java의 영역으로 어떻게든 무사히 가져왔다면 이를 Map 형식으로 변환할 차례이다.


## Parser 객체 구현하기

## 실전활용