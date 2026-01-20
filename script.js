
$(function(){	

	// маска ввода телефона	
	$('input[id= phone]').mask('+7 (999) 999-99-99')	

	//переключатель доклада
	$("input[name = 'report']").change(function(){
		if($(this).val() === "yes"){
			$(".report_line").stop().show();
			$("input[name = 'report_name']").prop("disabled",false).removeProp("disabled");
		}else{
			$(".report_line").stop().hide();
			$("input[name = 'report_name']").prop("disabled","disabled");
		}
	});
	//отправка формы - заглушка
	$(".reg_form").submit(function(){
		alert("Форма отправлена");
		return false;
	});
})


