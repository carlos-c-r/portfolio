import './chip.js';

import DOMPurify from 'dompurify';

if (window.trustedTypes && window.trustedTypes.createPolicy) { // Feature testing
    window.trustedTypes.createPolicy('default', {
        //@ts-ignore
        createHTML: (string) => DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true }),
        createScriptURL: string => string, // warning: this is unsafe!
        createScript: string => string, // warning: this is unsafe!
    });
}