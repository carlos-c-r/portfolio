import { FilterButton } from './filter-button.js';
import './portfolio-entry.js';
import stacksData from './data/stacks.json' with { type: "json" };
import stackIconsData from './data/stackicons.json' with { type: "json" };
import projectsData from './data/projects.json' with { type: "json" };

// import './main.scss';

const projects = Object.assign({}, projectsData) as { [key: string]: any };
for (const k in projects) projects[k].domElement = document.querySelector(`#${k}`);

const stackIcons = stackIconsData as unknown as { [key: string]: string };

const parent = document.querySelector('#portfolio-entries') as HTMLElement;
console.log(parent)

for (const [k, project] of Object.entries(projects)) {
    const elm = document.createElement("portfolio-entry");
    elm.setAttribute("name", k);
    elm.id = k;
    parent.appendChild(elm);
}


const projectsDomMap = Object.keys(projects).reduce((acc, x) => {
    const elm = document.querySelector(`#${x}`);
    if (!elm) throw new Error(`No DOM element found for project ${x}`);
    acc[x] = elm!;
    return acc;
}, <{[key: string]: Element}>{});

const stacksProjectMap = Object.entries(projects).reduce((acc, [k, {stacks}]) => {
    for (const s in stacks) {
        acc[s] ??= [];
        acc[s].push(k);
    }
    return acc;
}, <any>{});

var filterMask = new Map<string, boolean>(Object.keys(stacksData).map(x => [x, true]));


const filterParent = document.querySelector('#filters') as HTMLElement;

for (const [stackKey, label] of Object.entries(stacksData)) {

    let filter = FilterButton.make(stackIcons[stackKey], label);
    filter.addEventListener('click', ev => {

        filterMask.set(stackKey, (ev?.target as any).selected || false);   

        for (const projectKey of stacksProjectMap[stackKey] || []) {
            if (checkMaskForAny(filterMask, ...projects[projectKey].stacks)) {
                projectsDomMap[projectKey].classList.remove('hidden');
            }
            else {
                projectsDomMap[projectKey].classList.add('hidden');
            }
        }
    });

    filterParent.appendChild(filter);
}


function checkMaskForAny(mask: Map<string, boolean>, ...entries: string[]): boolean {
    for (const e of entries) {
        if (mask.has(e)) return true;
    }
    return false;
}

function checkMaskForAll(mask: Map<string, boolean>, ...entries: string[]): boolean {
    for (const e of entries) {
        if (!mask.has(e)) return false;
    }
    return true;
}