import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'rocketseat-ignite-nodejs-c06cc01',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    CreateUser: {
      handler: 'src/functions/createUser.handler',
      events: [
        {
          http: {
            method: 'post',
            path: '/users',
            cors: true
          }
        }
      ]
    },
    CreateTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            method: 'post',
            path: "/todos/{user_id}",
            cors: true,
            request: {
              parameters: {
                paths: {
                  user_id: {
                    required: true
                  }
                }
              }
            }
          }
        }
      ]
    },
    ListTodos: {
      handler: 'src/functions/listTodos.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos/{user_id}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  user_id: {
                    required: true,
                  },
                }
              }
            }
          }
        }
      ]
    },
    ExecuteTodo: {
      handler: 'src/functions/executeTodo.handler',
      events: [
        {
          http: {
            method: 'put',
            path: '/todos/{todo_id}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  todo_id: {
                    required: true
                  }
                }
              }
            }
          }
        }
      ]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8001,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources: {
    Resources: {
      todos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'todos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
        },
      },
      users: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
