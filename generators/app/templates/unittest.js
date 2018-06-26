import * as chai from "chai";
import * as sinon from "sinon";
import * as assert from "assert";
var expect = chai.expect;
let should = chai.should();

//if the call is a promise - inside 'it' return the result

describe("The module test",()=> {
  it("should work",() =>{
      expect(1).to.eql(1)
      //assert(1==1)
      //let myClass= new MyClass();
      //sinon.stub(myClass, "someMethod").returns(Promise.resolve({data:"some data result}));
      //myClass.someMethod()
  })

  it("should work too",() =>{
    expect(true).to.be.true;
  })
});
