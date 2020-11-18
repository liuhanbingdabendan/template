
var comm = {
       baseURL:'https://admintest.rupeemall.in/' 
}


if(process.env.NODE_ENV ==='production') {
    comm.baseURL="https://admintest.rupeemall.in/";
} else if ( process.env.NODE_ENV==='development'){
    comm.baseURL="/api";
}

module.exports = comm;