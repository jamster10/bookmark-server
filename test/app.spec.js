'use strict';
/* global request expect */

const app = require('../src/app');
const data = require('../src/DB');

describe('GET /', () => {
  it('Responds to homepage request', () => {
    return request(app)
      .get('/')
      .expect(200, 'Server running. Please make a request to /bookmarks');
  });
});

describe('GET /bookmark', () => {

  const item = {
    id: 1,
    title: 'NBA',
    url: 'https://www.nba.com',
    description: 'nba is the best league',
    rating: 3
  };

  it('Responds with all the bookmarks', () => {
    return request(app)
      .get('/bookmarks')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(3);
        expect(res.body).to.eql(data);
        expect(res.body[0]).to.eql(item);
        expect(res.body[0]).to.have.all.keys(['id', 'url', 'rating', 'description', 'title']);
      });
  });

  it.skip('GET Responds with the specific bookmark and correct id', () => {
    return request(app)
      .get('/bookmarks/1')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body).to.eql(data[0]);
        expect(res.body[0].id).to.be.a('number');
        expect(res.body[0].id).to.equal(1);
      });
  });

  it.skip('GET Responds with the specific bookmark and correct url', () => {
    return request(app)
      .get('/bookmarks/1')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body).to.eql(data[1]);
        expect(res.body[0].url).to.equal('https://www.google.com');
      });
  });
});

describe('POST /bookmark')
