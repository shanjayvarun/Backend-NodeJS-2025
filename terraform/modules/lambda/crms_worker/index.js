exports.handler = async (event) => {
    console.log("Lambda Worker Executed Successfully", event);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Worker Task Completed" })
    }
}