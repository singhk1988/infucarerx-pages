function getFormControlTemplate(label, isRequired) {
  const asterisk = isRequired ? '<span class="required-asterisk">*</span>' : '';
  return `
    <div class="form-item">
      <label class="form-label">${label}${asterisk}</label>
      <slot name="input"></slot>
    </div>
    <div class="invalid-feedback"></div>
  `;
}


customElements.define("custom-input", class extends HTMLElement {
  static observedAttributes = ["label", "value", "error", "required"];

  constructor() {
    super();
    this.initialised = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.initialised) {
      const isRequired = this.hasAttribute('required');
      this.innerHTML = getFormControlTemplate(this.getAttribute('label'), isRequired);
      const inputTemplate = document.createElement('template');
      const type = this.getAttribute('type') ?? 'text';
      inputTemplate.innerHTML = `
        <input type="${type}"
          id="${this.id}-input"
          name="${this.getAttribute('name')}"
          placeholder="${this.getAttribute('placeholder')}"
          value="${this.getAttribute('value')}"
          class="form-control"
          ${isRequired ? 'required' : ''}
        />
      `;
      this.querySelector('slot[name="input"]').replaceWith(inputTemplate.content);
      this.initialised = true;

      // Update inputElement reference
      this.inputElement = this.querySelector('.form-control');
      
      // Setup event listeners
      this.setupEventListeners();
    } else {
      this.updateComponent();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && this.inputElement) {
      this.inputElement.value = newValue;
    } else {
      this.render();
    }
  }

  get value() {
    return this.inputElement ? this.inputElement.value : '';
  }

  set value(val) {
    if (this.inputElement) {
      this.inputElement.value = val;
    }
    this.setAttribute('value', val);
  }

  setupEventListeners() {
    // Listen to input changes
    this.inputElement.addEventListener('input', () => {
      this.value = this.inputElement.value; // Reflect input value to the attribute
      this.dispatchEvent(new Event('change', { bubbles: true })); // Dispatch change event
    });

    // Focus event to focus the inner input when the custom element is focused
    this.addEventListener('focus', () => this.inputElement.focus(), { capture: true });
  }

  updateComponent() {
    const isRequired = this.hasAttribute('required');
    const label = this.getAttribute('label');
    const asteriskPresent = label.includes('*');
    this.querySelector('.form-label').innerHTML = `${label}${isRequired && !asteriskPresent ? '<span class="required-asterisk">*</span>' : ''}`;
    this.inputElement.value = this.getAttribute('value') || '';

    // Error handling
    const error = this.getAttribute('error');
    if (error) {
      this.querySelector('.form-item').classList.add('is-invalid');
      this.inputElement.classList.add('is-invalid');
      this.querySelector('.invalid-feedback').textContent = error;
    } else {
      this.querySelector('.form-item').classList.remove('is-invalid');
      this.inputElement.classList.remove('is-invalid');
      this.querySelector('.invalid-feedback').textContent = '';
    }
  }

  // Public method to focus the input element programmatically
  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }
});




customElements.define('custom-input-checkradio', class extends HTMLElement {
  static observedAttributes = ["label", "value", "error", "required"];
  
  constructor() {
    super();
    this.initialised = false;
    this.type = this.getAttribute('type') ?? 'checkbox';

    this.addEventListener('custom-input-checkradio-item-added', (e)=>{
      this.onItemAdded(e.detail);
    })
  }

  initialise() {
    const children = this.querySelectorAll('custom-input-checkradio-item');
    const isRequired = this.hasAttribute('required');
    this.innerHTML = getFormControlTemplate(this.getAttribute('label'), isRequired);
    // If the childrens are available already then add them to correct place.
    for (const child of children) {
      this.onItemAdded({
        id: child.id,
        name: child.getAttribute('name'),
        type: child.getAttribute('type'),
        label: child.getAttribute('label'),
        value: child.getAttribute('value'),
      })
    }
    this.initialised = true;
  }

  onItemAdded(attrs) {
    const item = document.createElement('template')
    item.innerHTML =
    `
    <div class="form-check">
      <input class="form-check-input" name="${attrs.name ?? this.getAttribute('name')}" type="${attrs.type ?? this.type}"
        value="${attrs.value}" id="${attrs.id}">
      <label class="form-check-label" for="${attrs.id}">
        ${attrs.label}
      </label>
    </div>
    
    `;
    this.querySelector('.form-item').insertBefore(item.content, this.querySelector('slot[name="input"]'));
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.initialised = false;
  }

  render() {
    if (!this.initialised) {
      this.initialise();
    } else {
      const isRequired = this.hasAttribute('required');
      const label = this.getAttribute('label');
      const asteriskPresent = label.includes('*');
      this.querySelector('.form-label').innerHTML = `${label}${isRequired && !asteriskPresent ? '<span class="required-asterisk">*</span>' : ''}`;

      // error handling
      const error = this.getAttribute('error');
      if (Boolean(error)) {
        this.querySelector('.form-item').classList.add('is-invalid');
        const items = this.querySelectorAll('.form-check-input');
        for (const child of items) {
          child.classList.add('is-invalid');
        }
        this.querySelector('.invalid-feedback').innerHTML = error;
      } else {
        this.querySelector('.form-item').classList.remove('is-invalid');
        const items = this.querySelectorAll('.form-check-input');
        for (const child of items) {
          child.classList.remove('is-invalid');
        }
        this.querySelector('.invalid-feedback').innerHTML = '';
      }
    }
  }

  attributeChangedCallback() {
    this.render();
  }
});


