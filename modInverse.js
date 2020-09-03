function modInverse(a, b) {
    var d = (b / a) | 0;
    var r = b - a * d;
    var pv = a;
    var pf = 1;
    var mv = r;
    var mf = d;
    var sw = false;
    var i = 0;

    while (pv != 1) {
        i++;
        d = (pv / mv) | 0;
        r = pv - mv * d;

        if (r == 0) {
            pf = pf + mf * (d - 1);
            break;
        }

        pf = pf + mf * d;
        pv = r;

        mf = pf + mf;
        mv = mv - r;

        if (mv > pv) {
            sw ^= true;

            pv = mv;
            mv = r;

            var t = pf;
            pf = mf;
            mf = t;
        }
    }

    if (sw)
        pf = mf;

    return { pf, i };
}

function gcd(a, b) {
    if (b == 0) return [0, a, 1, 0];
    var [i, d, x, y] = gcd(b, a % b);
    return [i + 1, d, y, x - y * ((a / b) | 0)];
}

/*console.log(modInverse(5, 23));
console.log(modInverse(508, 3571));
console.log(modInverse(507, 3571));
console.log(modInverse(505, 3571));
console.log(modInverse(504, 3571));
console.log(modInverse(501, 4999));
console.log(modInverse(4999, 18181));
console.log(modInverse(4997, 18181));*/

var p = 433494437;

var scale = [];
var iters = [];
var itersCount = 0;
var progress = 0;
var itersChunk = [0, 1];
var scaleChunk = [0, 1];
iters[0] = itersChunk;
scale[0] = scaleChunk;
for (var i = 2; i < p; i++) {
    const arrayIndex = i >> 16;
    const itemIndex = i & 0xffff;
    if (iters.length == arrayIndex) {
        itersChunk = [0];
        scaleChunk = [0];
        iters[arrayIndex] = itersChunk;
        scale[arrayIndex] = scaleChunk;
    }

    var r = modInverse(i, p);
    var iv = r.i;
    //itersChunk[itemIndex] = iv;
    itersCount += iv;

    var gcdR = gcd(i, p);        
    //scaleChunk[itemIndex] = gcdR[0] / iv;

    if (r.pf != (gcdR[2] + p) % p) {
        console.log("error: " + i);
        break;
    }

    // if (!isFinite(scaleChunk[itemIndex]))
    //     console.log({ gcd: gcdR[0], modInverse: iv, i });

    if ((i / p * 100) >= progress + 1) {
        progress = (i / p * 100) | 0;
        //process.stdout.cursorTo(0,0);
        console.log(progress + "%");
    }
}

console.log("iterations count:")
iters[0].reverse().pop();
iters[0].pop();
console.log(iters.reduce((v, x) => Math.min(v, x.reduce((x, y) => Math.min(x, y))), Number.MAX_SAFE_INTEGER));
console.log(iters.reduce((v, x) => Math.max(v, x.reduce((x, y) => Math.max(x, y))), 0));

console.log("scale:")
scale[0].reverse().pop();
scale[0].pop();
console.log(scale.reduce((v, x) => Math.min(v, x.reduce((x, y) => Math.min(x, y))), Number.MAX_SAFE_INTEGER));
console.log(scale.reduce((v, x) => Math.max(v, x.reduce((x, y) => Math.max(x, y))), 0));
