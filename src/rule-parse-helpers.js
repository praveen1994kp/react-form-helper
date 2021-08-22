

const DEFAULT_RULE_SYNTAX_TO_JS_MAP = {
    '}': '',
    '=': '===',
    'AND': '&&',
    'OR': '||',
    '-ne': '!=='
}

export function formatRule(ruleStr, formStateObjArgName, ruleSyntaxToJsMap) {
    const finalSyntaxMapper = ruleSyntaxToJsMap ? {...DEFAULT_RULE_SYNTAX_TO_JS_MAP, ruleSyntaxToJsMap} : DEFAULT_RULE_SYNTAX_TO_JS_MAP

    if (typeof ruleStr !== 'string') return ''

    const withFormStateObjRef = ruleStr.replaceAll('${', formStateObjArgName + '.')
    let jsFunctionDefn = withFormStateObjRef

    jsFunctionDefn = Object.keys(finalSyntaxMapper).reduce((jsRule, ruleKey) => {
        return jsRule.replaceAll(ruleKey, finalSyntaxMapper[ruleKey])
    }, jsFunctionDefn)

    return `return ${jsFunctionDefn}`
}