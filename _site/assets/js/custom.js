$("#get-notified").click(function() {
    $('html, body').animate({
        scrollTop: $("#notified-section").offset().top
    }, 500);
});