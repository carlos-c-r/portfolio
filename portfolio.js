export class FilterButton extends HTMLElement {
    static observedAttributes = ["selected"];

    constructor() {
        super();
        this.addEventListener('click', ev => {
            this.toggleAttribute("selected");
            console.log(this.hasAttribute("selected"));

        });
        let template = document.getElementById("f-b");
        let templateContent = template.content;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    get selected() {
        return this.hasAttribute("selected");
    }

    static make(icon, label) {

        const elm = document.createElement("filter-button");
        const i = document.createElement("i");
        i.classList.add(`devicon-${icon}-plain`, "colored");
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

var filterMask = 0;

export function createFilters() {
    
    const stacks = {
        "c": { label: "C" },
        "cplusplus": { label: "CPP" },
        "csharp": { label: "C#" },
        "python": { label: "Python" },
        "java": { label: "Java" },
        "javascript": { label: "JavaScript" },
        "typescript": { label: "TypeScript" },
        "nodejs": { label: "NodeJS" },
        "android": { label: "Android" },
        "unity": { label: "Unity" },
        "unrealengine": { label: "Unreal Engine" },
        "opencv": { label: "OpenCV" },
        "amazonwebservices": { label: "AWS" },
        "googlecloud": { label: "Google Cloud" },
        "bash": { label: "Bash" },
        "githubactions": { label: "Github Actions" },
        "php": { label: "PHP" },
        "html5": { label: "HTML5" },
        "css3": { label: "CSS3" },
        "opengl": { label: "OpenGL/GLES/DirectX" },
        "debian": { label: "SysAdmin" },
        "jenkins": { label: "DevOps" }
    };

    Object.keys(stacks).forEach((k, i) => stacks[k].mask = 1 << i);

    console.log(stacks);

    const parent = document.querySelector('#filters');

    for (const [icon, stack] of Object.entries(stacks)) {
        let filter = FilterButton.make(icon, stack.label);
        filter.addEventListener('click', ev => {

            if (ev.target.selected) {
                filterMask |= stack.mask;
            }
            else filterMask ^= stack.mask;

            //console.log(filterMask)

            for (const elm of document.querySelectorAll('.portfolio-entry')) {
                const entryStacks = elm.getAttribute("stacks")?.split(" ") || [];
                const entryMask = entryStacks.reduce((acc, x) => acc |= stacks[x].mask, 0);
                if (entryMask & filterMask) {
                    elm.classList.remove("hidden");
                }
                else {
                    elm.classList.add("hidden");
                }

                //console.log(elm.textContent, entryMask.toString(2), filterMask.toString(2), entryMask & filterMask)
            }
        });
        parent.appendChild(filter);

    }
}


export function setBackgrounds() {
    
    const entries = document.querySelectorAll('.portfolio-entry');
    for (const e of entries) {
        e.style.backgroundImage = `url("portfolio/${e.id}/bg.png")`;
    }
}

