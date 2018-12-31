심심해서 만들었다.

이미지 생성시 google-cloud의 storage에 업로드하므로 https://console.cloud.google.com/apis/credentials 에서 키 등록을 해야한다.

다운로드 받은 json key의 경로를 `GOOGLE_APPLICATION_CREDENTIALS`이라는 이름의 환경변수로 등록할 것.

## 실행
```
## vue-cli 
npm install -g vue-cli
git clone https://github.com/rotoshine/jjalbang-maker.git
cd jjalbang-maker
npm install
npm run dev
```

## build
```
npm run build
```
