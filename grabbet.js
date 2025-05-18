let paused = false;
let autobet = function(){
	//window.location = window.location;
	setTimeout(function(){
		$('#highlights_tab_lastMinute').click();
		setTimeout(function(){
			$('div.t3-list-entry').each(
				function (){
					$('.t3-product__wrapper-outer').css("background-color","lightblue");
					let games = [];
					if (localStorage.getItem("bettedGames") != null) {
						games = JSON.parse(localStorage.getItem("bettedGames"));
					}

					let line = $(this).data('eventid') + "\n" + $(this).find('.bet-group-column-1 .t3-bet-button').text();
					const regex = /([0-9]*)[\n]{2}([0-9,]+)[\n]{2}([0-9,]+)[\n]{2}([0-9,]+)/gm;
					
					let m;
					m = regex.exec(line);
					if ( m) {
                        paused = true;
						let b = parseFloat(m[2].replace(",","."));
						let c = parseFloat(m[3].replace(",","."));
						let d = parseFloat(m[4].replace(",","."));

						let minimum = 2.4;
						let minimum_draw = 3;

						if (b >= minimum && d >= minimum && d+d >=4.9 && c >= minimum_draw) {
							console.log(m[1]);
							console.log(b);
							console.log(c);
							console.log(d);
							console.log(b+c+d);
							$('#event_'+m[1]).css("background-color","lightgreen");
							let x = $(this).find('.bet-group-column-1 .t3-bet-button');
							if(!games.includes(m[1])) {
								games.push(m[1]);
								x[0].click();
								setTimeout(function(){
									$('#singlebets_betamount').attr("data-steps", "0,1,2,3");
									$('#betamount_plus').click();
									setTimeout(function(){
										$('#placeBetButton').click();
										setTimeout(function(){
											$('#commitBet').click();
											setTimeout(function(){
												x[2].click();
												setTimeout(function(){
													$('#singlebets_betamount').attr("data-steps", "0,1,2,3");
													$('#betamount_plus').click();
													setTimeout(function(){
														$('#placeBetButton').click();
														setTimeout(function(){
															$('#commitBet').click();
														}, 1000);
													}, 1000);
												}, 1000);
											}, 1000);
										}, 1000);
									}, 1000);
								}, 1000);
								localStorage.setItem("bettedGames", JSON.stringify(games));
							} else {
								$('#event_'+m[1]).css("background-color","red");
							}
						}
                        paused = false;
					}
				}
			)
		}, 3000);
	}, 5000);
}
window.setInterval("autobet()", 60000 * 5); // 5 Minuten
autobet();
let stayloggedin = function(){
    if (!paused) {
    	$('#betticket_mybets_header a').click();
    	setTimeout(function(){
    		$('#betticket_header a').click();
    	}, 2000);
    }
}
window.setInterval("stayloggedin()", 1000 * 56); // 30 Sekunden
