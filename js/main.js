

$(document).ready(function(){
var optionsMob;
	//display the options of the navigation bar
	$(".navigation-element").mouseover(
		function(){
			var id = "#"+ $(this).attr("id");
			$(id+ "> .options").css("display","block");
			$(id+ " > p").css("color","white");

	});
	$(".navigation-element").mouseout(
		function(){
			var id = "#"+ $(this).attr("id");
			$(id+ "> .options").css("display","none");
			$(id+ " > p").css("color","#6441A5");
	});


	//display the option of the navigator footer for mobile
	$(".navigation-mobile-element").on({
		'click':function (event){
			var id = "#"+ $(this).attr("id");


			$(".navigation-mobile-element").css("display","none");

			if (id === "#searchMobile"){
				optionsMob=$("#optionsMobSearch");
				$("#optionsMobSearch").css("display","block");
			}	else{
				optionsMob=$("#optionsMobStatus");
				$("#optionsMobStatus").css("display","block");
			}
		}
	});

	//Add animation when click an option 
	$(".optionMob").on({
		'click':function (){
			var option = $(this).attr("class").split(" ");
			$(".navigation-mobile-element").css("display","block");
			optionsMob.css("display","none");

			optionToShow(option[option.length-1]);
		}
	});

	$(".option").on({
		'click':function (){
			var option = $(this).attr("class").split(" ");

			optionToShow(option[option.length-1]);
		}
	}); 
});