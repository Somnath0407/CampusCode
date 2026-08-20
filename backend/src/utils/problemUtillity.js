const axios = require("axios");

const getLanguageById= (lang)=>{
    const language={
        "c++":54,
        "cpp":54,
        "java":62,
        "javascript":63,
    }
    return language[lang.toLowerCase()];
}

const submitBatch= async(submissions)=>{
    // make an API call to judge0 to submit the batch of code for execution
    // i can use axios or fetch to make the API call
    // return the result of the API call

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': process.env.JUDGE0_API_KEY,
        'x-rapidapi-host': process.env.JUDGE0_API_HOST,
        'Content-Type': 'application/json'
    },
        data: {
        submissions: submissions
    }
}
async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
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
//     'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
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
            base64_encoded: 'false',
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

    while (true) {
        const result = await fetchData();

        // 2. FIX: Guard clause to prevent crashes if the API call failed entirely
        if (!result || !result.submissions) {
            console.log("No result received, retrying...");
            await waiting(2000); // Wait slightly longer on failure
            continue;
        }

        // Judge0 Status IDs: 1 = In Queue, 2 = Processing. Anything > 2 means it finished (Success or Error).
        const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (IsResultObtained) {
            return result.submissions;
        }

        // Will now cleanly pause for 1 second before making the next API poll
        console.log("Submissions still processing, waiting...");
        await waiting(1000);
    }
};




module.exports= { getLanguageById, submitBatch, submitToken };