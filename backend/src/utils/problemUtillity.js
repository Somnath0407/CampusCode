const axios = require("axios");

const getLanguageById= (lang)=>{
    const language={
        "c++":54,
        "cpp":54,
        "java":62,
        "javascript":63,
        "sql":82,
    }
    return language[lang.toLowerCase()];
}

// SQL problems have no stdin at runtime — Judge0's SQLite runner (language 82)
// just executes whatever script it's given and prints the last statement's
// result set (pipe-separated, no headers, NULL as empty string). So instead of
// stdin holding the test input like the other languages, the schema + seed
// data (testcase.input) is prepended to the candidate's query and run as one
// script, with stdin left empty.
const buildJudge0Payload = (language, code, testcaseInput) => {
    if (language.toLowerCase() === "sql") {
        return { source_code: `${testcaseInput}\n${code}`, stdin: "" };
    }
    return { source_code: code, stdin: testcaseInput };
};

// Judge0 rejects plain-text (base64_encoded=false) results whenever any field
// (compile output, stderr, etc.) contains bytes that aren't valid UTF-8 — a
// 400 "cannot be converted to UTF-8" that shows up unpredictably, e.g. on
// certain C++ compiler diagnostics. Sending and receiving base64 end-to-end
// sidesteps that entirely, so submissions and stdin are base64-encoded going
// out, and stdout/stderr/compile_output/message are decoded coming back.
const toBase64 = (str) => (str == null ? str : Buffer.from(str, 'utf8').toString('base64'));
const fromBase64 = (str) => (str == null ? str : Buffer.from(str, 'base64').toString('utf8'));

const submitBatch= async(submissions)=>{
    // make an API call to judge0 to submit the batch of code for execution
    // i can use axios or fetch to make the API call
    // return the result of the API call

    const encodedSubmissions = submissions.map((s) => ({
        ...s,
        source_code: toBase64(s.source_code),
        stdin: toBase64(s.stdin),
        expected_output: toBase64(s.expected_output),
    }));

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'true'
    },
    headers: {
        'x-rapidapi-key': process.env.JUDGE0_API_KEY,
        'x-rapidapi-host': process.env.JUDGE0_API_HOST,
        'Content-Type': 'application/json'
    },
        data: {
        submissions: encodedSubmissions
    }
}
async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      const judge0Message = error.response?.data?.message || error.response?.data?.error;
      console.error("Error submitting batch to Judge0:", judge0Message || error.message);
      throw new Error(judge0Message || `Judge0 submission failed: ${error.message}`);
    }
  }

  return await fetchData();
}


// const waiting =async(timer)=>{
//     setTimeout(()=>{
//         return 1;
//     }, timer);
// }

// const submitToken = async(resultToken)=>{

// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultToken.join(','),
//     base64_encoded: 'true',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
//   try {
//     const response = await axios.request(options);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }
//     while(true){
//     const result= await fetchData();
//     const IsResultObtained=result.submissions.every((r)=>r.status_id>2);

//     if(IsResultObtained){
//         return result.submissions;
//     }
//     // if result is not obtained then we need to wait for some time and then call the API again
//     await waiting(1000);
//     }
// }

const waiting = (timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, timer);
    });
};

const submitToken = async (resultToken) => {
    // Ensure tokens are formatted as a comma-separated string if passed as an array
    const tokenString = Array.isArray(resultToken) ? resultToken.join(',') : resultToken;

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: tokenString,
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_API_KEY,
            'x-rapidapi-host': process.env.JUDGE0_API_HOST
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Error fetching submission status:", error.message);
            return null; // Return null to prevent app crashes on network errors
        }
    }

    const MAX_ATTEMPTS = 20;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const result = await fetchData();

        // Guard clause to prevent crashes if the API call failed entirely
        if (!result || !result.submissions) {
            console.log(`No result received, retrying... (${attempts}/${MAX_ATTEMPTS})`);
            await waiting(2000); // Wait slightly longer on failure
            continue;
        }

        // Judge0 Status IDs: 1 = In Queue, 2 = Processing. Anything > 2 means it finished (Success or Error).
        const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (IsResultObtained) {
            return result.submissions.map((s) => ({
                ...s,
                stdout: fromBase64(s.stdout),
                stderr: fromBase64(s.stderr),
                compile_output: fromBase64(s.compile_output),
                message: fromBase64(s.message),
            }));
        }

        // Will now cleanly pause for 1 second before making the next API poll
        console.log("Submissions still processing, waiting...");
        await waiting(1000);
    }

    throw new Error("Judge0 did not return a result in time (it may be rate-limited or temporarily unavailable) — please try again shortly.");
};




module.exports= { getLanguageById, submitBatch, submitToken, buildJudge0Payload };