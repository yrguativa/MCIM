import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { CellsModule } from '../src/cells/cells.module';

describe('Cells E2E Tests', () => {
  let app: INestApplication;

  const testCell = {
    leader: '67ec0e0b21b2baaa91f79dd1',
    network: 1,
    host: '67ec0e0b21b2baaa91f79dd2',
    timoteo: '67ec0e0b21b2baaa91f79dd3',
    address: 'Calle 123 #45-67',
    neighborhood: 1,
    createdUser: 'test-user',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/cells-e2e-test'),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
        }),
        CellsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GraphQL Queries and Mutations', () => {
    it('should create a cell with timoteo', async () => {
      const createCellMutation = `
        mutation CreateCell($input: CreateCellInput!) {
          createCell(createCellInput: $input) {
            id
            leader
            host
            timoteo
            address
            network
            neighborhood
            createdUser
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createCellMutation,
          variables: { input: testCell },
        });

      expect(result.status).toBe(200);
      expect(result.body.data.createCell).toBeDefined();
      expect(result.body.data.createCell.timoteo).toBe(testCell.timoteo);
      expect(result.body.data.createCell.host).toBe(testCell.host);
      expect(result.body.data.createCell.leader).toBe(testCell.leader);
    });

    it('should query cells', async () => {
      const query = `
        query {
          cells {
            id
            leader
            host
            timoteo
          }
        }
      `;

      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(result.status).toBe(200);
      expect(Array.isArray(result.body.data.cells)).toBe(true);
    });
  });
});
