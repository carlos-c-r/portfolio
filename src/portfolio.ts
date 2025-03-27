import textures from './textures.js';

import { Chip } from './chip.js';
import './portfolio-entry.js';
import stacksData from './data/stacks.json' with { type: "json" };
import stackIconsData from './data/stackicons.json' with { type: "json" };
import projectsData from './data/projects.json' with { type: "json" };
import { PortfolioEntry } from './portfolio-entry.js';

// import './main.scss';



const projects = Object.assign({}, projectsData) as { [key: string]: any };
for (const k in projects) projects[k].domElement = document.querySelector(`#${k}`);

const stackIcons = stackIconsData as unknown as { [key: string]: string };

const parent = document.querySelector('#portfolio-entries ul') as HTMLElement;

let z = 50;

for (const [k, project] of Object.entries(projects)) {

    const cnt = document.createElement("div");
    cnt.setAttribute("name", k);
    cnt.classList.add('hex-grid__content');
    cnt.id = k;

    cnt.addEventListener('mouseover', ev => {
        textures.load(`portfolio/${k}/bg.png`);
    });

    const elm = document.createElement('li');
    elm.classList.add('hex-grid__item');
    //cnt.innerText = k;//projects[k].title;
    parent.appendChild(elm);

    elm.appendChild(cnt);


    const bg = document.createElement('div');
    bg.classList.add('hex-bg');
    bg.style.backgroundImage = `url('/portfolio/${k}/bg.png')`;

    const brd = document.createElement('div');
    brd.classList.add('hex-border');

    const t = document.createElement('p');
    t.innerText = projects[k].title;


    cnt.appendChild(bg);
    cnt.appendChild(t);
    cnt.appendChild(brd);

    elm.style.zIndex = (z--).toString();

    elm.addEventListener('mousedown', ev => {
        (document.querySelector('#pe') as PortfolioEntry)?.setProject(project);
        document.querySelector('#portfolio-modal')?.classList.remove('modal-hidden');
    }


}


// const projectsDomMap = Object.keys(projects).reduce((acc, x) => {
//     const elm = document.querySelector(`#${x}`);
//     if (!elm) throw new Error(`No DOM element found for project ${x}`);
//     acc[x] = elm!;
//     return acc;
// }, <{[key: string]: Element}>{});

const stacksProjectMap = Object.entries(projects).reduce((acc, [k, { stacks }]) => {
    for (const s in stacks) {
        acc[s] ??= [];
        acc[s].push(k);
    }
    return acc;
}, <any>{});

var filterMask = new Map<string, boolean>(Object.keys(stacksData).map(x => [x, true]));


const filterParent = document.querySelector('#filters') as HTMLElement;

for (const [stackKey, label] of Object.entries(stacksData)) {

    let filter = document.createElement('filter-chip');
    filter.setAttribute('name', stackKey);
    filter.addEventListener('change', (ev: any) => {

        filterMask.set(stackKey, ev.detail.checked || false);

        // for (const projectKey of stacksProjectMap[stackKey] || []) {
        //     if (checkMaskForAny(filterMask, ...projects[projectKey].stacks)) {
        //         projectsDomMap[projectKey].classList.remove('hidden');
        //     }
        //     else {
        //         projectsDomMap[projectKey].classList.add('hidden');
        //     }
        // }


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