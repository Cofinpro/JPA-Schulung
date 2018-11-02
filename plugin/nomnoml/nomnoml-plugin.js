(function () {
    const nodes = document.getElementsByClassName('uml');

    const option_prefix = appendOptions({spacing: 100, arrowSize: 0.5, direction: 'right', fill: '#fff', zoom: 1.5});

    for (let i = 0, len = nodes.length; i < len; i++) {
        const source = option_prefix + nodes[i].textContent.trim();
        let canvas = document.createElement('canvas');

        nomnoml.draw(canvas, source);
        nodes[i].textContent = '';
        nodes[i].appendChild(canvas)

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