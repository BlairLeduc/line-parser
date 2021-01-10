module.exports = function (w) {

    return {
      files: [
        'src/*.ts'
      ],
  
      tests: [
        'test/*.spec.ts'
      ],
  
      env: {
        type: 'node'
      },
  
      compilers: {
        '**/*.ts': wallaby.compilers.babel()
      },
      // or any other supported testing framework:
      // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
      testFramework: 'jasmine'
    };
  };