#Desarrollo de un centro de conferencias virtual basado en WebRtc

####Proyecto fin de carrera
####Autor : Manuel Blanco
####Universidade da Coruña


Para el desarrollo de este proyecto utilizo licode y node-login.

*[Licode](https://github.com/ging/licode)
*[Node-login](https://github.com/braitsch/node-login)

***

####Se utilizan las siguientes librerias:

* [Node.js](http://nodejs.org/) - Application Server
* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [MongoDb](http://www.mongodb.org/) - Database Storage
* [Jade](http://jade-lang.com/) - HTML Templating Engine
* [Stylus](http://learnboost.github.com/stylus/) - CSS Preprocessor
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Moment.js](http://momentjs.com/) - Lightweight Date Library
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - UI Component & Layout Library

***



####Installation & Setup

Antes de empezar se necesita tener instalado node.js y npm.Tambien se necesita instalar licode tal y como explican en sus instrucciones. Para el correcto funcionamiento copiar la carpeta proyecto dentro de /licode/extras.


```
git clone https://github.com/manublanco/Centro-de-Videoconferencias proyecto
cd proyecto
npm install -d
node app
```
Para que el correo funcione es necesario editar email-settings.js con tus propios datos.
