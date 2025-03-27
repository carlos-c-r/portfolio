import html from './templates/portfolio-entry.html';

import projectsData from './data/projects.json' with { type: "json" };
import stacksData from './data/stacks.json' with { type: "json" };
import rolesData from './data/roles.json' with { type: "json" };


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

const TEMPLATE_ID = "portfolio-entry";
const TAG_NAME = "portfolio-entry";

const template = document.createElement('template');
document.body.append(template);
template.id = TEMPLATE_ID;
template.innerHTML = html;

const projects = projectsData as unknown as { [key: string]: PortfolioEntryData };
const stacks = stacksData as unknown as { [key: string]: string };
const roles = rolesData as unknown as { [key: string]: string };

export class PortfolioEntry extends HTMLElement {

    content: Node;
    root: ShadowRoot;

    titleElement!: HTMLElement;
    descElement!: HTMLElement;
    clientElement!: HTMLElement;
    roleElement!: HTMLElement;
    stacksElement!: HTMLElement;
    challengesElement!: HTMLElement;
    solutionsElement!: HTMLElement;
    referencesElement!: HTMLElement;



    constructor() {

        super();

        let template = document.getElementById(TEMPLATE_ID)! as HTMLTemplateElement;
        let content = template.content.cloneNode(true);
        this.content = content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(content);

        this.root = shadowRoot;
    }

    connectedCallback() {

        let id = this.getAttribute("name");
        if (!id) throw new Error(`Portfolio entries must have the name attribute set.`);

        let titleSlot = document.createElement("span");
        titleSlot.setAttribute("slot", "title");
        this.titleElement = titleSlot;

        let descSlot = document.createElement("span");
        descSlot.setAttribute("slot", "description");
        this.descElement = descSlot;

        let clientSlot = document.createElement("span");
        clientSlot.setAttribute("slot", "client");
        this.clientElement = clientSlot;

        let roleSlot = document.createElement("span");
        roleSlot.setAttribute("slot", "role");
        this.roleElement = roleSlot;

        this.stacksElement = document.createElement("div");
        this.stacksElement.setAttribute("slot", "stacks");

        this.challengesElement = document.createElement("div");
        this.challengesElement.setAttribute("slot", "challenges");

        this.solutionsElement = document.createElement("div");
        this.solutionsElement.setAttribute("slot", "solutions");

        this.referencesElement = document.createElement("div");
        this.referencesElement.setAttribute("slot", "references");

        this.root.host.appendChild(titleSlot);
        this.root.host.appendChild(descSlot);
        this.root.host.appendChild(clientSlot);
        this.root.host.appendChild(roleSlot);

        this.setProject(projects[id]);

        
    }

    setProject(project: PortfolioEntryData) {

        const toEmpty = new Set(['challenges', 'solutions', 'references', 'stacks']);

        for (const c of this.root.host.children) {
            if (toEmpty.has(c.slot)) this.root.host.removeChild(c);
        }

        this.titleElement.textContent = project.title;
        this.descElement.textContent = project.description;
        this.clientElement.textContent = `${project.year} - ${project.client}`;
        this.roleElement.textContent = project.roles.map(x => roles[x] || x).join(', ');

        for (const s of project.stacks) {
            //console.log(projects[id].title, s, stacks[s])
            const chip =  document.createElement('filter-chip')
            chip.setAttribute("name", s)
            chip.setAttribute("slot", "stacks");
            chip.toggleAttribute("disabled");

            this.root.host.appendChild(chip);
        }

        for (const c of project.challenges) {
            const elm = document.createElement('li');
            elm.textContent = c;
            elm.setAttribute('slot', 'challenges');

            this.root.host.appendChild(elm);
        }

        for (const c of project.solutions) {
            const elm = document.createElement('li');
            elm.textContent = c;
            elm.setAttribute('slot', 'solutions');

            this.root.host.appendChild(elm);
        }

        const refContainer = document.createElement('div');
        refContainer.setAttribute('slot', 'references');
        this.root.host.appendChild(refContainer);

        for (const c of project.references) {
            const elm = document.createElement('div');
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
            //elm.setAttribute('slot', 'references');

            refContainer.appendChild(elm);
        }
    }
}

window.customElements.define(TAG_NAME, PortfolioEntry);