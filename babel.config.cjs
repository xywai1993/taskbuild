module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        '@babel/preset-typescript',
    ],

    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: 'current',
                        },
                    },
                ],
                '@babel/preset-typescript',
                'ts-jest',
            ],
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                // '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                // '@babel/plugin-proposal-class-properties',
                // '@babel/plugin-proposal-json-strings',
            ],
        },
    },
};
