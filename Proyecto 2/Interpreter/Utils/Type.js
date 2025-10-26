const Type = {
    INT:     {value: 'int',    pythonType: 'int',    defaultValue: '0',      ord: 0},
    DOUBLE:  {value: 'double', pythonType: 'float',  defaultValue: '0.0',    ord: 1},
    STRING:  {value: 'String', pythonType: 'str',    defaultValue: '""',     ord: 2},
    BOOLEAN: {value: 'boolean',pythonType: 'bool',   defaultValue: 'False',  ord: 3},
    CHAR:    {value: 'char',   pythonType: 'str',    defaultValue: "''",     ord: 4},
}

export default Type;