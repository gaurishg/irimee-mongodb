function extractDigits(string)
{
    var newstr = "";
    for (const char of string) 
    {
        if(char.match(/\d/)) newstr += char;
    }

    return newstr;
}

$(document).ready(function(){

    // image uploading
    $("#bookCoverImage").click(function() {
        $("#bookCoverInput").trigger('click');
    });
    
    function changePreviewBookCover(input)
    {
        if (input.files && input.files[0])
        {
            var reader = new FileReader();
    
            reader.onload = function(e)
            {
                $("#bookCoverImage").attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#bookCoverInput").change(function() {
        changePreviewBookCover(this);
    }); 
    // image uploading ended
    //======================================================================================

    // Add modal-value functionality
    $(".modal button.btn-primary").on("click", function(){
        var modal = $(this).parents(".modal").eq(0);
        var input = modal.find("input").eq(0);
        var value = input.val().trim();
        // var id;
        //console.log("VALUE: " + value);

        if($.trim(value).length <= 1)
        {
            return;
        }
        var modalID = modal.attr("id");
        //console.log("modalID: " + modalID);
        var field = modalID.replace("-modal-id", ""); // author, language, tag or publisher
        var rowID = `#${field}Row`;
        var row = $(rowID);
        var fieldset = row.parent("fieldset").eq(0);
        var checkbox_or_radio = (fieldset.length)?"radio":"checkbox";

        var column = $("<div>").addClass("col").addClass("col-sm-3");
        column.prependTo(row);

        $("<input>").attr({
            "class": "d-none",
            "type": checkbox_or_radio,
            "name": "new_" + field,
            "id": value,
            "checked": true,
            "value": value,
        }).appendTo(column);

        $("<label>", {
            "class": "btn btn-secondary selector-button",
            "html": value,
            "for": value,
            "data-toggle": "tooltip",
            "title": value
        }).appendTo(column);

    });
    // Add modal-value functionality ends
    //======================================================================================
    
    // Focus on form input when modal shows up
    $(".modal").on("shown.bs.modal", function(e) {
        $(this).find("input").focus().val("");
    });
    // Focus on form input when modal shows up ends
    //======================================================================================


    // Define what happens when enter is pressed on modal input
    $(".modal input").on("keypress", function(e) {
        //console.log(e.which, "Pressed");
        if(e.which === 13)
        {
            e.preventDefault();
            var modalContent = $(this).parents("div.modal-content");
            //console.log(modalContent[0]);
            var saveButton = modalContent.find(".btn-primary");
            saveButton.click();
        }
    });
    // modal input enter pressed ends
    //=======================================================================================

    // Cancel button functionality
    $("button.btn.btn-secondary").on("click", function(event){
        event.preventDefault();
        window.location.href = "/library";
    })
    // Cancel button functionality ends
    //=======================================================================================

    // What happens when press enter inside form
    $("form").on("keypress", function(event){
        if(event.which === 13)
        {
            event.preventDefault();
        }
    })
    // What happens when press enter inside form ends
    //=======================================================================================

    // Add button functionality
    $("button.btn.btn-primary[type=submit]").on("click", function(event){
        // stop submission
        event.preventDefault();
        console.log("button clicked");

        // Start validation of form
        var bookTitleInput = $("#bookTitleInput"), bookISBN10Input = $("#bookISBN10Input"), bookISBN13Input = $("#bookISBN13Input");
        var title = bookTitleInput.val().trim();
        var isbn10 = bookISBN10Input.val();
        isbn10 = extractDigits(isbn10);
        var isbn13 = bookISBN13Input.val();
        isbn13 = extractDigits(isbn13);

        var errors = 0;
        if(title.length == 0)
        {
            errors++;
            bookTitleInput.addClass("is-invalid");
        }
        else
        {
            bookTitleInput.removeClass("is-invalid");
        }
        if(isbn10.length != 10 && isbn10.length != 0)
        {
            errors++;
            bookISBN10Input.addClass("is-invalid");
        }
        else
        {
            bookISBN10Input.removeClass("is-invalid");
        }
        if(isbn13.length != 13 && isbn13.length != 0)
        {
            errors++;
            bookISBN13Input.addClass("is-invalid");
        }
        else
        {
            bookISBN13Input.removeClass("is-invalid");
        }

        if(errors)
        {
            // bookTitleInput.val(title);
            // bookISBN10Input.val(isbn10);
            // bookISBN13Input.val(isbn13);
        }
        else
        {
            $("form").submit();
        }
        
    })
    // Add button functionality ends
    //=======================================================================================

    // Title on change event
    $("#bookTitleInput").on("change", function(event){
        if($(this).val()) $(this).removeClass("is-invalid");
        else $(this).addClass("is-invalid");
    })
    // Title on change event
    //=======================================================================================

    // ISBN10 onchange event
    $("#bookISBN10Input").on("change", function(event){
        if( extractDigits($(this).val()).length == 10 ) $(this).removeClass("is-invalid");
        else $(this).addClass("is-invalid");
    })
    // ISBN10 onchange event ends
    //=======================================================================================

    // ISBN13 onchange event
    $("#bookISBN13Input").on("change", function(event){
        if( extractDigits($(this).val()).length == 13 ) $(this).removeClass("is-invalid");
        else $(this).addClass("is-invalid");
    })
    // ISBN13 onchange event ends
    //=======================================================================================

});// document ready ends



