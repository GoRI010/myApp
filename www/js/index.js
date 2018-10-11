function addText(t){
  var node = document.createElement("p");  
  var textnode = document.createTextNode(t);
  node.appendChild(textnode);
  document.getElementById("logdiv").appendChild(node);  
  }
  
  var console = (function(oldCons){
  return {
      log: function(text){
          oldCons.log(text);
          addText(text);
          // Your code
      },
      info: function (text) {
          oldCons.info(text);
          addText(text);
          // Your code
      },
      warn: function (text) {
          oldCons.warn(text);
          addText(text);
          // Your code
      },
      error: function (text) {
          oldCons.error(text);
          addText(text);
          // Your code
      }
  };
  }(window.console));
  
  //Then redefine the old console
  window.console = console;
  
  function log(t){
      console.log(t);
  }

  var options = { dimBackground: true };
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

      var db;
      var dbNombre = 'mydb';
      var dbVersion = '1.0';
      var dbDescription = 'Test DB';
      var dbSize = 2*1024*1024;
      
      db=window.openDatabase(dbNombre,dbVersion,dbDescription,dbSize);
      //alert(db);
      document.getElementById('insertar').onclick=insertar;
      document.getElementById('enlistar').onclick=enlistarValores;
      document.getElementById('borrar').onclick=borrarTodo;
      document.getElementById('borrarTable').onclick=borrarTable;
            
      var nombre      = document.getElementById('nombre');
      var descripcion = document.getElementById('descripcion');
      var ul          = document.getElementById('salida');

      db.transaction(function(tx){

        tx.executeSql('create table if not exists places(id integer not null primary key, nombre text not null, descripcion text, lat text, lon text)',
        [],
        function (tx, result){
          log(result);
        },
          function (error) {
            alert(error);
        });},
        errorHandler, exitoHandler
        );
       
        function errorHandler(transaction, error){
          alert('Error: '+error.message + '; código: '+error.code);
        }
        
        function exitoHandler(){
          enlistarValores();
        }
        
        function nullHandler(){}
        
        function borrarTodo(){
          db.transaction(function(tx){
            tx.executeSql('delete from places',
            [],
            nullHandler, errorHandler);
          });
          enlistarValores();
          return false;
        }

        function borrarTable(){
          db.transaction(function(tx){
            tx.executeSql('drop table places',
            [],
            nullHandler, errorHandler);
          });
          return false;
        }
 

        function enlistarValores(){

          ul.innerHTML='';
          db.transaction(function(tx){
            tx.executeSql('select * from places;',[],
            function(tx, data){
              log(data.rows.length);
              if(data!=null && data.rows!=null){
                for(var i=0; i < data.rows.length;i++){
                  var r = data.rows.item(i);
                  var li = document.createElement("li");
                  li.appendChild(document.createTextNode(r.id + ', '+ r.nombre+', '+r.descripcion+ ', '+ r.lat+', '+r.lon));
                  ul.appendChild(li);
                }
              }
            },errorHandler);
          },errorHandler,nullHandler);
          return ;
        }
        
        function insertar(){

          var onSuccess = function(position) {
            /*
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp: '         + position.timestamp                + '\n');
            */
                  db.transaction(function(tx){
                    tx.executeSql('insert into places(nombre, descripcion, lat, lon) values(?,?,?,?)',
                    [nombre.value,descripcion.value,position.coords.latitude,position.coords.longitude],
                    function(tx, result){
                      nombre.value=''; descripcion.value="";
                    }, errorHandler);
                  });
                  
                  enlistarValores();                  
        };
        
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

          return false;
        }
        


        //app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
