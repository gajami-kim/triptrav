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
__3. [동행자](#동행자)__ <br>
  <br> - [동행자 추가](#--동행자-추가) <br>
  <br> - [동행자 삭제](#--동행자-삭제) <br>
  <br> - [동행자 권한 편집](#--동행자-권한-편집) <br><br>
__4. [메모](#메모)__ <br><br>
__5. [프론트엔드 작업](#프론트엔드-작업)__ <br><br>

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
![이미 있던 일정에 추가](https://github.com/user-attachments/assets/37f3fe5b-5b27-406c-b80c-b3ff15c63c18) <br><br>

#### - 일정이 없는 경우
- 일정이 없는 경우, 일정 없음 페이지를 표시하고 일정을 생성하도록 유도합니다.
- 제목과 여행일을 DB에 저장하며, 첫째 날의 첫 번째 여행으로 추가됩니다.
![여행생성](https://github.com/user-attachments/assets/5282e36f-d76b-41e3-b884-1810461b6f86) <br>
![일정없음](https://github.com/user-attachments/assets/2154a7e6-53de-4f48-94bc-8384a24d21aa) <br><br>

#
## 일정 편집
- 일정 배열을 저장하는 setPlanData 함수를 사용합니다.
![일정 배열 생성](https://github.com/user-attachments/assets/58a37be9-8c17-4175-9176-6df1ccf19750) <br><br>
- 일정 탭에서 저장 버튼을 클릭하면 편집된 정보를 DB에 저장합니다. 
  - 여행지 이름
  - API 장소 ID
  - 여행일자(Day)
  - 일정 순서
- 단, 저장은 선택된 여행일자(Day)만 진행되며, 각 Day(1, 2, 3)는 개별적으로 DB에 저장됩니다.
- 후에 사용자에게 sche_index번호를 기준으로 여행지 순서를 출력합니다.
![일정편집1](https://github.com/user-attachments/assets/326a4571-833d-436e-9bd5-7c28e9fd597b) <br>
![일정 DB](https://github.com/user-attachments/assets/2d4eb9a1-5e31-4ea3-9deb-0df76dbc2538) <br><br>

#### - 여행지 추천
- 선택한 여행일자의 마지막 여행지의 좌표를 기준으로 추천 여행지를 출력합니다.
- 여행지의 좌표를 활용하여, Tour API에서 제공하는 근처 여행지를 거리 순으로 나열합니다.
![추천여행지](https://github.com/user-attachments/assets/23a1cc63-5b17-49c6-bffe-7f34b5eee929) <br>
![일정 2dep 추천](https://github.com/user-attachments/assets/b330c2ea-d7cf-4335-b7a7-a770a5cd7f80) <br><br>

#### - 검색
- 검색에는 초기 출력값과 검색 후 결과값이 있습니다.
- 초기 출력값은 여행지 추천과 마찬가지로 마지막 여행지를 기준으로 하되, 
  좌표가 아닌 지역 코드를 사용하여 해당 지역 코드에 속하는 여행지를 가나다순으로 출력합니다.
- 검색을 진행하면, 입력한 키워드(search)를 기반으로 Tour API에서 제공하는 검색 결과를 출력합니다.
![검색1](https://github.com/user-attachments/assets/74346622-2b91-43d9-b8cd-d2d38ea9b5c5) <br>
![일정 2dep 검색](https://github.com/user-attachments/assets/907153ab-9138-421a-9f75-f61eae303c53) <br><br>

#### - 편집 제한
- 편집이 제한되는 경우는 두 가지입니다.
  - 편집 권한이 없는 동행자 유저의 접근
  - 현재 날짜를 기준으로 여행 종료일이 지난 경우
![동행자 유저의 일정편집 시도](https://github.com/user-attachments/assets/fba3fa89-807b-428b-ae30-ac9cb566b2f1) <br>
![종료된 여행](https://github.com/user-attachments/assets/b8fa9c77-57a1-4818-9184-e26171585529) <br><br>

#
## 동행자
#### - 동행자 추가
- 처음 일정을 생성한 유저는 초대 토큰을 이용해 동행자를 초대할 수 있습니다.
- 초대 토큰에 AES 암호화를 적용하여 보안성을 강화하였습니다. 
![암호화 복호화 다시작성](https://github.com/user-attachments/assets/7aa9e591-01b1-4598-bef7-001827d87ad6) <br><br>

- 클립보드 라이브러리를 이용하여 초대 토큰을 복사할 수 있도록 하였습니다. 
![동행자 초대 클립보드](https://github.com/user-attachments/assets/1a6ff87b-c24c-4e10-8ea4-d77cc55caea6) <br>
![동행자 추가 클립보드](https://github.com/user-attachments/assets/479977b4-b983-4776-9ef7-afe00679a192) <br><br>

- 초대받은 유저는 초대 URL로 접속 후 confirm 창에서 초대 수락 여부를 결정할 수 있습니다.
- 초대를 수락하면 동행자 권한으로 여행에 참여하게 됩니다.
![여행에 참여하겠냐는 confirm](https://github.com/user-attachments/assets/2086de9a-d921-43fb-bd2d-ce61dd0ec446) <br><br>

- 동행자 추가 시 권한(sche_role), 여행번호(sco), 유저번호(uno)가 함께 저장됩니다.
![권한 DB](https://github.com/user-attachments/assets/e9ebc1fb-b158-4a13-be5e-2df126b922ad) <br><br>

#### - 동행자 삭제
- 편집자 권한을 가진 유저는 동행자를 삭제할 수 있습니다.
- 삭제 전 confirm 창을 통해 정말 삭제할 것인지 확인합니다.
- 수락하면 해당 유저는 여행에서 삭제됩니다.
![동행자 권한 삭제](https://github.com/user-attachments/assets/a8d83c61-6a45-4aad-95f9-9ab91fecbd30) <br><br>

#### - 동행자 권한 편집
- 편집자 유저만 동행자 권한을 편집할 수 있습니다.
- 권한은 편집자, 동행자, 삭제로 결정할 수 있습니다.
- 편집자는 동행자 권한 편집, 일정 편집, 메모 작성 및 확인이 가능하며, 
  동행자는 메모 작성 및 확인, 동행자 확인만 할 수 있고, 여행 편집이나 동행자 권한 편집은 할 수 없습니다.
![동행자 권한 업데이트](https://github.com/user-attachments/assets/d0a053e8-d9d4-41a7-9107-6a53ba10130e) <br>
![동행자 권한 업데이트 함수](https://github.com/user-attachments/assets/8f8c076b-873e-4ed3-a473-879a0e0204a2) <br>
![동행자 권한 편집](https://github.com/user-attachments/assets/fe44948f-02ff-42b1-8d95-7b6b8d3b0978) <br>
- 동행자 권한은 편집 버튼이 보이지 않습니다.
![동행자 있을때](https://github.com/user-attachments/assets/4359f029-9018-4dd6-ae8f-47e2a797c776) <br><br>

#
## 메모
- 메모 작성 및 편집이 가능합니다.
- 순서대로 메모 저장, 메모 수정 및 삭제 코드입니다.
![메모 저장](https://github.com/user-attachments/assets/da588f55-9dc3-4b46-8726-263376cd2bef) <br>
![메모 수정 및 삭제](https://github.com/user-attachments/assets/86037bf2-0535-47c7-9e8c-ea77059e4e91) <br><br>

#
## 프론트엔드 작업
- 상단 이미지는 드래그하여 슬라이드할 수 있도록 구현했습니다.
- 이미지가 로드된 후, 전체 슬라이드 길이를 계산하여 양 끝에서는 드래그가 불가능하도록 설정했습니다.
![슬라이드 길이 계산 함수들](https://github.com/user-attachments/assets/34c55550-34fd-4ff7-a5aa-f8a1420b4381) <br>
![슬라이드 움짤](https://github.com/user-attachments/assets/a6a19222-1286-47f0-9568-75614bf119bc) <br><br>

### [위로 올라가기](#프로젝트-소개)
