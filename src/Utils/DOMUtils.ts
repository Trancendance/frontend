const replaceNode = (content: HTMLElement | null, target: HTMLElement) => {
    target.hasChildNodes() && target.removeChild(target.firstChild!);
    content
        ? target.appendChild(content)
        : target.removeChild(target.firstChild!);
};

const uniqueElement = (tagName: string): boolean => {
    const existingElement = document.querySelector(tagName);
    if (existingElement)
        console.warn('Only one instance of', tagName, 'is allowed.');
    return !existingElement;
};

const mapHTML = (arr: any[], callback: (item: any) => string) => {
    return arr.map(callback).join('');
};

const createElement = <T extends HTMLElement>(
    tagName: string,
    attributes: Record<string, string> = {},
    innerHTML: string = ''
): T => {
    const element = document.createElement(tagName) as T;
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    element.innerHTML = innerHTML;
    return element;
};

const createAndAppendElement = <T extends HTMLElement>(
    tagName: string,
    parent: HTMLElement,
    attributes: Record<string, string> = {},
    innerHTML: string = ''
): T => {
    const element = createElement<T>(tagName, attributes, innerHTML);
    parent.appendChild(element);
    return element;
};

export {
    replaceNode,
    uniqueElement,
    mapHTML,
    createElement,
    createAndAppendElement,
};
