# naver-works-lunch-bot

![lunch-bot-greeting](https://user-images.githubusercontent.com/20259189/163094317-18d5f170-3128-407d-845e-54951390e448.png)

업무용 메신저 '네이버 웍스'에서 사용할 수 있는 **'뭐 먹지 봇'** 입니다.

## Motivation
점심 시간이 다가오면 팀원들끼리 무엇을 먹을 지 고민하곤 합니다.  
투표를 통해 정하기도 하고, 각자 자기가 먹고 싶은 것을 따로 시켜 먹기도 합니다.  
업무용 메신저에서 의견을 종합해 점심 메뉴를 취합하곤 했는데,  
매일 매일 메뉴를 취합하는 것이 누군가에겐 '일'이 되기도 했습니다.  
누군가들이 더 중요한 일에 힘을 쏟게 하고 싶었습니다.  
그래서 만들었습니다. **'뭐 먹지 봇'**.


## Goal
- 유저로부터 입력 받은 메뉴를 취합해 보여준다. **(Motivation)**
- `![명령어] [옵션]? [옵션2]?` 포맷으로 동작한다.
- 위 포맷을 바탕으로 이후 새로운 명령어를 **추가/확장하기** 용이하게 구현한다.
- 유저의 입력으로부터 발생할 수 있는 예외에 대해 대처해둔다.


## Available commands
- !명령어
- !점심
- !음료
- !유저


## How to use
`!명령어`  
<img width="404" alt="help" src="https://user-images.githubusercontent.com/20259189/163131873-7a375e91-0808-47cd-a7f2-ae135b8ec7c5.png">

`!점심`  
<img width="404" alt="lunch" src="https://user-images.githubusercontent.com/20259189/163131438-188cd901-790e-478a-8376-afade20213da.png">

`!음료`  
<img width="400" alt="beverage" src="https://user-images.githubusercontent.com/20259189/163132452-340fc9d9-b502-4010-a500-762eaba1d664.png">
