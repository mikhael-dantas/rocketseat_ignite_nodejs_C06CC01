import { APIGatewayProxyHandler } from "aws-lambda"

// making a hello world
export const handler: APIGatewayProxyHandler = async (event) => {
   return {
      statusCode: 200,
      body: JSON.stringify({
         message: "Hello World",
      }),
   }
}