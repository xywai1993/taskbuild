const { startTask, cleanDirTask } = require('../../dist/index.js');

const { existsSync } = require('fs');
const path = require('path');

beforeAll(() => {
    // Clears the database and adds some testing data.
    // Jest will wait for this promise to resolve before running tests.
    cleanDirTask({ root: path.join(__dirname, '../../targetDir/test/test'), rmSelf: true });
});

test('startTask', () => {
    startTask({
        taskList: [
            {
                taskName: 'fileMove',
                params: {
                    root: path.join(__dirname, '../../testdist'),
                    deployTo: path.join(__dirname, '../../targetDir/test/test'),
                    extname: ['.md'],
                },
            },
        ],
    });

    expect(existsSync(path.join(__dirname, '../../targetDir/test/test/index.html'))).toBeTruthy();
    expect(existsSync(path.join(__dirname, '../../targetDir/test/test/test.md'))).toBeTruthy();
});
