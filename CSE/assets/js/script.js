$(function(){
	var check=1;
	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');
		step(2);
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');

		step(2);
	});
	$('#step2 .slow').click(function(){
		check=0;
		step(3);
	});

	$('#step2 .fast').click(function(){
		check=1;
		step(3);
	});

	$('#step3 .button').click(function(){
		$(this).parent().find('input').click();
	});

	var file = null;

	$('#step3').on('change', '#encrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Please select a file to encrypt!');
			return false;
		}

		file = e.target.files[0];

		if(file.size > 1024*1024){
			alert('Please choose files smaller than 1mb, otherwise you may crash your browser. \nThis is a known issue. See the tutorial.');
			return;
		}

		step(4);
	});

	$('#step3').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Please select a file to decrypt!');
			return false;
		}

		file = e.target.files[0];
		step(4);
	});

	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step5 a.download'),
			password = input.val();

		input.val('');

		if(password.length<5){
			alert('Please choose a longer password!');
			return;
		}
		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			reader.onload = function(e){

				if(check===1)//fast
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				else//secure
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);

				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');

				step(5);
			};

			reader.readAsDataURL(file);
		}
		else {

			reader.onload = function(e){
				if(check===1)
				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);
				else
				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);	

				if(!/^data:/.test(decrypted)){
					alert("Invalid pass phrase or file! Please try again.");
					return false;
				}

				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encrypted',''));

				step(5);
			};

			reader.readAsText(file);
		}
	});
	back.click(function(){

		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});

		step(1);
	});
	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}
		stage.css('top',(-(i-1)*100)+'%');
	}

});
