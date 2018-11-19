'use strict';

const support = require('./support');

beforeEach(() =>
{
  global.Dresscode = undefined;
});

afterEach(() =>
{
  jest.resetModules();
});

describe('Dresscode', () =>
{
  it('should have empty variables object', () =>
  {
    support.load_html('no_config');

    Dresscode = require('./dresscode');

    expect(Dresscode.variables).toMatchObject({});
  });

  it('should contain the autoDress property', () =>
  {
    support.load_html('autodress');

    Dresscode = require('./dresscode');

    expect(Dresscode.variables).toHaveProperty('autoDress');
  });

  it('should contain the refreshInterval', () =>
  {
    support.load_html('refresh_interval');

    Dresscode = require('./dresscode');

    expect(Dresscode.variables).toHaveProperty('refreshInterval');
  });

  it('should output a red-button class', () =>
  {
    support.load_html('red_button');

    Dresscode = require('./dresscode');

    expect(Dresscode.output).toEqual('.red-button{background-color:red;color:white}');
  });
});

