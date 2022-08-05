import { DVault, NoteQuickInput } from "@dendronhq/common-all";
import assert from "assert";
import sinon from "sinon";
import { stubInterface } from "ts-sinon";
import * as vscode from "vscode";
import { ILookupProvider } from "../../../commands/lookup/ILookupProvider";
import {
  LookupQuickpickFactory,
  LookupAcceptPayload,
} from "../../../commands/lookup/LookupQuickpickFactory";
import { NoteLookupCmd } from "../../../commands/NoteLookupCmd";
import { IReducedEngineAPIService } from "../../../engine/IReducedEngineApiService";

suite("GIVEN a NoteLookupCmd", () => {
  test("WHEN the user selects nothing THEN nothing is written to the engine", async () => {
    const wsRoot = vscode.workspace.workspaceFile!;

    const mockNoteProvider = stubInterface<ILookupProvider>();

    const factory = {
      showLookup: () => {
        return Promise.resolve(0);
      },
    } as unknown as LookupQuickpickFactory;

    const showLookupFake = sinon.fake.resolves(undefined);
    sinon.replace(factory, "showLookup", showLookupFake);

    const showTextDocumentFake = sinon.fake.resolves(undefined);
    sinon.replace(vscode.window, "showTextDocument", showTextDocumentFake);

    const mockEngine = stubInterface<IReducedEngineAPIService>();

    const cmd = new NoteLookupCmd(
      factory,
      wsRoot,
      mockEngine,
      mockNoteProvider
    );

    await cmd.run();

    assert.strictEqual(showLookupFake.callCount, 1);
    assert.strictEqual(mockEngine.writeNote.callCount, 0);
    assert.strictEqual(showTextDocumentFake.callCount, 0);

    sinon.restore();
  });

  test("WHEN the user selects a note THEN that note is opened", async () => {
    const wsRoot = vscode.workspace.workspaceFile!;

    const mockNoteProvider = stubInterface<ILookupProvider>();

    const factory = {
      showLookup: () => {
        return Promise.resolve(0);
      },
    } as unknown as LookupQuickpickFactory;

    const vault: DVault = {
      selfContained: true,
      fsPath: "path",
    };
    const lookupReturn: LookupAcceptPayload = {
      items: [{ fname: "foo", vault } as NoteQuickInput],
    };

    const showLookupFake = sinon.fake.resolves(lookupReturn);
    sinon.replace(factory, "showLookup", showLookupFake);

    const openTextDocumentFake = sinon.fake.resolves(undefined);
    const showTextDocumentFake = sinon.fake.resolves(undefined);
    sinon.replace(vscode.workspace, "openTextDocument", openTextDocumentFake);
    sinon.replace(vscode.window, "showTextDocument", showTextDocumentFake);

    const mockEngine = stubInterface<IReducedEngineAPIService>();

    const cmd = new NoteLookupCmd(
      factory,
      wsRoot,
      mockEngine,
      mockNoteProvider
    );

    await cmd.run();

    assert.strictEqual(showLookupFake.callCount, 1);
    assert.strictEqual(mockEngine.writeNote.callCount, 0);
    assert.strictEqual(openTextDocumentFake.callCount, 1);
    assert.strictEqual(showTextDocumentFake.callCount, 1);

    sinon.restore();
  });
});