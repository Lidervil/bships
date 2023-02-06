export function createHtmlElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = textContent;
    return element;
}