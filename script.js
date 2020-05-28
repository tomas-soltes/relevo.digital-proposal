const linksArray = document.querySelectorAll('.c-nav_p_menu_link');
let radioChange = document.querySelectorAll('input[type="radio"]');
let textInputs = document.querySelector('.s-p_contact').querySelectorAll('input');
const form = document.querySelector('#Proposal');

form.addEventListener("submit", checkLast);

function checkLast() {
    objects[objects.length - 1].link.classList.add('proposalLinkChecked');
}

radioChange.forEach((input) => {
    input.addEventListener('change', () => {
        checkSection(input.closest(".s-p_section").dataset.section - 1);
        checkFormValidation();
    });
});

textInputs.forEach((input) => {
    input.addEventListener('input', () => {
        checkSection(input.closest(".s-p_section").dataset.section - 1);
    });
});


//SUBMIT
let submitBtn = document.querySelector('input[type="submit"]');
let SubmitBtnFake = document.querySelector('#SubmitBtnFake');
let invalidQuestion;
submitBtnInvalid();
SubmitBtnFake.addEventListener('click', scrollToInvalid);

function checkFormValidation() {
    invalidQuestion = document.querySelector('[data-name="invalid"]:not([style*="display:none"]):not([style*="display: none"])');
    if (invalidQuestion !== null) {
        console.log("Please fill in " + invalidQuestion.closest(".s-p_question").id);
        submitBtnInvalid();
    } else {
        submitBtnValid();
    }
}

function scrollToInvalid() {
    let type = "question";
    scrollIntoID(invalidQuestion.closest(".s-p_question").id, type);
}

function submitBtnInvalid() {
    SubmitBtnFake.style.zIndex = "2";
    submitBtn.disabled = true;
}

function submitBtnValid() {
    SubmitBtnFake.style.zIndex = "-1";
    submitBtn.disabled = false;
}


const sections = [...document.querySelectorAll('.s-p_section')];
const objects = [];
let radioInputs, lastQuestion = [];

createObjects();

function createObjects() {
    for (let i = 0; i < sections.length; i++) {
        radioInputs = [...sections[i].querySelectorAll('.s-p_radio:not([style*="display:none"]):not([style*="display: none"])')];;
        textInputs = [...sections[i].querySelectorAll('.s-p_contact_input_field')];
        objects[i] = {
            name: sections[i].id,
            content: sections[i],
            link: linksArray[i],
            radio: {
                name: 'Radio Inputs',
                content: radioInputs,
                lastQuestion: radioInputs[radioInputs.length - 1],
                length: radioInputs.length,
                checked: 0,
                valid: true,
            },
            textInput: {
                name: 'Text Inputs',
                content: textInputs,
                length: textInputs.length,
                checked: 0,
                valid: true,
            },
            valid: false,
        };
        addListenerToLastQuestion(i);
        checkRadio(i);
    }
}

checkFormValidation()

function addInvalidToQuestions(i) {
    radioInputs.forEach(el => {
        let radioChecked = el.querySelector('input[type="radio"]:checked');
        if (radioChecked !== null) {
            el.dataset.name = "valid";
        } else {
            el.dataset.name = "invalid"
        }
    });
}

// SCROLL INTO VIEW
function addListenerToLastQuestion(e) {
    if (objects[e].radio.lastQuestion !== undefined) {
        let lastRadioQuestion = objects[e].radio.lastQuestion;
        let lastInputs = lastRadioQuestion.querySelectorAll('input[type="radio"]:not([data-scroll="notScroll"])');
        addListenerToInputs(lastInputs, e);
    }
}

function addListenerToInputs(lastInputs, e) {
    lastInputs.forEach((input) => {
        input.addEventListener('change', () => {
            let nextSection = input.closest(".s-p_section").nextElementSibling.id;
            if (objects[e].valid == true) {
                let type = "section";
                scrollIntoID(nextSection, type);
            }
        });
    });
}

function scrollIntoID(nextSection, type) {
    let $id = $("#" + nextSection);
    let pos;
    let deviceDesktop = checkMediaQueries();
    if (deviceDesktop) {
        if (type == "question") {
            pos = $id.offset().top - 100
        } else {
            pos = $id.offset().top
        }
    } else {
        if (type == "question") {
            pos = $id.offset().top - 200
        } else {
            pos = $id.offset().top - 100
        }
    }
    $('body, html').animate({
        scrollTop: pos
    });
}

function checkMediaQueries() {
    let mq = window.matchMedia("(min-width: 767px)");
    if (mq.matches) {
        return true;
    } else {
        return false;
    }
}

console.log(objects);

function checkSection(e) {
    checkRadioPresence(e);
    checkTextInputPresence(e);
    checkSectionValid(e);
    console.log(objects);
}

function checkTextInputPresence(e) {
    if (objects[e].textInput.length !== 0) {
        objects[e].textInput.valid = false;
        checkTextInputs(e);
    }
}

function checkTextInputs(e) {
    objects[e].textInput.checked = 0;

    objects[e].textInput.content.forEach(el => {
        if (el.checkValidity()) {
            objects[e].textInput.checked++;
            console.log(el + " is valid");
        } else {
            console.log(el + " is not valid");
        }

        if (objects[e].textInput.checked == objects[e].textInput.length) {
            objects[e].textInput.valid = true
        } else {
            objects[e].textInput.valid = false
        };

    })
}

