/**
 * Este arquivo pertence ao SCE - Sistema de Controle de Estágio -, cuja função
 * é realizar o controle de estágio para discentes do IFPA.
 * Copyright (C) 2015  Rafael Campos Nunes
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * NOTE: Eu não utilizarei mais esse servidor.
 */

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
console.log("Servidor obsoleto, por favor utilize o express_app.js.");
if(debug) {
  console.log("Server Running on 9000");
}
