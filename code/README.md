**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

Welcome!

We have added to this repository a `README.md` file and `.gitignore` file.

* **README.md**: is the document you are currently reading. It should be replaced with information about your project, and instructions on how to use your code in someone else's local computer.
 
* **.gitignore**: lets you filter out files that should not be added to git. For example, Windows 10 and Mac OS create hidden system files (e.g., .DS_Store) that are local to your computer and should not be part of the repository. This files should be filtered by the `.gitignore` file. This initial `.gitignore` has  been created to filter local files when using MacOS and Node. Depending on your project make sure you update the `.gitignore` file.  More information about this can be found in this [link](https://www.atlassian.com/git/tutorials/saving-changes/gitignore).

Remember that _"this document"_ can use `different formats` to **highlight** important information. This is just an example of different formating tools available for you. For help with the format you can find a guide [here](https://docs.github.com/en/github/writing-on-github).

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Adding Images](#adding-images)

## Team Members
Tash
Erica
Kumi 
Damian
Leonard 

## General info
This is Google2's project for INFO30005 Web Information and Technologies
	
## Technologies
Project is created with:
* NodeJs 14.16.X
* dotenv: 8.2.0
* express: 4.17.1
* express-handlebars: 5.3.0
* mongodb: 3.6.5
* mongoose: 5.12.5


----------------------------------------------

## DELIVERABLE 2

## Live URL Server
https://snacksinavan-google2.herokuapp.com/

## Commit ID
e86548cf66e578f9712fa4caf9fe5c1bbbe09ea0

## Access details to MongoDB Database
CONNECTION_STRING="mongodb+srv://<username>:<password>@cluster0.dmj7x.mongodb.net/foodbuddy?retryWrites=true&w=majority"
MONGO_USERNAME=google2
MONGO_PASSWORD=google2

## Exported Requests for Postman
Refer to [file in git repository]

## Postman Request Descriptions

**POST Start New Order**
"https://snacksinavan-google2.herokuapp.com/customer/order/add" represents a POST request URL. This is equivalent to a user starting a new order by requesting a snack.

The body of the JSON file in this POST request uses the schema from the "orders" collection found in the MongoDB database. As a result, the result of the post request should add a new entry into the "orders" collection containing information about the customerId, vendorId, itemList, orderPlaced status and orderFulfilled status.

**POST Update Order To Fulfilled**
"https://snacksinavan-google2.herokuapp.com/vendor/order/update/6080194ff61d3952287053b2" represents a POST request URL.

If there is an order in the MongoDB database that corresponds to the _id = 6080194ff61d3952287053b2 specified in the URL, the POST request will update the status field of the order from "orderFulfilled": false to "orderFulfilled": true in the orders collection of the MongoDB database.

As such, the body of the JSON file only contains one attribute: "orderFulfilled".

**GET View Outstanding Orders**
User enters the following address: "https://snacksinavan-google2.herokuapp.com/vendor/order/unfulfilled/6080f16dc6055a9fc72ff0b3" to initiate a GET request to view all outstanding orders that have been placed ("orderFulfilled": false, "orderPlaced": true) for a vendor with vendorId = 6080f16dc6055a9fc72ff0b3.

**POST openVanForOrders (Update Van for Orders)**
The user enters the following address: "https://snacksinavan-google2.herokuapp.com/vendor/status/updateAvailability/6080f16dc6055a9fc72ff0b3" to update the availability of the vendor as open for business, for a vendor with vendorId = 6080f16dc6055a9fc72ff0b3. 

If there is a vendor in the MongoDB database that corresponds to the _id = 6080194ff61d3952287053b2 specified in the URL, the POST request will update the readyForOrders field of the vendor in the vendors collection of the MongoDB database from "readyForOrders": false to "readyForOrders":true.

**POST closeVan (for business)**
The user enters the following address: "https://snacksinavan-google2.herokuapp.com/vendor/status/updateAvailability/6080f16dc6055a9fc72ff0b3" to update the availability of the vendor to closed, for a vendor with vendorId = 6080f16dc6055a9fc72ff0b3. 

If there is a vendor in the MongoDB database that corresponds to the _id = 6080194ff61d3952287053b2 specified in the URL, the POST request will update the readyForOrders field of the vendor in the vendors collection of the MongoDB database from "readyForOrders": true to "readyForOrders":false.


**POST updateLocationDescription**
The user enters the following address: "https://snacksinavan-google2.herokuapp.com/vendor/status/updateLocationDescription/6080f16dc6055a9fc72ff0b3" to update the short text address of the vendor with vendorId = 6080f16dc6055a9fc72ff0b3.

If there is a vendor in the MongoDB database that corresponds to the _id = 6080194ff61d3952287053b2 specified in the URL, the POST request will update the locationDescription field of the vendor in the vendors collection of the MongoDB database to what is submitted in the request.

**POST updateGeoLocation**
The user enters the following address: "https://snacksinavan-google2.herokuapp.com/vendor/status/updateGeoLocation/6080f16dc6055a9fc72ff0b3" to update the geo-location of the vendor with vendorId = 6080f16dc6055a9fc72ff0b3.

If there is a vendor in the MongoDB database that corresponds to the _id = 6080194ff61d3952287053b2 specified in the URL, the POST request will update the longitude and latitude fields of the vendor in the vendors collection of the MongoDB database to the geo-location that is captured by the app.

**GET View Menu (All Items)**
User enters the following address: "customer/menu" which initiates a GET request. 

This returns all items in the Mongo database stored in the collection: "menu" structured in the menuItem schema. The menu item image link, price, name and id are captured. 

**GET Get Small Cake Details**
User enters the following address: "customer/menu/607e325ec52713e5e9a3279c" which initiates a GET request. the GET request will return the details of this item: including name, price and photo URL.

If there is a menu item in the database collection: "menu" that corresponds to the _id=607e325ec52713e5e9a3279c_ the GET request will return the details of this item: including name, price and photo URL.

----------------------------------------------

## DELIVERABLE 3

**LOGIN DETAILS**
Email: anthony@gmail.com
Password: password1

## DELIVERABLE 4

**CUSTOMER LOGIN DETAILS**
Email: anthony@gmail.com
Password: password1

**VENDOR LOGIN DETAILS**
Vendor Name:Jack's snacks
Password:password

Vendor Name:Steven's Snacks
Password:password

**TESTING**
	
**Please run : $ npm test 
	
**This will commence all testing. 
	
**UML Diagram**
	
**link to UML diagram of system : https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1#G1wAg4wyOcVqtckJaRiNnooKz5qSJtmGI3
	
**please see key on LHS for clarity
## Code Implementation

You can include a code snippet here.

```HTML
<!--
Example code from: https://www.w3schools.com/jsref/met_win_alert.asp
__>

<!DOCTYPE html>
<html>
<body>

<p>Click the button to display an alert box.</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction() {
  alert("Hello! I am an alert box!");
}
</script>

</body>
</html>
```

## Adding Images

You can use images/gif hosted online:

<p align="center">
  <img src="https://github.com/Martin-Reinoso/sandpit-Profile/raw/main/Images_Readme/01.gif"  width="300" >
</p>

Or you can add your own images from a folder in your repo with the following code. The example has a folder `Gifs` with an image file `Q1-1.gif`:
```HTML
<p align="center">
  <img src="Gifs/Q1-1.gif"  width="300" >
</p>
```

To create a gif from a video you can follow this [link](https://ezgif.com/video-to-gif/ezgif-6-55f4b3b086d4.mov).

You can use emojis :+1: but do not over use it, we are looking for professional work. If you would not add them in your job, do not use them here! :shipit:

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [x] Complete system + source code
- [x] Report on your work(+ test1 feature)

