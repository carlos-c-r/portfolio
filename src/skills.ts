import skillsData from './data/skills.json' with { type: "json" };
import stacksData from './data/stacks.json' with { type: "json" };
import stackIconsData from './data/stackicons.json' with { type: "json" };


const skills = skillsData as unknown as { [key: string]: { [key: string]: any } }
const stackIcons = stackIconsData as unknown as { [key: string]: any };
const stacks = stacksData as unknown as { [key: string]: any };

function createStacks() {

    for (const k in skills) {

        let entries = skills[k];

        const parent = document.querySelector(`#skills-${k}`);
        
        for (const e in entries) {
            const info = entries[e];
            // console.log(k, e, info, parent)
            const elm = document.createElement('li');
            const icon = document.createElement('i');
            icon.setAttribute('name', stackIcons[e] || 'c');
            const label = document.createElement('span');
            icon.classList.add(`devicon-${stackIcons[e]}-plain`, "colored", "skill-icon");
            label.classList.add('skill-label');
            const years = document.createElement('span');
            years.classList.add('skill-years');
            const rating = document.createElement('span');
            const rating_empty = document.createElement('span');
            const rating_all = document.createElement('span');
            
            rating.classList.add('skill-rating');
            rating_empty.classList.add('skill-rating', 'skill-rating-empty');
            label.textContent = stacks[e] || '';
            years.textContent = `${info.start} - ${info.end}`;
            rating.textContent = new Array(info.rating).fill('★').join('');
            rating_empty.textContent = new Array(5 - info.rating).fill('☆').join('');

            elm.appendChild(icon);
            elm.appendChild(label);
            elm.appendChild(years);
            elm.appendChild(rating_all);

            rating_all.appendChild(rating);
            rating_all.appendChild(rating_empty);

            elm.addEventListener('mouseover', ev => lol(label.textContent || '', info.start, info.end, info.rating));
            elm.addEventListener('click', ev => lol(label.textContent || '', info.start, info.end, info.rating));

            parent?.appendChild(elm);

            const tml = document.createElement('div');
            tml.classList.add('timelined');
            tml.setAttribute('timeline-start', '1995');
            tml.setAttribute('timeline-end', '2025');
            tml.setAttribute('from', info.start.toString());
            tml.setAttribute('to', info.end.toString());

            parent?.appendChild(tml);

        }

    }

}

const innerDimensions = (node: Element) => {
    var computedStyle = getComputedStyle(node)

    let width = node.clientWidth // width with padding
    let height = node.clientHeight // height with padding

    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
    return { height, width }
}


const nameElement = document.querySelector('.language-name')!;

function lol(label: string, start: number, end: number, stars: number) {

    let s = document.querySelector('.language-timeline-start')! as HTMLElement;
    let e = document.querySelector('.language-timeline-end')! as HTMLElement;

    s.textContent = start.toString();
    e.textContent = end.toString();

    nameElement.textContent = label;

    let t = document.querySelector('.timeline')! as HTMLElement;

    let sp = (start - 1995) / 30.0;
    let ep = (end - 1995) / 30.0;

    const gapOffset = 8;

    let w = innerDimensions(t).width - gapOffset;

    s.style.left = `${sp * w}px`;
    e.style.left = `${ep * w}px`;

    document.querySelector('.language-rating-set')!.textContent = new Array(stars).fill('star').join(' ');
    document.querySelector('.language-rating-unset')!.textContent = new Array(5 - stars).fill('star').join(' ');

    let stops = [
        'red 0%',
        `red ${Math.max(sp * 100 - 2, 0)}%`,
        `green ${sp <= 0 ? 0 : sp * 100 + 2}%`,
        `green ${ep >= 1 ? 100 : ep * 100 - 2}%`,
        `red ${Math.min(ep * 100 + 2, 100)}%`,
        'red 100%'
    ];
    t.style.background = `linear-gradient(to right, ${stops.join(',')})`;
}

createStacks();


