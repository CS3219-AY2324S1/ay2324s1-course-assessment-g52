import fetch from "node-fetch";

class QuestionServiceInstance {
    constructor() {
        this.api = "https://pp-svc.com/api/questions/random-filtered?"
    }

    // Errors will be Handeled by Caller
    async getQuestionId(difficulty, topic, idToken) {
        // Incase Token gets refreshed
        const queryParams = {
            complexity: difficulty,
            categories: topic,
            id: ''
            // Add more query parameters as needed
          };

          const queryString = Object.keys(queryParams)
          .map((key) => `${key}=${queryParams[key]}`)
          .join('&');
    
        // Append the query string to the API URL
        const apiUrl = this.api + queryString; // Replace with the actual API endpoint and query parameters
        // console.log(this.client);
        console.log(`Making request to Url : ${apiUrl}`);
        console.log(`The bearer token is : ${idToken}`);
        
        // const response = await this.client.request({ url: apiUrl});
          let questionId = null;
        await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        })
        .then(resp => {
            console.log(`Response : ${resp.status}`);
            return resp.json();
        })
        .then(data => {
            questionId = data.question.questionId;
        })



        return questionId;
    }
    
}


export default QuestionServiceInstance;