# Out of Office

[![Out-Of-Office](https://github.com/jrk12b/Out-Of-Office/actions/workflows/node.js.yml/badge.svg)](https://github.com/jrk12b/Out-Of-Office/actions/workflows/node.js.yml)

[Out of Office App](https://out-of-office-app-b55595fc51c3.herokuapp.com/login)

Out of Office is a powerful tool to manage and plan your time off. The app allows you to track your available PTO days, see how many are remaining, and view a calendar of your planned PTO days. You can also set non-PTO days, add notes, and use the built-in habit tracker tab to create and track daily habits with visualizations over time. Whether you’re planning vacations or building better routines, Out of Office helps you stay organized and in control.

## Deployment and Hosting

- Domain is purchased and managed on Wix
- Hosting Platform for deployment: Heroku. Deployments are done manually in Heroku UI. Deployment is controled through Procfile.
- DB is hosted in MongoDB.
- Time of day can also be run locally (as described below).

## Tech Stack

- `Node.js` - JavaScript runtime environment and engine.
- `React` - JavaScript front-end library.
- `Express` - Backend web application framework for building RESTful APIs.
- `MongoDB/Mongoose` - No-SQL Database.
- `Heroku` - Cloud application platform used for deployment and hosting. It manages scaling, environment variables, and running both frontend and backend apps.

## Installation

1. Clone repo locally

- `git clone https://github.com/jrk12b/Time-Of-Day.git`

2. Install Dependencies

- `npm i`

3. Start backend server

- `node backend/server.js`

4. Start app

- `npm start`

## Usage

- `npm run format-write` - run prettier formatter locally.
- `npm run lint` - run esLint locally