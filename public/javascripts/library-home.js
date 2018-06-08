$(document).ready(function()
{
    var offset = $(".book-block").length;
    if(offset == 0) // No books found
    {
        var div = $("<div>").addClass('col').text("No books found");
        div.appendTo("#bookBlockRow");
    } 
    var clearFiltersButton = $("<div>").addClass("badge badge-secondary ml-3").text("Clear all");
    clearFiltersButton.on("click", function(){
        $(".close-badge").trigger("click");
        $(this).detach();
    });
    clearFiltersButton.hover(function(){
        $(this).toggleClass("badge-secondary").toggleClass("badge-dark");
        $(this).css("cursor", "context-menu");
    })
    

    function createBookBlock(book)
    {
        var bookBlock = $("<div>", {
            "class": "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 my-2 py-2 book-block",
            "data-book_id" : book._id, 
        });

        // Image row
        var bookImageRow = $("<div>", {
            "class": "row book-image-row",
        });
        var bookImageColumn = $("<div>", {
            "class": "col book-image-column justify-content-center align-items-center d-flex"
        });
        var image = $("<img>", {
            "class": "book-image",
            'src': "/images/book-covers/" + book.image_file,
            "alt": "book cover"
        });

        bookBlock.append(bookImageRow);
        bookImageRow.append(bookImageColumn);
        bookImageColumn.append(image);

        // Title Row
        var titleRow = $("<div>", {
            "class": "row"
        });
        var titleColumn = $("<div>", {
            "class": "col-12"
        });
        var title = $("<h4>").html(book.title);
        bookBlock.append(titleRow);
        titleRow.append(titleColumn);
        titleColumn.append(title);

        // Authors Row
        var authorsRow = $("<div>", {
            "class": "row"
        });
        var authorsColumn = $("<div>", {
            "class": "col"
        });
        var authors = $("<span>").html(book.authors.join(", "));
        bookBlock.append(authorsRow);
        authorsRow.append(authorsColumn);
        authorsColumn.append(authors);

        // Languages Row
        var languages = $("<small>").html(book.languages.join(", "));
        var languagesRow = $("<div>", {
            "class": "row"
        });
        var languagesColumn = $("<div>", {
            "class": "col"
        });
        bookBlock.append(languagesRow);
        languagesRow.append(languagesColumn);
        languagesColumn.append(languages);

        // Tags Row
        var tags = $("<small>").html(book.tags.slice(0, 5).join(", "));
        var tagsRow = $("<div>", {
            "class": "row"
        });
        var tagsColumn = $("<div>", {
            "class": "col"
        });
        bookBlock.append(tagsRow);
        tagsRow.append(tagsColumn);
        tagsColumn.append(tags);

        var copies_available = 0;
        for (const book_instance of book.book_instances) 
        {
            if(book_instance.status == "A")
                copies_available++;
        }
        var copies_available_html = $("<span>").html(`${copies_available} ${copies_available==1?"copy":"copies"} available`);
        var copies_availableRow = $("<div>", {
            "class": "row"
        });
        var copies_availableColumn = $("<div>", {
            "class": "col"
        });
        bookBlock.append(copies_availableRow);
        copies_availableRow.append(copies_availableColumn);
        copies_availableColumn.append(copies_available_html);

        bookBlock.on("click", function(event){
            var Book_ID = $(this).attr("data-book_id");
            window.location.href = "/library/bookdetail/" + Book_ID;
        });

        bookBlock.appendTo($("#bookBlockRow"));
    } // Fn createBookBlock Ends


    function createBadge(formCheckClassJQueryElement)
    {
        var checkbox = formCheckClassJQueryElement.children("input");
        var label = formCheckClassJQueryElement.children("label");
        var labelText = label.text();
        var checkboxId = checkbox.attr("id");

        var badgemain = $("<div class='badge badge-info m-1 main-badge'>");
        var badgeclose = $("<div class='badge badge-secondary close-badge'>");
        badgeclose.attr("data-checkboxId", checkboxId);
        badgemain.attr("id", "badgemain" + checkboxId);
        var fatimes = $("<i class='fa fa-times'>");
        badgemain.text(labelText + " ");
        badgeclose.append(fatimes);
        badgemain.append(badgeclose);
        badgemain.appendTo($("#firstsidebarnav"));

        badgeclose.on(
            { "click": function(event)
                        {
                            // console.log("mouse clicked");
                            $("#" + $(this).attr("data-checkboxId") ).prop("checked", false);
                            $(this).parent().remove();
                        },
            // "hover": function(event)
            //         {
            //             console.log("mouse hovered");
            //             $(this).toggleClass("badge-dark").toggleClass("badge-secondary");
            //         }
            });
        
        badgeclose.hover(function(){
            // console.log("mouse hovered");
            $(this).toggleClass("badge-dark").toggleClass("badge-secondary");
        });
        
        clearFiltersButton.appendTo($("#firstsidebarnav h5"));
    }


    $(".book-block").on("click", function(event){
        var Book_ID = $(this).attr("data-book_id");
        window.location.href = "/library/bookdetail/" + Book_ID;
    });

    // Add badges on page load
    // $(":checked") this also works
    $(":checkbox:checked").each(function(){
        var formCheckClassJQueryElement = $(this).parents(".form-check").eq(0);
        createBadge(formCheckClassJQueryElement);
    });


    // Add/Remove badge on checkbox change
    $(":checkbox").on("change", function(event){
        
        var formCheckClassJQueryElement = $(this).parent().eq(0);
        var column = formCheckClassJQueryElement.parent().eq(0);
        if(this.checked)
        {
            // console.log("Checked");
            // It has become checked
            // Add badge
            column.toggleClass("order-1").toggleClass("order-2");
            createBadge(formCheckClassJQueryElement);
        }
        else
        {
            // console.log("Unchecked");
            column.toggleClass("order-1").toggleClass("order-2");
            $("#badgemain" + this.id).remove();
        }
    });

    $(window).on("scroll", function(){
        var scrollHeight = $(document).height();
        var scrollPosition = $(window).height() + $(window).scrollTop();
        if((scrollHeight - scrollPosition) / scrollHeight === 0)
        {
            // When scroll to bottom of page
            $.ajax({
                url: "/api/getbooks?" + [window.location.search.substr(1), `offset=${offset}`].join("&"),
                dataType: "json",
                beforeSend: function()
                            {
                                $("#loadingimage").toggleClass("fade").toggleClass("show");
                                // alert("xhr beforeSend");
                            }
            })
            .done(function(json){
                // alert("xhr started");
                for (const book of json) 
                {
                    createBookBlock(book);
                }
                offset = $(".book-block").length;
                // alert("xhr ended");
            })//done ends
            .always(function(xhr, status){
                // alert("xhr always");
                $("#loadingimage").toggleClass("fade").toggleClass("show");
            })
        }
    });// Scroll event ends

});