// upload 12:07
$(document).ready(function() {
	var selected_issue = '';
	var issue_description = '';
	var login = '';
	var first_name = '';
	var last_name = '';
	var locName = '';
	//check if cr is entered on badge_id
	$('#badge_id').keypress(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') {
			$('#scan_badge').click();
		}
	});
	//Prevent default form
	$('#msform').on('keyup keypress', function(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13 && !$(e.target).is('textarea')) {
			e.preventDefault();
			return false;
		}
	});
	$('#scan_badge').click(function() {
		bg_id = $('#badge_id').val();
		bgid_to_login_url = "https://hrwfs.amazon.com/?employeeBCd=" + bg_id + "&Operation=empInfoByBarcode&ContentType=JSON";
		$.ajax({
			url: bgid_to_login_url,
			dataType: "json",
			crossDomain: true,
			success: function(response) {
				login = (response.empInfoByBarcodeResponse.empInfoByBarcodeResult.azuid);
				first_name = (response.empInfoByBarcodeResponse.empInfoByBarcodeResult.employeeFirstName);
				last_name = (response.empInfoByBarcodeResponse.empInfoByBarcodeResult.employeeLastName);
				locName = (response.empInfoByBarcodeResponse.empInfoByBarcodeResult.locName);
			}
		});
	});
	$("#submit_ticket").click(function() {
		issue_description = $('#description').val();
		$.ajax({
			crossDomain: true,
			method: "POST",
			dataType: "json",
			async: false,
			xhrFields: {
				withCredentials: true
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa("flx-SAZ1IT:2manytabs"));
			},
			url: "https://wfa-api.amazon.com/",
			data: {
				version: "1",
				impact: "5",
				short_description: "STUFF Movement Reminder for Asset: " + issue_description,
				details: "This is a reminder to move asset #" + issue_description + " in STUFF.",
				category: "OpsTechIT",
				type: "Site Administration",
				item: "Documentation",
				requester_login: login,
				requester_name: first_name + " " + last_name,
				assigned_group: locName,
				Operation: "CreateTicket",
				ContentType: "JSON"
			},
			complete: function(xhr) {
				document.getElementById("msform").reset();
				$('#ticket_submited').modal("show");
				// If user closes modal, reload page.
				$('#ticket_submited').on('hidden.bs.modal', function(e) {
					location.reload();
				});
				// Else reload after 5 sec
				setTimeout(function() {
					location.reload();
				}, 5000);
			}
		});
	});

	// rain start
	var makeItRain = function() {
		//clear out everything
		$('.rain').empty();
		var increment = 0;
		var drops = "";
		var backDrops = "";
		while (increment < 100) {
			//couple random numbers to use for various randomizations
			//random number between 98 and 1
			var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
			//random number between 5 and 2
			var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
			//increment
			increment += randoFiver;
			//add in a new raindrop with various randomizations to certain CSS properties
			drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
			backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
		}
		$('.rain.front-row').append(drops);
		$('.rain.back-row').append(backDrops);
	}
	makeItRain();
});
