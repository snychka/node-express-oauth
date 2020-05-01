## 1. Building the Authorization Server

1. **Creating the authorization route** - In `authorization-server.js` create a new empty server route that accepts `GET` requests to the `/authorize` endpoint using the `app.get` method. The empty route should return a `200` status by default, using the `res.end()` method.
2. **Verifying the client ID** - Next, get the `client_id` param from the `req.query` object and verify if the client ID exists by checking the `clients` object in the same file. If the client ID does not exist, respond with a `401` status code using the `res.status` method. If the
