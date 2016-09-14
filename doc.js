# The Node Beginner Book: Asynchronous callbacks

## 4. Event-driven asynchronous callbacks

To understand why Node.js applications have to be written this way,
we need to understand how Node.js executes our code. Node's
approach isn't unique, but the underlying execution model is
different from runtime environments like Python, Ruby, PHP or Java.

Let's take a very simple piece of code like this:

    var result = database.query("SELECT * FROM hugetable");
    console.log("Hello World");

Please ignore for now that we haven't actually talked about
connecting to databases before - it's just an example. The
first line queries a database for lots of rows, the second
line puts "Hello World" to the console.

Let's assume that the database query is really slow, that it has
to read an awful lot of rows, which takes several seconds.

The way we have written this code, the JavaScript interpreter of
Node.js first has to read the complete result set from the
database, and then it can execute the *console.log()*
function.

If this piece of code actually was, say, PHP, it would work the
same way: read all the results at once, then execute the next line
of code. If this code would be part of a web page script, the user
would have to wait several seconds for the page to load.

However, in the execution model of PHP, this would not become a
"global" problem: the web server starts its own PHP process for
every HTTP request it receives. If one of these requests results
in the execution of a slow piece of code, it results in a slow
page load for this particular user, but other users requesting
other pages would not be affected.

The execution model of Node.js is different - there is only one
single process. If there is a slow database query somewhere in
this process, this affects the whole process - everything comes
to a halt until the slow query has finished.

To avoid this, JavaScript, and therefore Node.js, introduces the
concept of event-driven, asynchronous callbacks, by utilizing an
event loop.

We can understand this concept by analyzing a rewritten version
of our problematic code:

    database.query("SELECT * FROM hugetable", function(rows) {
        var result = rows;
    });
    console.log("Hello World");

Here, instead of expecting *database.query()* to directly
return a result to us, we pass it a second parameter, an anonymous
function.

In its previous form, our code was synchronous: *first*
do the database query, and only when this is done, *then*
write to the console.

Now, Node.js can handle the database request asynchronously.
Provided that *database.query()* is part of an asynchronous
library, this is what Node.js does: just as before, it takes the
query and sends it to the database. But instead of waiting for it
to be finished, it makes a mental note that says "When at some
point in the future the database server is done and sends the
result of the query, then I have to execute the anonymous function
that was passed to *database.query()*."

Then, it immediately executes *console.log()*, and
afterwards, it enters the event loop. Node.js continuously cycles
through this loop again and again whenever there is nothing else
to do, waiting for events. Events like, e.g., a slow database
query finally delivering its results.

This also explains why our HTTP server needs a function it can
call upon incoming requests - if Node.js would start the server
and then just pause, waiting for the next request, continuing
only when it arrives, that would be highly inefficent. If a second
user requests the server while it is still serving the first
request, that second request could only be answered after the first
one is done - as soon as you have more than a handful of HTTP
requests per second, this wouldn't work at all.

It's important to note that this asynchronous, single-threaded,
event-driven execution model isn't an infinitely scalable
performance unicorn with silver bullets attached. It is just one
of several models, and it has its limitations. One being that as
of now, Node.js is just one single process and it can run on only
one single CPU core. Personally, I find this model quite
approachable, because it allows you to write applications that have to
deal with concurrency in an efficient and relatively
straightforward manner.

You might want to take the time to read Felix
Geisendoerfer's excellent post [*Understanding node.js*](http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)
for additional background explanation.

Let's play around a bit with this new concept. Can we prove that our
code continues after creating the server, even if no HTTP request
happened and the callback function we passed isn't called? Let's try
it:

    var http = require("http");
    function onRequest(request, response) {
      console.log("Request received.");
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.write("Hello World");
      response.end();
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");

Note that I use *console.log* to output a text whenever the *onRequest*
function (our callback) is triggered, and another text right *after*
starting the HTTP server.

When we start this, it will immediately
output "Server has started." on the command line (click `'Logs'`). Whenever we request by clicking `'Show'`, the message "Request received." is printed to the logs.

Event-driven asynchronous server-side JavaScript with callbacks in
action :-)

(Note that our server will probably write "Request received." to
STDOUT two times upon opening the page in a browser. That's because
most browser will try to load the favicon by requesting /favicon.ico whenever you open /).

## How our server handles requests

Ok, let's quickly analyze the rest of our server code, that is, the
body of our callback function *onRequest()*.

When the callback fires and our *onRequest()* function gets triggered,
two parameters are passed into it: *request* and *response*.

Those are objects, and you can use their methods to handle the details
of the HTTP request that occured and to respond to the request (i.e., to
actually send something over the wire back to the browser that requested
your server).

And our code does just that: Whenever a request is received, it uses the
*response.writeHead()* function to send an HTTP status 200 and
content-type in the HTTP response header, and the *response.write()*
function to send the text "Hello World" in the HTTP response body.

At last, we call *response.end()* to actually finish our response.

At this point, we don't care for the details of the request, which is
why we don't use the *request* object at all.

Go to the next part - open https://hyperdev.com/#!/remix/NodeBeginner5/665503e6-4531-40b7-9e3a-9e91761ce53b in a new tab.


# License
The Node Beginner Book (C) Manuel Kiessling
[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-nc-sa/3.0/). Some small text changes have been made to the original to make sense on HyperDev.
