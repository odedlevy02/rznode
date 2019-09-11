
export function generateUnitTest(generator) {
    let origTestName = (<any>generator).props.testname;
    let testName = origTestName;
    if (!testName.endsWith("test")) {
      testName += "Test"
    }
    generator.fs.copyTpl(
      generator.templatePath(`unittest.js`),
      generator.destinationPath(`test/${testName}.ts`), {
      origTestName
    });

  }