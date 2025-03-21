
import './portfolio.js';
import './skills.js';
import './history.js';
import { setup } from './background.js'

// const hexaGrid = document.querySelector('#hexa-grid')!;
// for(let i = 0; i < 450; i++) {
//     const hex = document.createElement('div');
//     hexaGrid.appendChild(hex);
//     if (Math.random() < 0.1)  hex.classList.add('hexa-anim-1');
// }

setup(document.querySelector('#background')!);