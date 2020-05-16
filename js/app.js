

$("#Header__burger-menu").on('click', function(){
    $(".Header__menu").css('visibility', 'visible');
    $(".Header__menu").css('opacity', '1');
});

$(".close_btn").on('click', function(){
    $(".Header__menu").css('visibility', 'hidden');
    $(".Header__menu").css('opacity', '0');
});

$(".nav a").on('click', function(){
    $(".Header__menu").css('visibility', 'hidden');
    $(".Header__menu").css('opacity', '0');
});


$(window).on('scroll', function(){
    if($(window).scrollTop()){
        $('.Header').addClass('menu-down');
    }else{
        $('.Header').removeClass('menu-down');
    }
})













// SCROLL TO LINK
$(document).ready(function(){
    $('a[href*="#"]').on("click", function(e){
    var anchor = $(this);
    $('html, body').stop().animate({
    scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
    e.preventDefault();
    return false;
    });
});


// Skilss

$(document).ready(function(){

    var show = true;
    $(window).on("scroll", function(){

        if(!show) return false;

        var w_top = $(window).scrollTop();
        var e_top = $("#section-mySkills").offset().top;

        console.log(w_top + " " + e_top);

        if(w_top >= e_top){

            $(".skillbar").each(function(){
                $(this).find(".skill-bar").animate({
                  width: $(this).attr("data-percent")
                },2000)
            });

            // skills numbers

            var time = 2;
            $('#mySkills').each(function(){
                $('label').each(function(){
                    var
                    i = 1,
                    num = $(this).data('num'),
                    step = 1000 * time / num,
                    that = $(this),
                    int = setInterval(function(){
                        if(i <= num){
                            that.html(i);
                        }
                        else{
                            clearInterval(int);
                        }
                        i++;
                    },step);
                });
            });

            show = false;
        }
    });

});


// slider

$('.testimonials-section__slider').slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    appendArrows: false,
    dots: true,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
    ]
});








// var $masonry = $('.portfolio').isotope({
//     itemSelector: '.inner',
//     percentPosition: true,
//     masonry: {
//       // use outer width of grid-sizer for columnWidth
//       columnWidth: '.inner_width'
//     }
// });

var Container = $('.portfolio');

Container.imagesLoaded(function(){
    Container.masonry({
        itemSelector: '.inner',
        percentPosition: true,
        masonry: {
            // use outer width of grid-sizer for columnWidth
            columnWidth: '.inner_width'
        }
    });
});

// GALLERY POPUP
$(".portfolio").magnificPopup({
    delegate: 'a',
    type: 'image',
    gallery:{
        enabled: true
    }
});
// GALLERY POPUP END



// AJAX FORM
$(document).ready(function() {

    $("#btn_submit").on("click", function(){
        var Email = $("#email").val().trim();
        var Name = $("#name").val().trim();
        var text_comment = $("#text_comment").val().trim();
        
        if(Name == ""){
            $("#winError").css("display", "inline-block");
            $("#winError").text("Enter your name");
            $("#name").focus();
            return false;
        }else if(Email == ""){
            $("#winError").css("display", "inline-block");
            $("#winError").text("Enter your email");
            $("#email").focus();
            return false;
        }else if(text_comment == ""){
            $("#winError").css("display", "inline-block");
            $("#winError").text("Enter your message");
            $("#text_comment").focus();
            return false;
        }
        

        $("#winError").css("display", "none");
        $("#winError").text("");
    });

	//E-mail Ajax Send
	$("form").submit(function() { //Change
        var th = $(this);
		$.ajax({
			type: "POST",
			url: "sendMail.php", //Change
            data: th.serialize(),
            beforeSend: function(){
                $("#btn_submit").prop("disabled", true);
            },
            success: function(){
                $("#btn_submit").prop("disabled", false);
            }
		}).done(function() {
			$("#MessageSent").fadeIn(500);
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

});
// AJAX FORM END

$('#overlaySentPopup, #SentPopupClose').on('click', function(){
    $('#MessageSent').css('display','none');
});



// setTimeout(function(){
//     $('#loader').fadeToggle();
// }, 1000);