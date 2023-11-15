[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# Basic Requirements
1. Have Docker and docker compose installed
1. Have node >= v18.0.0

# Project

We have deployed all our services using Google Cloud Platform. Thus, you will not need to run any of the services aside.

The code for all the services can be found in this respository and their respective links can be found in the report in this repository.

The project is hosted [here](https://peer-prep-399105.an.r.appspot.com/).

## Accessing the Project

To access the project, we have provided you with the following accounts that would grant you access to the application:

```
Admin Account:
username: tanjianoway+1@gmail.com
password: password123

User Account:
username: tanjianoway@gmail.com
password: password123
```

Alternatively, if you wish to create an account you can also choose to do so. If you require an Administrator account please contact the developers.


### Running Locally
1. Clone this repository.
2. Ensure you have the following files:
```
1. frontend/.env
```
If you do not have any of these files, or any other files required for the Assignments, please contact the developers for a copy.

3. Ensure that you do not have anything running on port 80, and run the following command from the root directory:
```
docker compose up --build
```
3. The applcation can then be accessed at http://localhost.
# Assignments
Detailed below are the instructions required to run all Assignments from 1 to 5.
## Assignment 1

#### Running the Application

1. Download the code from [here](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g52/releases/tag/Assignment-1) and unzip it.
1. Run the following commands
```
cd frontend
npm i
npm run dev
```
3. The application is running here: http://localhost:5173
4. Access the application using the following credentials:
```
username: dummyuser@example.com
password: password
```

## Assignment 2

#### Running the Application

1. Download the code from [here](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g52/releases/tag/Assignment-2) and unzip it.
1. Ensure you don't have anything running on port 5173, 8000 and 8080.
1. Ensure you have the following files:
```
1. frontend/.env
2. user-service/.env
3. question-service/.env
4. question-service/serviceAccount.json
```

4. Ensure you have a postgres database running in the background locally and set it up with the following script
```
DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL,
 	email VARCHAR(254) UNIQUE,
	password VARCHAR(128),
	salt VARCHAR(32),
	PRIMARY KEY (email, password)
);
INSERT INTO users ("email", "password", "salt") VALUES ('alanwalker@gmail.com', '8979679e286b9130417aae3aeb750f78f07019c5ed3d409d13a228f990e5970cb8b3151d18e561cc3f00d1be20b0e369db6e86fdadc8bd68414010d6b245aa5e', 'caa238d2878974b52f64ec4cbec3953c');

```
5. Fill up user-service/.env with the following details:

```
DB_USER=<DB USERNAME>
DB_HOST=localhost
DB_NAME=<NAME OF YOUR DATABASE>
DB_PASSWORD=<DB PASSWORD>
DB_PORT=<PORT OF YOUR DATABASE>
```
6. To run the frontend:
```
cd frontend
npm i
npm run dev
```

7. To run the Question Service

```
cd question-service
npm i
npm run start
```

8. To run the User Service

```
cd user-service
npm i 
npm run start
```
9. The application is running here: http://localhost:5173
10. To access the application, create an account using the Register button and login using the account created
11. Alternatively, you can access the application with the account credentials:
```
username: alanwalker@gmail.com
password: password1
```
## Assignment 3
#### Running the Application

1. Download the code from [here](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g52/releases/tag/Assignment-3) and unzip it.
1. Ensure you don't have anything running on port 5173, 8000 and 8080.
1. Ensure you have the following files:
```
1. frontend/.env
2. user-service/.env
3. user-service/serviceAccount.json
4. question-service/.env
5. question-service/serviceAccount.json
```

4. Ensure you have a postgres database running in the background locally and set it up with the following script

```
DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id SERIAL,
 	email VARCHAR(254) UNIQUE,
	firebaseId VARCHAR(254) UNIQUE,
	PRIMARY KEY (email, firebaseId),
);
```
5. Fill up user-service/.env with the following details:

```
DB_USER=<DB USERNAME>
DB_HOST=localhost
DB_NAME=<NAME OF YOUR DATABASE>
DB_PASSWORD=<DB PASSWORD>
DB_PORT=<PORT OF YOUR DATABASE>
```
6. To run the frontend:
```
cd frontend
npm i
npm run dev
```

7. To run the Question Service

```
cd question-service
npm i
npm run start
```

8. To run the User Service

```
cd user-service
npm i 
npm run start
```
9. The application is running here: http://localhost:5173
10. To access the application, create an account using the Register button and login using the account created
11. Alternatively, you can access the application with the account credentials:
```
Admin Account:
username: tanjianoway+1@gmail.com
password: password123

User Account:
username: tanjianoway@gmail.com
password: password123
```

## Assignment 4
#### Running the Application

1. Download the code from [here](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g52/releases/tag/Assignment-4) and unzip it.
1. Ensure you don't have anything running on port 80, 8000 and 8080.
1. Ensure you have Docker Engine running in the background
1. Ensure you have the Docker plugin docker compose installed
1. Ensure you have the following files:
```
1. .env
2. frontend/.env
3. user-service/.env
4. user-service/serviceAccount.json
5. question-service/.env
6. question-service/serviceAccount.json
```
4. To run the application, run the following command:
```
docker compose up --build -d
```
5. The application is running here: http://localhost:80
6. To access the application, create an account using the Register button and login using the account created
7. Alternatively, you can access the application with the account credentials:
```
Admin Account:
username: tanjianoway+1@gmail.com
password: password123

User Account:
username: tanjianoway@gmail.com
password: password123
```
7. Remember to remove the containers after you are done using the following commands:
```
docker compose down -v
```
## Assignment 5
#### Running the Application

1. Clone the repository
2. Run the following commands
```
cd matching-service
npm install
```
2. Place the service_account_key.json file in the matching sevice folder
3. In the terminal run `export GOOGLE_APPLICATION_CREDENTIALS="service_account_key.json"`
4. In the terminal run `npm start`

