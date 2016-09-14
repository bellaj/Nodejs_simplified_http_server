// server.js
// where your node app starts
var http = require("http");
var url = require("url");

console.log("server stared");

///////////callback exemple
///function say(word) {
//     console.log(word);
///   }
///   function execute(someFunction, value) {
///     someFunction(value);
//   }
//   execute(say, "Fct excution test");// equiv     execute(function(word){ console.log(word) }, "Hello"); => annonymous fct
////////////////
function get_parameters(request, response){
  var pathname = url.parse(request.url).pathname;
   if(pathname != '/favicon.ico')
        console.log("Request for " + pathname + " received.");
      }

   function run() {
     function onRequest(request, response) {
       console.log("Request received.");
       response.writeHead(200, {"Content-Type": "text/plain"});
       response.write("server Running");
       get_parameters(request, response);
       response.end();
     }
//process.env.PORT
     var server =http.createServer(onRequest).listen(8888, function(){
    console.log('Listening on port '+server.address().port); //Listening on port 8888
});

   } // STDOUT( console.log) two times upon opening the page in a browser. That's because
   //most browser will try to load the favicon by requesting /favicon.ico whenever you open /).
exports.run = run;
