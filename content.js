function getProblemTitle() {
    let title = document.title;

    title = title
        .replace(" - GeeksforGeeks", "")
        .replace(" | GeeksforGeeks", "")
        .trim();

    return title;
}


function getSolutionCode() {

    // GFG is using Ace Editor
    const aceEditor =
        document.querySelector(".ace_editor");

    if (aceEditor) {

        // Ace stores the actual code in .ace_text-layer
        const lines =
            aceEditor.querySelectorAll(".ace_line");

        if (lines.length > 0) {

            const code = Array.from(lines)
                .map(line => line.textContent || "")
                .join("\n");

            if (code.trim().length > 0) {
                return code;
            }
        }

        // Alternative Ace method
        const textLayer =
            aceEditor.querySelector(".ace_text-layer");

        if (textLayer) {

            const code =
                textLayer.innerText || textLayer.textContent;

            if (code && code.trim().length > 0) {
                return code;
            }
        }
    }


    // Fallback: textarea
    const textareas =
        document.querySelectorAll("textarea");

    for (const textarea of textareas) {

        if (
            textarea.value &&
            textarea.value.trim().length > 20
        ) {
            return textarea.value;
        }
    }


    return "";
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.action === "getProblem") {

            const title =
                getProblemTitle();

            const code =
                getSolutionCode();

            console.log("GFG Problem:", title);
            console.log("GFG Solution:", code);

            sendResponse({
                title: title,
                code: code
            });
        }

        return true;
    }
);