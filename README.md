# daladala-e-payment
This repository contains a prototype of an e-payment system by using zenopay

# ZenoPay Intergration Implementation
The backend uses springboot, that forwards data to the proxy server.
The proxy server sends a POST request to the zenopay api.
Now, the database contains the phone number of the passenger, the accountId, however the amount is given by the front-end by the @RequestParameter in the code.
The accountId, phone number and amount are sent with a POST request with the body x-www-form-urlencoded with the format 
POST {
api_key:     null
secret_key:  null
account_id:  zp51883 (or your own zenopay account_id)
buyer_phone: 0746xxxx (or your own number)
buyer_name:  dastani
buyer_email: iamdastani@gmail.com
amount:      1000
}
to https://api.zeno.africa.
In postman this works perfectly well, you wil recieve a pin popup on your phone and you will be able to send money from your phone to the respective zenopay account.
NB: Its best if you try it in POSTMAN first so as to understand whats happening, then try create your localhost that can do the same request to the api and you recieve a popup on your phone and send money to the zeno account.
This guide provides a simple understanding of the interaction with the api.

# System Implemtation
The user registers their infromation and is saved to the mysql database by the backend @Controller/PassengerController file.
There the bus Id is taken from either the QR-Code or manual entry, then a search for the busid is made in the database.
Which directly leads to the list of stops retrieved from the database based on the busId.
Then the stops are displayed and the passenger choses where they will stop.
as soon as they choose they are taken to the payment page then the data, amount is sent as a parameter in the url to the backend, and both accountId and phone number are retrieved from the database and then altogether sent to the api. The Proxy server handles the request. @Service/AyncOrderService


