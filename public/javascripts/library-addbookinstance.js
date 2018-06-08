$(document).ready(function(){
    $("#date_of_purchaseInput").datepicker({
        dateFormat: "dd/mm/yy",
        altField: "#formattedDate",
        altFormat: "DD, d MM, yy"
    });

    // For image uploading
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
    //image uploading ended
    //======================================================================================

    // Cancel button functionality
    $("form .btn-secondary").on("click", function(event){
        event.preventDefault();
        var Book_ID = window.location.href.split("/").reverse()[0];
        window.location.href = "/library/bookdetail/" + Book_ID;
    })
    // Cancel button functionality ends
    //======================================================================================

    // Add button functionality
    $("form .btn-primary").on("click", function(event){
        // Prevent default event of submiting the form
        event.preventDefault();
        
        // Validate the input
        var editionInput = $("#editionInput"), 
        date_of_purchaseInput = $("#date_of_purchaseInput"), 
        priceInput = $("#priceInput"), 
        remarksInput = $("#remarksInput"), 
        bookCoverInput = $("#bookCoverInput");

        var formInputs = {};
        formInputs.edition = editionInput.val().trim();
        formInputs.date_of_purchase = date_of_purchaseInput.val().trim();
        formInputs.price = priceInput.val().trim();
        formInputs.remarks = remarksInput.val().trim();
        formInputs.image_file = bookCoverInput.val().trim();

        var integerRegex = /^\d{1,9}$/;
        var errors = 0;

        // Validate Edition
        if(formInputs.edition.match(integerRegex) == null && formInputs.edition != "") // Invalid input
        {
            editionInput.addClass("is-invalid");
            errors++;
        }
        else
        {
            editionInput.removeClass("is-invalid");
        }
        
        // Validate date of purchase
        if(moment(formInputs.date_of_purchase, "DD/MM/YYYY").isValid()) // If date is valid
        {
            var formattedDate = moment(formInputs.date_of_purchase, "DD/MM/YYYY").format("DD/MM/YYYY");
            date_of_purchaseInput.removeClass("is-invalid");
            formInputs.date_of_purchase = formattedDate; date_of_purchaseInput.val(formattedDate);
        }
        else if(formInputs.date_of_purchase == "")
        {
            date_of_purchaseInput.removeClass("is-invalid");
        }
        else
        {
            date_of_purchaseInput.addClass("is-invalid");
            errors++;
        }

        // Validate price
        if(formInputs.price.match(integerRegex) == null && formInputs.price != "") // Invalid price
        {
            priceInput.addClass("is-invalid");
            errors++;
        }
        else
        {
            priceInput.removeClass("is-invalid");
        }

        if(errors)
        {
            // $("form").submit();
        }
        else
        {
            $("form").submit();
        }

        // console.log(formInputs);
    })
    // Add button functionality ends
    //======================================================================================

    // Enter button does nothing inside form
    $("form").on("keypress", function(event){
        if(event.which == 13)
        {
            event.preventDefault();
        }
    })
    // Enter button does nothing inside form ends
    //======================================================================================

    // Date changes
    $("#date_of_purchaseInput").on("change", function(event){
        //console.log($(this).val())
        if($(this).val() == "")
        {
            $(this).removeClass("is-invalid");
            return;
        }
        var formattedDate = moment($(this).val(), "DD/MM/YYYY").format("DD/MM/YYYY");
        //console.log(formattedDate);
        if(formattedDate === "Invalid date")
        {
            $(this).addClass("is-invalid");
        }
        else
        {
            $(this).val(formattedDate);
            $(this).removeClass("is-invalid");
        }
    })
    // Date changes ends
    //======================================================================================

    // Price changes
    $('#priceInput').on('change', function(event){
        var price = $(this).val();
        if(isNaN(price) && price!="")
        {
            $(this).addClass('is-invalid');
        }
        else
        {
            $(this).removeClass('is-invalid');
        }
    });

    // $('#priceInput').on('focusout', function(event){
    //     var price = $(this).val();
    //     if(isNaN(price) && price!="")
    //     {
    //         $(this).addClass('is-invalid');
    //     }
    //     else
    //     {
    //         $(this).removeClass('is-invalid');
    //     }
    // });
    // Price changes ends
    //======================================================================================

})