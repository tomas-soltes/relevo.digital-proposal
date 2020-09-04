/************** ADD EVENT LISTENERS TO INTERACTION ************/
let radioChange = document.querySelectorAll('input[type="radio"]');
let textInputs = document.querySelector('.s-p_contact').querySelectorAll('input');


radioChange.forEach((input) => {
  input.addEventListener('change', () => {
    checkSection(input.closest(".s-p_section").dataset.section-1);
    checkFormValidation();
  });
});

textInputs.forEach((input) => {
  input.addEventListener('input', () => {
    checkSection(input.closest(".s-p_section").dataset.section-1);
  });
});


/************** SUBMIT VALIDATION ************/

let submitBtn = document.querySelector('input[type="submit"]');
let SubmitBtnFake = document.querySelector('#SubmitBtnFake');
let invalidQuestion;
submitBtnDisabled();
SubmitBtnFake.addEventListener('click',scrollToInvalid);

function checkFormValidation(){
   invalidQuestion = document.querySelector('[data-name="invalid"]:not([style*="display:none"]):not([style*="display: none"])');
   if(invalidQuestion !== null) {
   console.log("Please fill in " + invalidQuestion.closest(".s-p_question").id);
   submitBtnDisabled();
   }
   else{
    submitBtnAllowed();
   }
}

function scrollToInvalid(){
   checkFormValidation();
   let type = "question";
   scrollIntoID(invalidQuestion.closest(".s-p_question").id,type);
}

function submitBtnDisabled(){
   SubmitBtnFake.style.zIndex = "2";
   submitBtn.disabled = true;
}

function submitBtnAllowed(){
   SubmitBtnFake.style.zIndex = "-1";
   submitBtn.disabled = false; 
}

/************** AFTER SUBMIT ************/
const form = document.querySelector('#Proposal');
form.addEventListener("submit", checkLast);

function checkLast(){
  objects[objects.length-1].link.classList.add('proposalLinkChecked');
}

/************** CREATE OBJECTS OF SECTIONS ************/

const sections = [...document.querySelectorAll('.s-p_section')];
const linksArray = document.querySelectorAll('.c-nav_p_menu_link');
const objects = [];
let radioInputs, lastQuestion = []; 

