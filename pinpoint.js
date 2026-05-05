pinpoint_graph = {
    "points": [],
    "size": 1,
    "rendered": true;
    "pinpoint": function(canvas, location, color, size) {
        location = {"x": Math.round(location.x), "y": Math.round(location.y)};
        pinpoint_graph.size = size;
        document.getElementById(canvas).getContext("2d").fillStyle = `rgb(${color.br ? (color.br * 255) : color.rg ? (255 - color.rg * 255) : color.r}, ${color.rg ? (color.rg * 255) : color.gb ? (255 - color.gb * 255) : color.g}, ${color.gb ? (color.gb * 255) : color.br ? (255 - color.br * 255) : color.b})`;
        document.getElementById(canvas).getContext("2d").fillRect(location.x * size, location.y * size, size, size);
        pinpoint_graph.points.push({
            "location": location,
            "color": color
        });
    },
    "interpolate": function(canvas) {
        if(pinpoint_graph.rendered) {
            pinpoint_graph.rendered = false;
            var change = Infinity;
            var dist = 3;
            var vectors;
            var relationships;
            var siblings;
            var candidates;
            var props = [
                ".location.x",
                ".location.y",
                ".color.r",
                ".color.g",
                ".color.b",
                ".color.rg",
                ".color.gb",
                ".color.br"
            ];
            var rendering = setInterval(function(){
                if(!(change != 0 || dist <= pinpoint_graph.points.length ** 2)) {
                    pinpoint_graph.rendered = true;
                    clearInterval(rendering);
                }
                if(!change) {
                    dist++;
                }
                change = 0;
                relationships = [];
                for(let point = 0; point < pinpoint_graph.points.length; point++) {
                    siblings = pinpoint_graph.points.filter(i => (Math.round(100 * ((i.location.x - pinpoint_graph.points[point].location.x) ** 2 + (i.location.y - pinpoint_graph.points[point].location.y) ** 2)) == Math.round(100 * dist ** 2)));
                    if(siblings.length) {
                        relationships.push([pinpoint_graph.points[point]].concat(siblings));
                    }
                }
                relationships.sort((a, b) => -(a.length - b.length));
                candidates = relationships.map(function(x) {
                    var ret = {"location": {"x": 0, "y": 0}, "color": {"r": 0, "g": 0, "b": 0, "rg": 0, "gb": 0, "br": 0}};
                    for(let i = 0; i < x.length; i++) {
                        for(let prop = 0; prop < props.length; prop++) {
                            eval(`ret${props[prop]} += x[i]${props[prop]} ? x[i]${props[prop]} : 0;`);
                        }
                    }
                    for(let prop = 0; prop < props.length; prop++) {
                        eval(`ret${props[prop]} /= x.length`);
                    }
                    if(!Math.round(100 * ((ret.x % 1) + (ret.y % 1)))) {
                        return ret;
                    }
                });
                candidates = candidates.filter(x => x);
                console.log(dist, candidates);
                for(let cand = 0; cand < candidates.length; cand++) {
                    console.log(pinpoint_graph.points.filter(x => (x.location == candidates[cand].location)).length);
                    if(pinpoint_graph.points.filter(x => (x.location == candidates[cand].location)).length == 0) {
                        pinpoint_graph.pinpoint(canvas, candidates[cand].location, candidates[cand].color, pinpoint_graph.size);
                        change++;
                    }
                }
            }, 1000)
        }
    }
}
// You can easily configure a function to pinpoint_graph.pinpoint using your preferred settings, but hue combos other than these might not work as intended: R G B, R↔G B, G↔B R, B↔R G
// If you want to create multiple graphs using this extension, then be sure to reset pinpoint_graph.points to [];
// For one graph, plot all the points you want first, then use the interpolate function. Please use one pixel size and one target canvas throughout, otherwise, you may get bad results.
