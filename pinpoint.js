pinpoint_graph = {
    "points": [],
    "size": 1,
    "rendered": true,
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
    "vectorred": function(v) {
        var c = 1;
        if(v[0] == 0 && v[1] == 0) {
            return {"vector": [0, 0], "coefficient": 1};
        }
        if(v[0] == 0) {
            return {"vector": [0, v[1] / Math.abs(v[1])], "coefficient": Math.abs(v[1])};
        }
        if(v[1] == 0) {
            return {"vector": [v[0] / Math.abs(v[0]), 0], "coefficient": Math.abs(v[0])};
        }
        for(let a = 2; a <= Math.abs(v[0]) && a <= Math.abs(v[1]); a++) {
            while(v[0] % a == 0 && v[1] % a == 0) {
                v[0] /= a;
                v[1] /= a;
                c *= a;
            }
        }
        return {"vector": v, "coefficient": c};
    },
    "vectors_allowed": [],
    "interpolate": function(canvas) {
        if(pinpoint_graph.rendered) {
            pinpoint_graph.rendered = false;
            var change = Infinity;
            var dist = 0;
            var vectors;
            var relationships;
            var siblings;
            var candidates;
            var oxygen = [];
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
                if(!(change != 0 || pinpoint_graph.vectors_allowed[dist]) {
                    pinpoint_graph.rendered = true;
                    clearInterval(rendering);
                }
                if(change) {
                    dist = 0;
                } else {
                    dist++;
                }
                change = 0;
                relationships = [];
                for(let point = 0; point < pinpoint_graph.points.length; point++) {
                    // siblings = pinpoint_graph.points.filter(i => (i.location.x - pinpoint_graph.points[point].location.x) ** 2 + (i.location.y - pinpoint_graph.points[point].location.y) ** 2 == pinpoint_graph.vectors_allowed[dist]);
                    siblings = pinpoint_graph.points.filter(i => (i.location.x - pinpoint_graph.points[point].location.x) ** 2 + (i.location.y - pinpoint_graph.points[point].location.y) ** 2 == pinpoint_graph.vectors_allowed[dist]);
                    siblings = siblings.map(x => structuredClone(x));
                    for(let sis = 0; sis < siblings.length; sis++) {
                        if(!oxygen.includes(`${pinpoint_graph.points[point].location.x} ${pinpoint_graph.points[point].location.y} ${siblings[sis].location.x} ${siblings[sis].location.y}`)) {
                            relationships.push([structuredClone(pinpoint_graph.points[point]), siblings[sis]]);
                            oxygen.push(`${pinpoint_graph.points[point].location.x} ${pinpoint_graph.points[point].location.y} ${siblings[sis].location.x} ${siblings[sis].location.y}`);
                        }
                    }
                }
                relationships = relationships.sort((a, b) => -(a.length - b.length));
                console.log(relationships);
                candidates = relationships.map(function(x) {
                    if(x.length == 2) {
                        var vect = pinpoint_graph.vectorred([x[1].location.x - x[0].location.x, x[1].location.y - x[0].location.y]);
                        var sqmag = vect.coefficient;
                        var rate = {
                            "location": {"x": vect.vector[0], "y": vect.vector[1]},
                            "color": {"r": (x[1].color.r - x[0].color.r) / sqmag, "g": (x[1].color.g - x[0].color.g) / sqmag, "b": (x[1].color.b - x[0].color.b) / sqmag, "rg": (x[1].color.rg - x[0].color.rg) / sqmag, "gb": (x[1].color.gb - x[0].color.gb) / sqmag, "br": (x[1].color.br - x[0].color.br) / sqmag}
                        };
                        var point = x[0];
                        for(let prop = 0; prop < props.length; prop++) {
                            eval(`
                                rate${props[prop]} = rate${props[prop]} || 0;
                            `);
                        }
                        var ret = [];
                        for(let weight = 0; weight < sqmag - 1; weight++) {
                            for(let prop = 0; prop < props.length; prop++) {
                                eval(`point${props[prop]} += rate${props[prop]} || 0;`);
                            }
                            ret.push(structuredClone(point));
                        }
                        return ret;
                    } else {
                        var ret = {"location": {"x": 0, "y": 0}, "color": {"r": 0, "g": 0, "b": 0, "rg": 0, "gb": 0, "br": 0}};
                        for(let i = 0; i < x.length; i++) {
                            for(let prop = 0; prop < props.length; prop++) {
                                eval(`ret${props[prop]} += x[i]${props[prop]} || 0;`);
                            }
                        }
                        for(let prop = 0; prop < props.length; prop++) {
                            eval(`ret${props[prop]} /= x.length`);
                        }
                        if(ret.location.x == Math.round(ret.location.x) && ret.location.y == Math.round(ret.location.y)) {
                            return ret;
                        }
                    }
                });
                relationships = candidates;
                candidates = [];
                for(let c = 0; c < relationships.length; c++) {
                    candidates = candidates.concat(relationships[c]);
                }
                // x => x && pinpoint_graph.points.filter(k => k.location.x == x.location.x && k.location.y == x.location.y).length == 0)
                candidates = candidates.filter(x => x && (pinpoint_graph.points.filter(k => k.location.x == x.location.x && k.location.y == x.location.y).length == 0));
                for(let cand = 0; cand < candidates.length; cand++) {
                    if(pinpoint_graph.points.filter(x => Math.round(candidates[cand].location.x - x.location.x) == 0 && Math.round(candidates[cand].location.y - x.location.y) == 0).length == 0) {
                        pinpoint_graph.pinpoint(canvas, candidates[cand].location, candidates[cand].color, pinpoint_graph.size);
                        change++;
                    }
                }
            })
        }
    }
}
for(let lim = 0; lim <= 10; lim += 1 + (lim == 0)) {
    for(let other = 0; other <= lim; other += 1 + (other == 0)) {
        if(vectorred([other, lim]).coefficient > 1) {
            pinpoint_graph.vectors_allowed.push(other ** 2 + lim ** 2);
            pinpoint_graph.vectors_allowed = pinpoint_graph.vectors_allowed.sort();
        }
    }
}
// You can easily configure a function to pinpoint_graph.pinpoint using your preferred settings, but hue combos other than these might not work as intended: R G B, R↔G B, G↔B R, B↔R G
// If you want to create multiple graphs using this extension, then be sure to reset pinpoint_graph.points to [];
// For one graph, plot all the points you want first, then use the interpolate function. Please use one pixel size and one target canvas throughout, otherwise, you may get bad results.
// It is safer to avoid changing the points list when extrapolating and postpone such changes once rendering is done.
