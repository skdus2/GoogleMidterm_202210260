# GoogleMidterm_202210260

API_KEY 및 데이터베이스 비밀번호 등을 담은 application.properties 파일은 빼고 push 하였습니다.  
만약 테스트를 원하신다면,  
*backend>src>main>resources>application.properties
```
spring.application.name=diet-ai-backend

spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.driver-class-name=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080

gemini.model.name=gemini-2.5-flash
gemini.api.url=
gemini.api.key=
```
위와 같이 데이터베이스 연결 및 api 연결하여 사용하시면 됩니다.  
(데모 시 AI는 gemini-2.5-flash 사용하였습니다.)  

- 구글캠퍼스프로젝트 중간 프로젝트과제
