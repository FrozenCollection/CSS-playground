
/**
 * @callback inputCallback
 * @param {string} value
 * @returns {void} 
 */

/** 
 * @typedef {Object} InputConfig
 */

/**
 * @param {HTMLElement} targetElement 
 * @param {string} attribute 
 * @returns {inputCallback}
 */
function bindStyle(targetElement, attribute) {
    return function(value) {
        targetElement.style[attribute] = value;
    };
}


class BaseInput {
    /**
     * @param {string} target 
     * @param {inputCallback} inputCallback
     * @param {InputConfig} config
     */
    constructor(target, inputCallback, config) {
        this.target = target;
        this.targetElement = document.getElementById(target);
        if (!this.targetElement) {
            throw new Error(`Element with id '${target}' not found.`);
        }
        this.inputCallback = inputCallback;
        if (config === undefined) this.config = {}
        else this.config = config;
    }
    /**
     * 通用事件处理器
     * @param {Event} e
     */
    handleInput(e) {
        const value = this.getValue(e);
        if (this.inputCallback)
            this.inputCallback(value);
    }
    /**
     * 子类实现：获取当前输入值
     * @abstract
     * @returns {string}
     */
    getValue() {
        throw new Error("getValue() must be implemented by subclass");
    }

}



/**
 * @typedef {InputConfig} TextInputConfig
 * @property {string} datalist
 */


class TextInput extends BaseInput {
    /**
     * @param {TextInputConfig} config 
     */
    constructor(target, inputCallback, config) {
        super(target, inputCallback, config);

        this.inputElement = document.createElement("input");
        if (this.config.datalist) this.inputElement.setAttribute('list', config.datalist);
        this.inputElement.addEventListener('input', this.handleInput.bind(this));
        this.inputElement.addEventListener('change', this.handleInput.bind(this));
        this.targetElement.appendChild(this.inputElement);
    }
    getValue() {
        return this.inputElement.value;
    }
}

class ChoiceInput extends BaseInput {
    /**
     * @param {string[]} options
     */
    constructor(target, options, inputCallback, config) {
        super(target, inputCallback, config);
        this.choiseElements = [];
        for (const option of options) {
            let labelElement = document.createElement("label");
            this.targetElement.appendChild(labelElement);
            let optionElement = this.createInput(option);
            let textElement = document.createTextNode(option);
            labelElement.appendChild(optionElement);
            labelElement.appendChild(textElement);
            this.choiseElements.push(optionElement);
        }
    }
    /**
     * @param {string} option
     */
    createInput(option) {
        let inputElement = document.createElement("input");
        inputElement.type = "radio";
        inputElement.name = this.target;
        inputElement.value = option;
        inputElement.addEventListener('input', this.handleInput.bind(this));
        return inputElement;
    }
    getValue(e) {
        return e.target.value;
    }
}

class ChoicesInput {
    constructor(target, options, inputCallback) {
        this.targetElement = document.getElementById(target);
    }
    createInput(option, callback) {
        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.name = target;
        inputElement.value = option;
        inputElement.addEventListener('input', callback);
    }
    getValue(e) {
        return e.target.value;
    }
}

/**
 * @typedef {object} LengthInputConfig
 * @property {string} initValue
 */


class LengthInput extends BaseInput {
    /**
     * @param {string} target 
     * @param {inputCallback} inputCallback 
     * @param {LengthInputConfig} config 
     */
    constructor(target, inputCallback, config) {
        super(target, inputCallback, config);

        this.inputElement = document.createElement('input');
        this.inputElement.type = 'number';
        this.inputElement.id = target + '-value'
        this.inputElement.step = '1';
        this.inputElement.placeholder = 'Enter length';
        if (this.config.initValue) this.inputElement.value = this.config.initValue;
        this.inputElement.addEventListener('input', this.handleInput.bind(this));
        this.inputElement.addEventListener('change', this.handleInput.bind(this));
        this.targetElement.appendChild(this.inputElement);

        this.selectElement = document.createElement('select');
        this.selectElement.id = target + '-unit';
        this.selectElement.addEventListener('change', this.handleInput.bind(this));
        this.selectElement.addEventListener('change', this.handleInput.bind(this));
        let units = ['px', 'em', 'rem', '%', 'vw', 'vh', 'vmin', 'vmax'];
        for (const unit of units) {
            let optionElem = document.createElement('option');
            optionElem.textContent = unit;
            this.selectElement.appendChild(optionElem);
        }
        this.targetElement.appendChild(this.selectElement);
    }
    getValue(e) {
        return this.inputElement.value + this.selectElement.value;
    }
}


