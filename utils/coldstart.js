// Script for adding sample data to MongoDB
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

let assetConfig = [
    {
        name:"a1.jpg",
        tags:"blue"
    },
    {
        name:"a2.jpg",
        tags:"pink"
    },
    {
        name:"a3.jpg",
        tags:"yellow,green,red"
    },
    {
        name:"b1.jpg",
        tags:"green,yellow"
    },
    {
        name:"b2.jpg",
        tags:"red"
    },
    {
        name:"b3.jpg",
        tags:"green"
    },
    {
        name:"b4.jpg",
        tags:"yellow"
    }
]

function postDoc(obj) {
    let data = new FormData();
    data.append('file', fs.createReadStream('./asset/'+obj.name));
    data.append('tags', obj.tags);
    let config = {
        method: 'post',
        url: 'http://localhost:3000/upload',
        headers: data.getHeaders(),
        data
    };
    return axios(config)
}

Promise.all(assetConfig.map(obj => postDoc(obj))).then(res => {
    console.log("Cold-Start Successfully Completed!!");
}).catch(err => console.log(err))