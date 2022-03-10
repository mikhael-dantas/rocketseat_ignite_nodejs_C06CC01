import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
   // const body = JSON.parse(event.body)

   // get the user_id from the path params
   const user_id = event.pathParameters?.user_id

   // check if user exists
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

   // query todos by user_id
   const todos = await document.scan({
      TableName: "todos",
      FilterExpression: "#user_id = :user_id",
      ExpressionAttributeNames: {
         "#user_id": "user_id"
      },
      ExpressionAttributeValues: {
         ":user_id": user_id
      }
   }).promise();

   return {
      statusCode: 200,
      body: JSON.stringify(todos.Items)
   };
   }