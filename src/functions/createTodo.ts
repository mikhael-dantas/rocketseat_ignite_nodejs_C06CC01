import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient"

// making a hello world
export const handler: APIGatewayProxyHandler = async (event) => {
   const body = JSON.parse(event.body)

   // get the user_id from the http request headers
   const user_id = event.headers["user_id"]

   console.log("batataaaaaaaaaaaa")
   console.log(user_id)

   const { id, title, deadline } = body

	const todoToCreate  = {
      id,
      title,
      deadline,
      done: false
   }

   await document.put({
      TableName: "todos",
      Item: todoToCreate
   }).promise()


   const response = await document.query({
      TableName: "todos",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
         "#id": "id"
      },
      ExpressionAttributeValues: {
         ":id": id
      }
   }).promise()

   return {
      statusCode: 200,
      body: JSON.stringify(response.Items[0]),
   }
}