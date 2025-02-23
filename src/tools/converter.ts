import { createReadStream } from 'fs';
import { parse } from 'node-html-parser';
import { text } from 'stream/consumers';

const html = await text(createReadStream('projects.html'));

const dom = parse(html);

const entries = dom.querySelectorAll('div.portfolio-entry');

const data = entries.reduce((acc, x) => {

    const clientDate = (x.querySelector('h2')?.textContent || '').split(',').map(x => x.trim());
    const roles = x.querySelector('h3')?.textContent?.split(',')?.map(x => deindent(x)) || [];
    const references = x.querySelectorAll('.portfolio-entry-references li').map(x => x.textContent.trim());
    const paragraphs = x.querySelectorAll('p').map(x => x.textContent);

    acc[x.id] = {
        title: x.querySelector('h1')?.textContent || '',
        client: clientDate?.[0] || '',
        year: clientDate?.[1] || '',
        stacks: [],
        roles,
        description: deindent(paragraphs[0]),
        references,
        challenges: paragraphToList(paragraphs[1] || '').map(deindent),
        solutions: paragraphToList(paragraphs[2] || '').map(deindent),
    }

    return acc;
}, <any>{});

process.stdout.setDefaultEncoding('utf8');

//console.log(data);
console.log(JSON.stringify(data, null, 4));

function paragraphToList(paragraph: string) {

    if (paragraph.trim().startsWith('- ')) {
        return paragraph
            .trim()
            .split('- ')
            .filter(x => x.trim());
    }
    else {
        return paragraph
        .trim()
        .split('.\r\n')
        .filter(x => x.trim());
    }
}

function deindent(text: string) {
    return text.trim().replaceAll(/\s+/g, ' ');
}