customElements.define("custom-input-checkradio-item", class extends HTMLElement {
  // We use this component for getting the data only
  // Pass on the details to parent and parent will take care of rendering.
  // In most cases, this will rendered before parent will set the innerHTML,
  // but sometimes, this component will load after parent innerHTML is set.
  // We need to tell parent that this component has arrived.
  connectedCallback() {
    this.dispatchEvent(new CustomEvent('custom-input-checkradio-item-added', {
      bubbles: true,
      cancelable: true,
      detail: {
        id: this.id,
        name: this.getAttribute('name'),
        type: this.getAttribute('type'),
        label: this.getAttribute('label'),
        value: this.getAttribute('value'),
      }
    }));
    this.remove();
  }
});
class CommonStepper extends HTMLElement {
  constructor() {
    super();
    this.currentStep = 1;
    this.steps = [];
    this.render();
  }

  connectedCallback() {
    // Parse the steps attribute value as JSON array
    this.steps = JSON.parse(this.getAttribute('steps'));
    this.render();
  }

  render() {
    const steps = JSON.parse(this.getAttribute('steps'));
    const totalSteps = steps.length;
    this.innerHTML = `
      <style>
      .steps {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          min-height: 70px;
      }
       
      h4 {
          margin-top: 0 !important; 
          margin-bottom: 0 !important;
      }
      .step {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction:column;
          gap: 5px;
          flex: 1;
          cursor: pointer;
          
      }
      .step-number {
          width: 40px;
          height: 40px;
          border: 2px solid #ddd;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          
      }
      .step h4 {  
          font-size: 12px;
          text-align: center;
      }
      .active {
          background-color: #007bff;
          color: #fff;
      }
      .active-header {
          color: #444;
          font-weight: bold;
          font-size:20px;
      }
      .progress-bar {
          height: 4px;
          background-color: #007bff;
          margin-top: 10px;
      }
      .line-wrapper {
          width: 100%;
      }
      .line1 {
          height:50px;
          width: 100%;
          display: flex;
          align-items: center;
      }
      .line {
          width: 100%;
          height: 4px;
          background-color: #ddd;
          
      }
      .line-completed .line{
          background-color: green;
      }
      .line-blue .line {
          background-color: #007bff;
      }
      .completed {
          background-color: green;
          color: white;
      }
      .step-number .check {
          display: none;
      }
      
      .completed .check {
          display: block !important;
      }
      @media(min-width:1200px) {
        h4.step-header {
            position: absolute;
            top: 43px;
            width: 130px;
        }
    }
    @media(min-width:1366px) {
        h4.step-header { 
            width: 210px;
            top: 50px;
        }
    }
      
      
      </style>
      <div class="steps mt-2">
          ${steps.map((label, index) => `
              <div class="step" data-step="${index + 1}">
              <p class="step-number ${index === 0 ? 'active' : ''}">
                  <span class="step-index-number">${index + 1}</span>
                  <span class="check">✔</span>
              </p>

              <h4 class="step-header ${index === 0 ? 'active-header' : ''}">${label}</h4>
              </div>
              ${index < totalSteps - 1 ? '<div class="line1"><div class="line" id="line"></div></div>' : ''}
          `).join('')}
      </div>
      <!-- <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${this.currentStep * (100 / totalSteps)}%;"></div>
          <div class="content"></div>
      </div> -->
  `;
    this.loadStepContent(1);
  }

  static get observedAttributes() {
    return ['steps', 'current-step', 'next-button', 'prev-button'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed:", name, "Old value:", oldValue, "New value:", newValue);
    if (name === 'current-step' && newValue) {
      this.currentStep = parseInt(newValue);
      this.loadStepContent(this.currentStep);
    }
  }
  loadStepContent(step) {
    const stepContentDiv = document.getElementById(`stepContent${step}`);
    if (stepContentDiv) {
      const stepContentDivs = document.querySelectorAll('.step-content');
      stepContentDivs.forEach(div => div.style.display = 'none');
      stepContentDiv.style.display = 'block';

      const steps = this.querySelectorAll('.step-number');
      const stepsHeader = this.querySelectorAll('.step-header');
      const stepsLine = this.querySelectorAll('.line1');

      if (steps && stepsHeader && stepsLine) {
        steps.forEach(stepEl => stepEl.classList.remove('active', 'completed'));
        stepsHeader.forEach(header => header.classList.remove('active-header'));
        stepsLine.forEach(line => line.classList.remove('line-completed', 'line-blue'));

        for (let i = 0; i < step - 1; i++) {
          if (steps[i] && stepsLine[i]) {
            steps[i].classList.add('completed');
            stepsLine[i].classList.add('line-completed');
            steps[i].querySelector('.step-index-number').style.display = 'none';
          }
        }

        if (steps[step - 1] && stepsHeader[step - 1]) {
          steps[step - 1].querySelector('.step-index-number').style.display = 'block';
          steps[step - 1].classList.add('active');
          stepsHeader[step - 1].classList.add('active-header');
        }

        if (step > 1 && stepsLine[step - 2]) {
          stepsLine[step - 2].classList.add('line-blue');
        }
        if (step < steps.length && stepsLine[step - 1]) {
          stepsLine[step - 1].classList.add('line-green');
        }
      }
    }
  }

  getStepLabel(stepIndex) {
    const steps = JSON.parse(this.getAttribute('steps'));
    if (stepIndex >= 0 && stepIndex < steps.length) {
      return steps[stepIndex];
    } else {
      return null;
    }
  }

  setStepLabel(stepIndex, newLabel) {
    const steps = JSON.parse(this.getAttribute('steps'));
    if (stepIndex >= 0 && stepIndex < steps.length) {
      steps[stepIndex] = newLabel;
      this.setAttribute('steps', JSON.stringify(steps));
      this.render();
    }
  }
}

customElements.define('common-stepper', CommonStepper);