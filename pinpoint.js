pinpoint_graph = {
    "points": [],
    "size": 1,
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
        var change = Infinity;
        var dist = 3;
        var vectors;
        var relationships = [];
        while(change != 0 || dist <= pinpoint_graph.points.length) {
            change = 0;
            dist++;
            vectors = [];
            for(let i = 0; i < Math.sqrt(dist); i++) {
                if(Math.round(100 * Math.sqrt(dist - i ** 2)) % 100 == 0) {
                    vectors.push([i, Math.sqrt(dist - i ** 2)]);
                }
            }
            console.log(dist, vectors);
            for(let point = 0; point < pinpoint_graph.points.length; point++) {
                relationships.push([pinpoint_graph.points[point]].concat(pinpoint_graph.filter(i => (i.x - pinpoint_graph.points[point].x) ** 2 + (i.y - pinpoint_graph.points[point].y) ** 2 == dist ** 2)))
            }
            console.log(relationships);
        }
    }
}
// You can easily configure a function to pinpoint_graph.pinpoint using your preferred settings, but hue combos other than these might not work as intended: R G B, R↔G B, G↔B R, B↔R G
// If you want to create multiple graphs using this extension, then be sure to reset pinpoint_graph.points to [];
// For one graph, plot all the points you want first, then use the interpolate function. Please use one pixel size and one target canvas throughout, otherwise, you may get bad results.
