const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const bodyParser = require("body-parser");
const app = express(); 
const PORT = process.env.PORT || 5000;
console.log(PORT);

app.use(bodyParser.json());
app.use(cors());
console.log('connection established');


app.post("/signup",(request, response) => {
    const username = request.body["username"];
    const email = request.body["email"];
    const password  = request.body["password"];
    const insert_statement = `INSERT INTO clients ( username, email, password ) VALUES ('${username}', '${email}', '${password}');`;

        pool.query(insert_statement).then((response) => {
            console.log("Data Saved");
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })

        response.send("Response Recieved: " + request.body);
});

app.post("/login", (request, response) => {
    const username = request.body["username"];
    const password = request.body["password"];
    const select_statement = `SELECT username, password FROM clients;`; 

    var flag = 0;

    pool.query(select_statement).then((sql_response) => {
        for (let count = 0; count < sql_response.rowCount; count++) {
            if (sql_response.rows[count].username == username && sql_response.rows[count].password == password) {
                flag = 1;
                
            }
        }

        if (flag == 1) {
            console.log("Data Extracted");
            console.log("From server:", username);
            response.send({username: username});
        }
        else {
            response.status(400).send({
                message: 'Please Re-Enter Valid Information!'
            });
        }
    })
    .catch((error) => {
        console.log('Connection Error', error);
    })
})

app.post("/charging_stations", (request, response) => {
    const location_query = 'SELECT * FROM charging_stations';
    const responseData = [];

    pool.query(location_query, (locationError, locationResults) => {
        if (locationError) {
            throw locationError;
        }
        locationResults.rows.forEach(locationrow => {
            const locationData = {
                station: locationrow.Station,
                location: locationrow.location
            };
            responseData.push(locationData);
            if (responseData.length === locationResults.rows.length) {
                response.json(responseData);
            }
        });
    })
})

app.post("/confirmSlot", (request, response) => {
    const username = request.body["username"];
    const location = request.body["location"];
    const slot  = request.body["slot"];
    const insert_statement = `INSERT INTO slotbook ( uname, clocation, btime ) VALUES ('${username}', '${location}', '${slot}');`;

        pool.query(insert_statement).then((response) => {
            console.log("Data Saved");
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })

        response.send("Response Recieved: " + request.body);
})

app.listen(PORT, () => {

    console.log('Server is running on port ${PORT}');
  
});


