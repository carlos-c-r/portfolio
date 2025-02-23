import projectsData from './data/projects.json';
import { FilterButton } from './filter-button.js';


interface PortfolioEntryData {
    title: string,
    client: string,
    year: string,
    description: string,
    stacks: string[],
    roles: string[],
    challenges: string[],
    solutions: string[],
    references: string[],
}

const projects = projectsData as unknown as { [key: string]: PortfolioEntryData }; 

export class PortfolioEntry extends HTMLElement {

    content: Node;
    root: any;

    constructor() {

        super();

        let template = document.getElementById("portfolio-entry") as HTMLTemplateElement;
        let templateContent = template.content;
        let content = templateContent.cloneNode(true);

        this.content = content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(content);

        this.root = shadowRoot;
    }

    connectedCallback() {

        let id = this.getAttribute("name");
        if (!id) throw new Error(`Portfolio entries must have the name attribute set.`);

        const project = projects[id]

        let titleSlot = document.createElement("span");
        titleSlot.textContent = projects[id].title;
        titleSlot.setAttribute("slot", "title");

        let descSlot = document.createElement("span");
        descSlot.textContent = projects[id].description;
        descSlot.setAttribute("slot", "description");

        let clientSlot = document.createElement("span");
        clientSlot.textContent = `${projects[id].year} - ${projects[id].client}`;
        clientSlot.setAttribute("slot", "client");

        let roleSlot = document.createElement("span");
        roleSlot.textContent = projects[id].roles.join(', ');
        roleSlot.setAttribute("slot", "role");

        this.root.host.appendChild(titleSlot);
        this.root.host.appendChild(descSlot);
        this.root.host.appendChild(clientSlot);
        this.root.host.appendChild(roleSlot);

        for (const s of projects[id].stacks) {
            const chip = FilterButton.make(s, s);
            chip.setAttribute("slot", "stacks");
            chip.setAttribute("selected", "");
            chip.setAttribute('unclickable', '');

            this.root.host.appendChild(chip);
        }

        for (const c of projects[id].challenges) {
            const elm = document.createElement('li');
            elm.textContent = c;
            elm.setAttribute('slot', 'challenges');

            this.root.host.appendChild(elm);
        }

        for (const c of projects[id].solutions) {
            const elm = document.createElement('li');
            elm.textContent = c;
            elm.setAttribute('slot', 'solutions');

            this.root.host.appendChild(elm);
        }

        for (const c of projects[id].references) {
            const elm = document.createElement('li');
            if (c.includes('youtube.com')) {
                elm.innerHTML = `
                <iframe width="420" height="315"
                src="${c.replace('/watch?v=', '/embed/')}">
                </iframe>
                `
            }
            else {
                elm.textContent = c;
            }
            elm.setAttribute('slot', 'references');

            this.root.host.appendChild(elm);
        }

        this.root.host.style.backgroundImage = `url("portfolio/${id}/bg.png")`;
    }
}

window.customElements.define("portfolio-entry", PortfolioEntry);