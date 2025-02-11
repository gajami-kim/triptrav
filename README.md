# 트립트랩🧳
여행 일정 생성 및 여행지 추천 서비스

## 🖥프로젝트 소개
한국 관공 공사의 Tour API를 활용해 취향 분석 과정을 거쳐 관광지 추천 및 AI 분석, <br>
관광지와 주변 음식점을 한 눈에 볼 수 있고 카카오맵 API와 연동 시켜 관광지의 <br>
위치를 마킹, 일정을 만들고 사용자에게 공유할 수 있는 서비스를 제공하는 사이트 입니다. <br>
__SpringBoot MVC패턴을 기반으로 작업되었으며__ DB 생성, 유저관리, 일정생성, API 활용 등 <br>
백엔드와 프론트엔드 전반에 걸쳐 개발에 참여한 사이트입니다.

## ⏲개발 기간 및 참여인원
* 24.08 ~ 24.10
* 박동재, __김정온__, 오하은, 윤지명
## 
### 👩🏻‍💻 기여한 부분
__1. [일정 생성](#일정-생성)__ <br><br>
__2. [일정 편집](#일정-편집)__ <br><br>
__3. [동행자](#동행자)__ <br><br>
__4. [메모](#메모)__ <br><br>
__5. [프론트엔드 작업](#화면)__ <br><br>

##
## 일정 생성
- 일정 배열을 저장하는 setPlanData 함수를 사용합니다.
- 일정 탭에서 저장 버튼을 클릭하면 다음 정보를 DB에 저장합니다.
  - 여행지 이름
  - API 장소 ID
  - 여행일자(Day)
  - 일정 순서
- 단, 저장은 선택된 여행일자(Day)만 진행되며, 각 Day(1, 2, 3)는 개별적으로 DB에 저장됩니다.
![일정편집1](https://github.com/user-attachments/assets/326a4571-833d-436e-9bd5-7c28e9fd597b)
![일정 배열 생성](https://github.com/user-attachments/assets/58a37be9-8c17-4175-9176-6df1ccf19750)
![일정 DB](https://github.com/user-attachments/assets/2d4eb9a1-5e31-4ea3-9deb-0df76dbc2538)
<br><br>
#
## 일정 편집
- 일정 편집 역시 저장과 같은 방법으로 진행됩니다.
- 새로운 배열 생성 후 DB에 저장됩니다.
- 이 때, 이미 생성된 일정을 기반으로 여행지를 추천하거나 여행지를 검색할 수 있는 2 Tap을 이용할 수 있습니다.

#
## 동행자

#
## 메모

#
## 프론트엔드 작업

### [위로 올라가기](#프로젝트-소개)
