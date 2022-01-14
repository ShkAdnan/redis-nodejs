const express = require('express');
const redis = require('redis');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

//Redis
const redis_port = 6379
const client = redis.createClient(redis_port); 


app.get('/photos', async (req, res)=> {
    try{
        client.on('error', (err) => console.log('Redis Client Error', err));
        
        await client.connect();

        const response = await client.get('photos');
        if(response !== null){
            res.json(JSON.parse(response))
        }
        
        if(response == null){
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos');      
            const stringData = JSON.stringify(data);
            await client.setEx('photos',3600, stringData);
            console.log("New Created");
        }

       await client.disconnect();
    }
    catch(e){
        console.log(e);
    }

})

app.listen(7000, () => {
    console.log("Server with redis is running");
})