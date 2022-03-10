import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
   // const body = JSON.parse(event.body)
   
   // get the user_id from the headers
   const user_id = event.headers?.user_id
   const todo_id = event.pathParameters?.todo_id
   
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
   
   // check if todo exists and if pertences to user
   const checkTodo = await document.query({
      TableName: "todos",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
         "#id": "id"
      },
      ExpressionAttributeValues: {
         ":id": todo_id
      }
   }).promise()

   if (checkTodo.Items.length === 0) {
      return {
         statusCode: 400,
         body: JSON.stringify({
         error: "Todo not found"
         })
      }
   }

   if (checkTodo.Items[0].user_id !== user_id) {
      return {
         statusCode: 400,
         body: JSON.stringify({
         error: "Todo does not belong to user"
         })
      }
   }

   // update todo done field to true
   await document.update({
      TableName: "todos",
      Key: {
         id: todo_id
      },
      UpdateExpression: "set done = :done",
      ExpressionAttributeValues: {
         ":done": true
      }
   }).promise()

   // query todo by todo_id
   const todo = await document.query({
      TableName: "todos",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
         "#id": "id"
      },
      ExpressionAttributeValues: {
         ":id": todo_id
      }
   }).promise()

   return {
      statusCode: 200,
      body: JSON.stringify(todo.Items[0])
   };
   }