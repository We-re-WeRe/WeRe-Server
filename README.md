# WeRe-Server

### 🚀 Latest version: 0.0.0
⚠️현재 개발 중인 프로젝트입니다.⚠️
코드를 보실 분은 develop 브랜치에서 확인부탁드립니다.

## Description

WeRe의 Server side Repository입니다.  
웹툰을 좋아하는 사람들을 위한 추천, 리뷰 확인 플랫폼을 제공합니다.

## Tech.

- NodeJS v20.11.1
- npm v6.14.17
- NestJS v9.1.5
- mysql v8.3.0
- jest v28.1.3

## Installation

```bash
$ yarn
```

## Running the app
env file should be set.
```bash
# development
# mySQL server should be turned on.
$ yarn start:local

# run program in docker
$ yarn start:docker

# production mode
$ yarn start:prod
```

env file keys
```
# env.local
DATABASE_HOST={your_host_name}
DATABASE_PORT={your_port}
DATABASE_USER={your_user_name}
DATABASE_PASSWORD={your_password}
DATABASE_NAME={your_database_name}
ACCESS_SECRET_KEY={your_access_token_secret_key}
REFRESH_SECRET_KEY={your_refresh_token_secret_key}
ACCESS_EXPIRATION_TIME={your_access_expiration_time}
REFRESH_EXPIRATION_TIME={your_refresh_expiration_time}
```
when using docker, you need this file too.
```
# env.db
MYSQL_DATABASE={your_database_name}
MYSQL_ROOT_HOST={your_host_name}
MYSQL_ROOT_PASSWORD={your_password}
```


## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Stay in touch

- Author - [Geonu Lim](https://github.com/rjsdn0124)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

Nest is [MIT licensed](LICENSE).

Updated at 2024.03.03
