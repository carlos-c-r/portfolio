const gradient = document.querySelector('#history-gradient div')! as HTMLDivElement;
const entries = document.querySelectorAll('.history-job') as unknown as HTMLElement[];

const rangeStart = 1995;
const rangeEnd = 2025;


for (const e of entries) {

    const [start, end] = e.querySelector('.job-years')?.textContent?.split('-')?.map(x => parseInt(x)) || [rangeStart, rangeEnd];

    let sp = (start - rangeStart) / (rangeEnd - rangeStart);
    let ep = (end - rangeStart) / (rangeEnd - rangeStart);

    let stops = [
        'var(--secondary-bg-color) 0%',
        `var(--secondary-bg-color) ${Math.max(sp * 100 - 2, 0)}%`,
        `var(--accent-fg-color) ${sp <= 0 ? 0 : sp * 100 + 2}%`,
        `var(--accent-fg-color) ${ep >= 1 ? 100 : ep * 100 - 2}%`,
        `var(--secondary-bg-color) ${Math.min(ep * 100 + 2, 100)}%`,
        'var(--secondary-bg-color) 100%'
    ];

    e.addEventListener('mouseover', ev => {
        console.log(sp, ep, start, end);
        gradient.style.background = `linear-gradient(180deg, ${stops.join(',')})`
    });

    console.log(e, start, end, sp, ep)
}