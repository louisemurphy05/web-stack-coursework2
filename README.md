# Movie Recommendation App 🎬

## Overview
This is a full-stack web application that helps users discover movies based on their preferences. It reduces decision fatigue by providing personalised recommendations using user ratings and genres...

----------------------------------

## Features (user)
- User registration, login and logout 
- Browse popular and latest movies
- Search for movies
- Filter Movies by genre or popularity
- Rate and review movies
- remove reviews/movies from profile
- Receive recommendation of films
- Delete Account and Details

----------------------------------

## Features (admin)
- Admin Login and Logout
- Remove users
- View dashboard with stats
- Add/remove movies
- View and remove reviews
- Search users and reviews

----------------------------------

## Tech Stack 
Frontend: React.js  
Backend: Node.js + Express  
Database: MongoDB Atlas (Cluster)
Authentication: JWT + Bcrypt
External API: TMDB (The Movie Database)

----------------------------------

## Prerequisites
- Node.js installed (v14 or higher)
- Internet connection for TMDB API

----------------------------------

## Project Structure
movie-recommendation-app/
- backend/
- client/
- admin/

----------------------------------

## Install Dependancies

Admin:
cd ../Admin
npm install

Backend:
cd ../Backend
npm install

Client:
cd ../Client
npm install

----------------------------------

## Instructions
Connecting to our MongoDB instructions:
- First install if not already, MongoDB Compass
- Then once launched click new connection and input following
    - mongodb+srv://Guest:CineMatch123@cinematch.4paylaf.mongodb.net/
- Click 'Connect' 

- Please ensure that mongoDB database is up and running before attempting to run the Movie Recommendation App

Runnning the Movie Recommendation App instructions:

When attempting to run the Cloned GitHub repo, please open your computers command prompt and begin to intialise the backend, and frontend applications:

Backend:
- Open command prompt and input cd followed with the path of the backend's 'src' folder
- Then run 'node server.js' - You should see the connection of the Database and localHost

Expected Output:
Server running on port 5000
http://localhost:5000
Connected to MongoDB

Frontend (Client or Admin):
- After insitialising the Backend proceed to open another separate command prompt tab to initalise either of frontend applications 
- For either application repeat the previous path finding of 'cd' followed by the specific path of which frontend application you wish to use.
- then input the following to create a runnable website: 'npm run dev'
- you can either copy and paste the given URL or input the 'o' command for it to automatically take you to the login page of the chosen application

In-app instructions:

In order to enter admin application, a preset username and password has been implemented:
- username = admin
- password = admin

In order to enter user application, you will need to register an account on register page then re-enter the 
email and password on the login page

----------------------------------