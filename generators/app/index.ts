import * as Generator from "yeoman-generator"
import * as path from "path"
import * as fs from "fs"
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    const prompts = [
      {
        type: 'list',
        name: 'gentype',
        message: 'What would you like to generate',
        choices: [
          {name:"New Node service",value:"nodeservice"},
          {name:"Express router",value:"noderoute"},
          {name:"Unit test",value:"unittest"},
        ]
      },{
        when:(response=>{
          return response.gentype=="nodeservice"
        }),
        type:"input",
        name:"projname",
        message:"What is the name of your new node service?"
      },{
        when:(response=>{
          return response.gentype=="noderoute"
        }),
        type:"input",
        name:"routename",
        message:"What is name of the new route?"
      },{
        when:(response=>{
          return response.gentype=="unittest"
        }),
        type:"input",
        name:"testname",
        message:"What is the test name?"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      (<any>this).props = props;
    });
  }

  writing() {
    if((<any>this).props.gentype=="nodeservice"){

      this._generateNodeFiles();
      this._installDepencies();
    }else if((<any>this).props.gentype=="noderoute"){
      this._generateRouter();
    }else if((<any>this).props.gentype=="unittest"){
      this._generateUnitTest();
      this._installUnitTestDependencies();
      console.log(`Note - to run the test from npm script add: "test":"mocha --recursive"` )
    }
  }

  _capitalize(s)
  {
    return s[0].toUpperCase() + s.slice(1);
  }

  _deCaptilize(s){
    return s[0].toLowerCase() + s.slice(1);
  }

  _getProjNameLower(){
    return this._deCaptilize((<any>this).props.projname);
  }

  _generateNodeFiles(){
    let projnameLower= this._getProjNameLower()
    this.fs.copy(
      this.templatePath(`index.js`),
      this.destinationPath(`${projnameLower}/index.ts`));
    this.fs.copy(
      this.templatePath(`server.js`),
      this.destinationPath(`${projnameLower}/server.ts`));
    this.fs.copy(
      this.templatePath(`_tsconfig.json`),
      this.destinationPath(`${projnameLower}/tsconfig.json`));
    this.fs.copy(
      this.templatePath(`.env`),
      this.destinationPath(`${projnameLower}/config/.env`));
    this.fs.copyTpl(
      this.templatePath(`_package.json`),
      this.destinationPath(`${projnameLower}/package.json`),{
        projnameLower
      });
  }

  _generateRouter(){
    let routename=this._capitalize((<any>this).props.routename);
    let routenameLower = this._deCaptilize((<any>this).props.routename)
    this.fs.copyTpl(
      this.templatePath(`router.js`),
      this.destinationPath(`routes/${routenameLower}Router.ts`),{
        routename,routenameLower
      });
  }

  _generateUnitTest(){
    let testName = (<any>this).props.testname;
    if(!testName.endsWith("test")){
      testName+="Test"
    }
    this.fs.copy(
      this.templatePath(`unittest.js`),
      this.destinationPath(`test/${testName}.ts`));

  }



  _installDepencies(){

    let projnameLower= this._getProjNameLower()
    var newprojLocation = path.join(process.cwd(), projnameLower)
    fs.mkdirSync(newprojLocation )
    //change the working directory before install so that npm will find the package.json file created and add node modules in correct location
    process.chdir(newprojLocation);
    this.npmInstall(["body-parser","compression","dotenv","express","prompt"],{save:true})
    this.npmInstall(["@types/body-parser","@types/compression","@types/dotenv","@types/express","@types/express-serve-static-core","@types/mime","@types/node","@types/serve-static"],{"save-dev":true})
  }

  _installUnitTestDependencies(){
    this.npmInstall(["chai","mocha","sinon","@types/chai","@types/mocha"],{"save-dev":true})
  }

  _installLoggerDependencies(){
    this.npmInstall(["winston@2.x","express-winston","winston-daily-rotate-file","s3-streamlogger@1.3.x","aws-sdk"],{save:true})
    this.npmInstall(["@types/winston"],{"save-dev":true})
  }
};
