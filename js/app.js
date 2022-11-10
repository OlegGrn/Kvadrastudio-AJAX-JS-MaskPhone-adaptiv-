function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});


// Классы для HTML
// a href="#registration" class="popup-link" ссылка на открытие попапа
// close-popup - ссылка на закрытие попапа
// div id="registration" class="popup" - оболочка всего попапа
// lock-padding - класс для фиксированных элементов которым нужен добавочный паддинг для устранения дергания
// popup__content класс для "белго фона" попапа
// lock  - класс для body для свойства overflow: hiden;




document.addEventListener("DOMContentLoaded", () => {
	const popupLink = document.querySelectorAll(".popup-link");
	const body = document.querySelector("body");
	const lockPadding = document.querySelectorAll(".lock-padding");
	const popupCloseIcon = document.querySelectorAll('.close-popup');



	let unlock = true;
	const timeout = 800; // такое значение в скорости анимации в CSS transition

	if (popupLink.length > 0) {
		popupLink.forEach(item => {
			item.addEventListener("click", function (e) {
				const popupName = item.getAttribute('href').replace('#', '');
				const curentPopup = document.getElementById(popupName);
				popupOpen(curentPopup);
				e.preventDefault();
			})
		})
	}

	if (popupCloseIcon.length > 0) {
		popupCloseIcon.forEach(item => {
			item.addEventListener("click", function (e) {
				popupClose(item.closest('.popup'));
				e.preventDefault();
			})
		})
	}

	function popupOpen(curentPopup) {

		if (curentPopup && unlock) {
			const popupActive = document.querySelector('.popup.popup-open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			curentPopup.classList.add('popup-open');
			curentPopup.addEventListener("click", function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			})
		}

	}

	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';//вычисляем ширину скрола

		if (lockPadding.length > 0) {
			lockPadding.forEach(item => {
				item.style.paddingRight = lockPaddingValue;
			})
		}

		body.style.paddingRight = lockPaddingValue;
		body.classList.add('lock');

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	function popupClose(popupActive, doUnlock = true) {
		if (unlock) {
			popupActive.classList.remove('popup-open');
			if (doUnlock) {
				bodyUnLock();
			}
		}
	}

	function bodyUnLock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				lockPadding.forEach(item => {
					item.style.paddingRight = '0px';
				})
			}
			body.style.paddingRight = '0px';
			body.classList.remove('lock');
		}, timeout)

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}

	document.addEventListener('keydown', function (e) {
		const popupActive = document.querySelector('.popup.popup-open');
		if (e.which === 27 && popupActive) {
			popupClose(popupActive);
		}
	})
});


