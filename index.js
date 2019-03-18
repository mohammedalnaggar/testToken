const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000,()=>{
     console.log('server is running on port 3000') 
});

app.get('/', function(req, res) {
    res.send('Hello world  app is running on http://localhost:3000/');
});

// auth route
app.post('/authenticate', (req , res) => {
    if(req.body.username==="naggar"){
        if(req.body.password === "abc123"){
            // everything went well << username and password are correct

            // data to create token upon
            const data = {
                check: true
            }

            // naggar is something called secret >> extra protection for the data , even if the data was
            // intercepted and changed the interceptor will not know the secret
            let token = jwt.sign(data, "naggar", {
                expiresIn: 2000 //minutes
            })

            console.log(token)
            
            // send the token to user >> should be saved in local storage in the client side<< 
            res.json({
                message: "auth done.",
                token: token
            });

        } else {
            res.json({ message: "Invalid password" })
        }
    } else {
        res.json({ message: "Invalid username" })
    }
} )


// define protected routes 
const  ProtectedRoutes = express.Router(); 


// middleware to check token validation
app.use('/api', ProtectedRoutes);

ProtectedRoutes.use((req, res, next) =>{
    // check header for the token
    var token = req.headers['access-token'];
    // decode token
    if (token) {
      // verifies secret and checks if the token is expired
      jwt.verify(token, "naggar", (err, decoded) =>{      
        if (err) {
            console.log('errrrr in verification')
            console.log(decoded)
            res.json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          console.log('verified')
          console.log(decoded)
          req.decoded = decoded;  
          // will route him to the next route handler with the decoded token attached
          next();
        }
      });

    } else {
      // if there is no token  
      console.log('no token provided')
      res.send({ 
          
          message: 'No token provided.' 
      });
    }
  });

  

  ProtectedRoutes.get('/getAllProducts',(req,res)=>{
    if (req.decoded){
        console.log("from get all products")
        console.log(req.decoded)
        let products = [
            {
                id: 1,
                name:"cheese"
            },
            {
               id: 2,
               name:"carottes"
           }
        ]
        res.json(products)
    }
    
   })
   
