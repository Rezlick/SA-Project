# SA_Project
This project is the main project for the System Analysis and Design subject, 
developed using React Vite (with TypeScript) and Go.

## Backend installation
To set up the backend, you'll need to install [go](https://go.dev/dl/) first.

Run the following commands to install the necessary Go packages:
```bash
go get -u github.com/gin-gonic/gin

go get -u gorm.io/gorm

go get -u gorm.io/driver/sqlite

go get -u github.com/dgrijalva/jwt-go

go get -u golang.org/x/crypto@v0.16.0
```
## Frontend installation
To set up the frontend, you'll need to install [node.js](https://nodejs.org/en/download/package-manager/current) first.

Run the following commands to install the necessary Node.js packages:
```bash
npm install --save react-router-dom@6.x

npm install antd --save

npm install axios --save

npm i antd-img-crop
```