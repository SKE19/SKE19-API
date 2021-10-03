# SKE19 RESTful API [![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/90vd.svg)](https://betteruptime.com/?utm_source=status_badge)

### Version: 1.1.0

**URL: https://ske19-api.herokuapp.com/**

A web-based RESTful API for querying information of SKE19 students, with AWS DynamoDB for database.

## Contribution (or just Building for yourself)
Make sure that you have set up **AWS** with **IAM** user and **DynamoDB**.

After cloning the repository, you should navigate to your repo folder, and type in terminal:

```
npm install
```

Then, you should make a new `.env` file, here's the emptied environment file:

```
PORT=3000
SECRET_IDENTIFIER=key_for_jwt

DATA_TYPE=[FILE|HTTPS]
DATA_PATH=path/to/your/csv

ENABLE_AWS=[true|false]
AWS_ACCESS_KEY_ID=aws_key
AWS_SECRET_ACCESS_KEY=aws_secret
AWS_REGION=aws_region

MAX_DISCORD_COUNT=2
```

After that, you should be able to start the API by:

```
npm run dev
```
