/******************************************************************************
 *                            SICA static file Server
 *
 * TODO: make the server only redirects the login page as I cannot learn how
 * to properly use the cookies with node.js.
 * Won't use this anymore, as the complexity has incresed I will use express.
 *****************************************************************************/

 my_http = require("http"),
 path = require("path"),
 url = require("url"),
 filesys = require("fs");

// for debugging purposes.
 var debug = false;

 // Get the third command line argument.
 if(process.argv[2] == "-d") {
     console.log("Debugging active.");
     debug = true;
 }

var sce_server = my_http.createServer(function(request, response){
     var my_path = url.parse(request.url).pathname;

     //Append index.html if my_path ends with /
     if(my_path == "/") {
         my_path = path.join(my_path, "index.html");
     }

     var public_html_dir = path.join(process.cwd(), "../public/")
     var full_path = path.join(public_html_dir, my_path);

     console.log("Requested file: " + full_path);

     // exists will be deprecated.
     filesys.exists(full_path,function(exists){
         if(!exists){
             var error_file_name = path.join(public_html_dir, "404.html");
             if(debug) {
               console.log(error_file_name);
             }

             filesys.readFile(error_file_name, "binary", function(err, file) {
                if(err) {
                    response.writeHeader(404, {"Content-Type": "text/plain"});
                    response.write("404 not found.");
                    response.end();
                }
                else {
                    response.writeHeader(404);
                    response.write(file, "binary");
                    response.end();
                }
             });
         }
         /*
          * TODO: handle other server errors like 408 etc.
          */
         else{
             filesys.readFile(full_path, "binary", function(err, file) {
                  if(err) {
                      if(debug) {
                        console.log("Error:" + err);
                      }
                      response.writeHeader(500, {"Content-Type": "text/plain"});
                      response.write(err + "\n");
                      response.write("\n\nRequested file" + full_path +
                                     " was unable to read from.\n" +
                                     "It proably does not exist.")
                      response.end();
                  }
                  /**/
                  else{
                     response.writeHeader(200, "OK");
                     response.write(file, "binary");
                     response.end();
                 }
             });
         }
     });
 })

sce_server.listen(9000);
if(debug) {
  console.log("Server Running on 9000");
}
