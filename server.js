//Here we sets up an Express.js server, 
//configure it to parse JSON data, enable CORS, and listen on port 8000.

const PORT =  8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json()) //allows us to work with json when we start sending sending stuff from the frontend to the backend without post requests
app.use(cors()) //allows your server to accept requests from different origins or domains. This is useful when your frontend and backend are hosted on different domains, as it ensures that the browser allows the frontend to make requests to the backend.

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))