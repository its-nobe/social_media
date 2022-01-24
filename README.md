# TriloG

Live Website [**TriloG**](https://trilog-media.netlify.app)

## How to install
1. Install [Nodejs](https://nodejs.org/en/) according to your OS
2. Install [Mysql Database Service](https://dev.mysql.com/downloads/)
3. Clone this Repo
    ```sh
    git clone https://github.com/its-nobe/social_media.git
    ```
    **OR**
   Extract The Zip File

## Following is the Procedure to install all Packages for Server and Client:

### Server Side
```sh 
cd server
npm install
```
**If Sequelize does not work, Install it globally**
```sh
npm install -g sequelize sequelize-cli
```
_Run below command once to create tables:_
```sh
npm start
```
Run the [Trigger and Function Script](https://github.com/its-nobe/social_media/tree/main/server) in Command Line Client or WorkBench

### Client Side
```sh
cd client
npm install
```

## After Installing everything:
1. **Server**
    ```sh
    cd server
    npm start
    ```
2. **Client**
    ```sh
    cd client
    npm start
    ```