createObjects();
function createObjects(){
for (let i=0; i<sections.length; i++) {
    radioInputs = [...sections[i].querySelectorAll('.s-p_radio:not([style*="display:none"]):not([style*="display: none"])')];;
    textInputs = [...sections[i].querySelectorAll('.s-p_contact_input_field')];
    objects[i] = {
        name: sections[i].id,
        content: sections[i],
        link: linksArray[i],
        radio: {
         name: 'Radio Inputs',
         content: radioInputs,
         lastQuestion: radioInputs[radioInputs.length-1],
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
    checkRadioInputs(i);
}
}

checkFormValidation()

/*
function addInvalidToQuestions(i){
    radioInputs.forEach(el => {
      let radioChecked = el.querySelector('input[type="radio"]:checked');
      if(radioChecked !== null) {
        el.dataset.name = "valid";
      } 
      else if(radioChecked.disabled) {
        el.dataset.name = "valid";
      } 
      else {
        el.dataset.name = "invalid"}
    });
}
*/

// SCROLL INTO VIEW
function addListenerToLastQuestion(e){
   if(objects[e].radio.lastQuestion !== undefined) {
      let lastRadioQuestion = objects[e].radio.lastQuestion;
      let lastInputs = lastRadioQuestion.querySelectorAll('input[type="radio"]:not([data-scroll="notScroll"])');
      addListenerToInputs(lastInputs,e);
    }
}

function addListenerToInputs(lastInputs,e){
   lastInputs.forEach((input) => {
        input.addEventListener('change', () => {
          let nextSection = input.closest(".s-p_section").nextElementSibling.id; 
          if (objects[e].valid == true){
          let type = "section";
          scrollIntoID(nextSection,type);
          }
        });
      });
}

function scrollIntoID(nextSection,type){
    let $id = $("#" + nextSection);
    let pos;
    let deviceDesktop = checkMediaQueries();
      if (deviceDesktop) {
        if (type=="question"){pos = $id.offset().top-100}else{pos = $id.offset().top}
        }
      else{
        if (type=="question"){pos = $id.offset().top-200}else{pos = $id.offset().top-100}
      }
    $('body, html').animate({scrollTop: pos});
}

function checkMediaQueries(){
  let mq = window.matchMedia("(min-width: 767px)");
  if (mq.matches) {
    return true;
    }
   else{
    return false;
   }
}

console.log(objects);

function checkSection(e){
  checkRadioInputsPresence(e);
  checkTextInputPresence(e);
  checkSectionValid(e);
  console.log(objects);
}

function checkTextInputPresence(e){
    if(objects[e].textInput.length !== 0) {
    objects[e].textInput.valid = false;
    checkTextInputs(e);
    }
}

function checkTextInputs(e){
  objects[e].textInput.checked = 0;

  objects[e].textInput.content.forEach(el => {
   if(el.checkValidity()) {
   objects[e].textInput.checked++;
   console.log(el + " is valid");
   }
   else{
   console.log(el + " is not valid");
   }
   
   if (objects[e].textInput.checked == objects[e].textInput.length){objects[e].textInput.valid = true}
   else {objects[e].textInput.valid = false};
   
   })
}

function checkRadioInputsPresence(e){
    if(objects[e].radio.length !== 0) {
    objects[e].radio.valid = false;
    checkRadioInputs(e); 
    }
}

function checkRadioInputs(e){
  objects[e].radio.checked = 0;
  objects[e].radio.content.forEach(el => {
   let radioChecked = el.querySelector('input[type="radio"]:checked');
   if(radioChecked !== null) {
     el.dataset.name = "valid";
     objects[e].radio.checked++;
   } 
   else if(el.querySelector('input[type="radio"]').disabled) {
    el.dataset.name = "valid";
    objects[e].radio.checked++;
  } 
   else {
   el.dataset.name = "invalid"}
   });
   
  if (objects[e].radio.checked == objects[e].radio.length){objects[e].radio.valid = true}
  else {objects[e].radio.valid = false};
}

function checkAllInputs(e){
  console.log(objects[e].radio);
  if (objects[e].radio.valid && objects[e].textInput.valid){
    objects[e].valid = true;
  } else {
    objects[e].valid = false;
  }
}

function checkSectionValid(e){
  checkAllInputs(e);
  if (objects[e].valid) {
  console.log(objects[e].name + " is valid");
  objects[e].link.classList.add('proposalLinkChecked');
  }
  
  else{
  console.log(objects[e].name + " is not valid");
  objects[e].link.classList.remove('proposalLinkChecked');
  }
}

/****************** TYPE OF WEBSITE - ECOMMERCE OR BUSINESS SECTION **********************/

const ecommerce_website = document.getElementById('P-Website-Ecommerce');
const ecommerce_section = document.querySelector('.s-p_ecommerce-only');
let ecommerce_radio = ecommerce_section.querySelectorAll('.s-p_radio');
let ecommerce_inputs = ecommerce_section.querySelectorAll('input[type="radio"]');

const business_website = document.getElementById('P-Website-Business');
const business_section = document.querySelector('.s-p_business-only');
let business_radio = business_section.querySelectorAll('.s-p_radio');
let business_inputs = business_section.querySelectorAll('input[type="radio"]');

typeOfWebsiteTimeOut();

const websiteTypeBtns = document.querySelectorAll('input[name="P-Website"]');
console.log(websiteTypeBtns);
websiteTypeBtns.forEach((input) => {
  input.addEventListener('change', () => {
    typeOfWebsiteTimeOut();
  });
});

function typeOfWebsiteTimeOut(){
setTimeout(function(){ typeOfWebsite()}, 100);
}

function typeOfWebsite(){
if (ecommerce_website.checked){
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

if (business_website.checked){
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



/************** CONDITION QUESTIONS ************/
const conditionQuestions = document.querySelectorAll('[data-condition="true"]');

conditionQuestions.forEach((question) => {
     let buttons = question.querySelectorAll('input[type="radio"]');
     addListenerToButtons(buttons);
});

function addListenerToButtons(buttons){
  buttons.forEach((button) => {
  setTimeout(function(){ checkCondition(button)}, 300);
  button.addEventListener('change', () => {
    checkCondition(button);
  });
  });
}


function checkCondition(button){
  let question = button.closest(".s-p_question");
  let nextQuestion = question.nextElementSibling;
  if (question.id == "Q_Deadline"){
    if (button.dataset.answer == "yes"){
    question.querySelector('textarea').required = true;
let error = document.querySelector('label.error');
if (error != null){
    error.style.opacity = 1;
}
    }
    else{
    question.querySelector('textarea').required = false;
let error = document.querySelector('label.error');
if (error != null){
    error.style.opacity = 0;
}
    }
  }
  if (question.id == "Q_Existing-Website"){
    console.log("Existing Website Question");
    if (button.dataset.answer == "yes"){
    showNextQuestionTextarea(question,nextQuestion);
    }
    else{
    hideNextQuestionTextarea(question,nextQuestion);
    }
  }
  if (question.id == "Q_E_Product-Setup"){
    console.log("Product Setup Question");
    let nextButtons = nextQuestion.querySelectorAll('input[type="radio"]');
    if (button.dataset.answer == "yes"){
    showNextQuestionRadio(question,nextQuestion,nextButtons);
    }
    else{
    hideNextQuestionRadio(question,nextQuestion,nextButtons);
    }
}
}

function showNextQuestionTextarea(question,nextQuestion){
question.querySelector('textarea').required = true;
let error = document.querySelector('label.error');
if (error != null){
    error.style.opacity = 1;
}
nextQuestion.style.cursor = "auto";
nextQuestion.style.opacity = "100";
nextQuestion.querySelector('textarea').disabled = false;
}

function hideNextQuestionTextarea(question,nextQuestion){
question.querySelector('textarea').required = false;
let error = document.querySelector('label.error');
if (error != null){
    error.style.opacity = 0;
}
nextQuestion.style.cursor = "not-allowed";
nextQuestion.style.opacity = "60%";
nextQuestion.querySelector('textarea').disabled = true;
}

function showNextQuestionRadio(question,nextQuestion,nextButtons){
nextButtons.forEach((button) => {
  button.disabled = false;
  button.nextElementSibling.style.cursor = "pointer";
});
nextQuestion.style.cursor = "auto";
nextQuestion.style.opacity = "100";
nextQuestion.querySelector('.s-p_radio').dataset.name = "invalid";
}

function hideNextQuestionRadio(question,nextQuestion,nextButtons){
nextButtons.forEach((button) => {
  button.checked = false;
  button.disabled = true;
  button.nextElementSibling.style.cursor = "not-allowed";
});
nextQuestion.style.cursor = "not-allowed";
nextQuestion.style.opacity = "50%";
nextQuestion.querySelector('.s-p_radio').dataset.name = "valid";
}
