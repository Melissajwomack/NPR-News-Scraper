//Initialize materialize javascript elements
M.AutoInit();

// //Wait for document to load
// document.addEventListener("DOMContentLoaded", function () {

//     //Initialize sidenav
//     var elems = document.querySelectorAll(".sidenav");
//     var instances = M.Sidenav.init(elems, {
//         //sidenave options
//         draggable: true
//     });
// });

$(document).ready(function () {
    var API = {
        getArticles: function () {
            $.ajax({
                url: "/scrape",
                type: "GET"
            });
        }
    };
});