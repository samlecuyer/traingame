
var expect = require('chai').expect;
var _ = require('lodash');

// This generates a set of unique dominoes up to a double-n (dn)
function generate_set(dn) {
    var set = [];
    for (i = 0; i <= dn; i++) {
        for (j = i; j <= dn; j++) {
            set.push([i, j]);
        }
    }
    expect(set.length).to.eql(((dn + 1) * (dn + 2))/2);
    // shuffle it so we can draw a random tile.
    return _.shuffle(set);
}

// [1,2] and [2,1] are the same tile
// p and c are bad names
function sameTile(p) {
    return function(c) {
        return (c[0] === p[0] && c[1] ===  p[1]) || (c[0] === p[1] && c[1] ===  p[0]);
    }
}

expect(sameTile([1,3])([2,3])).to.be.not.ok;
expect(sameTile([1,3])([1,3])).to.be.ok;
expect(sameTile([1,3])([3,1])).to.be.ok;

// Can a tile be chained onto the end of an existing chain?
function canPair(p) {
    return function(c) {
        return c[0] === p || c[1] === p;
    }
}

expect(canPair(10)([10,3])).to.be.ok;
expect(canPair(10)([3,10])).to.be.ok;
expect(canPair(10)([3,1])).to.not.be.ok;

// this takes a set of dominoes and an end to attach to
// at the beginning of the game it's the double on the board
function findChain(dominoes, start) {
    return _.chain(dominoes).sortBy('0')
        // we only care about the ones that match the start
            .filter(canPair(start))
            .map(function(tile) {
            // we call it a chain
                var chain = [tile];
            // and then only consider the other ones
                var others = _.without(dominoes, tile);
            // we figure out the other side of the tile
                var end = tile[0] === start? tile[1] : tile[0];
            // then recursively do this with the rest of the set against this tile
                var rest = findChain(others, end);
            // we return a sorted list, so we want the last one
                var longest = _.last(rest);
            // but maybe there aren't any more tiles that match
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

