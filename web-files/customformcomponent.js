function getFormControlTemplate(label) {
  return `
    <div class="form-item">
      <label class="form-label">${label}</label>
      <slot name="input"></slot>
    </div>
    <div class="invalid-feedback"></div>
  `;
}

customElements.define("custom-input", class extends HTMLElement {
  static observedAttributes = ["label", "value", "error"];

  constructor() {
    super();
    this.initialised = false; 
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if(!this.initialised)  {
      this.innerHTML = getFormControlTemplate(this.getAttribute('label'));
      const input = document.createElement('template')
      const type = this.getAttribute('type') ?? 'text';
      input.innerHTML = `
        <input type="${type}"
          id="${this.id}"
          name="${this.getAttribute('name')}"
          placeholder="${this.getAttribute('placeholder')}"
          value="${this.getAttribute('value')}"
          class="form-control"
        />
      `;
      this.querySelector('slot[name="input"]').replaceWith(input.content);
      this.initialised = true;
    } else {
      this.querySelector('.form-label').innerHTML = this.getAttribute('label');
      const inp = this.querySelector('.form-control')
      inp.setAttribute('value', this.getAttribute('value'));

      // error handling
      const error = this.getAttribute('error');
      if(Boolean(error)) {
        this.querySelector('.form-item').classList.add('is-invalid');
        inp.classList.add('is-invalid');
        this.querySelector('.invalid-feedback').innerHTML = error;
      } else {
        this.querySelector('.form-item').classList.remove('is-invalid');
        inp.classList.remove('is-invalid');
        this.querySelector('.invalid-feedback').innerHTML = '';
      }
    }
  }

  attributeChangedCallback() {
    this.render();
  }
});



customElements.define('custom-input-checkradio', class extends HTMLElement {
  static observedAttributes = ["label", "value", "error"];
  
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
    this.innerHTML = getFormControlTemplate(this.getAttribute('label'));
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
    if(!this.initialised) {
      this.initialise();
    } else {
      this.querySelector('.form-label').innerHTML = this.getAttribute('label');

      // error handling
      const error = this.getAttribute('error');
      if(Boolean(error)) {
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

