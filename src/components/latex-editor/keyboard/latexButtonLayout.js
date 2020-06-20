const variables = {
    'a': 'a',
    'b': 'b',
    'c': 'c',
    'd': 'd',
    'e': 'e',
    'f': 'f',
    'g': 'g',
    'h': 'h',
    'i': 'i',
    'j': 'j',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'o': 'o',
    'p': 'p',
    'q': 'q',
    'r': 'r',
    's': 's',
    't': 't',
    'u': 'u',
    'v': 'v',
    'w': 'w',
    'x': 'x',
    'y': 'y',
    'z': 'z',
};

const symbols = {
    'FRACTION': '\\frac{x}{y}',
    'ELEMENT_OF': '\\in',
    'REAL_SET': '\\Bbb R',
    'R^n': '\\Bbb R^n',
    'LESS': '<',
    'LESS_OR_EQUAL': '\\leq',
    'MORE': '>',
    'MORE_OR_EQUAL': '\\geq',
    'PIPE': '\\mid',
    'CURLY': '\\{\\}',
    'NOT_EQUAL': '\\neq',
    'SQUARE_ROOT': '\\sqrt{x}',
    'CROSS': '\\times',
    'PROJECTION': 'proj_{\\vec{v}}{\\vec{u}}',
    'PROJECTION_EQUATION': '\\frac{\\vec{u}\\cdot\\vec{v}}{||\\vec{v}||^2}\\vec{v}',
};

const greek = {
    'PI': '\\pi',
    'SIGMA': '\\Sigma',
    'SUMMATION': '\\sum_{n=1}^{\\infty}',
    'PRODUCT': '\\Pi'
};

const vectors = {
    'ZERO_VECTOR': '\\vec{0}',
    'VECTOR_X': '\\vec{x}',
    'VECTOR_Y': '\\vec{y}',
    'VECTOR_V': '\\vec{v}',
    'SUBSCRIPT_VECTOR E': '\\vec{e}_i',
    'STD_BASIS': '\\{\\vec{e}_1,\\ldots,\\vec{e}_n\\}',
    'V_TO_V': '\\vec{v}_1,\\ldots,\\vec{v}_k',
    'V_PLUS_TO_V': '\\vec{v}_1+\\cdots+\\vec{v}_k',
    'SINGLE_COL_MATRIX': '\\begin{bmatrix} 0 \\\\ 0 \\\\ 0 \\end{bmatrix}',
    'X_ONE_TO_X_N': '\\begin{bmatrix} x_1 \\\\ \\vdots \\\\ x_n \\end{bmatrix}',
    'Y_ONE_TO_Y_N': '\\begin{bmatrix} y_1 \\\\ \\vdots \\\\ y_n \\end{bmatrix}',
};

const dots = {
    'DOT': '\\cdot',
    'VERT_DOTS': '\\vdots',
    'UP_HORIZ_DOTS': '\\cdots',
    'DOWN_HORIZ_DOTS': '\\ldots',
};

export const LatexButtonLayout = Object.freeze({
    'Variables': variables,
    'Symbols': symbols,
    'Greek': greek,
    'Vectors': vectors,
    'Dots': dots,
});
