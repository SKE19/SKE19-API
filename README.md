# SKE19 RESTful API
**Host status: No host yet (in-development)**

A web-based RESTful API for querying information of SKE19 students.

Currently there are only GET routes for this API, more features will be implemented later. The responses of the API are always `application/json`. See below for routes for this API.

## Routes

### `/student:id`
GET information about the student with the given ID.

Example response:
```json
{
    "6410xxxxxx": {
        "firstname_th": "ชื่อจริง",
        "lastname_th": "นามสกุล",
        "firstname_en": "First Name",
        "lastname_en": "Last Name",
        "instagram": "@instagram.id",
        ...
    }
}
```

### `/students`
GET all the students information.

Example response:
```json
{
    "students": {
        "6410xxxxx1": {...},
        "6410xxxxx2": {...},
        "6410xxxxx3": {...},
        ...
    }
}
```

## Contribution (or just Building for yourself)
After cloning the repository, you should navigate to your repo folder, and type in terminal:

```
npm install
```

Then, you should make a new `.env` file, here's the emptied environment file:

```
PORT=
```

After that, you should be able to start the API by:

```
npm run dev
```
