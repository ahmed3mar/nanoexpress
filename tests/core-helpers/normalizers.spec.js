/* globals describe, it, expect */
import fastQueryParse from 'fast-query-parse';
import { Readable } from 'stream';
import { body } from '../../src/request-proto/index.js';

describe('queries normalize', () => {
  it('queries normalize non-empty', () => {
    const fakeReq = {
      getQuery() {
        return 'foo=bar&bar=baz';
      }
    };

    expect(fastQueryParse(fakeReq.getQuery())).toStrictEqual({
      foo: 'bar',
      bar: 'baz'
    });
  });
  it('queries normalize empty', () => {
    const fakeReq = {
      getQuery() {
        return '';
      }
    };

    expect(fastQueryParse(fakeReq.getQuery())).toBe(null);
  });
});

describe('body normalize', () => {
  it('body normalize non-empty', async () => {
    const stream = new Readable({
      read() {}
    });
    const fakeReq = {
      stream,
      headers: { 'content-type': 'application/json' }
    };
    const fakeRes = {
      onAborted() {}
    };

    stream.push(Buffer.concat([Buffer.from('fake body')]));
    setTimeout(() => stream.push(null), 50);

    await body(fakeReq, fakeRes);
    expect(fakeReq.body).toStrictEqual(Buffer.from('fake body'));
  });
  it('body normalize empty', async () => {
    const fakeReq = {};

    expect(await body(fakeReq)).toBe(undefined);
  });
});

describe('cookie normalize', () => {
  it('cookie normalize non-empty', async () => {
    const fakeReq = {
      headers: {
        cookie: 'foo=bar'
      }
    };

    expect(fastQueryParse(fakeReq.headers.cookie)).toStrictEqual({
      foo: 'bar'
    });
  });
  it('cookie normalize empty', async () => {
    const fakeReq = {};
    fakeReq.getHeader = () => '';

    expect(fastQueryParse(fakeReq.getHeader('cookie'))).toBe(null);
  });
});
