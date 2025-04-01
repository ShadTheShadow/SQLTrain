//Setting constants
const express = require('express');
const mysql = require('mysql2/promise');


var password;



async function initializeDatabase(){

    try {

        password = "EXAMPLE"; // Replace this with your actual password or method to fetch it securely

        console.log("Password: " + password);   

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'trains',
            password: password
        });

        const application = express();
        application.use(express.json());


        console.log("success");

        //Puts index.html in a public folder
        const path = require('path');
        application.use(express.static(path.join(__dirname, 'public')));


        const PORT = process.env.PORT || 3000;

        application.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        application.get("/test", async (request, response) => {
            

            try{
                const[results, fields] = await connection.query(
                    'SELECT * FROM `trains`.`untitled spreadsheet - regularities_by_liaisons_trains_france`'
                );
                console.log(results);
                response.send(results);
            }catch(error){
                console.log(error);
                response.status(500).send("Error fetching data from database.");
            }
        });





    } catch (error) {
        console.log(error);
    }
}

//Starts the server
initializeDatabase();