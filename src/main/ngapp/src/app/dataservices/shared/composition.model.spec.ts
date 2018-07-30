import { Composition } from "@dataservices/shared/composition.model";
import { CompositionType } from "@dataservices/shared/composition-type.enum";
import { Column } from "@dataservices/shared/column.model";
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";

describe("Composition", () => {
  let composition: Composition;

  beforeEach(() => {
    composition = null;
  });

  it("should create", () => {
    console.log("========== [Composition] should create");
    composition = Composition.create(
      {
        "name": "myView",
        "leftSourcePath": "leftPath",
        "rightSourcePath": "rightPath",
        "type": "INNER_JOIN",
        "condition": "EQ"
      }
    );

    expect(composition.getName()).toEqual("myView");
    expect(composition.getLeftSourcePath()).toEqual("leftPath");
    expect(composition.getRightSourcePath()).toEqual("rightPath");
    expect(composition.getType()).toEqual("INNER_JOIN");
    expect(composition.getOperator()).toEqual("EQ");

    const json = composition.toJSON();

    const str = composition.toString();

    const test = "";
  });

});
