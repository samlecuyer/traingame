
var expect = require('chai').expect;
var _ = require('lodash');

function generate_set(dn) {
    var set = [];
    for (i = 0; i <= dn; i++) {
        for (j = i; j <= dn; j++) {
            set.push([i, j]);
        }
    }
    expect(set.length).to.eql(((dn + 1) * (dn + 2))/2);
    return _.shuffle(set);
}

function sameTile(p) {
    return function(c) {
        return (c[0] === p[0] && c[1] ===  p[1]) || (c[0] === p[1] && c[1] ===  p[0]);
    }
}

expect(sameTile([1,3])([2,3])).to.be.not.ok;
expect(sameTile([1,3])([1,3])).to.be.ok;
expect(sameTile([1,3])([3,1])).to.be.ok;

function canPair(p) {
    return function(c) {
        return c[0] === p || c[1] === p;
    }
}

expect(canPair(10)([10,3])).to.be.ok;
expect(canPair(10)([3,10])).to.be.ok;
expect(canPair(10)([3,1])).to.not.be.ok;

function findChain(dominoes, start) {
    return _.chain(dominoes).sortBy('0')
            .filter(canPair(start))
            .map(function(tile) {
                var chain = [tile];
                var others = _.without(dominoes, tile);
                var end = tile[0] === start? tile[1] : tile[0];
                var rest = findChain(others, end);
                var longest = _.last(rest);
                if (longest) {
                    return chain.concat(longest);
                } else {
                    return chain;
                }
            })
            .sortBy('length')
            .value();
}

var set = generate_set(12);
var mine = set.splice(0, 15);

var chains = findChain(mine, 10);
console.log('possible options:');
_.forEach(chains, function(ch) {
    console.log(ch.join (' | '), ' -- ', ch.length, ' out of ', mine.length)
    var remainder = _.difference(mine, ch).join(', ');
    console.log('\t remaining:', remainder);
});

