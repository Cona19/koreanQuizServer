# KoreanQuizServer

**KoreanQuizServer는 SWMaestro 1차 과제 수행을 위해 앱과 연동되는 RESTful web service 입니다**  

## 목적
- 우리말을 재미있는 퀴즈를 이용해 학습
- 서버와의 연동을 통해 실시간 사전데이터 업데이트
- 자신의 전적 및 통계를 실시간으로 확인가능

## nodejs, npm install
``` bash
$ sudo apt-get install npm
$ sudo apt-get install nodejs
```

## Server install
``` bash
$ git clone https://github.com/Cona19/koreanQuizServer.git
$ cd koreanQuizServer
$ npm install
```

## Database install
``` bash
$ sudo apt-get install mongodb
$ sudo mongod &
```

## Run
``` bash
$ npm start
```

## 설명
- package.json : 현재 패키지에 관한 정보와 의존 module들을 기술.
- app.js : node.js 기반으로 서버를 구성 및 mongodb 연결등 서비스 제공을 위한 기본적인 작업을 수행.
- models/ : 사용하는 collection을 정의하여 node.js에서 사용할 수 있도록 함.
- routes/ : express에 의해 RESTful web service를 제공하기 위해 각 요청별로 분류하여 처리함.

