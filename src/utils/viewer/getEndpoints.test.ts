import { describe, expect, it } from 'vitest';

import { getEndpoints } from './getEndpoints';

const schema = `
openapi: 3.0.4
info:
  title: Swagger Petstore - OpenAPI 3.0
  version: 1.0.27
paths:
  /pet:
    put:
      tags:
        - pet
      summary: Update an existing pet.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '200':
          description: Successful operation
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '422':
          description: Validation exception
    post:
      tags:
        - pet
      summary: Add a new pet to the store.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '200':
          description: Successful operation
        '400':
          description: Invalid input
        '422':
          description: Validation exception
  /pet/findByStatus:
    get:
      tags:
        - pet
      summary: Finds Pets by status.
      parameters:
        - name: status
          in: query
          required: false
          schema:
            type: string
            default: available
            enum:
              - available
              - pending
              - sold
      responses:
        '200':
          description: Successful operation
        '400':
          description: Invalid status value
  /pet/{petId}:
    get:
      tags:
        - pet
      summary: Find pet by ID.
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: Successful operation
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
    delete:
      tags:
        - pet
      summary: Deletes a pet.
      parameters:
        - name: api_key
          in: header
          required: false
          schema:
            type: string
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: Pet deleted
        '400':
          description: Invalid pet value
  /store/inventory:
    get:
      tags:
        - store
      summary: Returns pet inventories by status.
      responses:
        '200':
          description: Successful operation
components:
  schemas:
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 1
        name:
          type: string
          example: Dogs
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
    Pet:
      required:
        - name
        - photoUrls
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 10
        name:
          type: string
          example: doggie
        category:
          $ref: '#/components/schemas/Category'
        photoUrls:
          type: array
          items:
            type: string
        tags:
          type: array
          items:
            $ref: '#/components/schemas/Tag'
        status:
          type: string
          enum:
            - available
            - pending
            - sold
`;

const endpoints = getEndpoints(schema);

describe('getEndpoints', () => {
  it('parses a Petstore endpoint', () => {
    const endpoint = endpoints.find(({ pathname, method }) => pathname === '/pet' && method === 'post');

    expect(endpoint).toMatchObject({
      pathname: '/pet',
      method: 'post',
      summary: 'Add a new pet to the store.',
      tags: ['pet'],
      parameters: [],
      responses: {
        '200': {
          description: 'Successful operation',
        },
        '400': {
          description: 'Invalid input',
        },
        '422': {
          description: 'Validation exception',
        },
      },
    });
  });

  it('generates a request body example from the Pet schema', () => {
    const endpoint = endpoints.find(({ pathname, method }) => pathname === '/pet' && method === 'post');

    expect(endpoint?.requestBodyExample).toMatchObject({
      id: 10,
      name: 'doggie',
      category: {
        id: 1,
        name: 'Dogs',
      },
    });
  });

  it('parses query parameters', () => {
    const endpoint = endpoints.find(({ pathname }) => pathname === '/pet/findByStatus');

    expect(endpoint?.parameters).toEqual([
      {
        name: 'status',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          default: 'available',
          enum: ['available', 'pending', 'sold'],
        },
      },
    ]);
  });

  it('parses path and header parameters', () => {
    const endpoint = endpoints.find(({ pathname, method }) => pathname === '/pet/{petId}' && method === 'delete');

    expect(endpoint?.parameters).toEqual([
      {
        name: 'api_key',
        in: 'header',
        required: false,
        schema: {
          type: 'string',
        },
      },
      {
        name: 'petId',
        in: 'path',
        required: true,
        schema: {
          type: 'integer',
          format: 'int64',
        },
      },
    ]);
  });

  it('uses default values for missing optional fields', () => {
    const endpoint = endpoints.find(({ pathname }) => pathname === '/store/inventory');

    expect(endpoint).toMatchObject({
      pathname: '/store/inventory',
      method: 'get',
      tags: ['store'],
      parameters: [],
      requestBody: null,
      requestBodyExample: null,
    });
  });

  it('sorts endpoints by pathname and HTTP method order', () => {
    expect(endpoints.map(({ pathname, method }) => `${method} ${pathname}`)).toEqual([
      'post /pet',
      'put /pet',
      'get /pet/{petId}',
      'delete /pet/{petId}',
      'get /pet/findByStatus',
      'get /store/inventory',
    ]);
  });
});
