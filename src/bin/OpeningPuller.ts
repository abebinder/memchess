import {ShortMove, Square} from "chess.js";
import fetch from 'node-fetch'
import * as d3 from "d3";
import {DSVRowString} from "d3";
import * as fs from 'fs';
import {OpeningNode} from "../data/OpeningNode";

//dirty hack to use d3 from node environment
// @ts-ignore
globalThis.fetch = fetch


function writeOpeningsToFile(): void {
    createRootNodes().then((nodes) => {
        let nodesAsString = JSON.stringify(nodes)
        fs.writeFile('src/data/openings.json', nodesAsString, 'utf8', () => {
        })
    })
}


async function createRootNodes() {
    const openingStringToNodeMap = new Map<string, OpeningNode>();
    const rootNodes: OpeningNode[] = []
    const openingList = await createOpeningList();
    for (const node of openingList) {
        let isDuplicateName = false;
        for (let i = node.moves.length - 1; i > -1; i--) {
            if (i == 0) rootNodes.push(node)
            const possibleParent = openingStringToNodeMap.get(stringify(node.moves.slice(0, i)))
            if (possibleParent) {
                possibleParent.text === node.text ? isDuplicateName = true : possibleParent.items.push(node)
                break;
            }
        }
        if (!isDuplicateName) openingStringToNodeMap.set(stringify(node.moves), node)
    }
    return sortNodeList(rootNodes)
}


function createShortMoves(data: DSVRowString): ShortMove[] {
    const movesAsSpaceSeperatedString = data["uci"] as string;
    const moves = movesAsSpaceSeperatedString.split(" ")
    const arr: ShortMove [] = [];
    for (const elem of moves) {
        const shortMove = {from: elem.substring(0, 2) as Square, to: elem.slice(-2) as Square}
        arr.push(shortMove);
    }
    return arr;
}


async function createOpeningList() {
    const openingList: OpeningNode[] = []
    for (const prefix of ['a', 'b', 'c', 'd', 'e']) {
        const data = await d3.tsv(`https://raw.githubusercontent.com/niklasf/chess-openings/master/dist/${prefix}.tsv`);
        for (const elem of data) {
            const moves = createShortMoves(elem)
            openingList.push({
                text: elem["name"],
                items: [],
                id: stringify(moves),
                moves: moves
            })
        }
    }
    return openingList.sort((a, b) => {
        return a.moves.length - b.moves.length || a.text.localeCompare(b.text)
    })
}

function stringify(arr: ShortMove[]): string {
    let unraveled = ""
    for (const shortMove of arr) {
        unraveled = unraveled + shortMove.from + shortMove.to
    }
    return unraveled
}

function sortNodeList(arr: OpeningNode[]): OpeningNode[] {
    arr.sort((a, b) => {
        return a.text.localeCompare(b.text)
    })
    for (const openingNode of arr) {
        if (openingNode.items) sortNodeList(openingNode.items)
    }
    return arr;
}


writeOpeningsToFile()