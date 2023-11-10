import { useEffect } from "react";

class Token {
  constructor(public type: string, public value: string | null = null) {}
}

class Lexer {
  private expression: string;
  private tokens: Token[] = [];

  constructor(expression: string) {
    this.expression = expression;
    this.tokens = this.tokenize();
  }

  private tokenize(): Token[] {
    const regex =
      /\s*([()%,+\-*/]|sin|cos|pow|abs|[0-9]+(?:\.[0-9]+)?|[a-zA-Z_][a-zA-Z0-9_]*)\s*/g;
    let match: RegExpExecArray | null;

    const tokens: Token[] = [];

    while ((match = regex.exec(this.expression)) !== null) {
      const [matchText, token] = match;
      tokens.push(new Token(this.getTokenType(token), token));
    }

    return tokens;
  }

  private getTokenType(token: string): string {
    switch (token) {
      case "(":
      case ")":
      case ",":
      case "%":
      case "+":
      case "-":
      case "*":
      case "/":
        return token;
      case "sin":
      case "cos":
      case "pow":
      case "abs":
        return "FUNCTION";
      default:
        return isNaN(Number(token)) ? "IDENTIFIER" : "NUMBER";
    }
  }

  getTokens(): Token[] {
    return this.tokens;
  }
}
class Node {
  constructor(
    public type: string,
    public value: string | number | null = null,
    public left: Node | null = null,
    public right: Node | null = null
  ) {}
}
function parseExpression(tokens: Token[]): Node {
  return parseAddition(tokens);
}

function parseAddition(tokens: Token[]): Node {
  let leftNode = parseMultiplication(tokens);

  while (tokens.length && (tokens[0].type === "+" || tokens[0].type === "-")) {
    const operator = tokens.shift()!;
    const rightNode = parseMultiplication(tokens);
    leftNode = new Node(operator.type, null, leftNode, rightNode);
  }

  return leftNode;
}

function parseMultiplication(tokens: Token[]): Node {
  let leftNode = parsePrimary(tokens);

  while (tokens.length && (tokens[0].type === "*" || tokens[0].type === "/")) {
    const operator = tokens.shift()!;
    const rightNode = parsePrimary(tokens);
    leftNode = new Node(operator.type, null, leftNode, rightNode);
  }

  return leftNode;
}

function parsePrimary(tokens: Token[]): Node {
  if (tokens[0].type === "NUMBER") {
    return new Node("NUMBER", tokens.shift()!.value);
  } else if (tokens[0].type === "FUNCTION") {
    const func = tokens.shift()!;
    if (tokens.shift()?.type !== "(") {
      throw new Error("Expected '(' after function");
    }
    let argument = parseExpression(tokens);
    let argument2: Node | null = null;
    //if it has two args
    if (tokens.shift()?.type == ",") {
      argument2 = parseExpression(tokens);
    }
    if (tokens.shift()?.type !== ")") {
      throw new Error("Expected ')' after function argument");
    }
    return new Node("FUNCTION", func.value, argument, argument2);
  } else if (tokens[0].type === "(") {
    tokens.shift();
    const node = parseExpression(tokens);
    if (tokens.shift()?.type !== ")") {
      throw new Error("Expected ')' after expression in parentheses");
    }
    return node;
  } else {
    throw new Error(`Unexpected token: ${tokens[0].type}`);
  }
}

function createAst(tokens: Token[]): Node {
  return parseExpression(tokens);
}
function evaluate(node: Node): number {
  const funMap: any = {
    sin: Math.sin,
    cos: Math.cos,
    abs: Math.abs,
    pow: Math.pow,
  };
  if (node.type === "NUMBER") {
    return parseFloat(node.value as string);
  } else if (node.type === "FUNCTION") {
    // For simplicity, let's assume a basic implementation for the sin function
    if (node.value) {
      const fun = funMap[node.value];

      if (node.value == "pow") {
        console.log({ node });
        if (node.left && node.right) {
          return fun(evaluate(node.left), evaluate(node.right));
        }
        throw new Error("Invalid arguments for  function " + node.value);
      }
      if (fun && node.left) {
        return fun(evaluate(node.left));
      }
    }
    throw new Error(`Unknown function: ${node.value}`);
  } else {
    const leftValue = node.left ? evaluate(node.left) : 0;
    const rightValue = node.right ? evaluate(node.right) : 0;

    switch (node.type) {
      case "+":
        return leftValue + rightValue;
      case "-":
        return leftValue - rightValue;
      case "*":
        return leftValue * rightValue;
      case "/":
        if (rightValue === 0) {
          throw new Error("Division by zero");
        }
        return leftValue / rightValue;
      default:
        throw new Error(`Unknown operator: ${node.type}`);
    }
  }
}
// Example usage

export default function MathEval() {
  useEffect(() => {
    {
      //const exp = "sin(3.3)*(2*(6-5))";
      {
        const exp = " pow(2,2)+pow(2,3) ";
        const lexer = new Lexer(exp);
        const tokens = lexer.getTokens();
        const ast = createAst([...tokens]);
        const res = evaluate(ast);
        console.log(
          res,
          eval(
            exp
              .replace(/\bsin\b/g, "Math.sin")
              .replace(/\cos\b/g, "Math.cos")
              .replace(/\abs\b/g, "Math.abs")
              .replace(/\pow\b/g, "Math.pow")
          )
        );
        console.log({ ast });
        console.log({ tokens });
      }
    }
  }, []);
  return <div></div>;
}
