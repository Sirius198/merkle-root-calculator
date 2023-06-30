const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const fs = require('fs');

let jsonData = require('./json/whitelist.json');

function main() {
    console.log(`${jsonData.length} addresses found 'whitelist.json' file.`)
    if (jsonData.length == 0) {
        return
    }

    const leaves = jsonData.map(x => SHA256(x))
    const tree = new MerkleTree(leaves, SHA256)
    const root = tree.getRoot().toString('hex')
    console.log(`Root Hash: ${root}`)

    const n = jsonData.length
    var proofData = {}
    for (var i = 0;i < n;i++) {
        const leaf = SHA256(jsonData[i])
        const prf = tree.getProof(leaf)
        proofData[jsonData[i]] = prf.map(p => p.data.toString('hex'))
        const t = prf.map(p => p.position == "left" ? 'L' : 'R').join("")
        proofData[jsonData[i]].push(t)
    }

    let data = JSON.stringify(proofData, null, 2)
    fs.writeFileSync('./json/merkle_proof.json', data)
    console.log(`Merkle proof is saved to merkle_proof.json`)
}

main()