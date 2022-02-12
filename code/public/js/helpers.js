
var register = function(Handlebars) {
    var helpers = { // add all helpers as key: value pairs
        // an example of listfood helper to iterate over
        // food items and display these in the page
        listMenu: function (menuItems) { 
          var ret = "<ul>";

          for (var i = 0, j = menuItems.length; i < j; i++) {
            ret = ret + "<li> " +
              "<img class=\"browsePage\" src=\"https://source.unsplash.com/" 
              + menuItems[i].photoId + "\">" +
              "<a href=\"/menuItems/" + menuItems[i]._id + "\">" + menuItems[i].itemName + "</a></li>"
          }

          return ret + "</ul>";
		    },
      
        listplacedorders: function (orders) {
          var ret = "";

          for (var i = 0, j = orders.length; i < j; i++) {
            ret = ret + "<p> " +
              orders[i].itemlist + "</p>"
          }

          return ret;
		    },
        // isLoggedIn: function (req) {
        //   return req.isAuthenticated()
        // },

        formatDate: function (date) { 
          const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
          return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
		    },

        formatDateAndTime: function (date) { 
          const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];

          var hour = date.getHours();
          var ampm = "am";
          if(hour > 12){
            hour = hour - 12;
            ampm = "pm";
          }
    
          var minute = date.getMinutes();
          if(minute < 10){
            minute = "0" + minute
          }
          return  hour + ":" + minute + ampm + " " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
		    },

        ifCurrentPath: function (currentPath, condition) {
          if (currentPath == condition) {
            return true;
          } 
          return false;
        },
        // ifUserType: function (userType, condition) {
        //   return userType == condition;
        // },
 
 

    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      // for each helper defined above (we have only one, listfood)
      for (var prop in helpers) {
          // we register helper using the registerHelper method
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  // export helpers to be used in our express app
  module.exports.register = register;
  module.exports.helpers = register(null);    