(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();

//! Общие функции================================================
function addActive(...args) {
	for (let arg of args) arg.classList.add("_active");
}
function removeActive(...args) {
	for (let arg of args) arg.classList.remove("_active");
}

function toggleActive(...args) {
	for (let arg of args) arg.classList.toggle("_active");
}

function addPading(arr) {

	let wrapper = document.querySelector(".wrapper");
	let body = document.querySelector("body");


	let lockPaddingValue = window.innerWidth - wrapper.offsetWidth + 'px';//вычисляем ширину скрола
	body.style.paddingRight = lockPaddingValue;// добавляем падинг body,  устраняем дергание экрана при body.style: overflow: hidden

	// добавляем падинг элементам массива arr, если есть необходимость (обычно это в header)
	if (arr.length > 0) {
		for (let el of arr) el.style.paddingRight = lockPaddingValue;
	}
}

function removePading(arr) {
	let body = document.querySelector("body");

	body.style.paddingRight = '0px';//удаляем паддинг, устраняем дергание экрана при body.style: overflow: hidden;

	// удаляем добавленный падинг элементам массива  arr, если есть необходимость
	if (arr.length > 0) {
		for (let el of arr) el.style.paddingRight = '0px';
	}
}
//!=======================================================================

document.addEventListener("DOMContentLoaded", () => {

	//? добаваляем точки - dd point after li class _point-add
	const allPoint = document.querySelectorAll("._point-add");
	if (allPoint) {
		allPoint.forEach((item, ind, arr) => {
			if (ind < arr.length - 1) {
				let point = document.createElement('li');
				point.className = "_point-add__point";
				item.after(point)
			}
		})
	}

	//? прячем меню при скролле ============
	const hideMenu = function (entries) {
		entries.forEach((entry) => {
			const { target, isIntersecting } = entry; // получаем свойства, которые доступны в объекте entry
			if (isIntersecting) {
				target.classList.remove('_scroll');
			} else {
				target.classList.add('_scroll');// удаляем класс, когда элемент из неё выходит  
			}
		})
	}

	const headerObserver = new IntersectionObserver(hideMenu);
	headerObserver.observe(document.querySelector(".header"));

	//? активируем БУРГЕР
	{
		const burger = document.querySelector(".burger");
		const body = document.querySelector("body");
		const menuBody = document.querySelector(".menu__body");
		const wrapper = document.querySelector(".wrapper");
		const needPaddingRight = document.querySelectorAll(".add-padding-right");// добавляем элементы которым нужен паддниг

		//добавляем паддинг, устраняем дергание экрана при body.style: overflow: hidden;
		function addPading(arr) {
			let lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';//вычисляем ширину скрола
			body.style.paddingRight = lockPaddingValue;// добавляем падинг body
			// добавляем падинг элементам массива needPaddingRight
			if (arr.length > 0) {
				for (let el of arr) el.style.paddingRight = lockPaddingValue;
			}
		}

		//удаляем паддинг, устраняем дергание экрана при body.style: overflow: hidden;
		function removePading(arr) {
			body.style.paddingRight = '0px';
			// удаляем добавленный падинг элементам массива  needPaddingRight
			if (arr.length > 0) {
				for (let el of arr) el.style.paddingRight = '0px';
			}
		}

		wrapper.addEventListener("click", function (e) {
			if (e.target.closest(".popup-link")) { //! важно для удаления падингов при наличии попапа
				return
			} else if (e.target.closest(".burger") && !burger.classList.contains("_active")) {
				addPading(needPaddingRight);
				addActive(burger, menuBody, body);

			} else if (
				e.target.closest(".menu__link")
				|| (e.target.closest(".burger") && burger.classList.contains("_active"))
				|| e.target.closest("main")
				|| e.target.closest("footer")
				// || e.target.closest(".popup-link")
			) {
				removeActive(burger, menuBody, body);
				removePading(needPaddingRight)


			}
		});
	}

	//? навигация к заголовкам ============================================
	//* атрибут в элементе <a> data-goto=".class"

	if (document.querySelectorAll("a[data-goto]") != null) {
		document.querySelectorAll("a[data-goto]").forEach(item => {
			item.addEventListener("click", onMenuLinkClick);
		});
	}

	function onMenuLinkClick(e) {
		let menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			let nameClass = menuLink.dataset.goto;
			let MoveBlock = document.querySelector(nameClass);
			let boxMoveBlock = MoveBlock.getBoundingClientRect();
			let upMoveBlock = boxMoveBlock.top + window.pageYOffset - document.querySelector(".header").offsetHeight;
			e.preventDefault();

			if (document.querySelector(".burger").classList.contains("_active")) {
				let menuIcon = document.querySelector(".burger");
				let bodyLock = document.querySelector("body");
				let menuBody = document.querySelector(".menu__body");
				menuIcon.classList.remove("_active");
				bodyLock.classList.remove("_active");
				menuBody.classList.remove("_active");
			}
			window.scrollTo({
				top: upMoveBlock,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
});



//? анимация / добабления класса _active при скроле ==============================
//* ==============================================================
// к элементу анимации добавить класс:  _anim-scroll_25
// число 25 это коэфициент анимации, значения от 0 до 100 (100 - пока элемент весь не покажется на экране)do

document.addEventListener("DOMContentLoaded", () => {

	let animItem = document.querySelectorAll('[class*="_anim-scroll"]');

	if (animItem.length > 0) {

		// запуск события
		window.addEventListener("scroll", animOnScroll);

		//== вызов уже видимых блоков + задержка анимации ===
		setTimeout(() => { animOnScroll() }, 700);
	}

	function animOnScroll() {

		let animItem = document.querySelectorAll('[class*="_anim-scroll"]');
		const namClas = "_anim-scroll_";

		animItem.forEach(item => {

			// значение задержки из названия класса
			let value = getStartAnim(item, namClas)

			// коэфициэнт регулировки старта анимации по высоте от величины блока. Максимум - это 100 ед ====
			const partItemOffStartAnim = value * 0.01;

			// высота блока
			const heightItem = item.offsetHeight;

			// текущее положение блока на странице
			const heightItemOffTopPage = item.getBoundingClientRect().top + window.pageYOffset;

			// текущая высота окна
			const heightWindow = windowHeight();
			function windowHeight() {
				let height = document.documentElement.clientHeight || document.body.clientHeight;
				return height;
			}

			let pointAnim = heightWindow - heightItem * partItemOffStartAnim;
			if (heightItem > heightWindow) {
				pointAnim = heightWindow - heightWindow * partItemOffStartAnim;
			}

			let startAnim = heightItemOffTopPage - pointAnim;
			let endAnim = heightItemOffTopPage + heightItem;

			// запрет анимации при скролле сверху вниз
			//   && (item.getBoundingClientRect().top > heightWindow)
			if (window.pageYOffset > startAnim && window.pageYOffset < endAnim) {
				item.classList.add("_active_anim-scroll");
			} else if (!item.classList.contains("_active_one")) {
				item.classList.remove("_active_anim-scroll");
			}

			// получение цифры из названия класса
			function getStartAnim(el, name) {
				//длина названия класса без цифр
				let length = name.length;
				// позиция начала названия класса
				let posName = el.className.indexOf(name);
				// позиция начала искомого числа в названии класса 
				let posNumb = posName + length;
				//получаем число из названия класса (условие - число из 2-х цифр, иначе - изменить цифру ниже)
				let risult = el.className.substr(posNumb, 2);
				return risult;
			}
		});
	}
});

//* ==============================================================
//?=========== NEW TABS =============================
/*
1. Внешнему блоку управления табами (родителю) - data-tab-tabs="tabs" (содержимое атрибута "..." не имеет значения)
2. Кнопкам управления data-tab-btn="tab_01" (содержимое это путь к блоку)
3. Блокам data-tab-block="tab_01"
4. Блоку который нужно открыть первым по умолчанию класс "_active_first"
*/
document.addEventListener("DOMContentLoaded", () => {

	const tabs = document.querySelector("[data-tab-tabs]");//controll

	if (tabs) {
		tabs.addEventListener("click", (e) => {
			if (!e.target.closest("[data-tab-btn]")) return;

			let tabBtn = e.target.closest("[data-tab-btn]"); // элемент btn клика
			let parentTabBtn = e.target.closest("li"); // родитель li элемента btn
			let allLi = tabs.querySelectorAll("li"); // все Li
			let allTabBtn = document.querySelectorAll("[data-tab-btn]");// все кнопки управления табами
			let allTabBlock = document.querySelectorAll("[data-tab-block]") // все блоки с табами

			delActiveArr(allLi, allTabBtn, allTabBlock);
			addActiveTab(tabBtn, parentTabBtn);

			function delActiveArr(...args) {
				for (let arg of arguments) {
					for (let ar of arg) {
						ar.classList.remove("_active")
					}
				}
			}
			function addActiveTab(btn, li) {
				let path = btn.dataset.tabBtn;
				let block = document.querySelector(`[data-tab-block="${path}"]`);

				btn.classList.add("_active");
				block.classList.add("_active");
				li.classList.add("_active");
			}
		})
		// первый клик автоматически на выбранной ссылке на экране выше 767.98px
		//if (window.innerWidth > 767.98) document.querySelector("._active_first").click();		
		document.querySelector("._active_first").click();
	}
});

//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('lightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}


function sliders_bild_callback(params) { }

let slider_blog = new Swiper('.blog__body', {
	/*
	effect: 'fade',
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	*/
	observer: true,
	observeParents: true,
	/*количество слайдов на просмотре*/
	slidesPerView: 1,
	spaceBetween: 0,
	autoHeight: false,
	speed: 800,

	/*мультирядность  loop: true - не работет*/
	//slidesPerColumn: 2,

	/* горизонтальная направленность заполнения при мультирядности*/
	//slidesPerColumnFill: 'row',

	/*количество слайдов на прокрутке*/
	//slidesPerGroup: 4,


	//touchRatio: 0,
	//simulateTouch: false,
	loop: true,
	//preloadImages: false,
	//lazy: true,
	// Dotts
	pagination: {
		el: '.blog__bullet',
		clickable: true,
	},
	// Arrows
	navigation: {
		nextEl: '.blog__arow_right',
		prevEl: '.blog__arow_left',
	},
	/*
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 0,
			autoHeight: true,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1268: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
	},
	*/
	on: {
		lazyImageReady: function () {
			ibg();
		},
	}
	// And if we need scrollbar
	//scrollbar: {
	//	el: '.swiper-scrollbar',
	//},
});

//* BEGINING ====== BEGINING ====== BEGINING ====== BEGINING ====== BEGINING ====== BEGINING ======
/* 
* HTML
класс "required" - необходимому инпуту для провекри
input указываем name = "name" проверка имени 
input указываем name = "email" проверка почты
input указываем name = "phone" проверка номера телефона
* CSS : 
 класс "invalid" - инпуту при собыитях focus/blur / добавляет JS
 класс "send-error" - инпуту не прошедшего проверку перед отправкой / добавляет JS
 класс "send-ok" - инпуту прошедшего проверку перед отправкой / добавляет JS
 атрибут data-help - итпутам для всплытия подсказки
* Логика:
 - создаем коллекцию инпутов
 - проверяем каждый инпут через слушателя focus/blur (если ошибка - добавляется класс "invalid" инпуту при потере
 фокуса, и класс снимается при повтороной фокусировке). Так же ставится слушатель на изменение значений инпутов
 "oninput", но он заработает когда будет неудачная отправка (у инпута появится класс "send-error")
 - на отправку формы ставим слушателя и при его срабатывании проверяем ещё раз всю форму перед отправкой (
	нет разницы отправка кнопкой или вводом с клавиатуры):
			//- удаляем у всех класс "invalid" при наличии (этим убираем стили invalid, так более юзебилити)
			- проверем ВСЕ интпуты на корректность данных
			- если есть "ошибки" - добавлем неверному инпуту класс "send-error"
			- далее, по классу "send-error" срабатывает слушатель "oninput" и при верном значении убирает "send-error"
			  и добавляет "send-ок" 
 - inputMadeHelp(item, form) - делает обёртку итпуту с поясняющим текстом из setInputCheek.help
 */

//*Руглярки для проверки инпутов =========================
// можно добавлять еще регулярки, их название добавляется к атрибуту "name" соответствующуго инпута 
const setInputCheek = {
	name: { // регулярка провекри имени
		set: /^[a-zа-я -]{2,16}$/i,
		help: "Кирилица и латинские буквы, пробелы и знак \" - \"(тире)"
	},
	email: { // регулярка провекри почты  
		set: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
		help: "Указать"
	},
	phone: { // на российские мобильные + городские с кодом из 3 цифр  
		set: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
		help: "Российские мобильные и городские с кодом из 3 цифр"
	},
	phoneRuMobile: { // на российские мобильные + городские с кодом из 3 цифр  
		set: /\+7\(\d+\)\s\d+\s\-\s\d+\s\-\s\d{2}/,
		help: "Российские мобильные",
		mask: "+7(___) ___ - __ - __"
	},
	class_remove: new Set() // коллекция классов для последующей очистки формы
}
//*==========================================================
//! ЗАПУСК ====== ЗАПУСК ====== ЗАПУСК ====== ЗАПУСК ====== ЗАПУСК ======

document.addEventListener("DOMContentLoaded", () => {
	const allFormInDocuemnt = document.querySelectorAll("form");

	allFormInDocuemnt.forEach(form => {
		// колекция обязательных к заполнению инпутов
		const inputsRequired = form.querySelectorAll(".required");

		// циркуляция ТАБами внутри всех формы (в обе стороны) - выход (потяря фокуса) по Escape
		circulationTabInForm(form);

		//! ДЛЯ ФОРМ БЕЗ ПРОВЕРКИ
		if (!inputsRequired) { }
		//! ДЛЯ ФОРМ С ПРОВЕРКОЙ 
		else if (inputsRequired && setInputCheek) {
			// перебираем инпуты
			inputsRequired.forEach(input => {
				// родидетель инпуту тег лейбл
				let labelInput = input.parentElement;

				// добавляем " * " в placeholder проверяемым инпутам  
				let placeholder = input.getAttribute('placeholder');
				input.setAttribute('placeholder', `${placeholder} *`);

				// получаем соответствующую имени регулярку для провекри  					
				const set = setInputCheek[input.getAttribute("name")].set;

				// Кешируем переменные input, set для последующего addEventListener
				let spyOnInput = spyInput(input, set);

				// проверяем инпут при потери фокуса с него
				input.addEventListener('blur', () => {

					// добавляем в общий объект для послудующей очистки лишних классов
					setInputCheek.class_remove.add("invalid");

					// если не прошел проверку, добавляем invalid 
					if (!input.classList.contains("send-error")) {
						if (!set.test(input.value)) {
							input.classList.add('invalid')
							labelInput.classList.add('invalid')
						};
					}
				})
				input.addEventListener('focus', () => {

					// добавляем в общий объект для послудующей очистки лишних классов
					setInputCheek.class_remove.add("invalid");

					// убираем класс invalid при фокусировки
					if (input.classList.contains('invalid')) {
						input.classList.remove('invalid');
						labelInput.classList.remove('invalid');
					};
					// добавляем слушатель на изменение инпута
					input.addEventListener("input", spyOnInput);
				})
				// отменяем spyOnInput по Escape и удаляем добавленные классы стилей
				input.addEventListener("keydown", (e) => {
					if (e.code == 'Escape') {
						inputsRequired.forEach(ellem => {
							// удаляем слушатель на изменение инпута	
							ellem.removeEventListener("input", spyOnInput);
						})
					}
				})
			})
		}
		//! ДЛЯ ВСЕХ ФОРМ устанавливаем слушателя на отправку через проверку класса onsubmit-has 
		//! чтобы избежать множественных слушателей и отправок
		if (!form.classList.contains("onsubmit-has")) {
			// добавляем класс что бы повторно не ставить слушателя
			form.classList.add("onsubmit-has");

			form.addEventListener('submit', (e) => {
				e.preventDefault();
				// блокирует пока идет анимация отправки формы	
				if (form.classList.contains("pending-animation-end")) return;

				// проверяем форму перед отправкой 
				if ((inputsRequired) ? formCheek(form) : true) {

					sendForm(e)  // отпрвляем форму async function
						.then((value) => {
							console.log(value);
							// убираем фокус с инпутов на форму (у формы tabindex="-1" в html)
							form.focus();
							animationSend(form); // анимация отправки
							inputMadeRemoveHelp(form, true); // убираем добавленные подсказки инпутам //
							// удаляем добавленные классы форме (второй аргумент - классы для удаления)
							cleanForm(form);
							form.reset();  // очищаем форму
							cleanMaskShadow(form) // сбрасываем все стили в маске	
						})
						.catch((err) => {
							animationSend(form, err.message)
						})
				}
			})
		}
	})

});

//? ====== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ========
//? ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ======== ФУНКЦИИ ========

//========= отправка формы ============================================

async function sendForm(e) {
	// текущая форма
	const form = e.target;
	// читаем атрибут action, иначе #
	const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
	// читаем метод, иначе POST 
	const formMethod = (form.getAttribute('method') ? form.getAttribute('method').trim().toUpperCase() : 'POST');
	let bodyForm = new FormData(form);
	let optionsSendFetch = {}; // опции для fetch запроса
	optionsSendFetch.method = formMethod; // добавляем метод запроса//
	// добавляем body если POST (наличие body при GET вызывает ошибку в консоле)
	if (formMethod == "POST") optionsSendFetch.body = bodyForm;

	if (formAction !== "#") { // если нет заглушки
		try {
			let response = await fetch(formAction, optionsSendFetch);
			if (response.status == 200) {
				let json = await response.json();
				return json;
			}
			else {
				throw new Error(`Ошибка ${response.status} для url: ${formAction}`)
			}

		} catch (err) {
			console.log(err.message);
			console.log(err.stack);
			throw new Error("Что-то не так")
		}
	} else { // если заглушка #
		alert("Демонстрационный режим отправки формы");
		return "Демонстрационный режим отправки формы"
	}
}
// ============  очистка формы ====================================================

function cleanForm(form, ...args) {
	// коллекция проверяемых input	
	let requiredInpt = form.querySelectorAll(".required");

	// если задали классы аргументами	
	if (args.length > 0) {
		requiredInpt.forEach(input => {

			// убираем у инпутов добавленные классы  во время проверки
			args.forEach(clas => input.classList.remove(`${clas}`));
		})
	}
	// если берем классы из объекта с регулярками -  "class_remove: new Set()""	
	else {
		requiredInpt.forEach(input => {
			// убираем у инпутов добавленные классы  во время проверки
			setInputCheek.class_remove.forEach(clas => input.classList.remove(`${clas}`));
		})
	}
}

// ============ анимация отправки формы =======================================

function animationSend(form, message) {

	if (!form.hasAttribute('data-animation')) return; // если нет атирибута на анимацию - выходим из функции
	if (form.hasAttribute('data-animation-new-titl')) animationNewTitlSend(form, message); // анимация нового титла
}

function animationNewTitlSend(form, message) {
	form.classList.add("pending-animation-end"); // добавляем класс форме для блокировки кнопки отправить

	let newTitlText = (message) ? message : form.getAttribute('data-animation-new-titl'); // получаем новый текст titl

	let owldTitlMain = form.querySelector(".titl-main"); // получаем элемент заголовок h1 с классом titl-main	
	owldTitlMain.classList.add("owld-titl"); // добавляем старому заголовку класс для изменеия его стилей
	let newTitlDiv = document.createElement('div'); // оббёртка для нового заголовка
	newTitlDiv.className = "new-titl"; //классы новой оббертки
	let newTitlh1 = document.createElement('h1'); // новый заголовок h1
	newTitlh1.className = "new-titl__content titl-main"; // классы нового заголовка h1
	newTitlh1.innerHTML = newTitlText; // текст нового загловка h1
	newTitlDiv.prepend(newTitlh1) // помещаем новый заголовок внутрь оббёртки
	owldTitlMain.prepend(newTitlDiv) // помещаем новую оббертку с загловоком на страницу

	setTimeout(() => {  // удаляем всё добавленное 
		form.classList.remove("pending-animation-end");
		owldTitlMain.classList.remove("owld-titl");
		newTitlDiv.remove()
	}, 3000) // время == времени анимации в CSS
}

// ================ делает спан с поясняющим текстом =====================================

function inputMadeRemoveHelp(form, hiden = false) {

	if (!hiden) {
		// инпуты с атрибутом data-help и классом send-error
		const allSendError = form.querySelectorAll(".send-error[data-help]")

		allSendError.forEach(el => {

			let parentEl = el.parentElement; // label родитель инпуту	
			parentEl.style.position = "relative";

			let helpIs = parentEl.querySelector(".span-help");

			if (helpIs) {  // уже есть span-help
				helpIs.classList.remove("span-help__remove");
				return

			} else {
				const nameInput = el.getAttribute("name");
				const textHelp = setInputCheek[nameInput].help; // текст подсказки из setInputCheek
				let spanHelp = document.createElement('span');
				spanHelp.classList.add(`span-help`);
				spanHelp.innerHTML = textHelp;
				parentEl.append(spanHelp);
			}
		})
	} else if (hiden) { // проверка пройдена и надо убрать подсказку
		const allSpanHelp = form.querySelectorAll(".span-help");
		allSpanHelp.forEach(el => el.classList.add('span-help__remove'))
	}
}

//=========== проверка формы перед отправкой ==========================================

function formCheek(form) {
	const requiredinput = form.querySelectorAll(".required"); // коллекция проверяемых элементов
	let count = requiredinput.length; // количество проверяемых элементов

	requiredinput.forEach((input) => {   // проверяем форму
		let curentSet = setInputCheek[input.getAttribute("name")].set; // получаем соответствующую имени регулярку для провекри
		let labelInput = input.parentElement;
		if (!curentSet.test(input.value)) {
			input.classList.add("send-error"); // добавить send-error не прошедшим проверку
			input.classList.remove("invalid");
			labelInput.classList.remove("invalid");

		} else count-- // если проверка пройдена, уменьшаем количество проверяемых элементов
	})

	inputMadeRemoveHelp(form) // делаем подсказки инпутам

	const inputError = form.querySelector(".send-error"); // находим первого не прошедшуго проверку
	if (inputError) inputError.focus(); // фокусируемся на нём

	return (count == 0); // true, если все прошли проверку
}

// ============= Для слушателя инпута (срабатывает если была неудачная отправка - по send-error у инпута) ========================
// переменные input, set передаются в лексичекое окружение  let = spyOnInput(input, set) 

function spyInput(input, set) {
	// добавляем в общий объект для послудующей очистки лишних классов 
	setInputCheek.class_remove.add("send-error");
	setInputCheek.class_remove.add("send-ok");

	return function () {

		if (input.classList.contains("send-error")) {
			if (set.test(input.value)) {
				input.classList.remove("send-error");
				input.classList.add("send-ok");
			}
		}
		if (input.classList.contains("send-ok")) {
			if (!set.test(input.value)) {
				input.classList.add("send-error");
				input.classList.remove("send-ok");
			}
		}
	}
}

// =========== циркуляция Tab внутри формы, по Escape стирание формы и выход из инпутов =================================
function circulationTabInForm(form) {
	// все элементы формы массивом (изночально - "именнованая коллекция")
	let allElementsForm = Array.from(form.elements);
	// перый элемент формы
	let firstElement = form.elements[0];
	// последний элемент 
	let lastElement = allElementsForm[allElementsForm.length - 1];

	allElementsForm.forEach(element => {
		// события нажания кнопки на первом элементе
		if (element == firstElement) {
			element.addEventListener("keydown", (e) => {
				if (e.code == 'Escape') { // нажата Escape
					element.blur();        // выход из поля инпута
					// form.reset();  // удаляем содержимое инпутов
					cleanForm(form) // убираем добавленные проверкой классы

				} else if (e.code == "Tab" && e.shiftKey) { // нажата ТаБ и shift
					e.preventDefault(e)	 //отменяет дефолтное поведения (иначе фокус перескакивает на второй элемент
					// так как срабатывает нажатие на первом элементе и фокус переходит далее) 			
					lastElement.focus(); // фокус на последний элемент
				}
			})
		}
		// события нажания кнопки на последнем элементе
		else if (element == lastElement) {
			element.addEventListener("keydown", (e) => {
				if (e.code == 'Escape') {  // нажата Escape 					
					element.blur();          // выход из поля инпута				
					form.reset();  // удаляем содержимое инпутов
					cleanForm(form) // убираем добавленные проверкой классы	
					cleanMaskShadow(form) // сбрасываем все стили в маске	


				} else if (e.code == 'Tab' && !e.shiftKey) { // нажата ТаБ и НЕ shift
					e.preventDefault(e)
					firstElement.focus(); // фокус на первый элемент
				}
			})
		}
		// cобытия нажания кнопки на остальных элементах
		else {
			element.addEventListener('keydown', (e) => {
				if (e.code == 'Escape') {
					element.blur();   // выход из поля инпута				
					// form.reset();    // удаляем содержимое инпутов
					cleanForm(form) // убираем добавленные проверкой классы
				}
			})
		}
	})
}

//** Удаляем все стили в маске, функции заимствуем из  mask.js*/

function cleanMaskShadow(form) {
	let inputsWithSadow = form.querySelectorAll('[data-mask-phone-shadow]');// коллекция инпутов 

	if (inputsWithSadow) {
		inputsWithSadow.forEach(input => {
			// убираем у всех инпутов добавленное свойство прозрачности фона
			input.style.backgroundColor = "";

			// родитель инпута  - Label
			let paretnInput = input.parentElement;
			let maskShadow = paretnInput.querySelector('.mask-shadow');

			let mask = getMaskPhone(input); // функция из mask.js - получаем маску	
			//let def = mask.slice(0, mask.indexOf("_")).length; // длина дефолтного начала маски	

			madeNewValue({ mask, maskShadow }, []); // функция из mask.js - формирует значение инпута
		});
	}
}
//*======== END ======== END ========= END ========== END =======================

"use strict";
/*
const setInputCheek = {
	name: { // регулярка провекри имени
		set: /^[a-zа-я -]{2,16}$/i,
		help: "Кирилица и латинские буквы, пробелы и знак \" - \"(тире)"
	},
	email: { // регулярка провекри почты  
		set: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
		help: "something text"
	},
	phoneRuMobile: { // на российские мобильные + городские с кодом из 3 цифр  
		set: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
		help: "Российские мобильные",
		mask: "+7(___) ___ - __ - __"
	},
	class_remove: new Set() // коллекция классов для последующей очистки формы
}

* HTML
!! Все инпуты обворачиваем в тег Label
aтрибут инпутам data-mask-phone - для создания маски;
aтрибут инпутам data-mask-phone-shadow - для создания тени маски;

* CSS : 
 класс "mask-shadow" -  добавляет JS
 класс "mask-shadow__body" -  добавляет JS
 класс "mask-shadow__span" -  добавляет JS
 класс "mask-shadow__span_hiden" -  добавляет JS
 класс "mask-shadow" -  добавляет JS
 класс "m☻ask-shadow" -  добавляет JS
* Логика
- устанавливаем значение placeholder (из знчения placeholder, если нет - из атрибута 'data-mask-phone, если нет - из setInputCheek)
- маску берем либо из атрибута data-mask-phone или из setInputCheek или defolt
- алгоритм получает цифры из инпута массивом в правильном порядке и заменяет в маске "_" на полученные цифры

Для маски создается div mask-shadow => div mask-shadow__body => span mask-shadow__span которые в начале содержат маску.
Затем по мере заполнения инпута, значения спанов "_" заменяют на цифры. Спанам с цифрами присваивается класс  mask-shadow__span_hiden, 
который их скрывает (opacity 0), и видимыми остаются только незаполненые "_".
Самому инпуту присваивается прозрачность background, за счет чего в инпуте будут видны введенные цифры (из инпута) и незаполненные
"_" (из mask-shadow) 

В CSS добавить стили для mask-shadow__span - желаемый цвет, для mask-shadow__span_hiden - opacity: 0;
и для mask-shadow__body стили при условии что у родителя Label есть класс "invalid" 
.invalid & {
		background-color: желаемый цвет; (поскольку фон инпута прозрачен)	
	}
*/


document.addEventListener("DOMContentLoaded", () => {

	maskPhoneInput = wrapController(maskPhoneInput);

	document.querySelectorAll('[data-mask-phone]').forEach(input => {

		// устанавливаем значение placeholder (из знчения placeholder, если нет - из атрибута 'data-mask-phone, если нет - из setInputCheek)
		let placeholderVal = (input.getAttribute('placeholder')) ? input.getAttribute('placeholder') :
			(input.getAttribute('data-mask-phone')) ? input.getAttribute('data-mask-phone') :
				(input.name && setInputCheek) ? setInputCheek[input.name].mask : "";

		input.placeholder = removeSpice(placeholderVal); // убираем лишние пробелы при их наличии

		// получаем маску		
		let mask = getMaskPhone(input);
		let def = mask.slice(0, mask.indexOf("_")).length; // длина дефолтного начала маски		

		// нужна или нет тень маски
		let shadow = input.hasAttribute('data-mask-phone-shadow');
		let maskShadow = (shadow) ? makeShadow({ input, mask, def }) : false; // делаем клон инпута и подрезаем на величину def

		let cursorStart;
		let cursorEnd;

		input.addEventListener('keydown', () => {
			cursorStart = input.selectionStart;
			cursorEnd = input.selectionEnd;
		});

		input.addEventListener('contextmenu', () => {
			cursorStart = input.selectionStart;
			cursorEnd = input.selectionEnd;
		});

		input.addEventListener('input', () => maskPhoneInput({ input, mask, cursorStart, cursorEnd, def, maskShadow }));
		input.addEventListener('focus', () => maskPhoneFocus({ input, mask, cursorStart, cursorEnd, def, maskShadow }));
		input.addEventListener('blur', () => maskPhoneBlur({ input, mask, cursorStart, cursorEnd, def, maskShadow }));
	})
});

//* ======= получаем маску для инпута 
// либо из атрибута data-mask-phone или из setInputCheek или  defolt
function getMaskPhone(input) {

	let defolt = "+7(___) ___ ____";

	let mask = (input.getAttribute('data-mask-phone')) ? input.getAttribute('data-mask-phone') :
		(input.name && setInputCheek) ? setInputCheek[input.name].mask : defolt;

	return removeSpice(mask)
}
//* удаляет лишние пробелы в маске *********
function removeSpice(mask) {
	return mask
		.trim()
		.replace(/[^]/g, (a, ind, str) => ((a == " ") && (str.charAt(++ind) == " ")) ? "" : a)
}

//* ======= фокус на инпуте =====================
function maskPhoneFocus(options) {

	let { input, mask, def, maskShadow } = options;

	if (maskShadow) {
		input.style.backgroundColor = "transparent";
	}
	input.value = (input.value < def) ? mask.slice(0, def) : input.value;

	setTimeout(() => {
		input.selectionStart = input.selectionEnd = input.value.length;
	}, 0)
}

//* ======= потеря фокуса =======================
function maskPhoneBlur(options) {

	let { input, mask, def, maskShadow } = options;

	const clearPhoneBlur = input.classList.contains('required');

	input.value = (input.value.length == mask.length) ? input.value :
		(input.value.length == def) ? ""
			: input.value;
	// :(clearPhoneBlur) ? "" : input.value;
	if (input.value == '' && maskShadow) {
		input.style.backgroundColor = ""
	}
}

//* обёртка для maskPhoneInput - алгоритм блокировки ввода значений при переполенении инпута

function wrapController(func) {
	let owldValue;
	return function (options) {

		let { input, cursorStart, cursorEnd, mask } = options;

		let cursorInpt = input.selectionStart; // положение курсора при событии	
		if ((input.value.length > mask.length) && (cursorInpt - cursorEnd == 1)) {
			input.value = owldValue;
			input.selectionStart = input.selectionEnd = cursorStart;
		} else {
			owldValue = func(options);
		}
	}
}

//* =======  устанавливает маску ввода телефона =========================

function maskPhoneInput(options) {

	let { input, cursorStart } = options;

	let newNumber = input.value.slice(cursorStart, input.selectionStart).replace(/\D/g, "");
	let getValue = getValueInput(options, newNumber); // получаем цифры из инпута массивом в правильном порядке
	let newInputValue = madeNewValue(options, getValue); // вычисляем новое значение инпута 
	let cursorPos = setCursor(options, newNumber); // получаем положение курсора

	input.value = newInputValue; // устанавливаем новое значение инпута 

	if (cursorPos != undefined) {
		input.selectionStart = input.selectionEnd = cursorPos;
	}
	return newInputValue
}

//*** получаем введные цифры из инпута массивом в правильном порядке \

function getValueInput(options, newNumber) {

	let { input, cursorStart, cursorEnd, def } = options;
	let cursorInpt = input.selectionStart; // положение курсора при событии	

	let add = (newNumber.length == 0 && cursorStart == cursorEnd) ? setShift(options, cursorInpt) : 0;

	let nextValOne = input.value.slice(0, (cursorStart > cursorInpt) ? cursorInpt - add : cursorStart);
	let nextValTwo = input.value.slice((cursorEnd < def) ? cursorInpt + (def - cursorEnd) :
		(cursorInpt + ((cursorInpt < cursorEnd && add != 0) ? 0 : add)));
	let nextVal = nextValOne + newNumber + nextValTwo;

	// отрезаем из полученной строки nextVal значение def и получем из неё цирфы массимов в правильном порядке
	let start = (cursorStart < cursorInpt) ? cursorStart : cursorInpt;
	let result = nextVal.slice(
		(start < def) ? start : def
	).match(/\d/g) || [];

	return result
};

//* устанавливает курсор ======================

function setCursor(options, newNumber) {
	let { input, mask, cursorStart, cursorEnd, def } = options;
	let cursorInpt = input.selectionStart;
	let result;

	if (newNumber.length > 0) { // был ввод новых цифр без разницы как		
		let count = 0; // отсчитывает найденные "_" в маске с позции cursorStart или cursorInpt
		let num; // результат это когда count будет == newNumber.length		
		mask.replace(/[^]/g, (a, ind) => {
			if ((ind >= ((cursorStart < cursorInpt) ? cursorStart : cursorInpt)) &&
				(a == "_") && (count++ < newNumber.length)) {
				num = ++ind;
			}
		})
		result = num;

	} else if (newNumber.length == 0) { //удаление или ввод НЕ цифры
		if ((cursorEnd - cursorInpt) == 1) { // удаление клавишей BackSpace одного знака
			result = (cursorInpt < def) ? def : mask.lastIndexOf("_", cursorInpt);
		} else { // все остальные удаления с выделением или нет
			result = mask.indexOf("_", cursorEnd)
		}
	}
	return result;
}

//* находим смещение left or right ************/
function setShift(options, cursorInpt) {
	let { mask, cursorEnd } = options;
	let oneNumMask = mask.indexOf("_");

	if (cursorInpt < cursorEnd) { // сдвиг влево
		let pos = mask.lastIndexOf("_", cursorInpt);
		return (pos == -1) ? 0 : cursorInpt - pos;

	} else if (cursorInpt >= cursorEnd) { // сдвиг вправоf
		let pos = mask.indexOf("_", cursorEnd);
		return (pos <= oneNumMask) ? 0 : pos - cursorEnd;
	}
}

//***** формирует новое значение инпута (заменяет "_" из маски на цифры из getValue и отрезает незаполненные "_") ****
function madeNewValue(options, getValue) {
	let { mask, maskShadow } = options;
	let i = 0;
	let mask_value = mask.replace(/[_]/g, (a) => (i < getValue.length) ? getValue[i++] : a); // заменяем "_" из маски на цифры из getValue
	let emptyPos = mask_value.indexOf('_');  // получаем позицию не заполненных "_" из маски

	let val = (emptyPos == -1) ? mask_value : mask_value.slice(0, emptyPos); // отрезаем пустые "_" 

	if (maskShadow) {
		madeShadowInput(options, val)
	}
	return val
}

//** подрезает тень в зависимости от заполнения инпута */

function madeShadowInput(options, val) {
	let { mask, maskShadow } = options;
	// все спаны в клоне
	let allSpan = maskShadow.querySelectorAll('span');
	// заменяем на значения из нового инпута или маски по мере заполнения
	let i = 0;
	allSpan.forEach(item => {
		if (i < val.length) {
			item.innerHTML = val.charAt(i++);
			item.classList.add("mask-shadow__span_hiden")
		} else {
			item.innerHTML = mask.charAt(i++);
			item.classList.remove("mask-shadow__span_hiden")
		}
	})
}

//*** делает клон инпута, стили для него + "подрезаем" клон за счет присвоения класса 
//**  спанам в def (в CSS для них опасити 0)
function makeShadow(options) {
	let { input, mask, def } = options;
	let parent = input.parentElement; // label родитель инпуту
	parent.style.position = "relative";
	parent.style.zIndex = "1";

	//let styleInput = input.className; // стили из клонируемого
	// и убираем класс required при его наличии (иначе будет ошибка при вызове formCheek(form))
	let styleInput = input.className.replace("required", "");

	let maskShadow = document.createElement("div");
	maskShadow.classList = styleInput; // присваеваем стили клону из клонируемого для синхронизации шрифтов	

	maskShadow.classList.add('mask-shadow');
	maskShadow.style.position = "absolute";
	maskShadow.style.top = "0";
	maskShadow.style.left = "0";
	maskShadow.style.width = "100%";
	maskShadow.style.height = "100%";
	maskShadow.style.display = "flex";
	maskShadow.style.alignItems = "center";
	maskShadow.style.pointerEvents = "none";
	maskShadow.style.lineHeight = "normal" // чтобы не прыгал шрифт
	maskShadow.style.zIndex = "-1";

	let bodyShadow = document.createElement('div');// контейнер для будущих span
	//bodyShadow.classList = styleInput; // присваеваем стили клону из клонируемого для синхронизации шрифтов

	bodyShadow.classList.add("mask-shadow__body");
	// оборачиваем каждый знак маски в span + span для def присваем класс для прозрачности
	bodyShadow.innerHTML = mask.replace(/[^]/g, (a, ind) => {
		if (ind < def) {
			return `<span class ="mask-shadow__span mask-shadow__span_hiden">${a}</span>`
		} else {
			return `<span class ="mask-shadow__span">${a}</span>`
		}
	})
	maskShadow.prepend(bodyShadow); //контенер со спанами внутрь maskShadow
	input.after(maskShadow); // вставляем на страницу maskShadow после инпута

	return maskShadow;
}










