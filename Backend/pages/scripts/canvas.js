var canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth
canvas.height = window.innerHeight;

var config = {
    particleNumber: 800,
    maxParticleSize: 10,
    maxSpeed: 40,
    colorVariation: 50
};


var colorPalette = {
    bg: {
        r: 12,
        g: 9,
        b: 29
    },
    matter: [{
            r: 36,
            g: 18,
            b: 42
        },
        {
            r: 78,
            g: 36,
            b: 42
        },
        {
            r: 252,
            g: 178,
            b: 96
        },
        {
            r: 253,
            g: 238,
            b: 152
        }
    ]
};

var particles = [],
    centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    drawBg,

    drawBg = function(ctx, color) {
        ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

var Particle = function(x, y) {

    this.x = x || Math.round(Math.random() * canvas.width);
    this.y = y || Math.round(Math.random() * canvas.height);
    this.r = Math.ceil(Math.random() * config.maxParticleSize);
    this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)], true);
    this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
    this.d = Math.round(Math.random() * 360);
};

var colorVariation = function(color, returnString) {
    var r, g, b, a, variation;
    r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.r);
    g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.g);
    b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.b);
    a = Math.random() + .5;
    if (returnString) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
        return {
            r,
            g,
            b,
            a
        };
    }
};

var updateParticleModel = function(p) {
    var a = 180 - (p.d + 90); // find the 3rd angle
    p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
    p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);
    return p;
};

var drawParticle = function(x, y, r, c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
};


var cleanUpArray = function() {
    particles = particles.filter((p) => {
        return (p.x > -100 && p.y > -100);
    });
};


var initParticles = function(numParticles, x, y) {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y));
    }
    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });
};


window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


var frame = function() {
    drawBg(ctx, colorPalette.bg);

    particles.map((p) => {
        return updateParticleModel(p);
    });

    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });

    window.requestAnimFrame(frame);
};

document.body.addEventListener("click", function(event) {
    var x = event.clientX,
        y = event.clientY;
    cleanUpArray();
    initParticles(config.particleNumber, x, y);
});

frame();

initParticles(config.particleNumber);