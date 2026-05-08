import test from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_WEB_TOOL_CONTRACTS, getPublicWebToolContract, } from "./index.js";
test("public web contracts expose the canonical tool names in stable order", () => {
    assert.deepEqual(PUBLIC_WEB_TOOL_CONTRACTS.map((contract) => contract.name), [
        "search_web",
        "read_web_url",
        "list_web_page_links",
        "crawl_web_site",
    ]);
});
test("read_web_url contract accepts a URL plus bounded extraction controls", () => {
    const contract = getPublicWebToolContract("read_web_url");
    assert.equal(contract?.inputSchema.properties?.url instanceof Object, true);
    assert.equal(contract?.inputSchema.properties?.query instanceof Object, true);
    assert.equal(contract?.inputSchema.properties?.maxChars instanceof Object, true);
    assert.equal(contract?.inputSchema.properties?.extractDepth instanceof Object, true);
    assert.deepEqual(contract?.inputSchema.required, ["url"]);
    assert.equal(contract?.inputSchema.additionalProperties, false);
    assert.match(contract?.description ?? "", /specific public web URL/i);
});
test("crawl_web_site contract requires instructions and defaults to bounded discovery", () => {
    const contract = getPublicWebToolContract("crawl_web_site");
    assert.equal(contract?.inputSchema.properties?.url instanceof Object, true);
    assert.equal(contract?.inputSchema.properties?.instructions instanceof Object, true);
    assert.equal(contract?.inputSchema.properties?.allowExternal instanceof Object, true);
    assert.deepEqual(contract?.inputSchema.required, ["url", "instructions"]);
    assert.equal(contract?.inputSchema.additionalProperties, false);
});
test("public web result types carry URL, retrieval, text, and truncation metadata", () => {
    const source = {
        url: "https://portal.ct.gov/dob/example",
        finalUrl: "https://portal.ct.gov/dob/example",
        title: "Connecticut DOB Example",
        source: "public_web",
        retrievedBy: "read_web_url",
    };
    const readResult = {
        source,
        retrievedBy: "read_web_url",
        text: "Registration guidance",
        truncated: false,
        metadata: { statusCode: 200 },
    };
    assert.equal(readResult.source.url, source.url);
    assert.equal(readResult.retrievedBy, "read_web_url");
    assert.equal(readResult.text, "Registration guidance");
});
