Dresscode is a new way to think about building web pages.

# Overview

At its core, Dresscode embeds entire CSS rules in CSS class names. For example:

```html
<div data-dresscode='my-class' class='background-color_red color_white'></div>
```

The classes above are parsed into CSS declarations and associated with the
class named `my-class` defined in the `data-dresscode` data attribute above:

```css
.my-class {
  background-color: red;
  color: white;
}
```

As previously mentioned, entire rules can be created from a single class name.

## Pseudo-classes

```html
<div data-dresscode='my-class'
class='--hover_background-color_green --hover_color_yellow'></div>
```

Compiles to:

```css
.my-class:hover {
  background-color: green;
  color: yellow;
}
```

## Pseudo-elements

```html
<div data-dresscode='my-class'
class='--first-child_background-color_blue --first-child_color_pink'></div>
```

Compiles to:

```css
.my-class:first-child {
  background-color: blue;
  color: pink;
}
```

## @rules

```html
<div data-dresscode='my-class' data-md='media screen and (min-width: 768px)'
class='at-md_background-color_lime at-md_color_fuchsia'></div>
```

Compiles to:

```css
@media screen and (min-width: 768px) {
  .my-class {
    background-color: lime;
    color: fuchsia;
  }
}
```

