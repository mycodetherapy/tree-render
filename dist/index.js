"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const drawButton = document.getElementById("draw-button");
    if (drawButton) {
        drawButton.addEventListener("click", onDrawButtonClick);
    }
});
function onDrawButtonClick() {
    const inputElement = document.getElementById("tree-input");
    const input = inputElement.value;
    const parser = new TreeParser(input);
    const tree = parser.parse();
    const drawer = new TreeDrawer();
    const outputElement = document.getElementById("tree-output");
    if (outputElement) {
        outputElement.textContent = drawer.draw(tree);
    }
}
class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }
}
class TreeParser {
    constructor(input) {
        this.input = input;
        this.index = 0;
    }
    parse() {
        return this.parseNode();
    }
    parseNode() {
        while (this.index < this.input.length && this.input[this.index] === " ") {
            this.index++;
        }
        let value = "";
        while (this.index < this.input.length &&
            this.input[this.index] !== "(" &&
            this.input[this.index] !== ")" &&
            this.input[this.index] !== " ") {
            value += this.input[this.index++];
        }
        let node = new TreeNode(value.trim());
        while (this.index < this.input.length && this.input[this.index] === " ") {
            this.index++;
        }
        if (this.input[this.index] === "(") {
            this.index++;
            while (this.input[this.index] !== ")") {
                if (this.input[this.index] === " ") {
                    this.index++;
                }
                else {
                    node.children.push(this.parseNode());
                }
            }
            this.index++;
        }
        const values = node.value.split(" ");
        if (values.length > 1) {
            const parentNode = new TreeNode("");
            for (const val of values) {
                parentNode.children.push(new TreeNode(val));
            }
            parentNode.children.push(...node.children);
            return parentNode;
        }
        return node;
    }
}
class TreeDrawer {
    draw(root, prefix = "", isTail = true) {
        const children = root.children;
        let result = prefix + root.value + `${children.length > 0 ? " ---+\n" : "\n"}`;
        for (let i = 0; i < children.length - 1; i++) {
            result += this.draw(children[i], prefix + (isTail ? "    " : "│    "), false);
        }
        if (children.length > 0) {
            result += this.draw(children[children.length - 1], prefix + (isTail ? "    " : "│    "), true);
        }
        return result;
    }
}
