for (const elm of document.querySelectorAll('.timelined') as Iterable<HTMLElement>) {

    const begin = parseInt(elm.getAttribute("timeline-start") || '') || 2004;
    const end = parseInt(elm.getAttribute("timeline-end") || '') || 2025;
    const from = parseInt(elm.getAttribute("from") || '') || 2004;
    const to = parseInt(elm.getAttribute("to") || '') || 2025;
    const sp = (from - begin) / (end - begin) * 100;
    const ep = (to - begin) / (end - begin) * 100;

    elm.style.backgroundColor = `linear-gradient(to right, var(--accent-fg-disabled-color) ${sp - 2}%, var(--accent-fg-color) ${sp + 2}%, var(--accent-fg-color) ${ep - 2}%, var(--accent-fg-disabled-color) ${ep + 2}%)`;

    //elm.style.backgroundColor = 'red';

    console.log(elm, begin, end, from, to, sp, ep, elm.style.backgroundColor);
}