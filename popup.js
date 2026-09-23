document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const usernameInput =
            document.getElementById("username");

        const repoInput =
            document.getElementById("repo");

        const tokenInput =
            document.getElementById("token");

        const categoryInput =
            document.getElementById("category");

        const languageInput =
            document.getElementById("language");

        const pushButton =
            document.getElementById("push");

        const status =
            document.getElementById("status");


        // Load saved settings
        const saved =
            await chrome.storage.local.get([
                "username",
                "repo",
                "token"
            ]);


        if (saved.username) {
            usernameInput.value =
                saved.username;
        }

        if (saved.repo) {
            repoInput.value =
                saved.repo;
        }

        if (saved.token) {
            tokenInput.value =
                saved.token;
        }


        pushButton.addEventListener(
            "click",
            async function () {

                try {

                    const username =
                        usernameInput.value.trim();

                    const repo =
                        repoInput.value.trim();

                    const token =
                        tokenInput.value.trim();

                    const category =
                        categoryInput.value;

                    const language =
                        languageInput.value;


                    if (!username ||
                        !repo ||
                        !token) {

                        status.innerText =
                            "❌ Please fill all fields.";

                        return;
                    }


                    // Save settings
                    await chrome.storage.local.set({
                        username: username,
                        repo: repo,
                        token: token
                    });


                    status.innerText =
                        "⏳ Reading GFG problem...";


                    const tabs =
                        await chrome.tabs.query({
                            active: true,
                            currentWindow: true
                        });


                    if (!tabs.length) {

                        status.innerText =
                            "❌ GFG tab not found.";

                        return;
                    }


                    const response =
                        await chrome.tabs.sendMessage(
                            tabs[0].id,
                            {
                                action: "getProblem"
                            }
                        );


                    if (!response) {

                        status.innerText =
                            "❌ Could not read GFG page.";

                        return;
                    }


                    const title =
                        response.title;

                    const code =
                        response.code;


                    if (!code ||
                        code.trim().length === 0) {

                        status.innerText =
                            "❌ Solution code not found.";

                        return;
                    }


                    // Create safe filename
                    const safeTitle =
                        title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "");


                    const extension =
                        "." + language;


                    const filePath =
                        `GeeksForGeeks/${category}/${safeTitle}${extension}`;


                    status.innerText =
                        "⏳ Checking GitHub file...";


                    const apiUrl =
                        `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(filePath)}`;


                    // Check whether file already exists
                    const existingResponse =
                        await fetch(apiUrl, {

                            method: "GET",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`,

                                "Accept":
                                    "application/vnd.github+json"
                            }
                        });


                    let sha = null;


                    if (existingResponse.ok) {

                        const existingFile =
                            await existingResponse.json();

                        sha = existingFile.sha;
                    }


                    status.innerText =
                        "⏳ Pushing to GitHub...";


                    // Convert code to Base64
                    const encodedContent =
                        uint8ToBase64(
                            new TextEncoder().encode(code)
                        );


                    const body = {

                        message:
                            `Add GFG solution: ${title}`,

                        content:
                            encodedContent,

                        branch:
                            "main"
                    };


                    // If file exists, SHA is required
                    if (sha) {
                        body.sha = sha;
                    }


                    const pushResponse =
                        await fetch(apiUrl, {

                            method: "PUT",

                            headers: {

                                "Authorization":
                                    `Bearer ${token}`,

                                "Accept":
                                    "application/vnd.github+json",

                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(body)
                        });


                    const result =
                        await pushResponse.json();


                    if (pushResponse.ok) {

                        if (sha) {

                            status.innerText =
                                "✅ File updated successfully!";

                        } else {

                            status.innerText =
                                "✅ Solution pushed successfully!";
                        }

                    } else {

                        console.error(result);

                        status.innerText =
                            "❌ GitHub Error: " +
                            (result.message ||
                             "Unknown error");
                    }


                } catch (error) {

                    console.error(error);

                    status.innerText =
                        "❌ " + error.message;
                }

            }
        );

    }
);


/*
 * Convert Uint8Array to Base64.
 * This works correctly with Unicode text too.
 */
function uint8ToBase64(bytes) {

    let binary = "";

    const chunkSize = 0x8000;

    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {

        binary += String.fromCharCode(
            ...bytes.subarray(
                i,
                Math.min(
                    i + chunkSize,
                    bytes.length
                )
            )
        );
    }

    return btoa(binary);
}