(function () {
            (async () => {
                  await import(
                    chrome.runtime.getURL("assets/common.js")
                  );
                })().catch(console.error);
            })();