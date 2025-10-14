const NotFoundDefault = () => {
    const container = document.createElement('div');
    container.innerHTML = '<h1>404 - Not Found</h1>';
    return container;
};

export { NotFoundDefault };
