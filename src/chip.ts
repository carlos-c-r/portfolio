import html from './templates/chip.html';

import stackIconsData from './data/stackicons.json' with { type: "json" };
import stacksData from './data/stacks.json' with { type: "json" };

const TEMPLATE_ID = "chip";
const TAG_NAME = "filter-chip";

const template = document.createElement('template');
document.body.append(template);
template.id = TEMPLATE_ID;
template.innerHTML = html;

const stackIcons = stackIconsData as { [key: string]: string };
const stacks = stacksData as { [key: string]: string };


export class Chip extends HTMLElement {

    static observedAttributes = ["disabled"];

    checkbox: HTMLInputElement;

    constructor() {
        super();

        let template = document.getElementById(TEMPLATE_ID)! as HTMLTemplateElement;
        let content = template.content.cloneNode(true);

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(content);

        this.checkbox = shadowRoot.querySelector('#checkbox')!;
        this.checkbox.addEventListener('change', ev => this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checkbox.checked } })));
    }

    connectedCallback() {

        const disabled = this.hasAttribute("disabled");
        this.setDisabled(disabled);

        const name = this.getAttribute("name");
        if (name) {

            if (stackIcons[name]) {
                //const s = document.createElement('span');
                //s.setAttribute("slot", "icon");

                const i = document.createElement("i");
                i.setAttribute("slot", "icon");
                i.setAttribute("name", stackIcons[name]);
                i.classList.add(`devicon-${stackIcons[name]}-plain`, "colored");


                //this.appendChild(s);
                //s.appendChild(i);
                this.appendChild(i);
            }

            const slot = this.shadowRoot!.querySelector('slot[name="label"]') as HTMLSlotElement;
            if (slot.assignedElements().length == 0 && stacks[name]) {
                const label = document.createElement('span');
                label.textContent = stacks[name];
                label.setAttribute('slot', 'label');
                this.appendChild(label);

            }
        }
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        const disabled = this.hasAttribute("disabled");
        this.setDisabled(disabled);
    }

    get checked() {
        return this.checkbox.checked;
    }

    private setDisabled(disabled: boolean) {
        console.log(this, disabled);
        this.checkbox.disabled = disabled;
    }
}

window.customElements.define(TAG_NAME, Chip);
