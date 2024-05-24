document.addEventListener("DOMContentLoaded", () => {
  const drawButton = document.getElementById("draw-button");
  if (drawButton) {
    drawButton.addEventListener("click", onDrawButtonClick);
  }
});

function onDrawButtonClick(): void {
  const inputElement = document.getElementById(
    "tree-input"
  ) as HTMLTextAreaElement;
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
  value: string;
  children: TreeNode[];

  constructor(value: string) {
    this.value = value;
    this.children = [];
  }
}

class TreeParser {
  private input: string;
  private index: number;

  constructor(input: string) {
    this.input = input;
    this.index = 0;
  }

  parse(): TreeNode {
    return this.parseNode();
  }

  private parseNode(): TreeNode {
    while (this.index < this.input.length && this.input[this.index] === " ") {
      this.index++;
    }

    let value = "";
    while (
      this.index < this.input.length &&
      this.input[this.index] !== "(" &&
      this.input[this.index] !== ")" &&
      this.input[this.index] !== " "
    ) {
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
        } else {
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
  draw(root: TreeNode, prefix: string = "", isTail: boolean = true): string {
    const children = root.children;
    let result =
      prefix + root.value + `${children.length > 0 ? " ---+\n" : "\n"}`;

    for (let i = 0; i < children.length - 1; i++) {
      result += this.draw(
        children[i],
        prefix + (isTail ? "    " : "│    "),
        false
      );
    }
    if (children.length > 0) {
      result += this.draw(
        children[children.length - 1],
        prefix + (isTail ? "    " : "│    "),
        true
      );
    }
    return result;
  }
}