function checkRadioPresence(e) {
    if (objects[e].radio.length !== 0) {
        objects[e].radio.valid = false;
        checkRadio(e);
    }
}

function checkRadio(e) {
    objects[e].radio.checked = 0;
    objects[e].radio.content.forEach(el => {
        let radioChecked = el.querySelector('input[type="radio"]:checked');
        if (radioChecked !== null) {
            el.dataset.name = "valid";
            objects[e].radio.checked++;
        } else {
            el.dataset.name = "invalid"
        }
    });

    if (objects[e].radio.checked == objects[e].radio.length) {
        objects[e].radio.valid = true
    } else {
        objects[e].radio.valid = false
    };
}

function checkAllInputs(e) {
    console.log(objects[e].radio);
    if (objects[e].radio.valid && objects[e].textInput.valid) {
        objects[e].valid = true;
    } else {
        objects[e].valid = false;
    }
}

function checkSectionValid(e) {
    checkAllInputs(e);
    if (objects[e].valid) {
        console.log(objects[e].name + " is valid");
        objects[e].link.classList.add('proposalLinkChecked');
    } else {
        console.log(objects[e].name + " is not valid");
        objects[e].link.classList.remove('proposalLinkChecked');
    }
}

/****************** SLIDER **********************/
initRangeSlider();
function initRangeSlider() {
$("#P-Range_Products").ionRangeSlider({
    grid: true,
    min: 10,
    max: 250,
    from_min: 10,
    from: 10,
    prefix: "± ",
    postfix: "",
    hide_min_max: true,
    force_edges: true,
    step: 10,
    grid_num: 6,
});
let lastNumber = document.querySelector('.js-grid-text-6');
lastNumber.innerHTML = lastNumber.textContent + "+";

let firstNumber = document.querySelector('.js-grid-text-0');
firstNumber.innerHTML = "< " + firstNumber.textContent;
}

/************* TYPE OF WEBSITE - ECOMMERCE OR BUSINESS *******************/
initTypeOfWebsite();
function initTypeOfWebsite() {
    let ecommerce_website = document.getElementById('P-Website-Ecommerce');
    let ecommerce_section = document.querySelector('.s-p_ecommerce-only');
    let ecommerce_radio = ecommerce_section.querySelectorAll('.s-p_radio');
    let ecommerce_inputs = ecommerce_section.querySelectorAll('input[type="radio"]');

    let business_website = document.getElementById('P-Website-Business');
    let business_section = document.querySelector('.s-p_business-only');
    let business_radio = business_section.querySelectorAll('.s-p_radio');
    let business_inputs = business_section.querySelectorAll('input[type="radio"]');

    displayRightSectionTimeOut();

    const websiteTypeBtns = document.querySelectorAll('input[name="P-Website"]');
    console.log(websiteTypeBtns);
    websiteTypeBtns.forEach((input) => {
        input.addEventListener('change', () => {
            displayRightSectionTimeOut();
        });
    });


    function displayRightSectionTimeOut() {
        setTimeout(function () {
            displayRightSection()
        }, 100);
    }

    function displayRightSection() {
        if (ecommerce_website.checked) {
            ecommerce_section.style.display = "block";
            business_section.style.display = "none";


            business_inputs.forEach((input) => {
                input.disabled = true;
            });

            business_radio.forEach((radio) => {
                radio.style.display = "none";
            });

            ecommerce_inputs.forEach((input) => {
                input.disabled = false;
            });

            ecommerce_radio.forEach((radio) => {
                radio.style.display = "flex";
            });

        }

        if (business_website.checked) {
            ecommerce_section.style.display = "none";
            business_section.style.display = "block";

            ecommerce_inputs.forEach((input) => {
                input.disabled = true;
            });

            ecommerce_radio.forEach((radio) => {
                radio.style.display = "none";
            });

            business_inputs.forEach((input) => {
                input.disabled = false;
            });

            business_radio.forEach((radio) => {
                radio.style.display = "flex";
            });

        }
        delete objects[2].radio.content;
        createObjects();
        checkSection(2);
        console.log(objects);
    }
}

/****************** CONDITION QUESTIONS **********************/
initConditionQuestions();
function initConditionQuestions() {
// 3.2 Existing Website
let conditionQuestion = document.querySelector('input[name="P-Existing-Website"][value="Yes"]');
let affectedQuestion = document.querySelector('#P-Q-Existing-Website_Features');

let conditionQuestionBtn = document.querySelectorAll('input[type="radio"][name="P-Existing-Website"]');
let conditionTextArea = conditionQuestion.parentElement.parentElement.parentElement.querySelector('textarea');


conditionQuestionBtn.forEach((input) => {
    input.addEventListener('change', () => {
        checkCondition();
    });
});

checkCondition();

function checkCondition() {
    if (conditionQuestion.checked) {
        conditionTextArea.required = true;
        affectedQuestion.style.opacity = "100%";
        affectedQuestion.querySelector('textarea').disabled = false;
    } else {
        conditionTextArea.required = false;
        affectedQuestion.style.opacity = "60%";
        affectedQuestion.querySelector('textarea').disabled = true;
    }
}
}