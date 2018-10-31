(function () {
    const nodes = document.getElementsByClassName('uml');

    const option_prefix = appendOptions({spacing: 100, arrowSize: 0.5, direction: 'right', fill: '#fff'});

    for (let i = 0, len = nodes.length; i < len; i++) {
        const source = option_prefix + nodes[i].textContent.trim();
        nodes[i].innerHTML = nomnoml.renderSvg(source);
        //nodes[i].firstChild.setAttribute('viewBox', '0 0 100 100');
    }
    Reveal.layout();

    function appendOptions(options) {
        let result = "";
        Object.entries(options).forEach(([key, value]) => {
            result += `#${key}: ${value}\n`
        });
        return result;
    }

})();