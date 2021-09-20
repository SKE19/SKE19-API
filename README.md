# SKE19 RESTful API
**Host status: Online @ https://ske19-api.herokuapp.com/**
**Current API version: 1.0.1**

A web-based RESTful API for querying information of SKE19 students.

Currently there are only GET routes for this API, more features will be implemented later. The responses of the API are always `application/json`. See below for routes for this API.

## Contribution (or just Building for yourself)
After cloning the repository, you should navigate to your repo folder, and type in terminal:

```
npm install
```

Then, you should make a new `.env` file, here's the emptied environment file:

```
PORT=3000
DATA_PATH=path/to/your/data/file
```

After that, you should be able to start the API by:

```
npm run dev
```
