'use strict';

test('parses class', () =>
{
  var _style            = document.head.appendChild(document.createElement('style'))
      ,_stylesheet      = _style.sheet
      ,_expected_output = '.my-class{background-color:blue;color:yellow;padding:5px}'
      ;

  _style.id                = 'dresscode';
  _style.dataset.autoDress = true;

  document.body.innerHTML =
    '<div data-dresscode="my-class" '
    + 'data-padding="5px" '
    + 'class="'
    + 'background-color_blue '
    + 'color_yellow '
    + 'padding_var-padding '
    + '"></div>\n'
    + '<div class="my-class"></div>'
    ;

  const Dresscode = require('../dresscode');

  expect(Dresscode.output).toEqual(_expected_output);
});

