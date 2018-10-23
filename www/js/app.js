var options = { dimBackground: true };

btnInsetar = document.getElementById('insertar')
btnInsetar.onclick=insertar;

btnenlistar = document.getElementById('enlistar')
btnenlistar.onclick=enlistarValores;

btnborrar = document.getElementById('borrar')
btnborrar.onclick=borrarTodo;

btnborrarTable = document.getElementById('borrarTable');
btnborrarTable.onclick=borrarTable;

btnlocationbtn = document.getElementById('locationbtn');
btnlocationbtn.onclick=getLocation;

loadingOverlay=document.getElementById('loading-overlay');
var latitud=document.getElementById('latitud');
var longitud=document.getElementById('longitud');
      
var nombre      = document.getElementById('nombre');
var descripcion = document.getElementById('descripcion');
var ul          = document.getElementById('salida');
setloading(false);
    
var db;
var dbNombre = 'mydb';
var dbVersion = '1.0';
var dbDescription = 'Test DB';
var dbSize = 2*1024*1024;


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

function setloading(v){
  if(v==false){
    loadingOverlay.style.display='none';
  }else{
    loadingOverlay.style.display='flex';
  }
}

function locationSuccess(position) {
  latitud.value = position.coords.latitude;
  longitud.value = position.coords.longitude;
  //alert(position.coords.longitude);
  setloading(false);
}
 
function locationError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
 setloading(false);
} 

function getLocation(){
 setloading(true);
 navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{enableHighAccuracy:true});
}

function insertar(){
  setloading(true);
  navigator.geolocation.getCurrentPosition(function(position){
    latitud.value = position.coords.latitude;
    longitud.value = position.coords.longitude;
    log(position);
    
    db.transaction(function(tx){
      tx.executeSql('insert into places(nombre, descripcion, lat, lon) values(?,?,?,?)',
      [nombre.value,descripcion.value,latitud.value,longitud.value],
      function(tx, result){
        nombre.value=''; 
        descripcion.value="";
        latitud.value=''; 
        longitud.value="";
        alert('Sitio Registrado correctamente');
        setloading(false);
      }, errorHandler);
    });
    
    enlistarValores();

    
  }, locationError,{enableHighAccuracy:true});

  return false;
}