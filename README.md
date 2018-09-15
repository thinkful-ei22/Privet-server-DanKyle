# Privet! - Server

The Node.js api powering our [client application](https://github.com/thinkful-ei22/Privet-client-DanKyle) to learn Russian words based on the [spaced-repetition](https://en.wikipedia.org/wiki/Spaced_repetition) algorithm.

Check out the [live version here](https://privet-hello.herokuapp.com/).

## API - Request & Response examples

## Getting started

### Setting up the API server

Move into your projects directory:

```bash
  cd ~/YOUR_PROJECTS_DIRECTORY
```

Clone this repository:

```bash
  git clone https://github.com/thinkful-ei22/Privet-server-DanKyle YOUR_PROJECT_NAME
```

Move into the project directory:

```bash
  cd YOUR_PROJECT_NAME
```

Install the dependencies:

```bash
  npm install
```

Create a new repo on GitHub: https://github.com/new

* Make sure the "Initialize this repository with a README" option is left unchecked

Update the remote to point to your GitHub repository:

```bash
  git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME
```

### Working on the project

Move into the project directory:

```bash
  cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME
```

Run the development task:

```bash
  npm start
```

* Starts a server running at http://localhost:8080
* Automatically restarts when any of your files change

## Databases

The server is configured to connect to a MongoDB database using Mongoose. The `DATABASE_URL` defaults to `mongodb://localhost:27017/privet-backend`, but can be configured via environment variables. We recommend utilizing [dotenv](https://github.com/motdotla/dotenv) to store your variables locally in a `.env` file.

## Deployment

Instructions require the [Heroku CLI client](https://devcenter.heroku.com/articles/heroku-command-line).

### Setting up the project on Heroku

Move into the project directory:

```bash
  cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME
```

Create the Heroku app:

```bash
  heroku create PROJECT_NAME
```

Configure the database URL:

```bash
  heroku config:set DATABASE_URL=mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

If you are creating a full-stack app, you need to configure the client origin:

```bash
  heroku config:set CLIENT_ORIGIN=https://www.YOUR_DEPLOYED_CLIENT.com
```

### Deploying to Heroku

Push your code to Heroku:

```bash
  git push heroku master
```
