import { GoogleAuth } from "google-auth-library";

class QuestionServiceInstance {
    constructor() {
        this.targetAudience = "https://pp-svc.com"
        this.auth = new GoogleAuth();
        this.client = null;
        this.bearer = null;
        this.api = "https://pp-svc.com/api/questions/random"
    }


    async connect() {
        // this.client = await this.auth.getClient();
        // this.token = await this.client.getAccessToken();
        // this.bearer = this.token.res.data.id_token;
        this.client = await this.auth.getIdTokenClient(this.targetAudience);
        this.bearer = await this.client.idTokenProvider.fetchIdToken(this.targetAudience);
        console.log(this.client)
        console.log(this.bearer)
    }

    // Errors will be Handeled by Caller
    async getNewQuestion(oldId) {
        // Incase Token gets refreshed

        if (this.client == null) {
            throw new Error("QUESTION_SERVICE ERROR:  Client not intalised");
        }
        const apiUrl = this.api + "/" + oldId;
        console.log(this.client);
        console.log(`Making request to Url : ${apiUrl}`);
        console.log("start:");
        let questionId = null;
        await this.client.request({url: apiUrl})
        .then(res => {
            console.log(res)
            questionId = res?.data.question[0].questionId;
        })
        console.log("new question id: " + questionId)

        return questionId
    }
    
}


export default QuestionServiceInstance;