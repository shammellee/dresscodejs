'use strict';

beforeAll(() =>
{
  global.Dresscode = require('../dresscode');

  var _style       = document.head.appendChild(document.createElement('style'))
      ,_stylesheet = _style.sheet
      ;

  _style.id = 'dresscode';

  document.body.innerHTML =
    '<div data-dresscode="my-class" '
    + 'data-padding="5px" '
    + 'class="'
    + 'background-color_blue '
    + 'color_yellow '
    + 'font-size_2rem '
    + 'padding_var-padding '
    + '"></div>\n'
    + '<div class="my-class"></div>'
    ;
});

describe('Dresscode', () =>
{
  it('should have no output if autoDress is disabled', () =>
  {
    expect(Dresscode.output).toMatchSnapshot();
  });

  it('should store correct CSS ruleset in Dresscode.output when Dresscode.dress() is called', () =>
  {
    Dresscode.dress();
    expect(Dresscode.output).toMatchSnapshot();
  });
});

