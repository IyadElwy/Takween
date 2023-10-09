

def check_dtype(inp):
    if inp == 'object':
        return "string"
    if inp == 'int64':
        return 'int'
    if inp == 'float64':
        return 'float'
