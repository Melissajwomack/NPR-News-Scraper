//Initialize materialize javascript elements
M.AutoInit();

$('.modal').modal();

$(document).ready(function () {

    $(".clearBtn").on("click", function() {
        $.ajax({
            type: "DELETE",
            url: "/delete"
        });
        if (window.location.href = "/") {
        window.location.reload();
        }
        else {
            window.location.href = "/";
        }
    });

    $(".saveBtn").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            type: "POST",
            url: "/save/" + id
        });
        $('#modal1').modal('open');
    });

    $(".removeSaveBtn").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            type: "POST",
            url: "/removesaved/" + id
        });
        window.location.reload();
    });

    

});