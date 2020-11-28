# 고민사거리
고민사거리는 대학생들의 식사고민을 덜어주기 위해 제작된 웹application입니다. 숭실대 근처(일명 고민사거리, 사거리에서 무엇을 먹을지 고민이 된다는 의미)의 식당들을 종류별로 카테고리화 했습니다. 랜딩페이지에서 랜덤추천 및 고민사거리맵을 이용할 수 있고, 메뉴페이지에서 메뉴별 식당들을 조회할 수 있습니다. pick기능으로 원하는 식당을 mypick에 담아 둘 수 있습니다. 


## How to install
1. clone : 로컬로 저장소를 클론합니다.
```
$ git clone https://github.com/Juhyung98/web_project.git
```
2. npm install : 루트 디렉토리에서 아래의 명령어로 모듈들을 설치합니다.
```
$ npm install && cd client && npm install
```

## How to use
- react 서버 실행 방법 : 루트 디렉토리에서 아래의 명령어를 실행합니다.
```
$ npm run client
```
- node 서버 실행 방법 : 루트 디렉토리에서 아래의 명령어를 실행합니다.
```
$ npm run server
```
- react, node 서버 동시 실행 방법 : 루트 디렉토리에서 아래의 명령어를 실행합니다.
```
$ npm run dev
```

- 데이터 custom 하기 : 루트 디렉토리에 json_datas.json이름의 파일을 생성하고, 아래의 형식처럼 데이터들을 저장해줍니다.
```
[
  {
    "id": "1",
    "name": "식당이름",
    "address": "식당주소",
    "latitude": "위도", 
    "longitude": "경도",
    "type": "식당종류", (ex : '한식', '중식', '일식', '고기', '분식', '호프', '술집', '패스트푸드', '카페', '디저트', '기타')
    "menu": "메뉴",
    "img": "이미지",
    "img_source": "이미지출처"
  }, ...
  ]
```

- 각종 key들 설정법
```
// database.json
// mysql을 통해 DB 생성 후 작성
{
    "host":"호스트",
    "user":"유저",
    "password":"비밀번호",
    "port":"포트번호",
    "database":"database이름"
}
// jwt_key.json
{
    "value": "키"
}
// client/config/appKey.json
// map을 띄우기 위해 사용하는 카카오API키를 발급 받아야 함.
{
    "value": "카카오API키"
}
```

## Tech Stack
- React
- Node.js
- Mysql
- Aws EC2
- Kakao Map Api

## License
MIT LICENSE
