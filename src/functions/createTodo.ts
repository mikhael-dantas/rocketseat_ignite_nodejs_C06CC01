import { APIGatewayProxyHandler } from "aws-lambda"
import { uuid } from "uuidv4"
import { document } from "../utils/dynamodbClient"

// making a hello world
export const handler: APIGatewayProxyHandler = async (event) => {
   const body = JSON.parse(event.body)

   // get the user_id from the path params
   const user_id = event.pathParameters?.user_id
   // get the user_id from the http request headers

   const checkUser = await document.query({
      TableName: "users",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
         "#id": "id"
      },
      ExpressionAttributeValues: {
         ":id": user_id
      }
   }).promise()

   if (checkUser.Items.length === 0) {
      return {
         statusCode: 400,
         body: JSON.stringify({
            error: "User not found"
         })
      }
   }

   const { title, deadline } = body
   const id = uuid()

	const todoToCreate  = {
      id,
      user_id,
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