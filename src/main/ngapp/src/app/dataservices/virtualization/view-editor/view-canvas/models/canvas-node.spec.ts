import { CanvasNode } from "@dataservices/virtualization/view-editor/view-canvas/models/canvas-node";

describe("CanvasNode", () => {
  let canvasNode: CanvasNode;

  beforeEach(() => {
    canvasNode = null;
  });

  it("should create", () => {
    console.log("========== [CanvasNode] should create");
    canvasNode = new CanvasNode("AddSourcesCommand1532362832377",
                                "connection=conn3/schema=public/table=stuff",
                                "SOURCE", "connection=conn3/schema=public/table=stuff", true);

    // Check the encoded id
    expect(canvasNode.id).toEqual("AddSourcesCommand1532362832377");
    expect(canvasNode.payload).toEqual("connection6X6conn35X5schema6X6public5X5table6X6stuff");
  });

  it("should decodeId", () => {
    console.log("========== [CanvasNode] should decode id");
    canvasNode = new CanvasNode("AddSourcesCommand1532362832377",
      "connection=conn3/schema=public/table=stuff",
      "SOURCE", "connection=conn3/schema=public/table=stuff", true);

    // Check the encoded id
    expect(canvasNode.id).toEqual("AddSourcesCommand1532362832377");
    expect(canvasNode.payload).toEqual("connection6X6conn35X5schema6X6public5X5table6X6stuff");

    // Check that the encoded id is decoded properly
    const decoded = canvasNode.decodedId;
    expect(CanvasNode.decodeId(canvasNode.payload)).toEqual("connection=conn3/schema=public/table=stuff");
  });

});
