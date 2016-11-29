"use strict";

module.exports = function ({types: t}) {
    const modVisitor = {
        ImportDefaultSpecifier(path, state) {
            state.hasDefault = true;
            if (path.node.name !== "React") {
                path.node.name = "React";
            }
        },
        ImportSpecifier(path, state) {
            if (t.isIdentifier(path.node.imported, {
                name: "h",
            })) {
                const name = path.node.local.name;
                path.remove();
                path.scope.rename(name, "React.createElement");
            } else if (t.isIdentifier(path.node.imported, {
                name: "render",
            })) {
                state.hasRender = true;
            }
        },
    };
    return {
        visitor: {
            ImportDeclaration(path) {
                if (path.node.source.value !== "preact") {
                    return;
                }
                let state = {
                    hasRender: false,
                    hasDefault: false,
                };
                path.traverse(modVisitor, state);
                const nodes = [];
                const specifiers = path.node.specifiers;
                if (!state.hasDefault) {
                    specifiers.unshift(
                        t.importDefaultSpecifier(
                            t.identifier("React")
                        )
                    );
                }
                nodes.push(t.importDeclaration(
                    specifiers,
                    t.stringLiteral("react")
                ));
                if (state.hasRender) {
                    nodes.push(t.importDeclaration([
                        t.importSpecifier(
                            t.identifier("render"),
                            t.identifier("render")
                        ),
                    ], t.stringLiteral("react-dom")));
                }
                path.replaceWithMultiple(nodes);
            },
        },
    };
};
