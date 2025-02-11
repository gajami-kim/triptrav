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
__1. [일정 생성](#일정-생성)__ <br>
  <br> - [Flatpickr](#f--latpickr) <br>
  <br> - [일정이 있는 경우](#--일정있음) <br>
  <br> - [일정이 없는 경우](#--일정없음) <br><br>
__2. [일정 편집](#일정-편집)__ <br>
  <br> - [여행지 추천](#--여행지-추천) <br>
  <br> - [검색](#--검색) <br>
  <br> - [편집 제한](#--편집-제한) <br><br>
__3. [동행자](#동행자)__ <br><br>
__4. [메모](#메모)__ <br><br>
__5. [프론트엔드 작업](#화면)__ <br><br>

##
## 일정 생성
#### - Flatpickr
- Flatpickr를 사용하여 여행의 출발일과 종료일을 선택합니다.
![플랫피커](https://github.com/user-attachments/assets/afd1d953-0ce5-4489-95ab-8b248c13ff32) <br>
![일정생성 캘린더 라이브러리](https://github.com/user-attachments/assets/3a7b5522-f90d-4835-9ae9-86d3090bdc22) <br><br>
- 선택한 출발일과 종료일을 기준으로 총 여행 기간을 계산합니다.
- 제한 사항:
  - 종료일은 출발일보다 빠를 수 없습니다.
  - 여행 기간은 최대 2박 3일까지만 설정할 수 있습니다.
![일정생성 2박3일 제한](https://github.com/user-attachments/assets/074ab8dc-5870-4c4b-ba54-fb8e7d380f93) ![일정생성 도착일제한](https://github.com/user-attachments/assets/ce40f9a6-974a-4a45-aecf-ef4d62498f67) <br>
 <br><br>

#### - 일정이 있는 경우
- 일정이 있는 경우 여행 기간과 상관없이 첫째 날의 마지막 여행으로 추가됩니다.
![여행생성 - 기존](https://github.com/user-attachments/assets/ba3fb1de-e3d9-4981-a543-c8bc2acfcbe8) <br>
![이미 있던 일정에 추가](https://github.com/user-attachments/assets/9e2fbcb7-7bf5-49e6-abf3-792f63b57057) <br><br>

#### - 일정이 없는 경우
- 일정이 없는 경우, 일정 없음 페이지를 표시하고 일정을 생성하도록 유도합니다.
- 제목과 여행일을 DB에 저장하며, 첫째 날의 첫 번째 여행으로 추가됩니다.
![여행생성](https://github.com/user-attachments/assets/5282e36f-d76b-41e3-b884-1810461b6f86) <br>
![일정없음](https://github.com/user-attachments/assets/21fe70d3-a73e-4b0e-b09e-2df8df081d1f) <br><br>

#
## 일정 편집
- 일정 배열을 저장하는 setPlanData 함수를 사용합니다.
- 일정 탭에서 저장 버튼을 클릭하면 편집된 정보를 DB에 저장합니다.
  - 여행지 이름
  - API 장소 ID
  - 여행일자(Day)
  - 일정 순서
- 단, 저장은 선택된 여행일자(Day)만 진행되며, 각 Day(1, 2, 3)는 개별적으로 DB에 저장됩니다.
- 후에 사용자에게 sche_index번호를 기준으로 여행지 순서를 출력합니다.
![일정편집1](https://github.com/user-attachments/assets/326a4571-833d-436e-9bd5-7c28e9fd597b)
![일정 배열 생성](https://github.com/user-attachments/assets/58a37be9-8c17-4175-9176-6df1ccf19750)
![일정 DB](https://github.com/user-attachments/assets/2d4eb9a1-5e31-4ea3-9deb-0df76dbc2538)

#### - 여행지 추천

#### - 검색

#### - 편집 제한


#
## 동행자

#
## 메모

#
## 프론트엔드 작업

### [위로 올라가기](#프로젝트-소개)
