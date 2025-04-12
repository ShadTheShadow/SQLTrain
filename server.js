//Setting constants
const express = require('express');
const mysql = require('mysql2/promise');

var password;

async function getPassword(){
    const fs = require('fs');
    try {
        const configData = fs.readFileSync('./public/config.json', 'utf-8');
        const config = JSON.parse(configData);
        password = config.password;
        console.log("PASSWORD RETRIEVED");
    } catch (error) {
        console.error("Error reading or parsing config file:", error);
    }
}




async function initializeDatabase(){

    try {

        await getPassword();  

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'trains',
            password: password
        });

        const application = express();
        application.use(express.json());


        console.log("success");

        //Ensures index.html is in the public directory
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


        application.get('/startLocs', async (request, response) => {

            try{
                const[results, fields] = await connection.query(
                    'SELECT DISTINCT `Departure station` FROM `trains`.`untitled spreadsheet - regularities_by_liaisons_trains_france`'
                );
                console.log(results);
                response.send(results);

            }catch(error){
                console.log(error);
                response.status(500).send("Error fetching data from database.");
            }

        });


        application.get('/endLocs', async (request, response) => {

            try{
                const[results, fields] = await connection.query(
                    'SELECT DISTINCT `Arrival station` FROM `trains`.`untitled spreadsheet - regularities_by_liaisons_trains_france`'
                );
                console.log(results);
                response.send(results);

            }catch(error){
                console.log(error);
                response.status(500).send("Error fetching data from database.");
            }

        });


        application.get('/findDirectPath', async (request, response) => {

            
            try{

                const start =  request.query.start;
                const end = request.query.end;
                const year = request.query.year;

                const[results, fields] = await connection.query(
                    
                    `SELECT * FROM \`trains\`.\`untitled spreadsheet - regularities_by_liaisons_trains_france\` WHERE \`Departure station\` = '${start}' AND \`Arrival station\` = '${end}' AND \`Year\` = '${year}'`
                );
                console.log(results);
                response.send(results);

            }catch(error){
                console.log(error);
                response.status(500).send("Error fetching data from database.");
            }
            

        });



       
 


       application.get('/findPath', async (request, response) => {

            
        try{

            const start =  request.query.start;
            const end = request.query.end;
            const year = request.query.year;

            const[results, fields] = await connection.query(
                
                "SELECT `Departure station`, `Arrival station`, `Average travel time (min)`, `Month` FROM `trains`.`untitled spreadsheet - regularities_by_liaisons_trains_france` WHERE Year = \"2018\""
            );

            const graph = {};

            for (const row of results){
                const from = row[`Departure station`]
                const to = row[`Arrival station`]
                const time = row[`Average travel time (min)`]
                const month = row[`Month`]

                if (!graph[from]) graph[from] = []
                
                //This is a list of outbound nodes from the original station
                graph[from].push({station: to, time, month})

            }

            console.log(graph[start])

            const PriorityQueue = require("./PriorityQueue")
            const queue = new PriorityQueue();

            //Calls our helper function
            const fastestPath = pathHelper(graph, queue, graph[start], end);

            console.log(fastestPath)

            //console.log(results);
            response.send(fastestPath);

        }catch(error){
            console.log(error);
            response.status(500).send("Error fetching data from database.");
        }
        

    });


    //Currently this doesn't really work because it doesn't make a final graph of nodes, just removes stuff for fun
    function pathHelper(graph, queue, nodes, end){

        console.log("RUNNING PATHHELPER")
        console.log(nodes)
        console.log("LENGTH: " + nodes.length)

        var pastTime;
        try {
            pastTime = queue.peek().time
        } catch (error) {
            //If nothing is in the queue
            pastTime = 0;
        }

        
        //Enqueues everything in current collection of nodes
        for (var i = 0; i < nodes.length; i++){

            //Updates historical time
            nodes[i].time += pastTime

            queue.enqueue(nodes[i])
        }
            
        
        const fastestNode = queue.dequeue()

        if (fastestNode.station === end){
            return fastestNode
        }
        
        if (fastestNode != null){
            pathHelper(graph, queue, graph[fastestNode.station])
        }else{
            return;
        }
        

        //pathHelper(graph, queue, newNode)
    }



    } catch (error) {
        console.log(error);
    }

}


//Starts the server
initializeDatabase();
