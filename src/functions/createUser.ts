import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient"
import { uuid } from "uuidv4"

// making a hello world
export const handler: APIGatewayProxyHandler = async (event) => {
   const body = JSON.parse(event.body)

   const { name, email, password } = body

   const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
   const id = uuid()

   const userToCreate  = {
      id,
      name: `${name}${randomString}`,
      email,
      password
   }

   await document.put({
      TableName: "users",
      Item: userToCreate
   }).promise()

   const user = await document.query({
      TableName: "users",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
         "#id": "id"
      },
      ExpressionAttributeValues: {
         ":id": id
      }
   }).promise()


   const userToReturn = user.Items[0]

   // delete the password
   delete userToReturn.password


   return {
      statusCode: 200,
      body: JSON.stringify(userToReturn),
   }
}