
const commonFormOpeation = (function () {

    
    let pr_questions = [];
    let pr_panswers = [];

    const getFormResponseMap = (formResponses) => {
        const formResponseMap = {};
        
        formResponses.forEach(({ questionId, value, type, answerId }) => {
            console.log('type', type);
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
        console.log('formResponseMap', formResponseMap);
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
    this.setFormDataFromSave = (selector, idToQueMap, idToAnsMap, formResponses) => {
        if(!formResponses || formResponses.length === 0) return;
        const formResponseMap = getFormResponseMap(formResponses);
        const formEle = document.querySelector(selector);
        const filteredElements = [...formEle.elements].filter((el) => {
            return Boolean(el.name);
        });
        filteredElements.forEach(el => {
            const questionId = idToQueMap[el.name];
            if (!questionId) return;
            const questionValue = formResponseMap[questionId];
            if (!questionValue) return;
            if (el.type == 'checkbox') {
                const elId = idToAnsMap[el.id];
                if (questionValue[elId]) {
                    // el.checked = true;
                    el.click();
                }
            } else if (el.type == 'radio') {
                if (questionValue == idToAnsMap[el.id]) {
                    // el.checked = true;
                    el.click();
                }
            } else {
                el.value = questionValue;
            }
        });
    }

    this.getFormDataToSave = (selector, idToQueMap, idToAnsMap) => {
        const retVal = {};
        const formEle = document.querySelector(selector);
        const filteredElements = [...formEle.elements].filter((el) => {
            return Boolean(el.name);
        })
        filteredElements.forEach(el => {
            const questionId = idToQueMap[el.name];
            if (!questionId) return;
            if (el.type == 'checkbox') {
                if (el.checked) {
                    if (!retVal[questionId]) {
                        retVal[questionId] = {
                            questionId: questionId,
                            value: [{
                                value: el.value,
                                type: 'checkbox',
                                answerId: idToAnsMap[el.id]
                            }]
                        }

                        return;
                    }
                    retVal[questionId].value.push({
                        value: el.value,
                        type: 'checkbox',
                        answerId: idToAnsMap[el.id]
                    });
                }
            } else if (el.type == 'radio') {
                if (el.checked) {
                    retVal[questionId] = {
                        questionId: questionId,
                        value: el.value,
                        type: 'radio',
                        answerId: idToAnsMap[el.id]
                    };
                }
            } else {
                if (el.value) {
                    retVal[questionId] = {
                        questionId: questionId,
                        type: 'checkbox',
                        value: el.value,
                    };
                }
            }
        });

        console.log('retVal', retVal);
        return retVal;
    };
    this.setSignatureFromSave = async (selector, base64Data = '') => {
        let canvasObj = document.getElementById(selector);
        console.log(base64Data.includes('base64'));
        debugger
        if(canvasObj && base64Data.includes('base64')){
            let new_image = document.createElement('img');
            new_image.src = base64Data;
            const ctx = canvasObj.getContext("2d");
            ctx.drawImage(new_image, 0, 0);
        }
    };
    this.getSignatureDataToSave = (selector) => {
        let canvasObj = document.getElementById(selector);
        if(canvasObj){
            return canvasObj.toDataURL();
        }
        return null;
    };

    return {
        setParseQuestions: this.setParseQuestions,
        setParseAnswers: this.setParseAnswers,
        getQuestions: this.getQuestions,
        getAnswers: this.getAnswers,
        getFormDataToSave: this.getFormDataToSave,
        setFormDataFromSave: this.setFormDataFromSave,
        setSignatureFromSave: this.setSignatureFromSave,
        getSignatureDataToSave: this.getSignatureDataToSave
    };
})();





