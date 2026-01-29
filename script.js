
$(function(){
	function safeParse(json) {
		try {
			return JSON.parse(json);
		} catch (e) {
			return null;
		}
	}

	function loadMessages() {
		var raw = null;
		try {
			raw = localStorage.getItem("messages");
		} catch (e) {
			raw = null;
		}
		var data = raw ? safeParse(raw) : null;
		if (Array.isArray(data)) {
			return data;
		}
		if (window.name && window.name.indexOf("__messages__:") === 0) {
			var nameRaw = window.name.replace("__messages__:", "");
			var nameData = safeParse(nameRaw);
			if (Array.isArray(nameData)) {
				return nameData;
			}
		}
		return [];
	}

	function saveMessages(list) {
		var json = JSON.stringify(list);
		try {
			localStorage.setItem("messages", json);
		} catch (e) {
		}
		window.name = "__messages__:" + json;
	}

	// тема на основе состояния входа
	function applyTheme() {
		var isAuth = localStorage.getItem("authUser") === "Administrator";
		if (isAuth) {
			$("body").addClass("theme-white");
		} else {
			$("body").removeClass("theme-white");
		}
	}

	applyTheme();

	// маска ввода телефона (если плагин подключен)
	if ($.fn.mask) {
		$("#phone").mask('+7 (999) 999-99-99');
	}

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

	// сохранение и переход на страницу результата
	$(".reg_form").submit(function(){
		var sectionMap = {
			maths: "Математика",
			physics: "Физика",
			informatics: "Информатика"
		};
		var reportMap = {
			yes: "Да",
			no: "Нет"
		};

		var data = {
			name: $("input[name='user_name']").val(),
			surname: $("input[name='surname']").val(),
			fatherName: $("input[name='father_name']").val(),
			birthDate: $("input[name='birth_date']").val(),
			email: $("input[name='email']").val(),
			phone: $("input[name='phone']").val(),
			section: sectionMap[$("input[name='section']:checked").val()],
			report: reportMap[$("input[name='report']:checked").val()],
			reportTitle: $("input[name='report_name']").val()
		};

		sessionStorage.setItem("regFormData", JSON.stringify(data));
		window.location.href = "result.html";
		return false;
	});

	// вывод результатов на result.html
	if ($("body").hasClass("result-page")) {
		var raw = sessionStorage.getItem("regFormData");
		var list = $("#resultList");
		if (!raw) {
			list.html("<div class='result-empty'>Данные не найдены. Заполните форму заново.</div>");
			return;
		}

		var data = JSON.parse(raw);
		var reportTitleText = data.report === "Да" ? (data.reportTitle || "Не указана") : "Нет";

		var items = [
			{ label: "Фамилия", value: data.surname },
			{ label: "Имя", value: data.name },
			{ label: "Отчество", value: data.fatherName },
			{ label: "Дата рождения", value: data.birthDate || "Не указана" },
			{ label: "Электронная почта", value: data.email },
			{ label: "Контактный телефон", value: data.phone },
			{ label: "Секция", value: data.section },
			{ label: "Доклад", value: data.report },
			{ label: "Тема доклада", value: reportTitleText }
		];

		var html = "";
		for (var i = 0; i < items.length; i++) {
			html += "<div class='result-row'><span class='result-label'>" +
				items[i].label + "</span><span class='result-value'>" +
				(items[i].value || "Не указано") + "</span></div>";
		}
		list.html(html);
	}

	// авторизация
	$(".login_form").submit(function(){
		var login = $("#loginName").val();
		var pass = $("#loginPass").val();
		if (login === "Administrator" && pass === "1234") {
			localStorage.setItem("authUser", "Administrator");
			applyTheme();
			$(".login_status").text("Вход выполнен. Тема белая.");
		} else {
			localStorage.removeItem("authUser");
			applyTheme();
			$(".login_status").text("Неверный логин или пароль.");
		}
		return false;
	});

	// выход
	$(".logout_btn").click(function(){
		localStorage.removeItem("authUser");
		applyTheme();
		$(".login_status").text("Вы вышли. Тема серая.");
	});

	// отправка сообщения с главной
	$(".message_form").submit(function(){
		var author = $("input[name='message_author']").val();
		var text = $("textarea[name='message_text']").val();
		var list = loadMessages();
		list.unshift({
			author: author,
			text: text,
			time: new Date().toLocaleString()
		});
		saveMessages(list);
		$(".message_status").text("Сообщение отправлено.");
		this.reset();
		return false;
	});

	// вывод сообщений на messages.html
	if ($("#messageList").length) {
		var messageList = loadMessages();
		if (!messageList.length) {
			$("#messageList").html("<div class='result-empty'>Сообщений пока нет.</div>");
		} else {
			var html = "";
			for (var j = 0; j < messageList.length; j++) {
				html += "<div class='message-item'><div class='message-head'>" +
					"<span class='message-author'>" + messageList[j].author + "</span>" +
					"<span class='message-time'>" + messageList[j].time + "</span></div>" +
					"<div class='message-text'>" + messageList[j].text + "</div></div>";
			}
			$("#messageList").html(html);
		}
	}
})


