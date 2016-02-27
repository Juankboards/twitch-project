

$(document).ready(function(){

  var InitialUsers = ["freecodecamp", "stickyrice1", "comster404", "habathcx",
								"cretetion","Swifty","noobs2ninjas","beohoff"];

	var optionsMob,
			resultsContent,
			apiUserUrl,
			searchBy = "channels",
			apiStatusUrl;
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


	//extract information of the users of twitch. Use the twitch API
	function api (apiUserUrl, apiStatusUrl){
		$.getJSON(apiUserUrl, function(jsonInfo){
			var userInfo={};

			userInfo.resultPhoto= (jsonInfo.logo===null)?"http://www.mobilemag.com/wp-content/uploads/2012/09/twitch-tv-logo.png" : jsonInfo.logo;
			userInfo.resultTittle = jsonInfo.display_name;


			$.getJSON(apiStatusUrl, function(jsonStatus){
				var userStatus;

				if (jsonStatus.stream === null){
					userStatus = "offline";
					userInfo.resultDescription = (jsonInfo.bio===null || jsonInfo.bio==="" || jsonInfo.bio===undefined)?"This user don't has a Bio, but we know is an amazing channel" : jsonInfo.bio;
				} else if (jsonStatus.stream === undefined) {
					userStatus= "offline";
					userInfo.resultDescription = "This user left us. We will miss you!"
				}	else{
					userStatus= "online";
					userInfo.resultDescription = (jsonInfo.bio===null || jsonInfo.bio===undefined)?"This user don't has a Bio, but we know is an amazing channel"+"<br><br>Streaming: "+ jsonStatus.stream.channel.game + " - " + jsonStatus.stream.channel.status : jsonInfo.bio+"<br><br>Streaming: "+ jsonStatus.stream.channel.game + "-" + jsonStatus.stream.channel.status;
				}

				resultsContent = "<div class='result'><a class='' href='http://www.twitch.tv/"+ jsonInfo.name +"' target='_blank'>"
										+ "<div class='content " + userStatus + "'><div class='channel-photo'><img src='"
										+ userInfo.resultPhoto + "'></div><div class='channel-text'><h1 class='channel-name'>"
										+ userInfo.resultTittle+"</h1><p class='channel-description'>"
										+ userInfo.resultDescription + "</div></div></a></div>";

				userStatus === "online"?
				$(".results").prepend(resultsContent) :
				$(".results").append(resultsContent)

			});
		});
	}

	//shows the information predifined Users of twitch on the initial page. 
	InitialUsers.forEach(function(user){
		apiUserUrl = "https://api.twitch.tv/kraken/users/"+user+"?callback=?";
		apiStatusUrl = "https://api.twitch.tv/kraken/streams/"+user+"?callback=?";

		api(apiUserUrl, apiStatusUrl);
	});


	//add functionality to the navigation buttons
	function optionToShow (option){
		switch (option){
			case "channel":
				if (searchBy!=="channel"){
					$(".stream").removeClass("highlight");
					$(".channel").addClass("highlight");
					searchBy = "channels";
					makeSearch(searchBy, searchBox.value);
				}
				break;
			case "stream":
				if (searchBy!=="stream"){
					$(".channel").removeClass("highlight");
					$(".stream").addClass("highlight");
					searchBy = "streams";
					makeSearch(searchBy, searchBox.value);
				}
				break;
			case "online":
				$(".result:has(.online)").css("display","block");
				$(".result:has(.offline)").css("display","none");
				break;
			case "offline":
				$(".result:has(.offline)").css("display","block");
				$(".result:has(.online)").css("display","none");
				break;
			case "all":
				$(".result:has(.offline)").css("display","block");
				$(".result:has(.online)").css("display","block");
				break;
		}
	}

	 //make the search by channel(default) or by stream
 function search (apiSearchUrl, searchBy){
	if (searchBy === "channels"){
		$.getJSON(apiSearchUrl, function(jsonSearch){
			var names=[];
			jsonSearch.channels.forEach(function(channel){
				names.push(channel.name);
			});

			names.forEach(function(name){
			apiUserUrl = "https://api.twitch.tv/kraken/users/"+name+"?callback=?";
			apiStatusUrl = "https://api.twitch.tv/kraken/streams/"+name+"?callback=?";

			$(".results").html("");
			api(apiUserUrl, apiStatusUrl);
			});
		});
	}else{
			$.getJSON(apiSearchUrl, function(jsonSearch){
			var names=[];
			jsonSearch.streams.forEach(function(stream){
				names.push(stream.channel.name);
			});

			names.forEach(function(name){
			apiUserUrl = "https://api.twitch.tv/kraken/users/"+name+"?callback=?";
			apiStatusUrl = "https://api.twitch.tv/kraken/streams/"+name+"?callback=?";

			$(".results").html("");
			api(apiUserUrl, apiStatusUrl);
			});
		});
		}
	}

	function makeSearch (searchBy, searchBoxValue){
		if (searchBoxValue!==""){
			var apiSearchUrl= "https://api.twitch.tv/kraken/search/"
	 										+ searchBy + "?q=" + searchBoxValue + "&type=suggest&limit=30";

	 		search(apiSearchUrl, searchBy);
		}
	}


 $("#search-form").submit(function(event) {
  event.preventDefault();
  makeSearch(searchBy, searchBox.value);
 });
});