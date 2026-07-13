import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Card } from './Card';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import type { Endpoint, JsonValue } from '@/types';

vi.mock('./Parameters/Parameters', () => ({
  Parameters: function ParametersMock({
    parameters,
    body,
  }: {
    parameters: Endpoint['parameters'];
    body: JsonValue | null;
  }) {
    return (
      <div>
        <span>Parameters count: {parameters.length}</span>
        <span>Request body: {JSON.stringify(body)}</span>
      </div>
    );
  },
}));

vi.mock('./Responses/Responses', () => ({
  Responses: function ResponsesMock({ responses }: { responses: Endpoint['responses'] }) {
    return <div>Response statuses: {Object.keys(responses ?? {}).join(', ')}</div>;
  },
}));

vi.mock('@/views/History/HistoryTable/HistoryTable', () => ({
  MethodChip: function MethodChipMock({ method }: { method: string }) {
    return <span>{method}</span>;
  },
}));

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

const petEndpoint = getEndpoints(schema).find(({ pathname, method }) => pathname === '/pet' && method === 'post');

if (petEndpoint === undefined) {
  throw new Error('Petstore POST /pet endpoint was not found');
}

describe('Card', () => {
  it('renders endpoint method, pathname and summary', () => {
    render(<Card endpoint={petEndpoint} />);

    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/pet')).toBeInTheDocument();
    expect(screen.getByText('Add a new pet to the store.')).toBeInTheDocument();
  });

  it('renders parameters, request body and responses after expanding the accordion', async () => {
    const user = userEvent.setup();

    render(<Card endpoint={petEndpoint} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Parameters count: 0')).toBeInTheDocument();
    expect(screen.getByText(/Request body:/)).toHaveTextContent('doggie');
    expect(screen.getByText('Response statuses: 200, 400, 422')).toBeInTheDocument();
  });

  it('renders an empty summary when summary is null', () => {
    const endpointWithoutSummary: Endpoint = {
      ...petEndpoint,
      summary: null,
    };

    const { container } = render(<Card endpoint={endpointWithoutSummary} />);

    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });
});
