##MEAN Seed Project
***
A starter to start build your own project with Angular, Node, Express and MongoDB, this seed will provide you with a Server/Client seperated project.  
  
By using Foundation-App and Gulp on the client side, we can maintain a good structure for our client app.   
  
Node will provide RESTful API. 
   
###Project Structure
***

```
├── README.md
├── client
│   ├── bower.json
│   ├── build
│   ├── conf
│   │   └── nginx.conf
│   ├── gulpfile.js
│   ├── logs
│   │   ├── access.log
│   │   └── error.log
│   ├── package.json
│   ├── src
│   │   ├── img
│   │   │   └── like.png
│   │   ├── index.html
│   │   ├── js
│   │   │   ├── app.js
│   │   │   ├── controllers
│   │   │   │   └── main.js
│   │   │   ├── directives
│   │   │   │   └── main.js
│   │   │   ├── filters
│   │   │   │   └── main.js
│   │   │   └── services
│   │   │       └── main.js
│   │   ├── scss
│   │   │   ├── app.scss
│   │   │   ├── base
│   │   │   │   ├── _functions.scss
│   │   │   │   ├── _mixins.scss
│   │   │   │   ├── _placeholders.scss
│   │   │   │   └── _variables.scss
│   │   │   ├── framework
│   │   │   │   ├── _grid.scss
│   │   │   │   └── _layout.scss
│   │   │   ├── modules
│   │   │   │   ├── _buttons.scss
│   │   │   │   └── _input.scss
│   │   │   └── vendor
│   │   ├── template
│   │   └── views
│   │       └── home.html
│   ├── templates
│   │   ├── index.html
│   │   ├── javascript.html
│   │   └── stylesheets.html
│   └── tests
│       └── karma.conf.js
└── server
    ├── config
    │   ├── db.js
    │   └── qiniu.js
    ├── helpers
    │   └── errors.js
    ├── main.js
    ├── middlewares
    │   ├── auth.js
    │   └── err_handler.js
    ├── models
    │   ├── auth.js
    │   └── user.js
    ├── package.json
    └── routes
        ├── index.js
        └── user.js
```  
###Requirements And Tools
***
* [Node and npm](http://nodejs.org/)
* [Bower](http://bower.io/)
* [Gulp](http://www.gulpjs.com.cn/)
* [Foundation for App](http://foundation.zurb.com/apps/)

###Installation
***
1. Clone the repository
2. Install npm and bower
2. Install the dependency: `npm install`
3. Install frontend libs: `bower install`
4. Install global gulp :`npm install -g gulp`
5. Switch to server folder and start the server: `nodemon main.js`
6. Switch to client folder and run `foundation-apps watch`
7. View in browser at `http://localhost:8080`
