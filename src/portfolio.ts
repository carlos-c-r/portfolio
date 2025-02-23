import { FilterButton } from './filter-button';
import stacksData from './data/stacks.json';
import projectsData from './data/projects.json';

const projects = Object.assign({}, projectsData) as { [key: string]: any };
for (const k in projects) projects[k].domElement = document.querySelector(`#${k}`);

const projectsDomMap = Object.keys(projects).reduce((acc, x) => {
    acc[x] = document.querySelector(`#${x}`);
    return acc;
}, {});

const stacksProjectMap = Object.entries(projects).reduce((acc, [k, {stacks}]) => {
    for (const s in stacks) {
        acc[s] ??= [];
        acc[s].push(k);
    }
    return acc;
}, <any>{});

var filterMask = new Map<string, boolean>(Object.keys(stacksData).map(x => [x, true]));

const parent = document.querySelector('#filters') as HTMLElement;

for (const [stackKey, label] of Object.entries(stacksData)) {

    let filter = FilterButton.make("", label);
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

    parent.appendChild(filter);
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