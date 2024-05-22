
const commonFormOpeation = (function () {
    let pr_questions = [];
    let pr_panswers = [];
    const nurseBy = 'n';
    const patientBy = 'p';

    const getFormResponseMap = (formResponses) => {
        const formResponseMap = {};
        Object.keys(formResponses).forEach(questionId => {
            const { value, type, answerId } = formResponses[questionId];
            if (Array.isArray(value)) {
                const valuesObject = {};
                value.forEach(val => {
                    valuesObject[val.answerId] = val.value
                });
                formResponseMap[questionId] = valuesObject;
            } else if (type === "radio") {
                formResponseMap[questionId] = answerId;
            } else {
                formResponseMap[questionId] = value;
            }
        });
        return formResponseMap;
    }
    this.setParseQuestions = (questions) => {
        const parsedQuestions = [];
        questions.forEach(question => {
            parsedQuestions.push({
                isrequired: question.happ_isrequired ? question.happ_isrequired : false,
                questiontype: question.happ_questiontype,
                question: question.happ_question,
                questionid: question.happ_questionid
            });
        });
        pr_questions = parsedQuestions;
        return parsedQuestions;
    };
    this.setParseAnswers = (answers) => {
        const parsedAnswers = [];
        answers.forEach(answer => {
            parsedAnswers.push({
                answer: answer.happ_answer,
                answerid: answer.happ_answerid,
                questionid: answer._happ_questionreference_value,
            });
        });
        pr_panswers = parsedAnswers;
        return parsedAnswers;
    };
    this.getQuestions = () => pr_questions;
    this.getAnswers = () => pr_panswers;
    this.setFormDataFromSave = (idToQueMap, idToAnsMap, formResponses, isPortalUserLoggedIn) => {
        if (!formResponses || formResponses.length === 0) return;
        const formResponseMap = getFormResponseMap(formResponses);
        // new Queries.
        const selectors = Object.keys(idToQueMap).map(id => `#${id}`).join(', ');
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            const questionId = idToQueMap[el.getAttribute('name')];
            if (!questionId) return;
            const questionValue = formResponseMap[questionId];
            const answer = formResponses[questionId];
            // console.log('answer', answer);
            const isFilledByNurse =  answer?.by === nurseBy;
            const isLoggedIn = isPortalUserLoggedIn === 'True';
            if (!questionValue) return;
            const elementType = el.getAttribute('type') ?? el.type;
            if (elementType == 'checkbox') {
                const checkBoxElements = el.querySelectorAll('.form-check-input');
                let isChecked = false;
                checkBoxElements.forEach(checkBoxEl => {
                    const elId = idToAnsMap[checkBoxEl.id];
                    if (questionValue[elId]) {
                        isChecked = true;
                        checkBoxEl.click();
                    }
                });
                if (isChecked && isFilledByNurse && !isLoggedIn) {
                    checkBoxElements.forEach(checkBoxEl => {
                       checkBoxEl.setAttribute('disabled', true);
                    });
                }
            } else if (elementType == 'radio') {
                const radioElements = el.querySelectorAll('.form-check-input');
                let isChecked = false;
                radioElements.forEach(radioEl => {
                    if (questionValue == idToAnsMap[radioEl.id]) {
                        isChecked = true
                        radioEl.click();
                    }
                });

                if(isChecked && isFilledByNurse && !isLoggedIn) {
                    radioElements.forEach(radioEl => {
                        radioEl.setAttribute('disabled', true);
                    });
                }
            } else if (elementType == 'textarea') {
                el.value = questionValue;
                if (isFilledByNurse && !isLoggedIn)
                    el.setAttribute('disabled', true);
            } else if (elementType === 'select-one') {
                el.value = questionValue;
                if (isFilledByNurse && !isLoggedIn)
                   el.setAttribute('disabled', true);
            } else {
                el.setAttribute('value', questionValue);
                if (isFilledByNurse && !isLoggedIn)
                   el.setAttribute('disabled', true);
            }
        });
    }

    this.getFormDataToSave = (idToQueMap, idToAnsMap, isPortalUserLoggedIn, formResponses) => {
        const retVal = {};
        const selectors = Object.keys(idToQueMap).map(id => `#${id}`).join(', ');
        const elements = document.querySelectorAll(selectors);
        // if form status is draft then it filed by nurse.
        let filledByLoggedInUser = isPortalUserLoggedIn === 'True' ? nurseBy : patientBy;
        console.log('isPortalUserLoggedIn', isPortalUserLoggedIn);
        console.log('filledBy', filledByLoggedInUser);
        elements.forEach(el => {
            const nameOfControl = el.getAttribute('name');
            const questionId = idToQueMap[el.getAttribute('name')];
            if (!questionId) return;
            const answer = formResponses ? formResponses[questionId] : null;
            let filledBy = answer?.by ? answer?.by : filledByLoggedInUser;
            const elementType = el.getAttribute('type') ?? el.type;
            if (elementType == 'checkbox') {
                const checkBoxElements = el.querySelectorAll('.form-check-input');
                checkBoxElements.forEach(checkBoxEl => {
                    if (checkBoxEl.checked) {
                        if (!retVal[questionId]) {
                            retVal[questionId] = {
                                name: nameOfControl,
                                by: filledBy,
                                value: [{
                                    value: checkBoxEl.value,
                                    type: 'checkbox',
                                    answerId: idToAnsMap[checkBoxEl.id],
                                }]
                            }
                            return;
                        }
                        retVal[questionId].value.push({
                            value: checkBoxEl.value,
                            type: 'checkbox',
                            answerId: idToAnsMap[checkBoxEl.id]
                        });
                    }
                });
            } else if (elementType == 'radio') {
                const radioElements = el.querySelectorAll('.form-check-input');
                radioElements.forEach(radioEl => {
                    if (radioEl.checked) {
                        retVal[questionId] = {
                            value: radioEl.value,
                            name: nameOfControl,
                            type: 'radio',
                            answerId: idToAnsMap[radioEl.id],
                            by: filledBy
                        };
                    }
                });
            } else if (elementType === 'select-one') {
                if (el.value) {
                    retVal[questionId] = {
                        type: 'text',
                        name: nameOfControl,
                        value: el.value,
                        by: filledBy
                    };
                }
            }
            else {
                if (el.getAttribute('value') ?? el.value) {
                    retVal[questionId] = {
                        type: 'text',
                        name: nameOfControl,
                        value: el.getAttribute('value') ?? el.value,
                        by: filledBy
                    };
                }
            }
        });
        return retVal;
    };
    this.setSignatureFromSave = async (selector, dataURL = '') => {
        const canvas = document.getElementById(selector);
        const ctx = canvas.getContext("2d");
        if (dataURL) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = dataURL
        }
    };
    this.getSignatureDataToSave = (selector) => {
        let canvas = document.getElementById(selector);
        const dataURL = canvas.toDataURL();
        return dataURL;
    };

    this.emptyTheValuesOfControls = (controlsIds) => {
        const selectors = controlsIds.map(id => `#${id}`).join(', ');
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            const elementType = el.getAttribute('type') ?? el.type;
            if (elementType === 'radio') {
                const radioElements = el.querySelectorAll('.form-check-input');
                radioElements.forEach(radioEl => {
                    if (radioEl.checked) {
                        radioEl.checked = false;
                    }
                });
            } else {
                el.setAttribute('value', '');
            }
        });
    };

    this.showSpinner = (spinnerId, show) => {
        if (show) {
            document.getElementById(spinnerId).style.display = 'block';
        } else {
            document.getElementById(spinnerId).style.display = 'none';
        }
    };

    this.populatePatientData = (patientControlMap) => {
        const selectors = Object.keys(patientControlMap).map(id => `#${id}`).join(', ');
        const elements = document.querySelectorAll(selectors);
        elements.forEach(element => {
            element.setAttribute('value', patientControlMap[element.id]);
        });
    }

    this.showModalPopup = (modalId) => {
        const modal1 = new bootstrap.Modal(modalId);
        modal1.show();
    }

    this.onChangeOperation = (idToQueMap, idToAnsMap) => {

    };

    return {
        setParseQuestions: this.setParseQuestions,
        setParseAnswers: this.setParseAnswers,
        getQuestions: this.getQuestions,
        getAnswers: this.getAnswers,
        getFormDataToSave: this.getFormDataToSave,
        setFormDataFromSave: this.setFormDataFromSave,
        setSignatureFromSave: this.setSignatureFromSave,
        getSignatureDataToSave: this.getSignatureDataToSave,
        emptyTheValuesOfControls: this.emptyTheValuesOfControls,
        showSpinner: this.showSpinner,
        populatePatientData: this.populatePatientData,
        showModalPopup: this.showModalPopup,
    };
})();





