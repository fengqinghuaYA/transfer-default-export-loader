function getImportReg(pattern) {
    const { exportName, importPaths } = pattern;
    const pathsPattern = importPaths.map((path) => path.replace('/', '\\/')).join('|');
    const regexPattern = `import\\s+\\{[^\\}]*\\b${exportName}\\b[^\\}]*\\}\\s+from\\s+['"](${pathsPattern})['"]`;
    const regex = new RegExp(regexPattern, 'g');

    return regex;
}

function matchAndReplaceProperties(code, pattern) {
    const { exportName: objectName } = pattern;
    const regexPattern = `${objectName}\\.(\\w+)|${objectName}\\['([^']+)'\\]|${objectName}\\["([^"]+)"\\]|${objectName}\\[([^\\]]+)\\]`;
    const regex = new RegExp(regexPattern, 'g');

    let match;
    const properties = [];
    let modifiedCode = code;

    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            properties.push({ value: match[1], case: 1 });
            modifiedCode = modifiedCode.replace(match[0], match[1]);
        } else if (match[2]) {
            properties.push({ value: match[2], case: 2 });
            modifiedCode = modifiedCode.replace(match[0], match[2]);
        } else if (match[3]) {
            properties.push({ value: match[3], case: 3 });
            modifiedCode = modifiedCode.replace(match[0], match[3]);
        } else if (match[4]) {
            properties.push({ value: match[4], case: 4 });
            modifiedCode = modifiedCode.replace(match[0], match[4]);
        }
    }

    return { properties, modifiedCode };
}

function generateImportCode(properties, pattern) {
    const { originPath } = pattern;
    const importProperties = properties
        .reduce((list, cur) => {
            if (list.findIndex((v) => v.value === cur.value) < 0) {
                list.push(cur);
            }
            return list;
        }, [])
        .filter((v) => v.case !== 4);
    if (importProperties.length === 0) return '';
    const importPropertiesStr = importProperties.map((v) => v.value).join(', ');
    return `import { ${importPropertiesStr} } from '${originPath}';`;
}

function transfer(code, pattern) {
    const importReg = getImportReg(pattern);
    const matches = code.match(importReg);
    if (!matches || matches.length === 0) {
        return code;
    }
    const { properties, modifiedCode } = matchAndReplaceProperties(code, pattern);
    const importCode = generateImportCode(properties, pattern);
    return `${importCode}\n${modifiedCode}`;
}

module.exports = {
    getImportReg,
    generateImportCode,
    transfer,
};
