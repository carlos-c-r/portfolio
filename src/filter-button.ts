export class FilterButton extends HTMLElement {

    static observedAttributes = ["selected"];

    constructor() {
        super();
        this.addEventListener('click', ev => {
            this.toggleAttribute("selected");
            console.log(this.hasAttribute("selected"));

        });
        let template = document.getElementById("f-b")! as HTMLTemplateElement;
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    get selected() {
        return this.hasAttribute("selected");
    }

    static make(icon: string, label: string) {

        const elm = document.createElement("filter-button");
        const i = document.createElement("i");
        //console.log(icon);
        if (icon) i.classList.add(`devicon-${icon}-plain`, "colored");
        i.setAttribute("slot", "icon");
        const l = document.createElement("span");
        l.textContent = label;
        l.setAttribute("slot", "label");

        elm.setAttribute("selected", "");

        elm.appendChild(i);
        elm.appendChild(l);

        return elm;
    }
}

window.customElements.define("filter-button", FilterButton);